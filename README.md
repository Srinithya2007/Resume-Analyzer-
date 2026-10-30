
# Resume Analyzer Dashboard

A modern, responsive Resume Analyzer Dashboard built using HTML, CSS, and JavaScript. It compares resume text with a job description to identify recognized keyword matches, missing skills, and areas for improvement.

## Features

- Modern and responsive dashboard interface
- Resume text input and `.txt` file upload
- Job description input
- Keyword-based resume matching score
- Matched and missing skill identification
- Visual score ring and keyword breakdown
- Resume improvement recommendations
- Sample resume and job description
- Downloadable analysis report
- Recent analysis history using browser LocalStorage
- Clear resume text, job description, and saved history
- Responsive mobile navigation
- Client-side processing without a backend

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Browser FileReader API
- LocalStorage API
- Blob API for report downloads

## Project Structure

```text
Resume-Analyzer-Dashboard/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Getting Started

### 1. Clone the repository

Replace `YOUR-USERNAME` with your GitHub username.

```bash
git clone https://github.com/YOUR-USERNAME/Resume-Analyzer-Dashboard.git
```

### 2. Open the project

```bash
cd Resume-Analyzer-Dashboard
code .
```

You can also open the project folder directly in Visual Studio Code.

### 3. Run the application

1. Open `index.html` in Visual Studio Code.
2. Right-click the file.
3. Select **Open with Live Server** if the Live Server extension is installed.
4. Otherwise, open `index.html` in your web browser.

No package installation or backend server is required.

## How to Use

1. Open the Resume Analyzer Dashboard.
2. Paste your resume text into the resume section, or upload a `.txt` file.
3. Paste the target job description into the job description section.
4. Click **Analyze Resume**.
5. Review the keyword match score.
6. Check the matched keywords and skills to review.
7. Read the improvement checklist.
8. Download the report if you want a copy.
9. View recent analyses in the report history section.

You can select **Use sample data** to test the dashboard.

## How It Works

The application uses a predefined collection of technical and professional skills.

It checks which recognized skills appear in the job description and compares them with the skills detected in the resume.

The match score is calculated as:

```text
Match Score = (Matched Job Keywords / Recognized Job Keywords) × 100
```

The result is rounded to the nearest whole percentage.

If no recognized skills are found in the job description, the score is shown as 0%.

## Limitations

- This is a front-end demonstration project.
- The application currently accepts `.txt` files only.
- PDF and DOCX parsing are not included.
- The keyword list is predefined and may not recognize every skill.
- The score measures keyword overlap, not the quality of a resume or a person's abilities.
- Reports are stored in the current browser only.
- LocalStorage history is not synchronized across devices.
- The application does not connect to an AI model or an Applicant Tracking System (ATS).

## Future Enhancements

- PDF and DOCX resume parsing
- Custom skill categories
- Resume section completeness checks
- Integration with a secure AI backend
- User authentication and cloud-based history
- More detailed keyword analysis
- Export reports as PDF

## Learning Outcomes

This project demonstrates practical skills in:

- Responsive web design
- DOM manipulation
- JavaScript event handling
- String processing and regular expressions
- File reading in the browser
- Dynamic UI updates
- LocalStorage
- Client-side report generation

## Live Demo

After enabling GitHub Pages, add your published link here:

`https://YOUR-USERNAME.github.io/Resume-Analyzer-Dashboard/`

## Author

Created as a front-end development portfolio project.

## License

This project is available for learning and portfolio demonstration.
