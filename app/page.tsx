"use client";

import { useState, useEffect } from "react";

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
  me: "😎",
  partner: "❤️",
  both: "🤝",
};

export default function Home() {
  const [screen, setScreen] = useState<"start" | "game" | "results">("start");
  const [yourName, setYourName] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<"me" | "partner" | "both" | null>(null);
  const [fadeIn, setFadeIn] = useState(true);

  const handleStart = () => {
    if (yourName.trim() && partnerName.trim()) {
      setScreen("game");
      setFadeIn(true);
    } else {
      alert("Please enter both names");
    }
  };

  const handleAnswer = (answer: "me" | "partner" | "both") => {
    setSelectedAnswer(answer);
    
    setTimeout(() => {
      const newAnswers = [
        ...answers,
        {
          question: QUESTIONS[currentQuestion],
          answer,
        },
      ];
      setAnswers(newAnswers);

      if (currentQuestion < QUESTIONS.length - 1) {
        setFadeIn(false);
        setTimeout(() => {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedAnswer(null);
          setFadeIn(true);
        }, 300);
      } else {
        setScreen("results");
        setFadeIn(true);
      }
    }, 600);
  };

  const handleRestart = () => {
    setScreen("start");
    setYourName("");
    setPartnerName("");
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setFadeIn(true);
  };

  const countAnswers = (value: "me" | "partner" | "both") => {
    return answers.filter((a) => a.answer === value).length;
  };

  if (screen === "start") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl p-8 space-y-6 animate-fade-in">
            <div className="text-center space-y-4">
              <h1 className="text-6xl font-bold mb-2">💖</h1>
              <h1 className="text-5xl font-bold text-white drop-shadow-lg">
                Couple Game
              </h1>
              <p className="text-white/90 text-lg drop-shadow-md">
                Let's see how well you know each other 😉
              </p>
            </div>

            <div className="space-y-4 pt-4">
              <div className="group">
                <label className="block text-sm font-semibold text-white/90 mb-2 drop-shadow-md">
                  Your Name
                </label>
                <input
                  type="text"
                  value={yourName}
                  onChange={(e) => setYourName(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleStart()}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 focus:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 placeholder-white/50 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/25"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-white/90 mb-2 drop-shadow-md">
                  Partner Name
                </label>
                <input
                  type="text"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleStart()}
                  placeholder="Enter partner's name"
                  className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 focus:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 placeholder-white/50 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/25"
                />
              </div>
            </div>

            <button
              onClick={handleStart}
              className="w-full bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 active:scale-95 drop-shadow-lg"
            >
              Start Game
            </button>

            <p className="text-center text-sm text-white/80 drop-shadow-md">
              Answer 12 fun questions together 🎮
            </p>
          </div>
        </div>

        <style>{`
          @keyframes blob {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
          .animate-fade-in {
            animation: fade-in 0.6s ease-out;
          }
        `}</style>
      </div>
    );
  }

  if (screen === "game") {
    const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="w-full max-w-2xl relative z-10">
          {/* Progress Section */}
          <div className="mb-8 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 space-y-4 animate-fade-in">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-white drop-shadow-md">
                Question {currentQuestion + 1}/{QUESTIONS.length}
              </span>
              <span className="text-sm font-semibold text-white drop-shadow-md">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden border border-white/20">
              <div
                className="h-full bg-gradient-to-r from-pink-400 to-purple-500 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Question Card */}
          <div
            className={`bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl p-8 space-y-8 transition-all duration-300 ${
              fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg leading-tight">
                {QUESTIONS[currentQuestion]}
              </h2>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Me Option */}
              <button
                onClick={() => handleAnswer("me")}
                disabled={selectedAnswer !== null}
                className={`group p-8 rounded-2xl border-2 transition-all duration-300 transform ${
                  selectedAnswer === null
                    ? "bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/40 hover:scale-105 active:scale-95 cursor-pointer"
                    : selectedAnswer === "me"
                      ? "bg-pink-400/30 border-pink-400 scale-105 shadow-lg shadow-pink-400/50"
                      : "bg-white/5 border-white/10 opacity-50 cursor-not-allowed"
                }`}
              >
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  😎
                </div>
                <div className="font-bold text-lg text-white drop-shadow-md">
                  {yourName}
                </div>
              </button>

              {/* Both Option */}
              <button
                onClick={() => handleAnswer("both")}
                disabled={selectedAnswer !== null}
                className={`group p-8 rounded-2xl border-2 transition-all duration-300 transform ${
                  selectedAnswer === null
                    ? "bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/40 hover:scale-105 active:scale-95 cursor-pointer"
                    : selectedAnswer === "both"
                      ? "bg-teal-400/30 border-teal-400 scale-105 shadow-lg shadow-teal-400/50"
                      : "bg-white/5 border-white/10 opacity-50 cursor-not-allowed"
                }`}
              >
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  🤝
                </div>
                <div className="font-bold text-lg text-white drop-shadow-md">
                  Both
                </div>
              </button>

              {/* Partner Option */}
              <button
                onClick={() => handleAnswer("partner")}
                disabled={selectedAnswer !== null}
                className={`group p-8 rounded-2xl border-2 transition-all duration-300 transform ${
                  selectedAnswer === null
                    ? "bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/40 hover:scale-105 active:scale-95 cursor-pointer"
                    : selectedAnswer === "partner"
                      ? "bg-purple-400/30 border-purple-400 scale-105 shadow-lg shadow-purple-400/50"
                      : "bg-white/5 border-white/10 opacity-50 cursor-not-allowed"
                }`}
              >
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  ❤️
                </div>
                <div className="font-bold text-lg text-white drop-shadow-md">
                  {partnerName}
                </div>
              </button>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes blob {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
          .animate-fade-in {
            animation: fade-in 0.6s ease-out;
          }
        `}</style>
      </div>
    );
  }

  if (screen === "results") {
    const meCount = countAnswers("me");
    const partnerCount = countAnswers("partner");
    const bothCount = countAnswers("both");

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-900 flex flex-col items-center justify-center p-4 relative overflow-hidden py-20">
        {/* Animated background circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="w-full max-w-3xl relative z-10 space-y-6">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg mb-2">
              Your Results 💖
            </h1>
            <p className="text-xl text-white/90 drop-shadow-md">
              Looks like you two are pretty amazing together 💕
            </p>
          </div>

          {/* Summary Stats */}
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 text-center hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
              <div className="text-5xl mb-3">😎</div>
              <div className="font-bold text-4xl text-pink-300 drop-shadow-md mb-2">
                {meCount}
              </div>
              <div className="text-white/80 font-semibold drop-shadow-md">
                You chose "{yourName}"
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 text-center hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
              <div className="text-5xl mb-3">🤝</div>
              <div className="font-bold text-4xl text-teal-300 drop-shadow-md mb-2">
                {bothCount}
              </div>
              <div className="text-white/80 font-semibold drop-shadow-md">
                You chose "Both"
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 text-center hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
              <div className="text-5xl mb-3">❤️</div>
              <div className="font-bold text-4xl text-purple-300 drop-shadow-md mb-2">
                {partnerCount}
              </div>
              <div className="text-white/80 font-semibold drop-shadow-md">
                You chose "{partnerName}"
              </div>
            </div>
          </div>

          {/* All Answers */}
          <div
            className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 space-y-3 animate-fade-in max-h-96 overflow-y-auto"
            style={{ animationDelay: "0.2s" }}
          >
            <h2 className="text-2xl font-bold text-white drop-shadow-md mb-4">
              Your Answers
            </h2>
            <div className="space-y-2">
              {answers.map((answer, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-white/10 hover:bg-white/15 rounded-xl border border-white/20 transition-all duration-300"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-white drop-shadow-md">
                      {index + 1}. {answer.question}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <span className="text-3xl">
                      {EMOJIS[answer.answer]}
                    </span>
                    <span className="font-bold text-white/90 drop-shadow-md whitespace-nowrap">
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

          {/* Action Button */}
          <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <button
              onClick={handleRestart}
              className="w-full bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white font-bold py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 active:scale-95 drop-shadow-lg"
            >
              Play Again
            </button>
          </div>
        </div>

        <style>{`
          @keyframes blob {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
          .animate-fade-in {
            animation: fade-in 0.6s ease-out;
          }
        `}</style>
      </div>
    );
  }
}

