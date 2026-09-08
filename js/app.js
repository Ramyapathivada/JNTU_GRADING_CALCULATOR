const STORAGE_KEY = "jntu-grade-calculator-v1";
let state = {
  regulation: "R23",
  semesters: {},
  history: [],
  theme: "light"
};

const $ = id => document.getElementById(id);

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved) state = { ...state, ...saved };
  } catch (e) {
    console.warn("Could not load local data.", e);
  }

  $("regulation").value = state.regulation;
  document.documentElement.dataset.theme = state.theme === "dark" ? "dark" : "light";
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, ch => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[ch]));
}

function gradeOptions(selected = "") {
  return getRegulation().grades.map(g =>
    `<option value="${esc(g.code)}" ${g.code === selected ? "selected" : ""}>${esc(g.code)} — ${g.gp}</option>`
  ).join("");
}

function defaultSubjects() {
  return [
    { course: "", credits: "", grade: "" },
    { course: "", credits: "", grade: "" },
    { course: "", credits: "", grade: "" },
    { course: "", credits: "", grade: "" },
    { course: "", credits: "", grade: "" }
  ];
}

function currentSemesterNumber() {
  return Number($("semesterNumber").value);
}

function currentRows() {
  return [...document.querySelectorAll("#subjectsBody tr")].map(tr => ({
    course: tr.querySelector(".course").value.trim(),
    credits: tr.querySelector(".credits").value,
    grade: tr.querySelector(".grade").value
  }));
}

function renderSubjects(rows = null) {
  const semester = currentSemesterNumber();
  const stored = state.semesters[semester]?.subjects;
  const data = rows || stored || defaultSubjects();

  $("subjectsBody").innerHTML = data.map((row, i) => `
    <tr>
      <td><input class="course" type="text" maxlength="80" placeholder="Course ${i + 1}" value="${esc(row.course)}"></td>
      <td><input class="credits" type="number" min="0" max="20" step="0.5" placeholder="0" value="${esc(row.credits)}"></td>
      <td><select class="grade"><option value="">Grade</option>${gradeOptions(row.grade)}</select></td>
      <td class="gp">—</td>
      <td class="cp">—</td>
      <td><button class="remove-btn" type="button" aria-label="Remove subject">×</button></td>
    </tr>
  `).join("");

  document.querySelectorAll("#subjectsBody tr").forEach(tr => {
    tr.querySelector(".grade").addEventListener("change", updateRowPreview);
    tr.querySelector(".credits").addEventListener("input", updateRowPreview);
    tr.querySelector(".remove-btn").addEventListener("click", () => {
      tr.remove();
      calculateSGPA(false);
    });
    updateRowPreview.call(tr);
  });
  calculateSGPA(false);
}

function addSubject() {
  const tr = document.createElement("tr");
  const i = $("subjectsBody").rows.length + 1;
  tr.innerHTML = `
    <td><input class="course" type="text" maxlength="80" placeholder="Course ${i}"></td>
    <td><input class="credits" type="number" min="0" max="20" step="0.5" placeholder="0"></td>
    <td><select class="grade"><option value="">Grade</option>${gradeOptions()}</select></td>
    <td class="gp">—</td><td class="cp">—</td>
    <td><button class="remove-btn" type="button" aria-label="Remove subject">×</button></td>
  `;
  $("subjectsBody").appendChild(tr);
  tr.querySelector(".grade").addEventListener("change", updateRowPreview);
  tr.querySelector(".credits").addEventListener("input", updateRowPreview);
  tr.querySelector(".remove-btn").addEventListener("click", () => {
    tr.remove();
    calculateSGPA(false);
  });
}

function updateRowPreview() {
  const row = this.closest("tr");
  const credits = Number(row.querySelector(".credits").value);
  const grade = gradeByCode(row.querySelector(".grade").value);
  row.querySelector(".gp").textContent = grade ? grade.gp : "—";
  row.querySelector(".cp").textContent = grade && Number.isFinite(credits) ? (credits * grade.gp).toFixed(2) : "—";
}

function calculateSGPA(showAlert = true) {
  const rows = [...document.querySelectorAll("#subjectsBody tr")];
  let totalCredits = 0;
  let totalPoints = 0;
  let failed = false;
  let valid = 0;

  rows.forEach(row => {
    const credits = Number(row.querySelector(".credits").value);
    const grade = gradeByCode(row.querySelector(".grade").value);
    if (!grade || !Number.isFinite(credits) || credits <= 0) return;
    valid++;
    totalCredits += credits;
    totalPoints += credits * grade.gp;
    if (grade.gp < getRegulation().passGp) failed = true;
  });

  if (totalCredits <= 0) {
    $("sgpaResult").textContent = "0.00";
    $("semesterCredits").textContent = "0";
    $("semesterStatus").textContent = "—";
    return { sgpa: 0, credits: 0, failed, valid };
  }

  const sgpa = totalPoints / totalCredits;
  $("sgpaResult").textContent = sgpa.toFixed(2);
  $("semesterCredits").textContent = trimNumber(totalCredits);
  $("semesterStatus").textContent = failed ? "Needs clearance" : "Passed";
  $("semesterStatus").style.color = failed ? "var(--danger)" : "var(--success)";

  if (showAlert && valid === 0) alert("Enter at least one valid subject.");
  return { sgpa, credits: totalCredits, failed, valid };
}

function saveSemester() {
  const result = calculateSGPA(true);
  if (result.credits <= 0) {
    alert("Enter valid subject credits and grades before saving.");
    return;
  }

  const semester = currentSemesterNumber();
  const subjects = currentRows();

  state.semesters[semester] = {
    semester,
    sgpa: Number(result.sgpa.toFixed(4)),
    credits: result.credits,
    failed: result.failed,
    subjects,
    updatedAt: new Date().toISOString()
  };

  state.history.unshift({
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    date: new Date().toISOString(),
    regulation: state.regulation,
    semester,
    sgpa: Number(result.sgpa.toFixed(2)),
    credits: result.credits
  });

  state.history = state.history.slice(0, 100);
  saveState();
  renderAll();
  alert(`Semester ${semester} saved successfully.`);
}

function calculateCGPA() {
  const entries = Object.values(state.semesters)
    .filter(s => s && Number(s.credits) > 0);

  let credits = 0;
  let points = 0;

  entries.forEach(s => {
    credits += Number(s.credits);
    points += Number(s.sgpa) * Number(s.credits);
  });

  if (!credits) {
    $("cgpaResult").textContent = "0.00";
    $("cgpaCredits").textContent = "0 credits";
    $("percentageResult").textContent = "0.00%";
    $("classResult").textContent = "—";
    return;
  }

  const cgpa = points / credits;
  const reg = getRegulation();
  const percentage = reg.percentageFormula(cgpa);

  $("cgpaResult").textContent = cgpa.toFixed(2);
  $("cgpaCredits").textContent = `${trimNumber(credits)} credits`;
  $("percentageResult").textContent = `${percentage.toFixed(2)}%`;
  $("classResult").textContent = getClass(cgpa);
}

function getClass(cgpa) {
  const band = getRegulation().classBands.find(b => cgpa >= b.min);
  return band ? band.label : "Below degree pass threshold";
}

function renderSummary() {
  const entries = Object.values(state.semesters).sort((a,b) => a.semester - b.semester);
  if (!entries.length) {
    $("semesterSummary").innerHTML = `<div class="empty">Save semester results to build your CGPA.</div>`;
    return;
  }

  $("semesterSummary").innerHTML = entries.map(s => `
    <div class="summary-item">
      <span>Semester ${s.semester} · ${trimNumber(s.credits)} credits</span>
      <strong>${Number(s.sgpa).toFixed(2)}</strong>
      <button type="button" data-semester="${s.semester}" aria-label="Delete semester">×</button>
    </div>
  `).join("");

  document.querySelectorAll(".summary-item button").forEach(btn => {
    btn.addEventListener("click", () => {
      const sem = Number(btn.dataset.semester);
      delete state.semesters[sem];
      saveState();
      renderAll();
    });
  });
}

function renderHistory() {
  const history = state.history || [];
  $("emptyHistory").style.display = history.length ? "none" : "block";
  $("historyBody").innerHTML = history.map(h => `
    <tr>
      <td>${new Date(h.date).toLocaleString()}</td>
      <td>${esc(h.regulation)}</td>
      <td>${esc(h.semester)}</td>
      <td><strong>${Number(h.sgpa).toFixed(2)}</strong></td>
      <td>${trimNumber(h.credits)}</td>
      <td><button class="history-delete" type="button" data-id="${esc(h.id)}">Delete</button></td>
    </tr>
  `).join("");

  document.querySelectorAll(".history-delete").forEach(btn => {
    btn.addEventListener("click", () => {
      state.history = state.history.filter(h => h.id !== btn.dataset.id);
      saveState();
      renderHistory();
    });
  });
}

function renderGradeGrid() {
  $("gradeGrid").innerHTML = getRegulation().grades.map(g => `
    <div class="grade-item">
      <strong>${esc(g.code)} · ${g.gp}</strong>
      <span>${esc(g.label)}${g.min ? ` · ${g.min}%+` : ""}</span>
    </div>
  `).join("");
}

function renderRegulationInfo() {
  const reg = getRegulation();
  $("regulationNotice").textContent = reg.notice;
  $("conversionFormula").textContent = `Formula: ${reg.formulaText}`;
}

function changeRegulation() {
  state.regulation = $("regulation").value;
  saveState();
  renderSubjects();
  renderRegulationInfo();
  renderGradeGrid();
  calculateCGPA();
}

function clearAll() {
  if (!confirm("Delete all saved semester data and history?")) return;
  state.semesters = {};
  state.history = [];
  saveState();
  renderAll();
}

function exportData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], {type: "application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "jntu-grade-calculator-data.json";
  a.click();
  URL.revokeObjectURL(url);
}

function toggleTheme() {
  state.theme = state.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = state.theme;
  saveState();
}

function trimNumber(n) {
  return Number.isInteger(Number(n)) ? String(Number(n)) : Number(n).toFixed(2);
}

function renderAll() {
  renderSubjects();
  renderSummary();
  renderHistory();
  renderRegulationInfo();
  renderGradeGrid();
  calculateCGPA();
}

$("regulation").addEventListener("change", changeRegulation);
$("semesterNumber").addEventListener("change", () => renderSubjects());
$("addSubject").addEventListener("click", addSubject);
$("calculateSgpa").addEventListener("click", () => calculateSGPA(true));
$("saveSemester").addEventListener("click", saveSemester);
$("clearAll").addEventListener("click", clearAll);
$("exportData").addEventListener("click", exportData);
$("themeToggle").addEventListener("click", toggleTheme);

loadState();
renderAll();
