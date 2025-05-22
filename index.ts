#!/usr/bin/env ts-node

import * as dotenv from "dotenv";
dotenv.config();

import puppeteer from "puppeteer";
import inquirer from "inquirer";
import chalk from "chalk";
import fs from "fs/promises";
import dayjs from "dayjs";
import { GoogleGenerativeAI } from "@google/generative-ai";

// -------------------- Types --------------------
type Subject = "DSA" | "OOPs" | "System Design";
type Difficulty = "Easy" | "Medium" | "Hard";

// -------------------- Constants --------------------
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const characters = [
  "Batman",
  "Iron Man",
  "Sherlock Holmes",
  "Rick Sanchez",
  "SpongeBob SquarePants",
  "Optimus Prime",
  "Yoda",
  "Dexter from Dexter's Lab",
  "Mario",
  "Luigi",
  "Princess Peach",
  "Bowser",
  "Donkey Kong",
  "Link",
  "Zelda",
  "Kirby",
  "Pikachu",
  "Charizard",
  "Sonic the Hedgehog",
  "Tails",
  "Knuckles",
  "Crash Bandicoot",
  "Spyro the Dragon",
  "Steve from Minecraft",
  "Creeper from Minecraft",
  "Master Chief",
  "Lara Croft",
  "Kratos",
  "Ratchet",
  "Clank",
  "Sackboy",
  "Pac-Man",
  "Ms. Pac-Man",
  "Wreck-It Ralph",
  "Elsa",
  "Anna",
  "Shrek",
  "Donkey from Shrek",
  "Po from Kung Fu Panda",
  "Gru from Despicable Me",
  "Minion (Kevin)",
  "Spider-Man (Miles Morales)",
  "Spider-Man (Peter Parker)",
  "Goku (Dragon Ball Z)",
  "Buzz Lightyear",
  "Woody",
  "Lightning McQueen",
  "Mater",
  "Sully from Monsters, Inc.",
  "Mike Wazowski",
  "Homer Simpson",
  "Bart Simpson",
  "Lisa Simpson",
  "Marge Simpson",
  "Mickey Mouse",
  "Donald Duck",
  "Goofy",
  "Scrooge McDuck",
  "Phineas",
  "Ferb",
  "Perry the Platypus",
  "Ash Ketchum",
  "Tom (Tom and Jerry)",
  "Jerry (Tom and Jerry)",
  "Bugs Bunny",
  "Daffy Duck",
  "Scooby-Doo",
  "Shaggy",
  "Ben Tennyson (Ben 10)",
  "Finn the Human",
  "Jake the Dog",
  "Gumball Watterson",
  "Darwin Watterson",
  "Steven Universe",
  "Raven (Teen Titans)",
  "Beast Boy",
  "Robin (Teen Titans)",
  "Cyborg (Teen Titans)",
  "Mordecai (Regular Show)",
  "Rigby (Regular Show)"
];
// Removed characters aimed at toddlers and those introduced after 2010.

function getRandomCharacter(): string {
  return characters[Math.floor(Math.random() * characters.length)];
}

// -------------------- Gemini Question Generator --------------------
async function generateQuestion(
  subject: Subject,
  difficulty: Difficulty,
  character: string
): Promise<string> {
  const prompt = `Generate a high-quality ${difficulty} level interview question of ${subject} in ${character} to make it slightly engaging — but do NOT distract or use excessive storytelling. Focus on the actual question content. try to make questions more numerical centric and less theoretical to retain attention and make interesting. 
(also write a questions without any rich text instead use brackets or uppercase letters to highlight the important parts of the question)(dont write any header, footer, or any other greetings, i want questions directly)`;

  try {
    const result = await model.generateContent([prompt]);
    const response = await result.response;
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
    return text?.trim() || "Failed to generate question.";
  } catch (error) {
    console.error("Error generating question:", error);
    return "Failed to generate question.";
  }
}

// -------------------- HTML Generator --------------------
function buildHTML(
  questionsBySubject: Record<string, string[]>,
  difficulty: string
): string {
  const styles = `
    <style>
      body {
        font-family: 'Segoe UI', sans-serif;
        padding: 20px;
        color: #222;
        line-height: 1.4;
      }
      h1 {
        text-align: center;
        color: #2E86DE;
      }
      h2 {
        margin-top: 40px;
        border-bottom: 1px solid #ddd;
        padding-bottom: 5px;
        color: #555;
      }
      p {
        margin: 10px 0;
      }
    </style>
  `;

  let body = `<h1>Your Quests </h1><p style="text-align:center;">Difficulty: <strong>${difficulty}</strong></p>`;

  for (const subject in questionsBySubject) {
    body += `<h2>${subject}</h2>`;
    questionsBySubject[subject].forEach((q) => {
      body += `<p>${q}</p>`;
    });
  }

  return `<!DOCTYPE html><html><head><meta charset="utf-8">${styles}</head><body>${body}</body></html>`;
}

// -------------------- PDF Generator with Puppeteer --------------------
async function generatePDFWithPuppeteer(html: string): Promise<string> {
  const filename = `interview_questions_${dayjs().format(
    "YYYY-MM-DD_HH-mm-ss"
  )}.pdf`;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: "networkidle0" });
  await page.pdf({ path: filename, format: "A4", printBackground: true });

  await browser.close();
  return filename;
}

// -------------------- CLI --------------------
async function main() {
  console.log(
    chalk.greenBright("🎓 Welcome to AI Interview Question Generator\n")
  );

  const { subjects, difficulty, count } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "subjects",
      message: "Select subjects:",
      choices: ["DSA", "OOPs", "System Design"],
      validate: (input) => input.length > 0 || "Select at least one subject",
    },
    {
      type: "list",
      name: "difficulty",
      message: "Choose difficulty:",
      choices: ["Easy", "Medium", "Hard"],
    },
    {
      type: "number",
      name: "count",
      message: "How many questions per subject?",
      default: 5,
      validate: (n) => (typeof n === "number" && n > 0) || "Must be at least 1",
    },
  ]);

  const results: Record<string, string[]> = {};

  for (const subject of subjects as Subject[]) {
    results[subject] = [];

    for (let i = 0; i < count; i++) {
      const character = getRandomCharacter();
      console.log(
        chalk.cyan(
          `Generating ${difficulty} ${subject} question as ${character}...`
        )
      );

      const question = await generateQuestion(subject, difficulty, character);
      results[subject].push(question);
    }
  }

  const html = buildHTML(results, difficulty);
  const filePath = await generatePDFWithPuppeteer(html);

  console.log(
    chalk.greenBright(`\n✅ PDF generated successfully: ${filePath}\n`)
  );
}

main();
