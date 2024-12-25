const piano = document.querySelector('.piano');
const visualizer = document.getElementById('visualizer');
const instrumentSelect = document.getElementById('instrument');
const birthdaySongBtn = document.getElementById('birthdaySong');
const christmasSongBtn = document.getElementById('christmasSong');

const notes = [
  { note: 'C', key: 'a', sound: 'C4' },
  { note: 'C#', key: 'w', sound: 'Cs4', black: true },
  { note: 'D', key: 's', sound: 'D4' },
  { note: 'D#', key: 'e', sound: 'Ds4', black: true },
  { note: 'E', key: 'd', sound: 'E4' },
  { note: 'F', key: 'f', sound: 'F4' },
  { note: 'F#', key: 't', sound: 'Fs4', black: true },
  { note: 'G', key: 'g', sound: 'G4' },
  { note: 'G#', key: 'y', sound: 'Gs4', black: true },
  { note: 'A', key: 'h', sound: 'A4' },
  { note: 'A#', key: 'u', sound: 'As4', black: true },
  { note: 'B', key: 'j', sound: 'B4' },
  { note: 'C5', key: 'k', sound: 'C5' }
];

const instruments = {
  piano: { type: 'triangle', decay: 1.5, volume: 0.5 },
  synth: { type: 'sawtooth', decay: 2, volume: 0.3 },
  guitar: { type: 'square', decay: 1, volume: 0.4 },
  drum: { type: 'sine', decay: 0.1, volume: 0.8 }
};

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playSound(note, startTime = audioContext.currentTime) {
  const instrument = instruments[instrumentSelect.value];
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.type = instrument.type;

  const baseFreq = 440 * Math.pow(2, (notes.findIndex(n => n.note === note) - 9) / 12);
  oscillator.frequency.setValueAtTime(baseFreq, startTime);

  gainNode.gain.setValueAtTime(instrument.volume, startTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + instrument.decay);

  oscillator.start(startTime);
  oscillator.stop(startTime + instrument.decay);

  visualizer.classList.add('playing');
  visualizer.textContent = `Playing: ${note} (${instrumentSelect.value})`;
  setTimeout(() => {
    visualizer.textContent = 'Ready to play';
    visualizer.classList.remove('playing');
  }, instrument.decay * 1000);

  highlightKey(note, startTime);
}

function createKey(noteData) {
  const key = document.createElement('div');
  key.className = `key ${noteData.black ? 'black' : ''}`;

  const label = document.createElement('div');
  label.className = 'key-label';
  label.textContent = `${noteData.note}\n${noteData.key}`;
  key.appendChild(label);

  function playNote() {
    playSound(noteData.note);
  }

  key.addEventListener('mousedown', playNote);
  document.addEventListener('keydown', (e) => {
    if (e.key === noteData.key && !e.repeat) playNote();
  });

  return key;
}

function highlightKey(note, startTime) {
  const key = piano.querySelector(`.key:nth-child(${notes.findIndex(n => n.note === note) + 1})`);
  setTimeout(() => {
    key.classList.add('active');
    setTimeout(() => key.classList.remove('active'), 200);
  }, (startTime - audioContext.currentTime) * 1000);
}

notes.forEach(note => piano.appendChild(createKey(note)));

function playSequenceWithDuration(sequence) {
  let currentTime = audioContext.currentTime;
  
  sequence.forEach(({ note, duration }) => {
    if (note) {
      playSound(note, currentTime);
    }
    currentTime += duration / 1000;
  });
}

function playBirthdaySong() {
  const sequence = [
    { note: 'C', duration: 500 }, { note: 'C', duration: 500 }, { note: 'D', duration: 500 }, { note: 'C', duration: 500 },
    { note: 'F', duration: 500 }, { note: 'E', duration: 1000 },
    { note: 'C', duration: 500 }, { note: 'C', duration: 500 }, { note: 'D', duration: 500 }, { note: 'C', duration: 500 },
    { note: 'G', duration: 500 }, { note: 'F', duration: 1000 },
    { note: 'C', duration: 500 }, {duration: 500 }, { note: 'C5', duration: 500 }, { note: 'A', duration: 500 }, { note: 'F', duration: 500 },
    { note: 'E', duration: 500 }, { note: 'D', duration: 500 },
    { note: 'A#', duration: 500 }, { note: 'A', duration: 500 }, { note: 'F', duration: 500 }, { note: 'G', duration: 500 }, { note: 'F', duration: 1000 }
  ];
  playSequenceWithDuration(sequence);
}

function playChristmasSong() {
  const sequence = [
    { note: 'E', duration: 250 }, { note: 'E', duration: 250 }, { note: 'E', duration: 500 },
    { note: null, duration: 250 }, // Short pause
    { note: 'E', duration: 250 }, { note: 'E', duration: 250 }, { note: 'E', duration: 500 },
    { note: null, duration: 250 }, // Short pause
    { note: 'E', duration: 250 }, { note: 'G', duration: 250 }, { note: 'C', duration: 250 }, { note: 'D', duration: 250 },
    { note: 'E', duration: 1000 },
    { note: null, duration: 500 }, // Longer pause
    { note: 'F', duration: 250 }, { note: 'F', duration: 250 }, { note: 'F', duration: 250 }, { note: 'F', duration: 250 },
    { note: 'F', duration: 250 }, { note: 'E', duration: 250 }, { note: 'E', duration: 250 }, { note: 'E', duration: 250 },
    { note: 'E', duration: 250 }, { note: 'D', duration: 250 }, { note: 'D', duration: 250 }, { note: 'E', duration: 250 },
    { note: 'D', duration: 500 }, { note: 'G', duration: 500 },
    { note: null, duration: 500 }, // Longer pause
    { note: 'G', duration: 250 }, { note: 'G', duration: 250 }, { note: 'G', duration: 500 },
    { note: 'G', duration: 250 }, { note: 'F#', duration: 250 }, { note: 'E', duration: 500 },
    { note: 'D', duration: 250 }, { note: 'A', duration: 250 }, { note: 'G', duration: 1000 },
    { note: null, duration: 500 }, // Longer pause
    { note: 'G', duration: 250 }, { note: 'G', duration: 250 }, { note: 'G', duration: 500 },
    { note: 'G', duration: 250 }, { note: 'F#', duration: 250 }, { note: 'E', duration: 500 },
    { note: 'D', duration: 250 }, { note: 'C', duration: 250 }, { note: 'C', duration: 1000 },
  ];
  
  playSequenceWithDuration(sequence);
}

birthdaySongBtn.addEventListener('click', playBirthdaySong);
christmasSongBtn.addEventListener('click', playChristmasSong);

function openTab(evt, tabName) {
  const tabContents = document.getElementsByClassName("tab-content");
  for (let i = 0; i < tabContents.length; i++) {
    tabContents[i].classList.remove("active");
  }

  const tabs = document.getElementsByClassName("tab");
  for (let i = 0; i < tabs.length; i++) {
    tabs[i].classList.remove("active");
  }

  document.getElementById(tabName).classList.add("active");
  evt.currentTarget.classList.add("active");
}
