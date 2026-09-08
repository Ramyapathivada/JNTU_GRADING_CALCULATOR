/*
 * Regulation definitions.
 *
 * R18 and R23 grade scales below are based on published JNTUH-style
 * academic regulations. R20 is kept configurable because exact rules can
 * differ between university/regulation/college versions.
 *
 * Do not treat this file as an official university data source.
 */
const REGULATIONS = {
  R18: {
    name: "R18",
    description: "JNTUH R18-style 10-point grading",
    grades: [
      { code: "O",  label: "Outstanding", gp: 10, min: 90 },
      { code: "A+", label: "Excellent",   gp: 9,  min: 80 },
      { code: "A",  label: "Very Good",   gp: 8,  min: 70 },
      { code: "B+", label: "Good",        gp: 7,  min: 60 },
      { code: "B",  label: "Average",     gp: 6,  min: 50 },
      { code: "C",  label: "Pass",        gp: 5,  min: 40 },
      { code: "P",  label: "Pass",        gp: 4,  min: 35 },
      { code: "F",  label: "Fail",        gp: 0,  min: 0 },
      { code: "Ab", label: "Absent",      gp: 0, min: 0 }
    ],
    passGp: 5,
    maxCredits: null,
    percentageFormula: cgpa => Math.max(0, (cgpa - 0.5) * 10),
    formulaText: "(CGPA − 0.5) × 10",
    classBands: [
      { min: 7.5, label: "First Class with Distinction" },
      { min: 6.5, label: "First Class" },
      { min: 5.5, label: "Second Class" },
      { min: 5.0, label: "Pass Class" }
    ],
    notice: "R18 uses credit-weighted SGPA/CGPA. Final percentage conversion is commonly stated as (CGPA − 0.5) × 10 in JNTUH R18 regulations."
  },

  R20: {
    name: "R20",
    description: "R20 configurable 10-point grading",
    grades: [
      { code: "O",  label: "Outstanding", gp: 10, min: 90 },
      { code: "A+", label: "Excellent",   gp: 9,  min: 80 },
      { code: "A",  label: "Very Good",   gp: 8,  min: 70 },
      { code: "B+", label: "Good",        gp: 7,  min: 60 },
      { code: "B",  label: "Average",     gp: 6,  min: 50 },
      { code: "C",  label: "Pass",        gp: 5,  min: 40 },
      { code: "F",  label: "Fail",        gp: 0,  min: 0 },
      { code: "Ab", label: "Absent",      gp: 0, min: 0 }
    ],
    passGp: 5,
    maxCredits: null,
    percentageFormula: cgpa => Math.max(0, (cgpa - 0.5) * 10),
    formulaText: "(CGPA − 0.5) × 10",
    classBands: [
      { min: 7.5, label: "First Class with Distinction" },
      { min: 6.5, label: "First Class" },
      { min: 5.5, label: "Second Class" },
      { min: 5.0, label: "Pass Class" }
    ],
    notice: "R20 is intentionally configurable. Verify the exact R20 regulation applicable to your university/college before using the result officially."
  },

  R23: {
    name: "R23",
    description: "JNTUH R23-style 10-point grading",
    grades: [
      { code: "O",  label: "Outstanding", gp: 10, min: 90 },
      { code: "A+", label: "Excellent",   gp: 9,  min: 80 },
      { code: "A",  label: "Very Good",   gp: 8,  min: 70 },
      { code: "B+", label: "Good",        gp: 7,  min: 60 },
      { code: "B",  label: "Average",     gp: 6,  min: 50 },
      { code: "C",  label: "Pass",        gp: 5,  min: 40 },
      { code: "F",  label: "Fail",        gp: 0,  min: 0 },
      { code: "Ab", label: "Absent",      gp: 0, min: 0 }
    ],
    passGp: 5,
    maxCredits: 160,
    percentageFormula: cgpa => Math.max(0, (cgpa - 0.5) * 10),
    formulaText: "(CGPA − 0.5) × 10",
    classBands: [
      { min: 7.5, label: "First Class with Distinction" },
      { min: 6.5, label: "First Class" },
      { min: 5.5, label: "Second Class" },
      { min: 5.0, label: "Pass Class" }
    ],
    notice: "R23 uses a 10-point absolute grading system and computes SGPA/CGPA from credit points. The final B.Tech CGPA is based on the prescribed 160-credit programme structure."
  }
};

function getRegulation() {
  return REGULATIONS[document.getElementById("regulation").value];
}

function gradeByCode(code) {
  return getRegulation().grades.find(g => g.code === code);
}
