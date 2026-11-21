document.addEventListener('DOMContentLoaded', () => {
    // Hier greifen wir auf die Elemente auf der Webseite zu
    // Konstanten für die Slot-Machine Logik
    const PRE_POST_ITEMS_COUNT = 10; // Anzahl der Dummy-Items am Anfang/Ende jeder Walze
    const EXTRA_SPINS = 3;           // Wie viele zusätzliche "volle" Umdrehungen für den Effekt
    const REEL_ITEM_HEIGHT = 100;    // Höhe eines einzelnen Items in der Walze (muss mit CSS übereinstimmen)

    const keyReel = document.getElementById('keyReel');
    const scaleReel = document.getElementById('scaleReel');
    const bpmReel = document.getElementById('bpmReel');
    const spinBtn = document.getElementById('spinBtn');
    const genreInput = document.getElementById('genreInput');
    const randomGenreBtn = document.getElementById('randomGenreBtn');
    const currentKeySpan = document.getElementById('currentKey');
    const currentScaleSpan = document.getElementById('currentScale');
    const currentBPMSpan = document.getElementById('currentBPM');

    // Die Listen der möglichen Werte
    // Nur die Grundtöne (Root Notes)
    const keys = [
        'C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E',
        'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A',
        'A#', 'Bb', 'B'
    ];

    // Hier alle bekannten Stimmungen/Skalen aus Ableton 12 hinzufügen
    const scales = [
        'Major', 'Minor (Natural)', 'Harmonic Minor', 'Melodic Minor',
        'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Locrian',
        'Pentatonic Major', 'Pentatonic Minor', 'Blues Scale',
        'Whole Tone', 'Diminished (Whole-Half)', 'Diminished (Half-Whole)',
        'Chromatic', 'Augmented', 'Phrygian Dominant'
        // Du kannst hier weitere Skalen hinzufügen!
    ];

    // Genre-Profile: Hier definieren wir typische Werte für verschiedene Genres.
    // Du kannst diese Liste beliebig erweitern!
    const genreProfiles = {
        // Bestehende Genres
        'techno': {
            bpmRange: [125, 145],
            commonKeys: ['A', 'C', 'F', 'G', 'D'],
            commonScales: ['Minor (Natural)', 'Dorian', 'Phrygian']
        },
        'house': {
            bpmRange: [118, 128],
            commonKeys: ['C', 'G', 'D', 'A', 'E', 'F#', 'Bb'],
            commonScales: ['Major', 'Minor (Natural)', 'Dorian', 'Mixolydian', 'Pentatonic Minor']
        },
        'hip hop': {
            bpmRange: [80, 110],
            commonKeys: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
            commonScales: ['Minor (Natural)', 'Major', 'Blues Scale', 'Dorian']
        },
        'pop': {
            bpmRange: [90, 130],
            commonKeys: keys,
            commonScales: ['Major', 'Minor (Natural)']
        },
        'drum and bass': {
            bpmRange: [165, 180],
            commonKeys: ['F', 'G', 'C', 'D', 'E'],
            commonScales: ['Minor (Natural)', 'Dorian', 'Phrygian', 'Lydian']
        },
        // --- Neue Genres basierend auf deiner Liste ---
        'rock': {
            bpmRange: [110, 150],
            commonKeys: ['E', 'A', 'D', 'G', 'C'],
            commonScales: ['Major', 'Minor (Natural)', 'Pentatonic Major', 'Pentatonic Minor', 'Blues Scale']
        },
        'electronic': {
            bpmRange: [120, 140],
            commonKeys: ['A', 'C', 'F', 'G', 'D'],
            commonScales: ['Minor (Natural)', 'Dorian', 'Phrygian', 'Major']
        },
        'r&b': {
            bpmRange: [60, 100],
            commonKeys: ['C', 'G', 'F', 'Bb', 'Eb', 'Ab'],
            commonScales: ['Minor (Natural)', 'Major', 'Dorian', 'Pentatonic Minor']
        },
        'soul': {
            bpmRange: [80, 120],
            commonKeys: ['G', 'C', 'D', 'A', 'E'],
            commonScales: ['Major', 'Minor (Natural)', 'Pentatonic Major']
        },
        'jazz': {
            bpmRange: [80, 160],
            commonKeys: ['F', 'Bb', 'Eb', 'Ab', 'C', 'G'],
            commonScales: ['Major', 'Dorian', 'Mixolydian', 'Melodic Minor', 'Diminished (Whole-Half)']
        },
        'classical': {
            bpmRange: [60, 140],
            commonKeys: keys,
            commonScales: ['Major', 'Minor (Natural)', 'Harmonic Minor']
        },
        'country': {
            bpmRange: [100, 140],
            commonKeys: ['G', 'C', 'D', 'A', 'E'],
            commonScales: ['Major', 'Pentatonic Major']
        },
        'folk': {
            bpmRange: [90, 130],
            commonKeys: ['G', 'C', 'D', 'A', 'E'],
            commonScales: ['Major', 'Minor (Natural)', 'Dorian', 'Pentatonic Major']
        },
        'blues': {
            bpmRange: [80, 130],
            commonKeys: ['E', 'A', 'B', 'G', 'C'],
            commonScales: ['Blues Scale', 'Pentatonic Minor', 'Pentatonic Major', 'Mixolydian']
        },
        'metal': {
            bpmRange: [120, 180],
            commonKeys: ['E', 'D', 'C', 'B', 'A'],
            commonScales: ['Minor (Natural)', 'Phrygian', 'Locrian', 'Harmonic Minor', 'Chromatic']
        },
        'reggae': {
            bpmRange: [60, 90],
            commonKeys: ['A', 'G', 'C', 'D', 'E'],
            commonScales: ['Minor (Natural)', 'Major']
        },
        'latin': {
            bpmRange: [90, 130],
            commonKeys: ['G', 'C', 'F', 'D', 'A'],
            commonScales: ['Major', 'Minor (Natural)', 'Harmonic Minor']
        },
        'world music': {
            bpmRange: [80, 140],
            commonKeys: keys,
            commonScales: scales
        },
        'soundtrack': {
            bpmRange: [60, 160],
            commonKeys: keys,
            commonScales: ['Major', 'Minor (Natural)', 'Lydian', 'Phrygian', 'Harmonic Minor']
        }
    };

    const minBPM = 60;
    const maxBPM = 180;
    // Erzeugt eine Liste von Zahlen von minBPM bis maxBPM
    const bpmValues = Array.from({ length: maxBPM - minBPM + 1 }, (_, i) => minBPM + i);

    // --- Logik für das Genre-Auswahl-Popup ---

    // 1. Erstelle das Popup-Element und füge es zum Body hinzu
    const genreSuggestionsPopup = document.createElement('div');
    genreSuggestionsPopup.id = 'genreSuggestionsPopup';
    // Hinweis: Diese Stile sind direkt hier für die Funktionalität.
    // Für ein besseres Design sollten sie in eine CSS-Datei ausgelagert werden.
    Object.assign(genreSuggestionsPopup.style, {
        display: 'none',
        position: 'absolute',
        border: '1px solid #555',
        backgroundColor: '#2e2e2e',
        color: '#eee',
        zIndex: '1000',
        maxHeight: '200px',
        overflowY: 'auto',
        borderRadius: '4px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
    });
    document.body.appendChild(genreSuggestionsPopup);

    // 2. Fülle das Popup mit den verfügbaren Genres
    Object.keys(genreProfiles).forEach(genreKey => {
        const button = document.createElement('button');
        button.textContent = genreKey.charAt(0).toUpperCase() + genreKey.slice(1);
        // Grundlegende Button-Stile
        Object.assign(button.style, {
            display: 'block',
            width: '100%',
            padding: '10px',
            border: 'none',
            borderBottom: '1px solid #444',
            backgroundColor: 'transparent',
            color: '#eee',
            textAlign: 'left',
            cursor: 'pointer'
        });
        // Hover-Effekt
        button.addEventListener('mouseenter', () => button.style.backgroundColor = '#4a4a4a');
        button.addEventListener('mouseleave', () => button.style.backgroundColor = 'transparent');

        // Klick-Aktion: Genre ins Feld eintragen und Popup schließen
        button.addEventListener('click', () => {
            genreInput.value = button.textContent;
            genreSuggestionsPopup.style.display = 'none';
        });
        genreSuggestionsPopup.appendChild(button);
    });
    // Entferne den Border beim letzten Button für ein sauberes Aussehen
    if (genreSuggestionsPopup.lastChild) {
        genreSuggestionsPopup.lastChild.style.borderBottom = 'none';
    }

    // 3. Logik zum Anzeigen und Verstecken des Popups
    genreInput.addEventListener('focus', () => {
        const rect = genreInput.getBoundingClientRect();
        Object.assign(genreSuggestionsPopup.style, {
            left: `${rect.left + window.scrollX}px`,
            top: `${rect.bottom + window.scrollY + 5}px`, // 5px Abstand
            width: `${rect.width}px`,
            display: 'block'
        });
    });

    // Schließe das Popup, wenn außerhalb geklickt wird
    document.addEventListener('click', (e) => {
        // Verstecke, wenn der Klick nicht auf dem Input oder im Popup selbst war
        if (e.target !== genreInput && !genreSuggestionsPopup.contains(e.target)) {
            genreSuggestionsPopup.style.display = 'none';
        }
    });

    // Diese Funktion füllt die Walzen mit den Texten
    function populateReel(reelElement, items) {
        let allItemsHtml = [];

        // 1. Pre-items (Dummies am Anfang)
        for (let i = 0; i < PRE_POST_ITEMS_COUNT; i++) {
            allItemsHtml.push(`<div class="reel-item">${items[Math.floor(Math.random() * items.length)]}</div>`);
        }

        // 2. "Spin-through" items (EXTRA_SPINS volle Zyklen der echten Items)
        // Diese Items werden während der "extra Spins" sichtbar durchlaufen.
        for (let spinCycle = 0; spinCycle < EXTRA_SPINS; spinCycle++) {
            items.forEach(item => {
                allItemsHtml.push(`<div class="reel-item">${item}</div>`);
            });
        }

        // 3. "Landing" items (ein voller Zyklus der echten Items, auf denen die Walze landen wird)
        items.forEach(item => {
            allItemsHtml.push(`<div class="reel-item">${item}</div>`);
        });

        // 4. Post-items (Dummies am Ende)
        // Diese sorgen dafür, dass auch beim Landen auf dem letzten Item noch "etwas" darunter ist.
        for (let i = 0; i < PRE_POST_ITEMS_COUNT; i++) {
            allItemsHtml.push(`<div class="reel-item">${items[Math.floor(Math.random() * items.length)]}</div>`);
        }
        reelElement.innerHTML = allItemsHtml.join(''); // Fügt alle Items in die HTML-Walze ein
    }

    // Fülle jede Walze beim Start
    populateReel(keyReel, keys.map(String)); // Stelle sicher, dass alle Items Strings sind
    populateReel(scaleReel, scales.map(String));
    populateReel(bpmReel, bpmValues.map(String));

    let isSpinning = false; // Eine Variable, die verhindert, dass man den Button drückt, während es sich dreht

    spinBtn.addEventListener('click', () => {
        if (isSpinning) return; // Wenn sich schon dreht, tue nichts
        isSpinning = true;
        spinBtn.disabled = true; // Button deaktivieren

        // --- NEUE LOGIK: Genre-basierte Auswahl ---
        const genre = genreInput.value.toLowerCase().trim();
        const profile = genreProfiles[genre];

        // Wähle die Quell-Arrays basierend auf dem Genre-Profil aus
        const sourceKeys = profile ? profile.commonKeys : keys;
        const sourceScales = profile ? profile.commonScales : scales;
        let sourceBpmValues = bpmValues;
        if (profile) {
            const [min, max] = profile.bpmRange;
            sourceBpmValues = Array.from({ length: max - min + 1 }, (_, i) => min + i);
        }

        // Setze die Walzenpositionen zurück, damit die Animation immer von "oben" startet
        keyReel.style.transform = `translateY(0px)`;
        scaleReel.style.transform = `translateY(0px)`;
        bpmReel.style.transform = `translateY(0px)`;

        // Entferne alte Animationseinstellungen, damit der Reset sofort passiert
        keyReel.style.transition = 'none';
        scaleReel.style.transition = 'none';
        bpmReel.style.transition = 'none';

        // Wähle zufällig die finalen Ergebnisse aus den (möglicherweise gefilterten) Quell-Listen
        const targetKey = sourceKeys[Math.floor(Math.random() * sourceKeys.length)];
        const targetScale = sourceScales[Math.floor(Math.random() * sourceScales.length)];
        const targetBPM = sourceBpmValues[Math.floor(Math.random() * sourceBpmValues.length)];

        // Finde den Index der ausgewählten Werte in den *originalen*, vollständigen Listen.
        // Das ist wichtig, damit die Walzen-Animation an die richtige Stelle scrollt.
        const finalKeyIndex = keys.indexOf(targetKey);
        const finalScaleIndex = scales.indexOf(targetScale);
        const finalBPMIndex = bpmValues.indexOf(targetBPM);

        // Berechne die Zielposition für die Walzen. Die Formel berücksichtigt die PRE_POST_ITEMS_COUNT,
        // die EXTRA_SPINS Durchläufe der Items und den ausgewählten Index im "Lande"-Block.
        // Wir benutzen hier die finalen Indizes aus den vollen Listen.
        const keyTargetPosition = -(finalKeyIndex + PRE_POST_ITEMS_COUNT + (keys.length * EXTRA_SPINS)) * REEL_ITEM_HEIGHT;
        const scaleTargetPosition = -(finalScaleIndex + PRE_POST_ITEMS_COUNT + (scales.length * EXTRA_SPINS)) * REEL_ITEM_HEIGHT;
        const bpmTargetPosition = -(finalBPMIndex + PRE_POST_ITEMS_COUNT + (bpmValues.length * EXTRA_SPINS)) * REEL_ITEM_HEIGHT;

        // Dauer der Animation für jede Walze in Millisekunden (ms)
        const keySpinTime = 3000;
        const scaleSpinTime = 3500;
        const bpmSpinTime = 4000;

        // Animation starten
        // Ein kleiner Timeout, um sicherzustellen, dass der "Reset" der Position zuerst passiert
        setTimeout(() => {
            keyReel.style.transition = `transform ${keySpinTime / 1000}s cubic-bezier(0.25, 0.1, 0.25, 1)`; // Die Animationseinstellung
            keyReel.style.transform = `translateY(${keyTargetPosition}px)`; // Walze bewegen
        }, 50); // 50ms Verzögerung

        setTimeout(() => {
            scaleReel.style.transition = `transform ${scaleSpinTime / 1000}s cubic-bezier(0.25, 0.1, 0.25, 1)`;
            scaleReel.style.transform = `translateY(${scaleTargetPosition}px)`;
        }, 100); // Etwas später starten für den Kaskadeneffekt

        setTimeout(() => {
            bpmReel.style.transition = `transform ${bpmSpinTime / 1000}s cubic-bezier(0.25, 0.1, 0.25, 1)`;
            bpmReel.style.transform = `translateY(${bpmTargetPosition}px)`;
        }, 150); // Noch später starten

        // Nachdem alle Animationen beendet sind, zeigen wir die Ergebnisse an
        setTimeout(() => {
            currentKeySpan.textContent = targetKey;
            currentScaleSpan.textContent = targetScale;
            currentBPMSpan.textContent = targetBPM;
            isSpinning = false; // Spin-Status zurücksetzen
            spinBtn.disabled = false; // Button wieder aktivieren
        }, bpmSpinTime + 200); // Warte etwas länger als die längste Animation
    });

    // Event Listener für den Zufalls-Genre-Button
    randomGenreBtn.addEventListener('click', () => {
        const availableGenres = Object.keys(genreProfiles);
        const randomGenre = availableGenres[Math.floor(Math.random() * availableGenres.length)];
        genreInput.value = randomGenre.charAt(0).toUpperCase() + randomGenre.slice(1); // Macht den ersten Buchstaben groß
    });

    // Beim ersten Laden der Seite die Anzeige initialisieren
    currentKeySpan.textContent = '-';
    currentScaleSpan.textContent = '-';
    currentBPMSpan.textContent = '-';
});