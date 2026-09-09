/*
 * Grade point scale requested for this calculator:
 * S = 10, A = 9, B = 8, C = 7, D = 6, F = 0, AB = Absent
 *
 * This is an independent educational calculator and should be
 * checked against the exact regulation applicable to your college.
 */

const REQUESTED_GRADES = [
  { code: "S",  label: "Superior", gp: 10, min: 90 },
  { code: "A",  label: "Excellent", gp: 9, min: 80 },
  { code: "B",  label: "Very Good", gp: 8, min: 70 },
  { code: "C",  label: "Good", gp: 7, min: 60 },
  { code: "D",  label: "Pass", gp: 6, min: 50 },
  { code: "F",  label: "Fail", gp: 0, min: 0 },
  { code: "AB", label: "Absent", gp: 0, min: 0 }
];

const makeRegulation = (name, description, maxCredits = null) => ({
  name,
  description,
  grades: REQUESTED_GRADES.map(g => ({ ...g })),
  passGp: 6,
  maxCredits,
  percentageFormula: cgpa => Math.max(0, (cgpa - 0.5) * 10),
  formulaText: "(CGPA − 0.5) × 10",
  classBands: [
    { min: 7.5, label: "First Class with Distinction" },
    { min: 6.5, label: "First Class" },
    { min: 5.5, label: "Second Class" },
    { min: 5.0, label: "Pass Class" }
  ],
  notice: `${name} uses the custom grade point scale: S=10, A=9, B=8, C=7, D=6, F=0, AB=Absent.`
});

const REGULATIONS = {
  R18: makeRegulation("R18", "Custom 10-point grading scale"),
  R20: makeRegulation("R20", "Custom 10-point grading scale"),
  R23: makeRegulation("R23", "Custom 10-point grading scale", 160)
};

function getRegulation() {
  return REGULATIONS[document.getElementById("regulation").value];
}

function gradeByCode(code) {
  return getRegulation().grades.find(g => g.code === code);
}
