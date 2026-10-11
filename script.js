
"use strict";

// ------------------------------------
// 1. INTERACTIVE JAVASCRIPT QUIZ
// ------------------------------------

const questions = [
  {
    question: "Which CSS feature makes a layout adapt to different screen sizes?",
    options: ["CSS variables", "Media queries", "HTML comments", "Console logs"],
    answer: 1,
    explanation: "Media queries apply different CSS rules depending on screen or device conditions."
  },
  {
    question: "Which JavaScript method selects an element using its ID?",
    options: ["document.getElementById()", "document.getAll()", "window.selectID()", "console.getID()"],
    answer: 0,
    explanation: "getElementById() finds the HTML element with the specified ID."
  },
  {
    question: "Which JavaScript function sends a request to a web API?",
    options: ["alert()", "prompt()", "fetch()", "parseInt()"],
    answer: 2,
    explanation: "fetch() requests a resource and returns a Promise for the response."
  },
  {
    question: "What does JSON.parse() do?",
    options: [
      "Styles a webpage",
      "Converts a JSON string into a JavaScript value",
      "Creates an HTML element",
      "Reloads the browser"
    ],
    answer: 1,
    explanation: "JSON.parse() converts valid JSON text into a JavaScript value or object."
  },
  {
    question: "Which CSS layout system is useful for arranging items in rows and columns?",
    options: ["CSS Grid", "HTML forms", "JavaScript alerts", "URL encoding"],
    answer: 0,
    explanation: "CSS Grid is designed for two-dimensional row-and-column layouts."
  }
];

const questionCount = document.getElementById("question-count");
const scoreLabel = document.getElementById("score-label");
const progressBar = document.getElementById("progress-bar");
const questionText = document.getElementById("question-text");
const answerOptions = document.getElementById("answer-options");
const quizFeedback = document.getElementById("quiz-feedback");
const questionHint = document.getElementById("question-hint");
const nextButton = document.getElementById("next-button");
const quizResult = document.getElementById("quiz-result");
const restartButton = document.getElementById("restart-button");

let currentQuestion = 0;
let score = 0;
let answered = false;

function loadQuestion() {
  answered = false;

  const item = questions[currentQuestion];

  questionCount.textContent =
    `QUESTION ${String(currentQuestion + 1).padStart(2, "0")} / ${questions.length}`;

  scoreLabel.textContent = `Score: ${score}`;
  progressBar.style.width = `${(currentQuestion / questions.length) * 100}%`;
  questionText.textContent = item.question;
  answerOptions.replaceChildren();
  quizFeedback.textContent = "";
  questionHint.textContent = "Choose the best answer.";
  nextButton.disabled = true;
  nextButton.textContent =
    currentQuestion === questions.length - 1 ? "See results →" : "Next question →";

  item.options.forEach((option, index) => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "answer-option";
    button.textContent = `${String.fromCharCode(65 + index)}. ${option}`;

    button.addEventListener("click", () => selectAnswer(index));

    answerOptions.appendChild(button);
  });
}

function selectAnswer(selectedIndex) {
  if (answered) return;

  answered = true;

  const item = questions[currentQuestion];
  const buttons = answerOptions.querySelectorAll("button");
  const isCorrect = selectedIndex === item.answer;

  if (isCorrect) {
    score++;
    quizFeedback.textContent = `Correct! ${item.explanation}`;
    quizFeedback.style.color = "var(--green)";
  } else {
    quizFeedback.textContent =
      `Not quite. The correct answer is ${item.options[item.answer]}. ${item.explanation}`;
    quizFeedback.style.color = "#ff9bae";
  }

  buttons.forEach((button, index) => {
    button.disabled = true;

    if (index === item.answer) {
      button.classList.add("correct");
    } else if (index === selectedIndex) {
      button.classList.add("incorrect");
    }
  });

  scoreLabel.textContent = `Score: ${score}`;
  progressBar.style.width =
    `${((currentQuestion + 1) / questions.length) * 100}%`;

  questionHint.textContent = "Answer recorded.";
  nextButton.disabled = false;
}

function finishQuiz() {
  questionCount.textContent = "QUIZ COMPLETED";
  progressBar.style.width = "100%";
  questionText.textContent = "Challenge completed!";
  answerOptions.replaceChildren();
  quizFeedback.textContent = "";
  questionHint.textContent = "";
  nextButton.hidden = true;
  quizResult.hidden = false;
  quizResult.replaceChildren();

  const heading = document.createElement("div");
  heading.textContent = `Your score: ${score} / ${questions.length}`;

  const message = document.createElement("p");
  const percentage = Math.round((score / questions.length) * 100);

  message.textContent = percentage >= 80
    ? "Excellent work! You have a strong grasp of these concepts."
    : percentage >= 60
      ? "Good effort! Review the explanations and try again."
      : "Keep learning! Review the concepts and give it another try.";

  quizResult.append(heading, message);
  nextButton.hidden = true;
  restartButton.hidden = false;
  scoreLabel.textContent = `Final score: ${score}`;
}

nextButton.addEventListener("click", () => {
  if (!answered) return;

  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    loadQuestion();
  } else {
    finishQuiz();
  }
});

restartButton.addEventListener("click", () => {
  currentQuestion = 0;
  score = 0;
  answered = false;

  nextButton.hidden = false;
  restartButton.hidden = true;
  quizResult.hidden = true;

  loadQuestion();
});

loadQuestion();


// ------------------------------------
// 2. PUBLIC API: PROGRAMMING JOKES
// ------------------------------------

const jokeButton = document.getElementById("joke-button");
const jokeText = document.getElementById("joke-text");
const apiStatus = document.getElementById("api-status");

const jokeApiUrl =
  "https://v2.jokeapi.dev/joke/Programming?type=single&safe-mode";

async function fetchJoke() {
  jokeButton.disabled = true;
  jokeButton.textContent = "Fetching a joke...";
  jokeText.textContent = "Connecting to the joke API...";
  apiStatus.textContent = "Waiting for the server response.";

  try {
    const response = await fetch(jokeApiUrl);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();

    if (data.error || !data.joke) {
      throw new Error("The API did not return a joke.");
    }

    jokeText.textContent = data.joke;
    apiStatus.textContent =
      "Success! Joke data fetched from the public API.";
  } catch (error) {
    jokeText.textContent =
      "We could not load a joke right now. Please try again.";
    apiStatus.textContent =
      "Request failed. Check your internet connection and try again.";

    console.error("Joke API error:", error);
  } finally {
    jokeButton.disabled = false;
    jokeButton.textContent = "Get a new joke ↗";
  }
}

jokeButton.addEventListener("click", fetchJoke);
