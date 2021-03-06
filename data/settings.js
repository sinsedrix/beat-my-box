module.exports = [
    { id: "t", name: "type", type: "select", values: [
        { value: "full-60", text: "Full range"},
        { value: "kikker-15", text: "Kikkerland"},
        { value: "grill-20", text: "Grands Illusions 20"},
        { value: "grill-30", text: "Grands Illusions 30"},
        { value: "grill-30f", text: "Grands Illusions 30 (F scale)"},
    ] },
    { id: "n", name: "nbNotes", type: "number", min: "32", max: "128", step: "8" },
    { id: "bpm", name: "tempo", type: "number", min: "60", max: "180", step: "1" },
    { id: "v", name: "volume", type: "number", min: "0", max: "1", step: "0.01" },
    { id: "w", name: "waveform", type: "select", values: [
        { value: "sine", text: "Sine"},
        { value: "square", text: "Square"},
        { value: "sawtooth", text: "Sawtooth"},
        { value: "triangle", text: "Triangle"},
        { value: "custom", text: "Custom"},
    ] },
];