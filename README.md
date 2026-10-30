# 📄 Resume Analyzer Dashboard

A modern and responsive **Resume Analyzer Dashboard** built using HTML, CSS, and JavaScript. This project helps users compare resume content with a job description, identify matching and missing keywords, calculate a keyword match score, and receive suggestions for improvement.

## 🚀 Project Overview

The Resume Analyzer Dashboard provides a simple interface where users can paste their resume content and a job description to analyze keyword compatibility. It is designed as a beginner-friendly frontend project to demonstrate web development and JavaScript skills.

## ✨ Features

- 📊 **Resume Match Score** – Calculates keyword overlap between resume content and a job description.
- 🔍 **Keyword Matching** – Identifies skills and keywords found in both texts.
- ⚠️ **Missing Keywords** – Highlights recognized job-related keywords missing from the resume.
- 💡 **Improvement Suggestions** – Provides suggestions to improve resume content.
- 📁 **Text File Upload** – Supports uploading a `.txt` resume file.
- 📥 **Download Report** – Allows users to download the analysis report.
- 🕘 **Analysis History** – Stores recent analysis results in browser LocalStorage.
- 📱 **Responsive Design** – Works across desktop, tablet, and mobile screens.
- 🎨 **Modern Dashboard UI** – Clean layout with statistics, cards, and a score display.

## 🛠️ Technologies Used

- **HTML5** – Page structure
- **CSS3** – Styling and responsive layout
- **JavaScript** – Analysis logic and interactive features
- **LocalStorage** – Stores analysis history in the browser

## 📂 Project Structure

```text
Resume-Analyzer-Dashboard/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

## ⚙️ How to Run the Project

1. Download or clone this repository.
2. Open the project folder in Visual Studio Code.
3. Make sure `index.html`, `style.css`, and `script.js` are in the same folder.
4. Install the **Live Server** extension in VS Code if you do not already have it.
5. Right-click `index.html`.
6. Select **Open with Live Server**.
7. Enter your resume content and the job description.
8. Click **Analyze Resume** to view the results.

## 📝 How to Use

1. Open the Resume Analyzer Dashboard.
2. Paste your resume content into the resume text area.
3. Paste the target job description into the job description area.
4. Click the **Analyze Resume** button.
5. Review the keyword match score.
6. Check matched and missing keywords.
7. Read the improvement suggestions.
8. Download the report or review previous analysis history.

## 🧮 How the Match Score Works

The project calculates a keyword overlap score using recognized skills found in the job description.

**Formula:**

```text
Match Score = (Matched Recognized Job Skills / Total Recognized Job Skills) × 100
```

The score is a simple keyword-based estimate. It does not measure actual professional ability, guarantee ATS compatibility, or predict hiring outcomes.

## 🔒 Privacy

- Resume analysis is performed in the browser using JavaScript.
- Analysis history is stored in browser LocalStorage.
- The project does not require a backend server or database.
- Clearing browser data may remove saved analysis history.

## 🔮 Future Enhancements

- PDF and DOCX resume upload support
- AI-powered resume feedback
- Resume section detection
- Job-specific skill recommendations
- Resume improvement suggestions based on experience level
- Backend integration and user authentication
- Export reports as PDF

## 🎯 Learning Outcomes

Through this project, I practiced:

- DOM manipulation using JavaScript
- Text processing and keyword matching
- Event handling and file input
- LocalStorage integration
- Responsive web design
- Creating interactive dashboard components
- Organizing a frontend project for GitHub

## 👩‍💻 Author

**Sri Nithya**  
Bachelor of Computer Applications (BCA)  
Loganatha Narayanasamy Government Arts and Science College

## 📄 License

This project is created for educational and portfolio purposes. You may adapt it for personal learning and development.

---

⭐ If you find this project useful, consider giving the repository a star!
