
export const createAudioContext = () => typeof window !== "undefined" ? new (window.AudioContext || window.webkitAudioContext)() : null;

export const createOscillator = (audioCtx, gain, freq, wave, customWaveform) => {
    let osc = audioCtx.createOscillator();
    osc.connect(gain);

    if (wave == "custom") {
        osc.setPeriodicWave(customWaveform);
    } else {
        osc.type = wave;
    }

    osc.frequency.value = freq;

    return osc;
}

export const createGain = (audioCtx, vol) => {
    let gainNode = audioCtx.createGain();
    gainNode.connect(audioCtx.destination);
    gainNode.gain.value = vol;

    return gainNode;
}