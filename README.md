
# POST UTME CBT - University of Ibadan

A web-based practice platform for the University of Ibadan POST UTME CBT, featuring quizzes, study plans, Wikipedia topic search, a calculator, and MongoDB integration for user data.

## Features

- **Customizable Quizzes**: Select number of questions (10–25) and time per question (30–60 seconds).
- **Wikipedia Search**: Search topics using the MediaWiki Action API, displaying titles, images, and summaries.
- **AI Explanations**: Detailed, educational explanations for quiz answers, with fallback for API failures.
- **Visual Feedback**: Green highlights and confetti animations for correct answers.
- **Tabular Study Plans**: AI-generated study plans in a table format, including concepts, descriptions, resources, and practice questions.
- **MongoDB Integration**: Stores user profiles, quiz results, and studied topics.
- **Responsive Design**: Optimized for mobile and webview with Tailwind CSS.
- **Calculator**: Basic calculator and quadratic equation solver for Mathematics, Physics, and Chemistry.
- **Leaderboard**: Displays top 10 users based on average quiz scores.

## Project Structure

```
utme-cbt-app/
├── client/              # Frontend code (HTML, CSS, JavaScript)
│   ├── index.html       # Main HTML file
│   ├── css/             # Styles (Tailwind CSS)
│   ├── js/              # JavaScript modules
│   ├── assets/          # Images (logo, placeholder)
│   ├── package.json     # Frontend dependencies
│   ├── tailwind.config.js
│   └── postcss.config.js
├── server/              # Backend code (Node.js/Express)
│   ├── index.js         # Server entry point
│   ├── routes/          # API routes
│   ├── models/          # MongoDB schemas
│   ├── package.json     # Backend dependencies
│   └── .env             # Environment variables
├── README.md            # Project documentation
└── .gitignore           # Git ignore file
```

## Setup Instructions

### Prerequisites

- **Node.js**: Version 18 or higher
- **npm**: Node package manager
- **MongoDB Atlas**: Account for database hosting
- **Assets**: Replace placeholder images in `client/assets/` (e.g., `logo.png`, `placeholder.jpg`)

### Client Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Access the app at `http://localhost:5173`.

### Server Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following:
   ```
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority&appName=APP
   PORT=5000
   ```
   Replace `<username>`, `<password>`, and `<cluster>` with your MongoDB Atlas credentials.
4. Start the server:
   ```bash
   npm run dev
   ```

## Testing Features

1. **Wikipedia Search**:
   - Go to the study plan section, enter a topic (e.g., "Photosynthesis"), and verify results include a title, image, and summary.
2. **AI Explanation**:
   - Take a quiz, submit an answer, and check for a detailed explanation (150–300 words).
3. **Quiz Settings**:
   - Select a subject, customize question count and time, and ensure the quiz respects these settings.
4. **Visual Feedback**:
   - Correct answers should highlight green and trigger confetti.
5. **Study Plan**:
   - Select a topic in the study section and verify the study plan displays in a table format.
6. **MongoDB**:
   - Check MongoDB Atlas for saved user profiles, quiz results, and studied topics.
7. **Responsive Design**:
   - Test on mobile and desktop browsers to ensure compatibility.
8. **Calculator**:
   - Use the calculator in Mathematics, Physics, or Chemistry quizzes for basic calculations or quadratic equations.

## Notes

- **Assets**: Replace `client/assets/logo.png` and `client/assets/placeholder.jpg` with actual images (e.g., from `https://via.placeholder.com/150`).
- **APIs**:
  - **Question API**: Uses `questions.aloc.com.ng` with provided access token.
  - **Wikipedia API**: MediaWiki Action API for reliable topic search and images.
  - **AI API**: Uses `kaiz-apis.gleeze.com` for explanations and study plans.
  - Replace API keys or endpoints if needed.
- **MongoDB**: Ensure the MongoDB URI is correct and collections (`users`, `quizresults`, `studiedtopics`) are created.
- **Error Handling**: The app includes fallbacks for API failures and user input validation.

## Troubleshooting

- **MongoDB Connection**:
  - Verify the MongoDB URI and network access in MongoDB Atlas.
- **API Failures**:
  - Check API endpoints and keys for `questions.aloc.com.ng` and `kaiz-apis.gleeze.com`.
- **Responsive Issues**:
  - Test on multiple devices and adjust Tailwind classes if needed.
- **Assets Missing**:
  - Ensure `client/assets/` contains `logo.png` and `placeholder.jpg`.

## License

MIT License

