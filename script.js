const piano = document.querySelector('.piano');
const visualizer = document.getElementById('visualizer');
const instrumentSelect = document.getElementById('instrument');
const birthdaySongBtn = document.getElementById('birthdaySong');

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

function playSound(note) {
  const instrument = instruments[instrumentSelect.value];
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.type = instrument.type;

  const baseFreq = 440 * Math.pow(2, (notes.findIndex(n => n.note === note) - 9) / 12);
  oscillator.frequency.setValueAtTime(baseFreq, audioContext.currentTime);

  gainNode.gain.setValueAtTime(instrument.volume, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + instrument.decay);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + instrument.decay);

  visualizer.classList.add('playing');
  visualizer.textContent = `Playing: ${note} (${instrumentSelect.value})`;
  setTimeout(() => {
    visualizer.textContent = 'Ready to play';
    visualizer.classList.remove('playing');
  }, instrument.decay * 1000);

  highlightKey(note);
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

function highlightKey(note) {
  const key = piano.querySelector(`.key:nth-child(${notes.findIndex(n => n.note === note) + 1})`);
  key.classList.add('active');
  setTimeout(() => key.classList.remove('active'), 200);
}

notes.forEach(note => piano.appendChild(createKey(note)));

function playSequence(sequence) {
  let index = 0;
  const interval = setInterval(() => {
    if (index < sequence.length) {
      playSound(sequence[index]);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 500);
}

function playBirthdaySong() {
  const sequence = ['C', 'C', 'D', 'C', 'F', 'E', 'C', 'C', 'D', 'C', 'G', 'F', 'C', 'C5', 'A', 'F', 'E', 'D', 'A#', 'A', 'F', 'G', 'F'];
  playSequence(sequence);
}

birthdaySongBtn.addEventListener('click', playBirthdaySong);
