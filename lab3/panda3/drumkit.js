document.addEventListener('keypress', onKeyPress);

const keyToSound = {
    a: document.querySelector('#sound-boom'),
    s: document.querySelector('#sound-clap'),
    d: document.querySelector('#sound-hihat'),
    f: document.querySelector('#sound-kick'),
    g: document.querySelector('#sound-openhat'),
    h: document.querySelector('#sound-ride'),
    j: document.querySelector('#sound-snare'),
    k: document.querySelector('#sound-tink'),
    l: document.querySelector('#sound-tom'),
};

const playBtn = document.querySelector('#btn-play');
const currentCanalEl = document.querySelector('#current-canal');
const canalsEl = document.querySelector('#canals');

let currentCanal = null;
const canals = [[], [], [], []];

function onKeyPress(event) {
    const sound = keyToSound[event.key];
    if (!sound) return;

    playSound(sound);
    pushSoundToCanal(sound, currentCanal);
}

function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
}

function pushSoundToCanal(sound, canal) {
    if (!canal) return;

    const firstSound = canals[canal - 1][0];
    const delay = Date.now() - (firstSound?.timestamp || 0);

    canals[canal - 1].push({ sound, timestamp: Date.now(), delay });
}

function setCurrentCanal(canal) {
    currentCanal = canal;
    currentCanalEl.textContent = canal;
}

function playCanals() {
    const selectedChanels = [...document.querySelectorAll('input[name=playable-canal]:checked')].map(
        (item) => item.dataset.canal
    );

    const playableCanals = canals.filter((_, index) => selectedChanels.includes(String(index + 1)));

    for (const canal of playableCanals) {
        for (const sound of canal) {
            setTimeout(() => {
                playSound(sound.sound);
                console.log('sound', sound);
            }, sound.delay);
        }
    }
}

playBtn.addEventListener('click', playCanals);
