module.exports = [
    { id: "r", name: "range", type: "select", values: [
        { value: "full-60", text: "Full range"},
        { value: "kikker-15", text: "Kikkerland"},
        { value: "grill-20", text: "Grands Illusions 20"},
        { value: "grill-30", text: "Grands Illusions 30"},
        { value: "grill-30f", text: "Grands Illusions 30 (F scale)"},
    ] },
    { id: "n", name: "nbNotes", type: "number", min: "32", max: "128", step: "8" },
];