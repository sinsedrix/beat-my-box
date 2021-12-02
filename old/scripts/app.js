let audioCtx = null;
let oscList = [];
let mainGainNode = null;

let keyboard = document.querySelector(".keyboard");
let partition = document.querySelector(".partition-table");
let wavePicker = document.querySelector("select[name='waveform']");
let rangePicker = document.querySelector("select[name='range']");
let volumeControl = document.querySelector("input[name='volume']");
let bpmControl = document.querySelector("input[name='bpm']");
let playButton = document.querySelector("button[name='play']");
let initButton = document.querySelector("button[name='init']");

let noteFreq = null;
let customWaveform = null;
let sineTerms = null;
let cosineTerms = null;
let isPlaying = false;
let tempo = 60;

let notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const lookahead = 25.0; // How frequently to call scheduling function (in milliseconds)
const scheduleAheadTime = 0.1; // How far ahead to schedule audio (sec)

let currentNote = 0; // The note we are currently playing
let nextNoteTime = 0.0; // when the next note is due.

function nextNote() {
  const secondsPerBeat = 60.0 / tempo;

  nextNoteTime += secondsPerBeat / 2; // Add beat length to last beat time

  // Advance the beat number, wrap to zero
  currentNote = (currentNote+1)%96;
}

// Create a queue for the notes that are to be played, with the current time that we want them to play:
const notesInQueue = [];

function scheduleNote(beatNumber, time) {
  // push the note on the queue, even if we're not playing.
  notesInQueue.push({note: beatNumber, time: time});
  // console.log(beatNumber, time);

  for(let oct in noteFreq) {
    for(let key in noteFreq[oct]) {
      let input = partition.querySelector('tr.o'+oct+'.n'+key+' td.t'+beatNumber+' input');
      if (input.checked) {
        playBeep(time, noteFreq[oct][key]);
      }
    }
  }
  
}

let timerID;
function scheduler() {
  // while there are notes that will need to play before the next interval,
  // schedule them and advance the pointer.
  while (nextNoteTime < audioCtx.currentTime + scheduleAheadTime ) {
      scheduleNote(currentNote, nextNoteTime);
      nextNote();
  }
  timerID = setTimeout(scheduler, lookahead);
}

function freq(o, n) {
  return 55*Math.pow(2, o+(n-3)/12);
}

let ranges = {
  "full-60" :  createNoteTableFull60 ,
  "kikker-15" : createNoteTableKikker15,
  "grill-20": [],
  "grill-30": [],
  "grill-30f": [],
};

function createNoteTableFull60() {
  let noteFreq = [];
  for (let i=1; i<7; i++) {
    noteFreq[i] = [];
    for(let j=0; j<12; j++) {
      if(notes[j].length == 1) {
        noteFreq[i][notes[j]] = freq(i, j);
      }
    }
  }
  return noteFreq;
}

function createNoteTableKikker15() {
  let noteFreq = [];
  for (let i=4; i<6; i++) {
    noteFreq[i] = [];
    for(let j=0; j<12; j++) {
      if(notes[j].length == 1) {
        noteFreq[i][notes[j]] = freq(i, j);
      }
    }
  }
  noteFreq[6] = [];
  noteFreq[6][notes[0]] = freq(6, 0);
  return noteFreq;
}

if (!Object.entries) {
  Object.entries = function entries(O) {
    return reduce(keys(O), (e, k) => concat(e, typeof k === 'string' && isEnumerable(O, k) ? [[k, O[k]]] : []), []);
  };
}

function init() {
  audioCtx = typeof window !== "undefined" ? new (window.AudioContext || window.webkitAudioContext)() : null;
  mainGainNode = audioCtx.createGain();
  mainGainNode.connect(audioCtx.destination);
  mainGainNode.gain.value = volumeControl.value;

  sineTerms = new Float32Array([0, 0, 1, 0, 1]);
  cosineTerms = new Float32Array(sineTerms.length);
  customWaveform = audioCtx.createPeriodicWave(cosineTerms, sineTerms);

  for (i=0; i<9; i++) {
    oscList[i] = {};
  }

  changeRange();
}

function setup() {


  volumeControl.addEventListener("change", changeVolume, false);
  rangePicker.addEventListener("change", changeRange, false);
  
  bpmControl.addEventListener('input', ev => {
    tempo = Number(ev.target.value);
  }, false);
  playButton.addEventListener('click', ev => {
    isPlaying = !isPlaying;

    if (isPlaying) { // start playing

      // check if context is in suspended state (autoplay policy)
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      currentNote = 0;
      nextNoteTime = audioCtx.currentTime;
      scheduler(); // kick off scheduling
      //requestAnimationFrame(draw); // start the drawing loop.
      ev.target.dataset.playing = 'true';
    } else {
      clearTimeout(timerID);
      ev.target.dataset.playing = 'false';
    }
  });
  initButton.addEventListener('click', init);
}

setup();

function createKey(note, octave, freq) {
  let keyElement = document.createElement("div");
  let labelElement = document.createElement("div");

  keyElement.className = "key";
  keyElement.dataset["octave"] = octave;
  keyElement.dataset["note"] = note;
  keyElement.dataset["frequency"] = freq;

  labelElement.innerHTML = note + "<sub>" + octave + "</sub>";
  keyElement.appendChild(labelElement);

  keyElement.addEventListener("mousedown", notePressed, false);
  keyElement.addEventListener("mouseup", noteReleased, false);
  keyElement.addEventListener("mouseover", notePressed, false);
  keyElement.addEventListener("mouseleave", noteReleased, false);

  return keyElement;
}

function playTone(freq) {
  let osc = audioCtx.createOscillator();
  osc.connect(mainGainNode);

  let type = wavePicker.options[wavePicker.selectedIndex].value;

  if (type == "custom") {
    osc.setPeriodicWave(customWaveform);
  } else {
    osc.type = type;
  }

  osc.frequency.value = freq;
  osc.start();

  return osc;
}

function notePressed(event) {
  if (event.buttons & 1) {
    let dataset = event.target.dataset;

    if (!dataset["pressed"]) {
      let octave = +dataset["octave"];
      oscList[octave][dataset["note"]] = playTone(dataset["frequency"]);
      dataset["pressed"] = "yes";
    }
  }
}

function noteReleased(event) {
  let dataset = event.target.dataset;

  if (dataset && dataset["pressed"]) {
    let octave = +dataset["octave"];
    oscList[octave][dataset["note"]].stop();
    delete oscList[octave][dataset["note"]];
    delete dataset["pressed"];
  }
}

function changeVolume(event) {
  mainGainNode.gain.value = volumeControl.value
}

function changeRange(event) {
  noteFreq = ranges[rangePicker.value]();

  keyboard.innerHTML = "";
  partition.innerHTML = "";

  // Create the keys; skip any that are sharp or flat; for
  // our purposes we don't need them. Each octave is inserted
  // into a <div> of class "octave".

  noteFreq.forEach(function(keys, oct) {
    let keyList = Object.entries(keys);
    let octaveElem = document.createElement("div");
    octaveElem.className = "octave";

    keyList.forEach(function(key) {
      let note = key[0];
      octaveElem.appendChild(createKey(key[0], oct, key[1]));

      let keyRow = document.createElement("tr");
      keyRow.className = "key-row o"+ oct +" n" + note;
      keyRow.dataset = key[0];
      
      let keyHead = document.createElement("th");
      keyHead.className = "key-head";
      let keyLabel = document.createElement("div");
      keyLabel.innerHTML = note + "<sub>" + oct + "</sub>";
      keyHead.appendChild(keyLabel);
      keyRow.appendChild(keyHead);

      for(let c=0; c<96; c++) {
        let keyCell = document.createElement("td");
        keyCell.className = "key-cell-" + Math.floor(c/8)%2 +' '+ "t"+c;
        let keyCheck = document.createElement("input");
        keyCheck.type = "checkbox";
        keyCheck.dataset = c;
        keyCell.appendChild(keyCheck);
        keyRow.appendChild(keyCell);
      }

      partition.appendChild(keyRow);
    });

    keyboard.appendChild(octaveElem);
    
  });

  document.querySelector("div[data-note='B'][data-octave='5']").scrollIntoView(false);
}

const attackControl = document.querySelector('#attack');
let attackTime = Number(attackControl.value);
attackControl.addEventListener('input', ev => {
  attackTime = Number(ev.target.value);
}, false);

const releaseControl = document.querySelector('#release');
let releaseTime = Number(releaseControl.value);
releaseControl.addEventListener('input', ev => {
  releaseTime = Number(ev.target.value);
}, false);

const beepLength = 1;
// expose attack time & release time
function playBeep(time, freq) {
  const osc = audioCtx.createOscillator();
  let type = wavePicker.options[wavePicker.selectedIndex].value;

  if (type == "custom") {
    osc.setPeriodicWave(customWaveform);
  } else {
    osc.type = type;
  }

  osc.frequency.value = freq;

  const beepEnv = audioCtx.createGain();
  beepEnv.gain.cancelScheduledValues(time);
  beepEnv.gain.setValueAtTime(0, time);
  beepEnv.gain.linearRampToValueAtTime(1, time + attackTime);
  beepEnv.gain.linearRampToValueAtTime(0, time + beepLength - releaseTime);

  osc.connect(beepEnv).connect(audioCtx.destination);
  osc.start(time);
  osc.stop(time + beepLength);
}

