# Technical Documentation

## Project Structure
```
assignment-4/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── script.js
├── assets/
│   └── images
├── docs/
│   ├── ai-usage-report.md
│   └── technical-documentation.md
├── Presentation/
│   ├── slides.pdf
│   └── demo-video.mp4
├── README.md
└── .gitignore

```

## Sections

- **Header**
- **Hero** (greeting, name input, quote)
- **About**
- **Projects** (filter, search, sort, GitHub API)
- **Contact**
- **Footer**

## Technologies Used
- HTML
- CSS
- JavaScript
- ZenQuotes API for inspirational quotes
- GitHub API for project list
- LocalStorage for theme, filters, and user data
- GitHub Pages for deployment

## Key Components

### 1) Dynamic Content
- **Project Filter**
    - Buttons use `data-filter` values.
    - Cards labeled with `data-category`.
    - JS shows/hides cards, saves filter to `localStorage`.
    - Integrated live search and sorting.

- **Project Sorting**
    - Cards include `data-year`.
    - `<select>` dropdown changes order of cards.
    - Default order saved.

- **Search**
    - Does not hide cards.
    - Dims cards that doesn't match.

- **Greeting + Visitor Name**
    - Detects morning/afternoon/evening.
    - Saves visitor name in `localStorage`.
    - Shows “Edit name” after saving.
    - Live greeting updates while typing.

- **Inspiring Quote**
    - Fetches from ZenQuotes.
    - Fade in animation after loading. 
    - Error message if unable to fetch.

- **GitHub Repositories**
    - Fetches latest 5 repos from GitHub API.
    - Displays name and description.
    - Links to repos and profile.
    - Error message if unable to fetch.

### 2) Data Handling
- State saved by `localStorage`for:
    - Dark/Light theme. 
    - Project filter.
    - Visitor name.

### 3) Validation & Feedback
- Contact form:
    - Checks name, email format, message. 
    - Errors shown under the fields.
    - Success text shown for correct input.

### 4) Styling & Transitions
- Gradient background and text decorations.
- Quote card fades in.
- Hover animations on repo cards.
- Search dimming effect.

### 5) Responsiveness
- Header becomes changes layout on phones.
- Hero becomes single column on phones.



