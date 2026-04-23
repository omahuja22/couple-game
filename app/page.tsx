"use client";

import { useState, useRef } from "react";
import html2canvas from "html2canvas";

interface Answer {
  question: string;
  answer: "me" | "partner" | "both";
}

const QUESTIONS = [
  "Who fell first?",
  "Who loves more?",
  "Who gets jealous more?",
  "Who says sorry first?",
  "Who is more caring?",
  "Who is more emotional?",
  "Who is more dramatic?",
  "Who misses the other more?",
  "Who is more stubborn?",
  "Who spends more money?",
  "Who is more romantic?",
  "Who would survive a zombie apocalypse?",
];

const OPTION_LABELS = {
  me: "Me",
  partner: "Partner",
  both: "Both",
};

const EMOJIS = {
  me: "😏",
  partner: "❤️",
  both: "🤝",
};

export default function Home() {
  const [screen, setScreen] = useState<"start" | "game" | "results">("start");
  const [yourName, setYourName] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleStart = () => {
    if (yourName.trim() && partnerName.trim()) {
      setScreen("game");
    } else {
      alert("Please enter both names");
    }
  };

  const handleAnswer = (answer: "me" | "partner" | "both") => {
    const newAnswers = [
      ...answers,
      {
        question: QUESTIONS[currentQuestion],
        answer,
      },
    ];
    setAnswers(newAnswers);

    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setScreen("results");
    }
  };

  const handleRestart = () => {
    setScreen("start");
    setYourName("");
    setPartnerName("");
    setCurrentQuestion(0);
    setAnswers([]);
  };

  const countAnswers = (value: "me" | "partner" | "both") => {
    return answers.filter((a) => a.answer === value).length;
  };

  const handleShare = async () => {
    if (resultsRef.current) {
      try {
        const canvas = await html2canvas(resultsRef.current, {
          backgroundColor: "#faf5ff",
          scale: 2,
        });
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "couple-game-results.png";
        link.click();
      } catch (error) {
        console.error("Error capturing screenshot:", error);
        alert("Error creating screenshot");
      }
    }
  };

  if (screen === "start") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-6">
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-2">💖</h1>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Couple Game
              </h1>
              <p className="text-gray-500 mt-2">Test your compatibility!</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={yourName}
                  onChange={(e) => setYourName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Partner Name
                </label>
                <input
                  type="text"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  placeholder="Enter partner's name"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition"
                />
              </div>
            </div>

            <button
              onClick={handleStart}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-4 rounded-xl hover:shadow-lg transform hover:scale-105 transition"
            >
              Start Game
            </button>

            <p className="text-center text-sm text-gray-500">
              Answer 12 fun questions together 🎮
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (screen === "game") {
    const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-600">
                Question {currentQuestion + 1}/{QUESTIONS.length}
              </span>
              <span className="text-sm font-semibold text-gray-600">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-8">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                {QUESTIONS[currentQuestion]}
              </h2>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => handleAnswer("me")}
                className="group p-6 rounded-2xl border-2 border-gray-200 hover:border-pink-500 hover:bg-pink-50 transition transform hover:scale-105 active:scale-95"
              >
                <div className="text-4xl mb-2">😏</div>
                <div className="font-bold text-lg text-gray-800 group-hover:text-pink-600 transition">
                  {yourName}
                </div>
              </button>

              <button
                onClick={() => handleAnswer("both")}
                className="group p-6 rounded-2xl border-2 border-gray-200 hover:border-teal-500 hover:bg-teal-50 transition transform hover:scale-105 active:scale-95"
              >
                <div className="text-4xl mb-2">🤝</div>
                <div className="font-bold text-lg text-gray-800 group-hover:text-teal-600 transition">
                  Both
                </div>
              </button>

              <button
                onClick={() => handleAnswer("partner")}
                className="group p-6 rounded-2xl border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition transform hover:scale-105 active:scale-95"
              >
                <div className="text-4xl mb-2">❤️</div>
                <div className="font-bold text-lg text-gray-800 group-hover:text-purple-600 transition">
                  {partnerName}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (screen === "results") {
    const meCount = countAnswers("me");
    const partnerCount = countAnswers("partner");
    const bothCount = countAnswers("both");

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Results Card */}
          <div
            ref={resultsRef}
            className="bg-white rounded-3xl shadow-2xl p-8 space-y-8 mb-8"
          >
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
                Results! 🎉
              </h1>
              <p className="text-xl text-gray-600">
                Looks like you both are pretty compatible 💖
              </p>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-pink-100 to-pink-50 rounded-2xl p-6 text-center">
                <div className="text-4xl mb-2">😏</div>
                <div className="font-bold text-3xl text-pink-600">{meCount}</div>
                <div className="text-gray-600 font-semibold">
                  You chose "{yourName}"
                </div>
              </div>

              <div className="bg-gradient-to-br from-teal-100 to-teal-50 rounded-2xl p-6 text-center">
                <div className="text-4xl mb-2">🤝</div>
                <div className="font-bold text-3xl text-teal-600">{bothCount}</div>
                <div className="text-gray-600 font-semibold">
                  You chose "Both"
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl p-6 text-center">
                <div className="text-4xl mb-2">❤️</div>
                <div className="font-bold text-3xl text-purple-600">
                  {partnerCount}
                </div>
                <div className="text-gray-600 font-semibold">
                  You chose "{partnerName}"
                </div>
              </div>
            </div>

            {/* All Answers */}
            <div className="space-y-4 border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-800">Your Answers</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {answers.map((answer, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">
                        {index + 1}. {answer.question}
                      </p>
                    </div>
                    <div className="text-2xl">
                      {EMOJIS[answer.answer]}
                      <span className="ml-2 font-bold text-gray-700">
                        {answer.answer === "me"
                          ? yourName
                          : answer.answer === "partner"
                            ? partnerName
                            : "Both"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={handleShare}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 rounded-xl hover:shadow-lg transform hover:scale-105 transition"
            >
              📸 Share Screenshot
            </button>

            <button
              onClick={handleRestart}
              className="w-full bg-gray-200 text-gray-800 font-bold py-4 rounded-xl hover:bg-gray-300 transition"
            >
              Play Again
            </button>

            <p className="text-center text-sm text-gray-500">
              Share on WhatsApp 😉
            </p>
          </div>
        </div>
      </div>
    );
  }
}
