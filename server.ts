import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import dns from "dns";
import fs from "fs";

// Fix for Node.js 17+ preferring IPv6, which causes issues in some environments
dns.setDefaultResultOrder("ipv4first");

interface Guess {
  name: string;
  guess: number;
  timestamp: number;
}

const GUESSES_FILE = path.join(process.cwd(), "guesses.json");

function readGuesses(): Guess[] {
  try {
    if (fs.existsSync(GUESSES_FILE)) {
      const data = fs.readFileSync(GUESSES_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading guesses:", error);
  }
  return [];
}

function saveGuesses(guesses: Guess[]) {
  try {
    fs.writeFileSync(GUESSES_FILE, JSON.stringify(guesses, null, 2));
  } catch (error) {
    console.error("Error saving guesses:", error);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/guesses", (req, res) => {
    const guesses = readGuesses().sort((a, b) => b.guess - a.guess);
    res.json(guesses);
  });

  app.delete("/api/guesses", (req, res) => {
    saveGuesses([]);
    res.status(204).send();
  });

  app.post("/api/guesses", (req, res) => {
    const { name, guess } = req.body;
    if (!name || guess === undefined) {
      return res.status(400).json({ error: "Name and guess are required" });
    }

    const guesses = readGuesses();
    const newGuess: Guess = {
      name,
      guess: Number(guess),
      timestamp: Date.now(),
    };
    guesses.push(newGuess);
    saveGuesses(guesses);

    res.status(201).json(newGuess);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
