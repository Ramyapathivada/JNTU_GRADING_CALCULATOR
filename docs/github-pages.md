# GitHub Pages

## Option A — Browser UI

1. Push the project to GitHub.
2. Open repository Settings.
3. Select Pages.
4. Select `Deploy from a branch`.
5. Choose `main` and `/ (root)`.
6. Save.

## Option B — GitHub CLI

```bash
git init
git add .
git commit -m "Initial JNTU grade calculator"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/jntu-grade-calculator.git
git push -u origin main
```

Then enable Pages in repository settings.
