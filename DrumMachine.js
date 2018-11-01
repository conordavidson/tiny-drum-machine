class DrumMachine {
  constructor() {
    this.soundBank = {
      snare: new Audio('snare.wav'),
      kick: new Audio('kick.wav'),
      hat: new Audio('hat.wav')
    };

    this.stopped = false;
    this.sequenceLength = 8;
    this.bpm = 120;

    this.tracks = {
      snare: {
        id: 'snare',
        sound: this.soundBank.snare,
        sequence: [false, false, true, false, false, false, true, false]
      },
      kick: {
        id: 'kick',
        sound: this.soundBank.kick,
        sequence: [true, false, false, false, true, false, false, false]
      },
      hat: {
        id: 'hat',
        sound: this.soundBank.hat,
        sequence: [true, true, true, true, true, true, true, true]
      }
    };
  }

  noteInterval() {
    return 30000 / this.bpm;
  }

  trackArray() {
    return Object.values(this.tracks);
  }

  play() {
    this.stopped = false;
    this.loop(0);
  }

  stop() {
    this.stopped = true;
  }

  loop(noteIndex) {
    if (this.stopped) return;

    this.trackArray().forEach(track => {
      if (track.sequence[noteIndex]) {
        track.sound.play();
      }
    });

    return setTimeout(() => {
      return noteIndex == this.sequenceLength - 1 ? this.loop(0) : this.loop(noteIndex + 1);
    }, this.noteInterval());
  }

  toggleNote(trackId, index) {
    this.tracks[trackId].sequence[index] = !this.tracks[trackId].sequence[index];
  }

  render() {
    const tracksContainer = document.querySelector('[data-tracks]');
    const bpmContainer = document.querySelector('[data-bpm]');
    this.trackArray().map(track => this.renderTrack(tracksContainer, track));
    this.renderBpmSelector(bpmContainer);
  }

  renderTrack(container, track) {
    const trackElement = document.createElement('div');
    trackElement.innerHTML = `<div>${track.id}</div>`;
    track.sequence.map((note, index) => this.renderNote(trackElement, track.id, index, note));
    container.appendChild(trackElement);
  }

  renderNote(trackElement, trackId, noteIndex, note) {
    const noteElement = document.createElement('input');
    noteElement.type = 'checkbox';
    noteElement.checked = note;
    noteElement.onchange = e => {
      this.tracks[trackId].sequence[noteIndex] = e.target.checked;
    };
    trackElement.appendChild(noteElement);
  }

  renderBpmSelector(container) {
    const bpmSelector = document.createElement('input');
    bpmSelector.type = 'number';
    bpmSelector.value = this.bpm;
    bpmSelector.label = 'bpm';
    bpmSelector.onchange = e => {
      this.bpm = e.target.value;
    };
    container.appendChild(bpmSelector);
  }
}

const drumMachine = new DrumMachine();
drumMachine.render();

const play = () => {
  drumMachine.play();
};

const stop = () => {
  drumMachine.stop();
};
