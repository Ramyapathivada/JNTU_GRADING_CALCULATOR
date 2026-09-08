# JNTU Grade Calculator

A professional, responsive, client-side SGPA and CGPA calculator for JNTU-style B.Tech grading workflows.

## Features

- R18, R20 and R23 regulation selector
- Credit-weighted SGPA calculation
- Cumulative CGPA calculation
- CGPA → percentage conversion
- Semester 1–8 management
- Grade point reference table
- Pass/fail indication
- LocalStorage persistence
- Semester history
- JSON export
- Light/dark theme
- Mobile responsive UI
- Zero backend and zero npm dependencies
- GitHub Pages friendly

## Project structure

```text
jntu-grade-calculator/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   └── regulations.js
├── .gitignore
├── LICENSE
└── README.md
```

## Run locally

No build step is required.

Open `index.html` in a browser.

For a local HTTP server:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Deploy on GitHub Pages

1. Create a repository, for example `jntu-grade-calculator`.
2. Upload all project files.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose:
   - Source: **Deploy from a branch**
   - Branch: `main`
   - Folder: `/ (root)`
5. Save.

GitHub will provide the Pages URL.

## Calculation model

SGPA:

```text
SGPA = Σ(Credit × Grade Point) / Σ(Credit)
```

CGPA:

```text
CGPA = Σ(Credit × Grade Point) / Σ(Credit)
```

The application stores each semester's total credits and SGPA and uses credit-weighted semester values for the CGPA display.

## Regulation notes

The app intentionally keeps regulation definitions in `js/regulations.js` so the grade scale, pass threshold, credit rules and percentage formula can be changed without rewriting the UI.

### R18

The included R18-style configuration uses:

| Grade | GP |
|---|---:|
| O | 10 |
| A+ | 9 |
| A | 8 |
| B+ | 7 |
| B | 6 |
| C | 5 |
| P | 4 |
| F | 0 |
| Ab | 0 |

The JNTUH R18 regulations describe SGPA as credit-point total divided by registered credits and CGPA as the corresponding cumulative credit-weighted calculation. They also state the percentage conversion formula `(final CGPA - 0.5) × 10`.

### R23

The included JNTUH-style R23 configuration uses:

| Grade | GP |
|---|---:|
| O | 10 |
| A+ | 9 |
| A | 8 |
| B+ | 7 |
| B | 6 |
| C | 5 |
| F | 0 |
| Ab | 0 |

The R23 workflow is designed around the 160-credit B.Tech programme structure.

### R20

R20 is implemented as a configurable profile. Because institutions/universities can publish different regulation documents and autonomous-college rules, verify the exact R20 grade table and percentage rule applicable to the student's institution before using it for an official purpose.

## Important

This project is an independent educational tool. It is not an official JNTU/JNTUH examination portal.

Do not use the calculated value as an official transcript, grade memo or university result without verifying it against the applicable university regulations and official marks memo.

## Privacy

Student data is stored only in the browser's LocalStorage. No server, account or external database is required.

Use **Export JSON** if you want a backup.

## License

MIT

