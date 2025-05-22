#  MONO QUEST

### An AI-Powered Interview Question Generator (CLI)

Generate crisp, interview-grade questions on **DSA, OOP and System Design**—sprinkled with a light pop-culture twist—then export them as a clean, print-ready PDF.

> **Why you’ll like it:**
>
> - Prompts Gemini 2.0 Flash to craft concise, difficulty-tagged questions.
> - Adds a tiny dash of random cartoon / superhero flavor for engagement—without hijacking the question.
> - Uses **Puppeteer** to render an HTML template into a polished A4 PDF (better typography & layout than pdfkit).
> - One-file TypeScript CLI; no server, no frontend, no fuss.

<br>

## ✨ Features

- **Subjects:** Data-Structures & Algorithms, Object-Oriented Programming, System Design
- **Difficulty levels:** Easy · Medium · Hard
- **Custom count:** any number of questions per chosen subject
- **Character cameo:** Batman, Yoda, SpongeBob, etc. (optional, single-line intro)
- **PDF output:** `interview_questions_<timestamp>.pdf` (A4, modern fonts, styled headings)
- **Single-file script:** run with `ts-node` or compile with `tsc`

<br>

## 🏗 Tech Stack

| Purpose              | Library / Service                                     |
| -------------------- | ----------------------------------------------------- |
| LLM prompt / answers | **Google Gemini 2.0 Flash** (`@google/generative-ai`) |
| PDF rendering        | **Puppeteer** (Chrome headless HTML → PDF)            |
| CLI interaction      | `inquirer`, `chalk`                                   |
| Date formatting      | `dayjs`                                               |
| Language & runtime   | TypeScript · Node 18+                                 |

<br>

## 🚀 Quick Start

```bash
# 1- Clone / download the repo
git clone https://github.com/you/ai-interview-cli.git
cd ai-interview-cli

# 2- Install dependencies
npm install

# 3- Add your API key
cp .env.example .env       # then edit .env
# GEMINI_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# 4- Run the CLI
npx ts-node index.ts
# or: npm start (if you add a script)
```

Follow the prompts:

```
✔ Select subjects:  ◉  DSA  ◉  OOPs  ◉  System Design
✔ Choose difficulty:  Medium
✔ How many questions per subject?  3
```

The tool calls Gemini, builds an HTML report, renders it to PDF, and drops e.g.:

```
interview_questions_2025-05-22_18-40-12.pdf
```

Open the file—ready for printing or sharing.

<br>

## 🔑 Environment Variables

| Variable         | Purpose                                                              |
| ---------------- | -------------------------------------------------------------------- |
| `GEMINI_API_KEY` | Google Generative AI key ([AI Studio](https://aistudio.google.com/)) |

<br>

## 🛠 Customisation

- **Change question style** → tweak the `prompt` string in `generateQuestion()`.
- **Add / remove characters** → edit the `characters` array.
- **PDF look & feel** → update the CSS in `buildHTML()`.
- **Different page size** → adjust `page.pdf({ format: "A4" … })`.

<br>

## 🙂 Free free to contribute
#### Current improvement I am looking for :
1. Improve the puppeteer (html to pdf) 
2. Current prompt for fetching questions
3. Cli interaction with user

#### Future improvements I have planned:
1. make a backend and deploy in liveapi
2. make a chrome extension which would give your quest 3-4 times a day, ramdonly.
3. Built a desktop app, program runs in background and gives you quest 3-4 times a day and more features...  

<br>

## 🤔 FAQ

**Q » Is it really free to use?**
A » Gemini Flash currently has a generous free quota on Google AI Studio. Heavy usage may require billing.

**Q » Can I swap Gemini for OpenAI or Mistral?**
A » Yes—replace the `generateQuestion` function with the provider’s SDK.

**Q » Why Puppeteer over pdfkit?**
A » HTML → PDF delivers far better typography, CSS control, and is easier to iterate on.

<br>

## 📝 License

MIT. Use at your own risk. All trademarks and character names belong to their respective owners; they are referenced here purely for educational context.

---

Happy prepping—may your next interview feel like a walk in the Batcave! 🦇
