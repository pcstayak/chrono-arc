/**
 * Quiz Question Generator
 * Epic 6: Story 6.3 (BA-US-quiz-game-integration)
 * Generates quiz questions based on event content
 */

import type { TimelineEvent } from "./sampleEvents";
import type { QuizQuestion } from "@/components/DefenseQuiz";

/**
 * Generate 5 quiz questions for an event based on its content
 * Questions are generated from:
 * - Event title, year, era
 * - Story content
 * - Fun facts
 * - Related events
 */
export function generateQuizQuestions(event: TimelineEvent): QuizQuestion[] {
  const questions: QuizQuestion[] = [];

  // Question 1: Year/Date recognition
  questions.push(generateYearQuestion(event));

  // Question 2: Era identification
  questions.push(generateEraQuestion(event));

  // Question 3: Story/Content comprehension
  questions.push(generateStoryQuestion(event));

  // Question 4: Fun fact recall
  questions.push(generateFunFactQuestion(event));

  // Question 5: Title/Name recognition
  questions.push(generateTitleQuestion(event));

  // Randomize answer order for each question
  return questions.map(randomizeAnswers);
}

/**
 * Generate a question about the event's year
 */
function generateYearQuestion(event: TimelineEvent): QuizQuestion {
  const correctYear = event.year;
  const displayYear = correctYear < 0 ? `${Math.abs(correctYear)} BCE` : `${correctYear} CE`;

  // Generate plausible wrong years
  const wrongYears = [
    correctYear + 100,
    correctYear - 100,
    correctYear + 500,
  ].map((year) => (year < 0 ? `${Math.abs(year)} BCE` : `${year} CE`));

  return {
    question: `When did ${event.title} occur?`,
    answers: [displayYear, ...wrongYears],
    correctIndex: 0,
  };
}

/**
 * Generate a question about the event's era
 */
function generateEraQuestion(event: TimelineEvent): QuizQuestion {
  const eras = ["ancient", "medieval", "renaissance", "industrial", "modern", "digital"];
  const correctEra = event.era;

  // Get 3 wrong eras
  const wrongEras = eras
    .filter((era) => era !== correctEra)
    .slice(0, 3);

  return {
    question: `Which historical era does ${event.title} belong to?`,
    answers: [
      capitalizeFirst(correctEra),
      ...wrongEras.map(capitalizeFirst),
    ],
    correctIndex: 0,
  };
}

/**
 * Generate a question based on story content
 */
function generateStoryQuestion(event: TimelineEvent): QuizQuestion {
  const storyContent = event.content.triggers?.story?.content || event.content.story;

  if (!storyContent) {
    // Fallback: generate a generic question about the description
    return {
      question: `What is ${event.title} best known for?`,
      answers: [
        event.description,
        "Leading to rapid population decline",
        "Starting a major war",
        "Causing economic collapse",
      ],
      correctIndex: 0,
    };
  }

  // Extract a key fact from the story (simplified approach)
  // In production, this would use NLP or pre-authored questions
  const sentences = storyContent.split(/[.!?]+/).filter((s) => s.trim().length > 20);

  if (sentences.length > 0) {
    // Create a question based on the description
    return {
      question: `What was the significance of ${event.title}?`,
      answers: [
        event.description,
        "It had no lasting impact on society",
        "It was quickly forgotten after its introduction",
        "It was only used for a short period of time",
      ],
      correctIndex: 0,
    };
  }

  return {
    question: `What best describes ${event.title}?`,
    answers: [
      event.description,
      "A temporary phenomenon with no lasting effects",
      "An event that happened by accident with no planning",
      "Something that only affected a small group of people",
    ],
    correctIndex: 0,
  };
}

/**
 * Generate a question based on fun facts
 */
function generateFunFactQuestion(event: TimelineEvent): QuizQuestion {
  const funFacts = event.content.funFacts || [];

  if (funFacts.length === 0) {
    // Fallback to a tag-based question
    const tags = event.tags || [];
    if (tags.length > 0) {
      return {
        question: `Which category best describes ${event.title}?`,
        answers: [
          capitalizeFirst(tags[0]),
          "Entertainment",
          "Sports",
          "Fashion",
        ],
        correctIndex: 0,
      };
    }

    // Ultimate fallback
    return {
      question: `What type of historical event is ${event.title}?`,
      answers: [
        event.era === "digital" || event.era === "modern" ? "A modern innovation" : "An important historical development",
        "A natural disaster",
        "A sports achievement",
        "A fashion trend",
      ],
      correctIndex: 0,
    };
  }

  // Use the first fun fact
  const correctFact = funFacts[0];

  return {
    question: `Which of these facts about ${event.title} is true?`,
    answers: [
      correctFact,
      "It was discovered by accident during a cooking experiment",
      "It was banned for over 100 years after its invention",
      "No one knows who created it or when it was made",
    ],
    correctIndex: 0,
  };
}

/**
 * Generate a question about the event title/name
 */
function generateTitleQuestion(event: TimelineEvent): QuizQuestion {
  // Generate plausible wrong names based on the correct title
  const wrongNames = generatePlausibleNames(event.title, event.era);

  return {
    question: `What is the name of this invention/event from ${event.year < 0 ? `${Math.abs(event.year)} BCE` : `${event.year} CE`}?`,
    answers: [event.title, ...wrongNames],
    correctIndex: 0,
  };
}

/**
 * Generate plausible wrong names based on the era
 */
function generatePlausibleNames(correctTitle: string, era: string): string[] {
  // This is a simplified version - in production, use a database of real event names
  const ancientInventions = ["The Plow", "The Compass", "The Sundial"];
  const medievalInventions = ["The Crossbow", "The Hourglass", "The Astrolabe"];
  const modernInventions = ["The Radio", "The Typewriter", "The Camera"];
  const digitalInventions = ["The Laptop", "The Tablet", "The GPS"];

  let pool: string[] = [];
  switch (era) {
    case "ancient":
      pool = ancientInventions;
      break;
    case "medieval":
    case "renaissance":
      pool = medievalInventions;
      break;
    case "industrial":
    case "modern":
      pool = modernInventions;
      break;
    case "digital":
      pool = digitalInventions;
      break;
    default:
      pool = [...modernInventions];
  }

  // Filter out the correct title and return 3 wrong names
  return pool.filter((name) => name !== correctTitle).slice(0, 3);
}

/**
 * Randomize the order of answers in a question
 */
function randomizeAnswers(question: QuizQuestion): QuizQuestion {
  const correctAnswer = question.answers[question.correctIndex];

  // Create a shuffled copy of answers
  const shuffledAnswers = [...question.answers];
  for (let i = shuffledAnswers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledAnswers[i], shuffledAnswers[j]] = [shuffledAnswers[j], shuffledAnswers[i]];
  }

  // Find the new index of the correct answer
  const newCorrectIndex = shuffledAnswers.indexOf(correctAnswer);

  return {
    question: question.question,
    answers: shuffledAnswers,
    correctIndex: newCorrectIndex,
  };
}

/**
 * Capitalize first letter of a string
 */
function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
