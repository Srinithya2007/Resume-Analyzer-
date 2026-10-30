
"use strict";

const HISTORY_KEY = "resumeiq-analysis-history";
const MAX_FILE_SIZE = 1024 * 1024;
const MAX_HISTORY = 10;

const $ = (selector) => document.querySelector(selector);

const resumeText = $("#resumeText");
const jobText = $("#jobText");
const resumeFile = $("#resumeFile");
const analyzerForm = $("#analyzerForm");
const formMessage = $("#formMessage");

let latestReport = null;

const SKILL_GROUPS = {
  "Programming Languages": [
    "Python", "Java", "JavaScript", "TypeScript", "C++", "C#", "C",
    "SQL", "PHP", "Ruby", "Go", "Kotlin", "Swift", "R"
  ],
  "Frontend Development": [
    "HTML", "CSS", "React", "Angular", "Vue", "Next.js",
    "Bootstrap", "Tailwind CSS", "Responsive Design"
  ],
  "Backend Development": [
    "Node.js", "Express.js", "Django", "Flask", "FastAPI",
    "REST API", "API Development", "Spring Boot"
  ],
  "Data and AI": [
    "Machine Learning", "Deep Learning", "Artificial Intelligence",
    "Data Analysis", "Data Science", "Pandas", "NumPy",
    "Scikit-learn", "TensorFlow", "PyTorch", "NLP", "Generative AI",
    "Power BI", "Tableau", "Excel", "Statistics"
  ],
  "Databases and Cloud": [
    "MySQL", "PostgreSQL", "MongoDB", "Firebase", "SQLite",
    "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes"
  ],
  "Tools and Professional Skills": [
    "Git", "GitHub", "Linux", "Figma", "Agile", "Scrum",
    "Communication", "Problem Solving", "Teamwork",
    "Project Management", "Testing", "Debugging", "CI/CD"
  ]
};

const SAMPLE_RESUME = `SANDHIYA
Aspiring Software Developer

PROFESSIONAL SUMMARY
B.Tech Artificial Intelligence and Data Science student with a foundation in Python, HTML, CSS, JavaScript, and React. Interested in software development and building user-friendly web applications.

TECHNICAL SKILLS
Python, HTML, CSS, JavaScript, React, Git, GitHub, MySQL, Excel, Data Analysis, Problem Solving.

PROJECTS
NovaCart E-commerce Website
Built a responsive shopping interface using HTML, CSS, and JavaScript. Implemented product search, category filtering, cart quantity updates, and LocalStorage.

Recipe Finder App
Created a recipe browsing interface using HTML, CSS, and JavaScript with search and responsive layouts.

EDUCATION
B.Tech Artificial Intelligence and Data Science
Engineering College
2023 - 2027`;

const SAMPLE_JOB = `Junior Software Developer

We are looking for an entry-level developer with knowledge of HTML, CSS, JavaScript, React, Python, and SQL.

Required skills:
- HTML, CSS, JavaScript, and responsive design
- React and frontend development
- Python programming and problem solving
- SQL and MySQL databases
- Git and GitHub version control
- REST API integration and debugging
- Communication and teamwork

Responsibilities:
Develop responsive web applications, write readable code, debug issues, collaborate with team members, and participate in code reviews.

Preferred:
Knowledge of Node.js, testing, Agile, and project management.`;

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const replacements = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };
    return replacements[character];
  });
}

function normalizeText(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9+#./\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function containsSkill(text, skill) {
  const normalizedText = normalizeText(text);
  const normalizedSkill = normalizeText(skill);

  if (!normalizedSkill) return false;

  // Match whole phrases/words rather than partial words.
  const escaped = normalizedSkill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(
    `(^|[^a-z0-9])${escaped}(?=$|[^a-z0-9])`,
    "i"
  );

  return pattern.test(normalizedText);
}

function getRecognizedSkills(text) {
  const found = [];

  for (const [category, skills] of Object.entries(SKILL_GROUPS)) {
    for (const skill of skills) {
      if (containsSkill(text, skill)) {
        found.push({ name: skill, category });
      }
    }
  }

  return found;
}

function getHistory() {
  try {
    const saved = localStorage.getItem(HISTORY_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn("Could not read report history:", error);
    return [];
  }
}

function saveHistory(history) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    return true;
  } catch (error) {
    console.warn("Could not save report history:", error);
    showMessage(
      "Analysis completed, but browser storage is unavailable. Download your report to keep a copy.",
      "error"
    );
    return false;
  }
}

function showMessage(message, type = "success") {
  formMessage.textContent = message;
  formMessage.className = `form-message ${type}`;
}

function updateCharacterCounts() {
  $("#resumeCharCount").textContent =
    `${resumeText.value.length.toLocaleString()} characters`;

  $("#jobCharCount").textContent =
    `${jobText.value.length.toLocaleString()} characters`;
}

function setSampleData() {
  resumeText.value = SAMPLE_RESUME;
  jobText.value = SAMPLE_JOB;
  $("#fileName").textContent = "Sample resume loaded";
  updateCharacterCounts();
  showMessage("Sample resume and job description loaded. Select Analyze Resume.", "success");
}

function clearInput(input, fileName) {
  input.value = "";

  if (input === resumeText) {
    resumeFile.value = "";
    $("#fileName").textContent = "TXT files only · Max 1 MB";
  }

  updateCharacterCounts();
  showMessage(`${fileName} cleared.`, "success");
}

function calculateScore(resume, job) {
  const jobSkills = getRecognizedSkills(job);
  const resumeSkills = getRecognizedSkills(resume);

  const resumeSkillSet = new Set(resumeSkills.map((skill) => skill.name));

  const matched = jobSkills.filter((skill) => resumeSkillSet.has(skill.name));
  const missing = jobSkills.filter((skill) => !resumeSkillSet.has(skill.name));

  const score = jobSkills.length === 0
    ? 0
    : Math.round((matched.length / jobSkills.length) * 100);

  return {
    score,
    jobSkills,
    resumeSkills,
    matched,
    missing
  };
}

function buildRecommendations(report) {
  const suggestions = [];
  const resume = report.resume.toLowerCase();

  if (report.jobSkills.length === 0) {
    suggestions.push({
      title: "Add recognizable skills to the job description",
      text: "Include specific tools, technologies, or skills so the dashboard can compare them."
    });
  } else if (report.missing.length > 0) {
    const missingNames = report.missing
      .slice(0, 5)
      .map((skill) => skill.name)
      .join(", ");

    suggestions.push({
      title: "Review missing job keywords",
      text: `These terms were not found in your resume: ${missingNames}. Add them only if they accurately describe your knowledge or experience.`
    });
  }

  if (!/\b(project|projects)\b/.test(resume)) {
    suggestions.push({
      title: "Add a projects section",
      text: "Describe relevant academic or personal projects, the technologies used, and what you built."
    });
  } else {
    suggestions.push({
      title: "Make project descriptions specific",
      text: "For each relevant project, explain your contribution, the technologies used, and the outcome."
    });
  }

  if (!/\b(education|degree|b\.?tech|bachelor|university|college)\b/.test(resume)) {
    suggestions.push({
      title: "Review your education section",
      text: "Include relevant degrees, institutions, expected graduation dates, or applicable coursework."
    });
  }

  if (!/\b(github|portfolio|linkedin)\b/.test(resume)) {
    suggestions.push({
      title: "Include relevant professional links",
      text: "Consider adding your GitHub, portfolio, or LinkedIn link if it is relevant to the role."
    });
  }

  if (!/\b(experience|internship|responsibilities|developed|built|created)\b/.test(resume)) {
    suggestions.push({
      title: "Show what you have done",
      text: "Describe internships, coursework, volunteering, or personal projects using clear action statements."
    });
  }

  if (!/\b(achieved|improved|reduced|increased|completed|delivered|implemented)\b/.test(resume)) {
    suggestions.push({
      title: "Highlight outcomes where possible",
      text: "Use truthful, specific results to explain the impact of your work. Do not invent numbers or achievements."
    });
  }

  suggestions.push({
    title: "Tailor the resume for the role",
    text: "Keep the most relevant and truthful skills, projects, and experience easy to find."
  });

  return suggestions.slice(0, 5);
}

function createReport(resume, job) {
  const result = calculateScore(resume, job);

  return {
    id: createId(),
    date: new Date().toISOString(),
    resume,
    job,
    score: result.score,
    jobSkills: result.jobSkills,
    resumeSkills: result.resumeSkills,
    matched: result.matched,
    missing: result.missing,
    recommendations: []
  };
}

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function renderKeywordChips(container, skills, isMissing = false) {
  if (skills.length === 0) {
    container.innerHTML = `<p class="muted">${
      isMissing
        ? "No recognized missing skills. Check the job description for more detail."
        : "No recognized keywords found yet."
    }</p>`;
    return;
  }

  container.innerHTML = skills
    .map((skill) =>
      `<span class="keyword-chip ${isMissing ? "missing" : ""}">${escapeHTML(skill.name)}</span>`
    )
    .join("");
}

function renderRecommendations(recommendations) {
  $("#recommendations").innerHTML = recommendations
    .map((item, index) => `
      <div class="recommendation-item">
        <span class="recommendation-number">${index + 1}</span>
        <div>
          <h4>${escapeHTML(item.title)}</h4>
          <p>${escapeHTML(item.text)}</p>
        </div>
      </div>
    `)
    .join("");
}

function getScoreCopy(score) {
  if (score >= 80) {
    return {
      title: "Strong keyword overlap",
      description: "Many recognized job keywords were found in your resume. Review the details and keep tailoring your application."
    };
  }

  if (score >= 50) {
    return {
      title: "Some relevant keywords found",
      description: "Your resume shares several recognized keywords with this job description. Review the missing skills below."
    };
  }

  return {
    title: "Room to improve keyword overlap",
    description: "Few recognized job keywords were found. Check the role requirements and highlight relevant experience you genuinely have."
  };
}

function renderReport(report) {
  const score = report.score;
  const matchedCount = report.matched.length;
  const missingCount = report.missing.length;
  const requiredCount = report.jobSkills.length;

  $("#scoreValue").textContent = `${score}%`;
  $("#scoreRing").style.background =
    `conic-gradient(var(--primary) ${score * 3.6}deg, #efedfa ${score * 3.6}deg)`;

  $("#scoreProgress").style.width = `${score}%`;

  const copy = getScoreCopy(score);
  $("#scoreTitle").textContent = copy.title;
  $("#scoreDescription").textContent = copy.description;

  $("#matchedCount").textContent = matchedCount;
  $("#missingCount").textContent = missingCount;
  $("#requiredCount").textContent = requiredCount;

  const matchedWidth = requiredCount > 0 ? (matchedCount / requiredCount) * 100 : 0;
  const missingWidth = requiredCount > 0 ? (missingCount / requiredCount) * 100 : 0;

  $("#matchedBar").style.width = `${matchedWidth}%`;
  $("#missingBar").style.width = `${missingWidth}%`;

  $("#matchedPill").textContent = matchedCount;
  $("#missingPill").textContent = missingCount;

  renderKeywordChips($("#matchedKeywords"), report.matched);
  renderKeywordChips($("#missingKeywords"), report.missing, true);
  renderRecommendations(report.recommendations);

  $("#emptyResults").hidden = true;
  $("#resultsContent").hidden = false;
  $("#downloadButton").disabled = false;

  $("#latestMatch").textContent = `${score}%`;
  $("#totalMatched").textContent = matchedCount;
  $("#totalMissing").textContent = missingCount;
}

function renderHistory() {
  const history = getHistory();

  $("#totalAnalyses").textContent = history.length;

  if (history.length === 0) {
    $("#historyTable").innerHTML =
      `<tr><td colspan="4" class="empty-history">No reports saved yet.</td></tr>`;
    $("#latestMatch").textContent = "—";
    $("#totalMatched").textContent = "0";
    $("#totalMissing").textContent = "0";
    return;
  }

  const latest = history[0];

  $("#latestMatch").textContent = `${latest.score}%`;
  $("#totalMatched").textContent = latest.matchedCount;
  $("#totalMissing").textContent = latest.missingCount;

  $("#historyTable").innerHTML = history.map((item) => {
    const date = new Date(item.date);
    const formattedDate = Number.isNaN(date.getTime())
      ? "Unknown date"
      : date.toLocaleString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        });

    return `
      <tr>
        <td>Resume analysis</td>
        <td>${escapeHTML(formattedDate)}</td>
        <td><span class="table-score">${Number(item.score) || 0}%</span></td>
        <td>${Number(item.matchedCount) || 0} matched</td>
      </tr>
    `;
  }).join("");
}

function saveReportToHistory(report) {
  const history = getHistory();

  const historyItem = {
    id: report.id,
    date: report.date,
    score: report.score,
    matchedCount: report.matched.length,
    missingCount: report.missing.length
  };

  const updated = [historyItem, ...history].slice(0, MAX_HISTORY);
  return saveHistory(updated);
}

function downloadReport(report) {
  if (!report) return;

  const date = new Date(report.date).toLocaleString();

  const matched = report.matched.length
    ? report.matched.map((skill) => `- ${skill.name}`).join("\n")
    : "- None recognized";

  const missing = report.missing.length
    ? report.missing.map((skill) => `- ${skill.name}`).join("\n")
    : "- None recognized";

  const recommendations = report.recommendations
    .map((item, index) => `${index + 1}. ${item.title}\n   ${item.text}`)
    .join("\n\n");

  const content = [
    "RESUMEIQ - RESUME ANALYSIS REPORT",
    "=================================",
    `Generated: ${date}`,
    `Keyword Match Score: ${report.score}%`,
    "",
    "MATCHED KEYWORDS",
    "----------------",
    matched,
    "",
    "MISSING KEYWORDS",
    "----------------",
    missing,
    "",
    "IMPROVEMENT SUGGESTIONS",
    "-----------------------",
    recommendations,
    "",
    "IMPORTANT NOTE",
    "--------------",
    "This report uses a predefined keyword list and keyword overlap only.",
    "It is not an ATS compatibility test, a measure of actual ability, or a hiring prediction.",
    "Only include skills and experience that accurately reflect your background."
  ].join("\n");

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "resume-analysis-report.txt";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

analyzerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const resume = resumeText.value.trim();
  const job = jobText.value.trim();

  if (resume.length < 30) {
    showMessage("Please enter more resume text before analyzing.", "error");
    resumeText.focus();
    return;
  }

  if (job.length < 30) {
    showMessage("Please enter a longer job description before analyzing.", "error");
    jobText.focus();
    return;
  }

  if (resume.length > 100000 || job.length > 100000) {
    showMessage("Please keep each text under 100,000 characters.", "error");
    return;
  }

  latestReport = createReport(resume, job);
  latestReport.recommendations = buildRecommendations(latestReport);

  renderReport(latestReport);
  saveReportToHistory(latestReport);
  renderHistory();

  showMessage(
    "Analysis completed! Review your results and download the report if needed.",
    "success"
  );

  $("#results").scrollIntoView({ behavior: "smooth", block: "start" });
});

$("#sampleButton").addEventListener("click", setSampleData);

$("#clearResume").addEventListener("click", () => {
  clearInput(resumeText, "Resume");
});

$("#clearJob").addEventListener("click", () => {
  clearInput(jobText, "Job description");
});

resumeText.addEventListener("input", updateCharacterCounts);
jobText.addEventListener("input", updateCharacterCounts);

resumeFile.addEventListener("change", () => {
  const file = resumeFile.files && resumeFile.files[0];
  if (!file) return;

  if (!file.name.toLowerCase().endsWith(".txt")) {
    showMessage("Please choose a .txt file. PDF and DOCX files are not supported in this version.", "error");
    resumeFile.value = "";
    return;
  }

  if (file.size > MAX_FILE_SIZE) {
    showMessage("The file is too large. Please choose a text file under 1 MB.", "error");
    resumeFile.value = "";
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    resumeText.value = String(reader.result || "");
    $("#fileName").textContent = file.name;
    updateCharacterCounts();
    showMessage("Resume text file loaded successfully.", "success");
  };

  reader.onerror = () => {
    showMessage("Could not read this file. Please try another .txt file.", "error");
  };

  reader.readAsText(file);
});

$("#downloadButton").addEventListener("click", () => {
  if (!latestReport) {
    showMessage("Analyze a resume first to download a report.", "error");
    return;
  }

  downloadReport(latestReport);
});

$("#clearHistoryButton").addEventListener("click", () => {
  const confirmed = window.confirm(
    "Clear all saved analysis history from this browser?"
  );

  if (!confirmed) return;

  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.warn("Could not clear report history:", error);
  }

  renderHistory();
  showMessage("Saved report history cleared.", "success");
});

$("#menuButton").addEventListener("click", () => {
  $("#sidebar").classList.toggle("open");
});

document.querySelectorAll(".nav-item").forEach((item) => {
  item.addEventListener("click", () => {
    document.querySelectorAll(".nav-item").forEach((nav) => {
      nav.classList.remove("active");
    });

    item.classList.add("active");
    $("#sidebar").classList.remove("open");
  });
});

// Initial dashboard state.
updateCharacterCounts();
renderHistory();
