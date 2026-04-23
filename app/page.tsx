"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  "Who misses the other more?",
  "Who texts first?",
  "Who calls more?",
  "Who is more romantic?",
  "Who gets angry faster?",
  "Who is more clingy?",
  "Who loves cuddles more?",
  "Who is more cute?",
  "Who would win in a cute argument?",
];

const ROMANTIC_MESSAGE = `No matter what these answers say, one thing will never change — you mean everything to me. 💖

From the smallest smiles to the biggest moments, every memory feels special because it has you in it. The way you laugh, the way you look at me, the way you hold my hand — all of it makes my heart skip a beat.

You're not just someone I love — you're someone I feel safe with, someone who makes everything lighter, happier, and more meaningful. You've become a part of my everyday thoughts, my comfort, and my peace.

Even on the days when things are messy or imperfect, my heart still finds its way back to you without hesitation. You're my person, my favorite person, and my home.

This game might just be fun and games… but what we have is something real, something rare, something that doesn't need these questions to prove it. Because deep down, I already know — you're the one I choose, every single day, in every single way.

I'm always on your side. Always yours. Always. 💕

Yours forever,
Your [Partner Name] 🌹`;

const EMOJIS = {
  me: "😎",
  partner: "❤️",
  both: "🤝",
};

export default function Home() {
  // GLOBAL STATE - NEVER RESET THESE
  const [yourName, setYourName] = useState<string>("");
  const [partnerName, setPartnerName] = useState<string>("");

  // SCREEN MANAGEMENT
  const [screen, setScreen] = useState<"start" | "game" | "results">("start");
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<"me" | "partner" | "both" | null>(null);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);

  // HANDLERS
  const handleStart = () => {
    const trimmedYourName = yourName.trim();
    const trimmedPartnerName = partnerName.trim();

    if (!trimmedYourName || !trimmedPartnerName) {
      alert("Please enter both names");
      return;
    }

    setScreen("game");
  };

  const handleAnswer = (answer: "me" | "partner" | "both") => {
    setSelectedAnswer(answer);
    setShowFeedback(true);

    setTimeout(() => {
      setAnswers([
        ...answers,
        {
          question: QUESTIONS[currentQuestion],
          answer,
        },
      ]);

      if (currentQuestion < QUESTIONS.length - 1) {
        setTimeout(() => {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedAnswer(null);
          setShowFeedback(false);
        }, 300);
      } else {
        setScreen("results");
        setSelectedAnswer(null);
        setShowFeedback(false);
      }
    }, 400);
  };

  const handleRestart = () => {
    setScreen("start");
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowFeedback(false);
    // DO NOT RESET: yourName and partnerName stay intact
  };

  const countAnswers = (value: "me" | "partner" | "both"): number => {
    return answers.filter((a) => a.answer === value).length;
  };

  const getProgressMessage = (): string => {
    const percentage = (currentQuestion / QUESTIONS.length) * 100;
    if (percentage < 25) return "This is getting interesting 👀";
    if (percentage < 50) return "You're doing great 😏";
    if (percentage < 75) return "Almost there 💖";
    return "Final stretch, love! 💕";
  };

  const getResultMessage = (meCount: number, partnerCount: number, bothCount: number): string => {
    const max = Math.max(meCount, partnerCount, bothCount);

    if (bothCount === max && bothCount > 0) {
      return "Looks like you both are perfectly in sync 💖";
    } else if (partnerCount === max) {
      return `Aww, seems like ${yourName} really admires ${partnerName} a lot ❤️`;
    } else if (meCount === max) {
      return `Someone's feeling pretty confident here 😏`;
    }
    return "You two are amazing together! 💕";
  };

  const personalizeMessage = (): string => {
    return ROMANTIC_MESSAGE.replace("[Partner Name]", partnerName);
  };

  // START SCREEN
  if (screen === "start") {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="start-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden"
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>

          <div className="w-full max-w-md relative z-10">
            <motion.div
              className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl p-8 space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="text-center space-y-4">
                <h1 className="text-6xl font-bold mb-2">💖</h1>
                <h1 className="text-5xl font-bold text-white drop-shadow-lg">Couple Game</h1>
                <p className="text-white/90 text-lg drop-shadow-md">Let's see how well you know each other 😉</p>
              </div>

              <div className="space-y-4 pt-4">
                <div className="group">
                  <label className="block text-sm font-semibold text-white/90 mb-2 drop-shadow-md">Your Name</label>
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
                  <label className="block text-sm font-semibold text-white/90 mb-2 drop-shadow-md">Partner Name</label>
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

              <motion.button
                onClick={handleStart}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-full bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg drop-shadow-lg"
              >
                Start Game
              </motion.button>

              <p className="text-center text-sm text-white/80 drop-shadow-md">
                Answer {QUESTIONS.length} fun questions together 🎮
              </p>
            </motion.div>
          </div>

          <style>{`
            @keyframes blob {
              0%, 100% { transform: translate(0, 0) scale(1); }
              33% { transform: translate(30px, -50px) scale(1.1); }
              66% { transform: translate(-20px, 20px) scale(0.9); }
            }
            .animate-blob { animation: blob 7s infinite; }
            .animation-delay-2000 { animation-delay: 2s; }
            .animation-delay-4000 { animation-delay: 4s; }
          `}</style>
        </motion.div>
      </AnimatePresence>
    );
  }

  // GAME SCREEN
  if (screen === "game") {
    const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="game-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-900 flex flex-col items-center justify-center p-4 relative overflow-hidden"
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>

          <div className="w-full max-w-2xl relative z-10">
            <motion.div
              className="mb-8 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-white drop-shadow-md">
                  Question {currentQuestion + 1}/{QUESTIONS.length}
                </span>
                <span className="text-sm font-semibold text-white/80 drop-shadow-md italic">
                  {getProgressMessage()}
                </span>
                <span className="text-sm font-semibold text-white drop-shadow-md">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden border border-white/20">
                <motion.div
                  className="h-full bg-gradient-to-r from-pink-400 to-purple-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                ></motion.div>
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl p-8 space-y-8"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.4 }}
              >
                <div className="text-center">
                  <h2 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg leading-tight">
                    {QUESTIONS[currentQuestion]}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.button
                    onClick={() => handleAnswer("me")}
                    disabled={selectedAnswer !== null}
                    whileHover={selectedAnswer === null ? { scale: 1.05 } : {}}
                    whileTap={selectedAnswer === null ? { scale: 0.95 } : {}}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`group p-8 rounded-2xl border-2 transition-all duration-300 ${
                      selectedAnswer === null
                        ? "bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/40 cursor-pointer"
                        : selectedAnswer === "me"
                        ? "bg-pink-400/30 border-pink-400 shadow-lg shadow-pink-400/50 scale-105"
                        : "bg-white/5 border-white/10 opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">😎</div>
                    <div className="font-bold text-lg text-white drop-shadow-md">Me</div>
                    <div className="text-sm text-white/80 drop-shadow-md mt-1">{yourName}</div>
                  </motion.button>

                  <motion.button
                    onClick={() => handleAnswer("both")}
                    disabled={selectedAnswer !== null}
                    whileHover={selectedAnswer === null ? { scale: 1.05 } : {}}
                    whileTap={selectedAnswer === null ? { scale: 0.95 } : {}}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`group p-8 rounded-2xl border-2 transition-all duration-300 ${
                      selectedAnswer === null
                        ? "bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/40 cursor-pointer"
                        : selectedAnswer === "both"
                        ? "bg-teal-400/30 border-teal-400 shadow-lg shadow-teal-400/50 scale-105"
                        : "bg-white/5 border-white/10 opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">🤝</div>
                    <div className="font-bold text-lg text-white drop-shadow-md">Both</div>
                    <div className="text-sm text-white/80 drop-shadow-md mt-1">Equal</div>
                  </motion.button>

                  <motion.button
                    onClick={() => handleAnswer("partner")}
                    disabled={selectedAnswer !== null}
                    whileHover={selectedAnswer === null ? { scale: 1.05 } : {}}
                    whileTap={selectedAnswer === null ? { scale: 0.95 } : {}}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`group p-8 rounded-2xl border-2 transition-all duration-300 ${
                      selectedAnswer === null
                        ? "bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/40 cursor-pointer"
                        : selectedAnswer === "partner"
                        ? "bg-purple-400/30 border-purple-400 shadow-lg shadow-purple-400/50 scale-105"
                        : "bg-white/5 border-white/10 opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">❤️</div>
                    <div className="font-bold text-lg text-white drop-shadow-md">Partner</div>
                    <div className="text-sm text-white/80 drop-shadow-md mt-1">{partnerName}</div>
                  </motion.button>
                </div>

                <AnimatePresence>
                  {showFeedback && (
                    <motion.div
                      className="text-center text-xl text-white/90 drop-shadow-lg font-semibold"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      ✨ Great choice! ✨
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>
          </div>

          <style>{`
            @keyframes blob {
              0%, 100% { transform: translate(0, 0) scale(1); }
              33% { transform: translate(30px, -50px) scale(1.1); }
              66% { transform: translate(-20px, 20px) scale(0.9); }
            }
            .animate-blob { animation: blob 7s infinite; }
            .animation-delay-2000 { animation-delay: 2s; }
            .animation-delay-4000 { animation-delay: 4s; }
          `}</style>
        </motion.div>
      </AnimatePresence>
    );
  }

  // RESULTS SCREEN
  if (screen === "results") {
    const meCount = countAnswers("me");
    const partnerCount = countAnswers("partner");
    const bothCount = countAnswers("both");
    const coupleDisplay =
      yourName && partnerName ? `${yourName} ❤️ ${partnerName}` : "Couple 💖";

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="results-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-900 flex flex-col items-center justify-center p-4 relative overflow-hidden py-20"
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>

          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-pink-300 text-2xl"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-10px`,
                }}
                animate={{
                  y: [-20, -100],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
              >
                💕
              </motion.div>
            ))}
          </div>

          <div className="w-full max-w-3xl relative z-10 space-y-6">
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg mb-2">
                {coupleDisplay}'s Results 💖
              </h1>
              <p className="text-2xl text-white/90 drop-shadow-md font-semibold">
                {getResultMessage(meCount, partnerCount, bothCount)}
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 text-center hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
                <div className="text-5xl mb-3">😎</div>
                <div className="font-bold text-4xl text-pink-300 drop-shadow-md mb-2">{meCount}</div>
                <div className="text-white/80 font-semibold drop-shadow-md">You</div>
                <div className="text-sm text-white/70 drop-shadow-md">({yourName})</div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 text-center hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
                <div className="text-5xl mb-3">🤝</div>
                <div className="font-bold text-4xl text-teal-300 drop-shadow-md mb-2">{bothCount}</div>
                <div className="text-white/80 font-semibold drop-shadow-md">Both</div>
                <div className="text-sm text-white/70 drop-shadow-md">Equally</div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 text-center hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
                <div className="text-5xl mb-3">❤️</div>
                <div className="font-bold text-4xl text-purple-300 drop-shadow-md mb-2">{partnerCount}</div>
                <div className="text-white/80 font-semibold drop-shadow-md">Partner</div>
                <div className="text-sm text-white/70 drop-shadow-md">({partnerName})</div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 space-y-3 max-h-96 overflow-y-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-white drop-shadow-md mb-4">Your Answers</h2>
              <div className="space-y-2">
                {answers.map((answer, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-white/10 hover:bg-white/15 rounded-xl border border-white/20 transition-all duration-300"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-white drop-shadow-md text-sm md:text-base">
                        {index + 1}. {answer.question}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4 whitespace-nowrap">
                      <span className="text-3xl">{EMOJIS[answer.answer]}</span>
                      <span className="font-bold text-white/90 drop-shadow-md text-sm">
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
            </motion.div>

            <motion.div
              className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="text-white/90 drop-shadow-md leading-relaxed text-center whitespace-pre-wrap font-light text-sm md:text-base">
                {personalizeMessage()}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <motion.button
                onClick={handleRestart}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-full bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white font-bold py-4 rounded-xl shadow-lg drop-shadow-lg"
              >
                Play Again 🔁
              </motion.button>
            </motion.div>
          </div>

          <style>{`
            @keyframes blob {
              0%, 100% { transform: translate(0, 0) scale(1); }
              33% { transform: translate(30px, -50px) scale(1.1); }
              66% { transform: translate(-20px, 20px) scale(0.9); }
            }
            .animate-blob { animation: blob 7s infinite; }
            .animation-delay-2000 { animation-delay: 2s; }
            .animation-delay-4000 { animation-delay: 4s; }
          `}</style>
        </motion.div>
      </AnimatePresence>
    );
  }
}
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  "Who misses the other more?",
  "Who texts first?",
  "Who calls more?",
  "Who is more romantic?",
  "Who gets angry faster?",
  "Who is more clingy?",
  "Who loves cuddles more?",
  "Who is more cute?",
  "Who would win in a cute argument?",
];

const TERMS_OF_ENDEARMENT = [
  "Bubu",
  "Dudu",
  "Kuchu Puchu",
  "Sweetheart",
  "Baby",
  "My Love",
  "Honey",
  "Darling",
  "Cutie Pie",
  "My Heart",
  "Angel",
  "Lovebug",
  "Snugglebug",
  "Muffin",
  "Boo",
];

const ROMANTIC_MESSAGE = `No matter what these answers say, one thing will never change — you mean everything to me. 💖

From the smallest smiles to the biggest moments, every memory feels special because it has you in it. The way you laugh, the way you look at me, the way you hold my hand — all of it makes my heart skip a beat.

You're not just someone I love — you're someone I feel safe with, someone who makes everything lighter, happier, and more meaningful. You've become a part of my everyday thoughts, my comfort, and my peace.

Even on the days when things are messy or imperfect, my heart still finds its way back to you without hesitation. You're my person, my favorite person, and my home.

This game might just be fun and games… but what we have is something real, something rare, something that doesn't need these questions to prove it. Because deep down, I already know — you're the one I choose, every single day, in every single way.

I'm always on your side. Always yours. Always. 💕

Yours forever,
Your [Partner Name] 🌹`;

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
  const [selectedAnswer, setSelectedAnswer] = useState<
    "me" | "partner" | "both" | null
  >(null);
  const [fadeIn, setFadeIn] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);

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
    setShowFeedback(true);

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
        setShowFeedback(false);
        setTimeout(() => {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedAnswer(null);
          setFadeIn(true);
        }, 300);
      } else {
        setScreen("results");
        setFadeIn(true);
        setShowFeedback(false);
      }
    }, 400);
  };

  const handleRestart = () => {
    setScreen("start");
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setFadeIn(true);
    setShowFeedback(false);
  };

  const countAnswers = (value: "me" | "partner" | "both") => {
    return answers.filter((a) => a.answer === value).length;
  };

  const getProgressMessage = () => {
    const percentage = (currentQuestion / QUESTIONS.length) * 100;
    if (percentage < 25) return "This is getting interesting 👀";
    if (percentage < 50) return "You're doing great 😏";
    if (percentage < 75) return "Almost there 💖";
    return "Final stretch, love! 💕";
  };

  const getResultMessage = (
    meCount: number,
    partnerCount: number,
    bothCount: number
  ) => {
    const max = Math.max(meCount, partnerCount, bothCount);

    if (bothCount === max && bothCount > 0) {
      return "Looks like you both are perfectly in sync 💖";
    } else if (partnerCount === max) {
      return `Aww, seems like ${yourName} really admires ${partnerName} a lot ❤️`;
    } else if (meCount === max) {
      return `Someone's feeling pretty confident here 😏`;
    }
    return "You two are amazing together! 💕";
  };

  const personalizeMessage = () => {
    return ROMANTIC_MESSAGE.replace("[Partner Name]", partnerName);
  };

  if (screen === "start") {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="start-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden"
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>

          <div className="w-full max-w-md relative z-10">
            <motion.div
              className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl p-8 space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
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

              <motion.button
                onClick={handleStart}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-full bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg drop-shadow-lg"
              >
                Start Game
              </motion.button>

              <p className="text-center text-sm text-white/80 drop-shadow-md">
                Answer {QUESTIONS.length} fun questions together 🎮
              </p>
            </motion.div>
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
            @keyframes pop {
              0% { transform: scale(0.8); opacity: 0; }
              50% { transform: scale(1.1); }
              100% { transform: scale(1); opacity: 1; }
            }
            .animate-blob { animation: blob 7s infinite; }
            .animation-delay-2000 { animation-delay: 2s; }
            .animation-delay-4000 { animation-delay: 4s; }
            .animate-fade-in { animation: fade-in 0.6s ease-out; }
            .animate-pop { animation: pop 0.4s ease-out; }
          `}</style>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (screen === "game") {
    const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="game-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-900 flex flex-col items-center justify-center p-4 relative overflow-hidden"
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>

          <div className="w-full max-w-2xl relative z-10">
            <motion.div
              className="mb-8 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-white drop-shadow-md">
                  Question {currentQuestion + 1}/{QUESTIONS.length}
                </span>
                <span className="text-sm font-semibold text-white/80 drop-shadow-md italic">
                  {getProgressMessage()}
                </span>
                <span className="text-sm font-semibold text-white drop-shadow-md">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden border border-white/20">
                <motion.div
                  className="h-full bg-gradient-to-r from-pink-400 to-purple-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                ></motion.div>
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl p-8 space-y-8"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.4 }}
              >
                <div className="text-center">
                  <h2 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg leading-tight">
                    {QUESTIONS[currentQuestion]}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.button
                    onClick={() => handleAnswer("me")}
                    disabled={selectedAnswer !== null}
                    whileHover={selectedAnswer === null ? { scale: 1.05 } : {}}
                    whileTap={selectedAnswer === null ? { scale: 0.95 } : {}}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`group p-8 rounded-2xl border-2 transition-all duration-300 ${
                      selectedAnswer === null
                        ? "bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/40 cursor-pointer"
                        : selectedAnswer === "me"
                        ? "bg-pink-400/30 border-pink-400 shadow-lg shadow-pink-400/50"
                        : "bg-white/5 border-white/10 opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">
                      😎
                    </div>
                    <div className="font-bold text-lg text-white drop-shadow-md">
                      Me
                    </div>
                    <div className="text-sm text-white/80 drop-shadow-md mt-1">
                      {yourName}
                    </div>
                  </motion.button>

                  <motion.button
                    onClick={() => handleAnswer("both")}
                    disabled={selectedAnswer !== null}
                    whileHover={selectedAnswer === null ? { scale: 1.05 } : {}}
                    whileTap={selectedAnswer === null ? { scale: 0.95 } : {}}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`group p-8 rounded-2xl border-2 transition-all duration-300 ${
                      selectedAnswer === null
                        ? "bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/40 cursor-pointer"
                        : selectedAnswer === "both"
                        ? "bg-teal-400/30 border-teal-400 shadow-lg shadow-teal-400/50"
                        : "bg-white/5 border-white/10 opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">
                      🤝
                    </div>
                    <div className="font-bold text-lg text-white drop-shadow-md">
                      Both
                    </div>
                    <div className="text-sm text-white/80 drop-shadow-md mt-1">
                      Equal
                    </div>
                  </motion.button>

                  <motion.button
                    onClick={() => handleAnswer("partner")}
                    disabled={selectedAnswer !== null}
                    whileHover={selectedAnswer === null ? { scale: 1.05 } : {}}
                    whileTap={selectedAnswer === null ? { scale: 0.95 } : {}}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`group p-8 rounded-2xl border-2 transition-all duration-300 ${
                      selectedAnswer === null
                        ? "bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/40 cursor-pointer"
                        : selectedAnswer === "partner"
                        ? "bg-purple-400/30 border-purple-400 shadow-lg shadow-purple-400/50"
                        : "bg-white/5 border-white/10 opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">
                      ❤️
                    </div>
                    <div className="font-bold text-lg text-white drop-shadow-md">
                      Partner
                    </div>
                    <div className="text-sm text-white/80 drop-shadow-md mt-1">
                      {partnerName}
                    </div>
                  </motion.button>
                </div>

                <AnimatePresence>
                  {showFeedback && (
                    <motion.div
                      className="text-center text-xl text-white/90 drop-shadow-lg font-semibold"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      ✨ Great choice! ✨
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>
          </div>

          <style>{`
            @keyframes blob {
              0%, 100% { transform: translate(0, 0) scale(1); }
              33% { transform: translate(30px, -50px) scale(1.1); }
              66% { transform: translate(-20px, 20px) scale(0.9); }
            }
            .animate-blob { animation: blob 7s infinite; }
            .animation-delay-2000 { animation-delay: 2s; }
            .animation-delay-4000 { animation-delay: 4s; }
          `}</style>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (screen === "results") {
    const meCount = countAnswers("me");
    const partnerCount = countAnswers("partner");
    const bothCount = countAnswers("both");
    const coupleDisplay =
      yourName && partnerName ? `${yourName} ❤️ ${partnerName}` : "Couple 💖";

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="results-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-900 flex flex-col items-center justify-center p-4 relative overflow-hidden py-20"
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>

          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-pink-300 text-2xl"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-10px`,
                }}
                animate={{
                  y: [-20, -100],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
              >
                💕
              </motion.div>
            ))}
          </div>

          <div className="w-full max-w-3xl relative z-10 space-y-6">
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg mb-2">
                {coupleDisplay}'s Results 💖
              </h1>
              <p className="text-2xl text-white/90 drop-shadow-md font-semibold">
                {getResultMessage(meCount, partnerCount, bothCount)}
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 text-center hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
                <div className="text-5xl mb-3">😎</div>
                <div className="font-bold text-4xl text-pink-300 drop-shadow-md mb-2">
                  {meCount}
                </div>
                <div className="text-white/80 font-semibold drop-shadow-md">
                  You
                </div>
                <div className="text-sm text-white/70 drop-shadow-md">
                  ({yourName})
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 text-center hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
                <div className="text-5xl mb-3">🤝</div>
                <div className="font-bold text-4xl text-teal-300 drop-shadow-md mb-2">
                  {bothCount}
                </div>
                <div className="text-white/80 font-semibold drop-shadow-md">
                  Both
                </div>
                <div className="text-sm text-white/70 drop-shadow-md">
                  Equally
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 text-center hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
                <div className="text-5xl mb-3">❤️</div>
                <div className="font-bold text-4xl text-purple-300 drop-shadow-md mb-2">
                  {partnerCount}
                </div>
                <div className="text-white/80 font-semibold drop-shadow-md">
                  Partner
                </div>
                <div className="text-sm text-white/70 drop-shadow-md">
                  ({partnerName})
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 space-y-3 max-h-96 overflow-y-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
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
                      <p className="font-semibold text-white drop-shadow-md text-sm md:text-base">
                        {index + 1}. {answer.question}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4 whitespace-nowrap">
                      <span className="text-3xl">{EMOJIS[answer.answer]}</span>
                      <span className="font-bold text-white/90 drop-shadow-md text-sm">
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
            </motion.div>

            <motion.div
              className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="text-white/90 drop-shadow-md leading-relaxed text-center whitespace-pre-wrap font-light text-sm md:text-base">
                {personalizeMessage()}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <motion.button
                onClick={handleRestart}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-full bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white font-bold py-4 rounded-xl shadow-lg drop-shadow-lg"
              >
                Play Again 🔁
              </motion.button>
            </motion.div>
          </div>

          <style>{`
            @keyframes blob {
              0%, 100% { transform: translate(0, 0) scale(1); }
              33% { transform: translate(30px, -50px) scale(1.1); }
              66% { transform: translate(-20px, 20px) scale(0.9); }
            }
            .animate-blob { animation: blob 7s infinite; }
            .animation-delay-2000 { animation-delay: 2s; }
            .animation-delay-4000 { animation-delay: 4s; }
          `}</style>
        </motion.div>
      </AnimatePresence>
    );
  }
}
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  "Who texts first?",
  "Who calls more?",
  "Who is more obsessed?",
  "Who is more romantic?",
  "Who gets angry faster?",
  "Who takes longer to calm down?",
  "Who is more protective?",
  "Who is more clingy?",
  "Who is more funny?",
  "Who spends more money?",
  "Who plans dates better?",
  "Who would survive a zombie apocalypse?",
  "Who is more lazy?",
  "Who is more hardworking?",
  "Who loves cuddles more?",
  "Who gives better surprises?",
  "Who is more cute?",
];

const TERMS_OF_ENDEARMENT = [
  "Bubu",
  "Dudu",
  "Kuchu Puchu",
  "Sweetheart",
  "Baby",
  "My Love",
  "Honey",
  "Darling",
  "Cutie Pie",
  "My Heart",
  "Angel",
  "Lovebug",
  "Snugglebug",
  "Muffin",
  "Boo",
];

const ROMANTIC_MESSAGE = `No matter what these answers say, one thing will never change — you mean everything to me. 💖

From the smallest smiles to the biggest moments, every memory feels special because it has you in it. The way you laugh, the way you look at me, the way you hold my hand — all of it makes my heart skip a beat.

You're not just someone I love — you're someone I feel safe with, someone who makes everything lighter, happier, and more meaningful. You've become a part of my everyday thoughts, my comfort, and my peace.

Even on the days when things are messy or imperfect, my heart still finds its way back to you without hesitation. You're my person, my favorite person, and my home.

This game might just be fun and games… but what we have is something real, something rare, something that doesn't need these questions to prove it. Because deep down, I already know — you're the one I choose, every single day, in every single way.

I'm always on your side. Always yours. Always. 💕

Yours forever,
Your [Partner Name] 🌹`;

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
  const [selectedAnswer, setSelectedAnswer] = useState<
    "me" | "partner" | "both" | null
  >(null);
  const [fadeIn, setFadeIn] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);

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
    setShowFeedback(true);

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
        setShowFeedback(false);
        setTimeout(() => {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedAnswer(null);
          setFadeIn(true);
        }, 300);
      } else {
        setScreen("results");
        setFadeIn(true);
        setShowFeedback(false);
      }
    }, 500);
  };

  const handleRestart = () => {
    setScreen("start");
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setFadeIn(true);
    setShowFeedback(false);
  };

  const countAnswers = (value: "me" | "partner" | "both") => {
    return answers.filter((a) => a.answer === value).length;
  };

  const getProgressMessage = () => {
    const percentage = (currentQuestion / QUESTIONS.length) * 100;
    if (percentage < 25) return "This is getting interesting 👀";
    if (percentage < 50) return "You're doing great 😏";
    if (percentage < 75) return "Almost there 💖";
    return "Final stretch, love! 💕";
  };

  const getResultMessage = (
    meCount: number,
    partnerCount: number,
    bothCount: number
  ) => {
    const max = Math.max(meCount, partnerCount, bothCount);

    if (bothCount === max && bothCount > 0) {
      return "Looks like you both are perfectly in sync 💖";
    } else if (partnerCount === max) {
      return `Aww, seems like ${yourName} really admires ${partnerName} a lot ❤️`;
    } else if (meCount === max) {
      return `Someone's feeling pretty confident here 😏`;
    }
    return "You two are amazing together! 💕";
  };

  const personalizeMessage = () => {
    return ROMANTIC_MESSAGE.replace("[Partner Name]", partnerName);
  };

  if (screen === "start") {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="start-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden"
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>

          <div className="w-full max-w-md relative z-10">
            <motion.div
              className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl p-8 space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
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

              <motion.button
                onClick={handleStart}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-full bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg drop-shadow-lg"
              >
                Start Game
              </motion.button>

              <p className="text-center text-sm text-white/80 drop-shadow-md">
                Answer {QUESTIONS.length} fun questions together 🎮
              </p>
            </motion.div>
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
            @keyframes pop {
              0% { transform: scale(0.8); opacity: 0; }
              50% { transform: scale(1.1); }
              100% { transform: scale(1); opacity: 1; }
            }
            .animate-blob { animation: blob 7s infinite; }
            .animation-delay-2000 { animation-delay: 2s; }
            .animation-delay-4000 { animation-delay: 4s; }
            .animate-fade-in { animation: fade-in 0.6s ease-out; }
            .animate-pop { animation: pop 0.4s ease-out; }
          `}</style>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (screen === "game") {
    const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="game-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-900 flex flex-col items-center justify-center p-4 relative overflow-hidden"
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>

          <div className="w-full max-w-2xl relative z-10">
            <motion.div
              className="mb-8 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-white drop-shadow-md">
                  Question {currentQuestion + 1}/{QUESTIONS.length}
                </span>
                <span className="text-sm font-semibold text-white/80 drop-shadow-md italic">
                  {getProgressMessage()}
                </span>
                <span className="text-sm font-semibold text-white drop-shadow-md">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden border border-white/20">
                <motion.div
                  className="h-full bg-gradient-to-r from-pink-400 to-purple-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                ></motion.div>
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl p-8 space-y-8"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.4 }}
              >
                <div className="text-center">
                  <h2 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg leading-tight">
                    {QUESTIONS[currentQuestion]}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.button
                    onClick={() => handleAnswer("me")}
                    disabled={selectedAnswer !== null}
                    whileHover={selectedAnswer === null ? { scale: 1.05 } : {}}
                    whileTap={selectedAnswer === null ? { scale: 0.95 } : {}}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`group p-8 rounded-2xl border-2 transition-all duration-300 ${
                      selectedAnswer === null
                        ? "bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/40 cursor-pointer"
                        : selectedAnswer === "me"
                        ? "bg-pink-400/30 border-pink-400 shadow-lg shadow-pink-400/50"
                        : "bg-white/5 border-white/10 opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">
                      😎
                    </div>
                    <div className="font-bold text-lg text-white drop-shadow-md">
                      Me
                    </div>
                    <div className="text-sm text-white/80 drop-shadow-md mt-1">
                      {yourName}
                    </div>
                  </motion.button>

                  <motion.button
                    onClick={() => handleAnswer("both")}
                    disabled={selectedAnswer !== null}
                    whileHover={selectedAnswer === null ? { scale: 1.05 } : {}}
                    whileTap={selectedAnswer === null ? { scale: 0.95 } : {}}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`group p-8 rounded-2xl border-2 transition-all duration-300 ${
                      selectedAnswer === null
                        ? "bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/40 cursor-pointer"
                        : selectedAnswer === "both"
                        ? "bg-teal-400/30 border-teal-400 shadow-lg shadow-teal-400/50"
                        : "bg-white/5 border-white/10 opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">
                      🤝
                    </div>
                    <div className="font-bold text-lg text-white drop-shadow-md">
                      Both
                    </div>
                    <div className="text-sm text-white/80 drop-shadow-md mt-1">
                      Equal
                    </div>
                  </motion.button>

                  <motion.button
                    onClick={() => handleAnswer("partner")}
                    disabled={selectedAnswer !== null}
                    whileHover={selectedAnswer === null ? { scale: 1.05 } : {}}
                    whileTap={selectedAnswer === null ? { scale: 0.95 } : {}}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`group p-8 rounded-2xl border-2 transition-all duration-300 ${
                      selectedAnswer === null
                        ? "bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/40 cursor-pointer"
                        : selectedAnswer === "partner"
                        ? "bg-purple-400/30 border-purple-400 shadow-lg shadow-purple-400/50"
                        : "bg-white/5 border-white/10 opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">
                      ❤️
                    </div>
                    <div className="font-bold text-lg text-white drop-shadow-md">
                      Partner
                    </div>
                    <div className="text-sm text-white/80 drop-shadow-md mt-1">
                      {partnerName}
                    </div>
                  </motion.button>
                </div>

                <AnimatePresence>
                  {showFeedback && (
                    <motion.div
                      className="text-center text-xl text-white/90 drop-shadow-lg font-semibold"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      ✨ Great choice! ✨
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>
          </div>

          <style>{`
            @keyframes blob {
              0%, 100% { transform: translate(0, 0) scale(1); }
              33% { transform: translate(30px, -50px) scale(1.1); }
              66% { transform: translate(-20px, 20px) scale(0.9); }
            }
            .animate-blob { animation: blob 7s infinite; }
            .animation-delay-2000 { animation-delay: 2s; }
            .animation-delay-4000 { animation-delay: 4s; }
          `}</style>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (screen === "results") {
    const meCount = countAnswers("me");
    const partnerCount = countAnswers("partner");
    const bothCount = countAnswers("both");
    const coupleDisplay =
      yourName && partnerName ? `${yourName} ❤️ ${partnerName}` : "Couple 💖";

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="results-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-900 flex flex-col items-center justify-center p-4 relative overflow-hidden py-20"
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>

          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-pink-300 text-2xl"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-10px`,
                }}
                animate={{
                  y: [-20, -100],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
              >
                💕
              </motion.div>
            ))}
          </div>

          <div className="w-full max-w-3xl relative z-10 space-y-6">
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg mb-2">
                {coupleDisplay}'s Results 💖
              </h1>
              <p className="text-2xl text-white/90 drop-shadow-md font-semibold">
                {getResultMessage(meCount, partnerCount, bothCount)}
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 text-center hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
                <div className="text-5xl mb-3">😎</div>
                <div className="font-bold text-4xl text-pink-300 drop-shadow-md mb-2">
                  {meCount}
                </div>
                <div className="text-white/80 font-semibold drop-shadow-md">
                  You
                </div>
                <div className="text-sm text-white/70 drop-shadow-md">
                  ({yourName})
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 text-center hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
                <div className="text-5xl mb-3">🤝</div>
                <div className="font-bold text-4xl text-teal-300 drop-shadow-md mb-2">
                  {bothCount}
                </div>
                <div className="text-white/80 font-semibold drop-shadow-md">
                  Both
                </div>
                <div className="text-sm text-white/70 drop-shadow-md">
                  Equally
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 text-center hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
                <div className="text-5xl mb-3">❤️</div>
                <div className="font-bold text-4xl text-purple-300 drop-shadow-md mb-2">
                  {partnerCount}
                </div>
                <div className="text-white/80 font-semibold drop-shadow-md">
                  Partner
                </div>
                <div className="text-sm text-white/70 drop-shadow-md">
                  ({partnerName})
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 space-y-3 max-h-96 overflow-y-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
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
                      <p className="font-semibold text-white drop-shadow-md text-sm md:text-base">
                        {index + 1}. {answer.question}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4 whitespace-nowrap">
                      <span className="text-3xl">{EMOJIS[answer.answer]}</span>
                      <span className="font-bold text-white/90 drop-shadow-md text-sm">
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
            </motion.div>

            <motion.div
              className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="text-white/90 drop-shadow-md leading-relaxed text-center whitespace-pre-wrap font-light text-sm md:text-base">
                {personalizeMessage()}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <motion.button
                onClick={handleRestart}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-full bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white font-bold py-4 rounded-xl shadow-lg drop-shadow-lg"
              >
                Play Again 🔁
              </motion.button>
            </motion.div>
          </div>

          <style>{`
            @keyframes blob {
              0%, 100% { transform: translate(0, 0) scale(1); }
              33% { transform: translate(30px, -50px) scale(1.1); }
              66% { transform: translate(-20px, 20px) scale(0.9); }
            }
            .animate-blob { animation: blob 7s infinite; }
            .animation-delay-2000 { animation-delay: 2s; }
            .animation-delay-4000 { animation-delay: 4s; }
          `}</style>
        </motion.div>
      </AnimatePresence>
    );
  }
}
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
  "Who texts first?",
  "Who calls more?",
  "Who is more obsessed?",
  "Who is more romantic?",
  "Who gets angry faster?",
  "Who takes longer to calm down?",
  "Who is more protective?",
  "Who is more clingy?",
  "Who is more funny?",
  "Who spends more money?",
  "Who plans dates better?",
  "Who would survive a zombie apocalypse?",
  "Who is more lazy?",
  "Who is more hardworking?",
  "Who loves cuddles more?",
  "Who gives better surprises?",
  "Who is more cute?",
];

const TERMS_OF_ENDEARMENT = [
  "Bubu",
  "Dudu",
  "Kuchu Puchu",
  "Sweetheart",
  "Baby",
  "My Love",
  "Honey",
  "Darling",
  "Cutie Pie",
  "My Heart",
  "Angel",
  "Lovebug",
  "Snugglebug",
  "Muffin",
  "Boo",
];

const ROMANTIC_MESSAGE = `No matter what these answers say, one thing will never change — you mean everything to me. 💖

From the smallest smiles to the biggest moments, every memory feels special because it has you in it. The way you laugh, the way you look at me, the way you hold my hand — all of it makes my heart skip a beat.

You're not just someone I love — you're someone I feel safe with, someone who makes everything lighter, happier, and more meaningful. You've become a part of my everyday thoughts, my comfort, and my peace.

Even on the days when things are messy or imperfect, my heart still finds its way back to you without hesitation. You're my person, my favorite person, and my home.

This game might just be fun and games… but what we have is something real, something rare, something that doesn't need these questions to prove it. Because deep down, I already know — you're the one I choose, every single day, in every single way.

I'm always on your side. Always yours. Always. 💕

Yours forever,
Your [Partner Name] 🌹`;

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
  const [selectedAnswer, setSelectedAnswer] = useState<
    "me" | "partner" | "both" | null
  >(null);
  const [fadeIn, setFadeIn] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);

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
    setShowFeedback(true);

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
        setShowFeedback(false);
        setTimeout(() => {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedAnswer(null);
          setFadeIn(true);
        }, 300);
      } else {
        setScreen("results");
        setFadeIn(true);
        setShowFeedback(false);
      }
    }, 800);
  };

  const handleRestart = () => {
    setScreen("start");
    setYourName("");
    setPartnerName("");
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setFadeIn(true);
    setShowFeedback(false);
  };

  const countAnswers = (value: "me" | "partner" | "both") => {
    return answers.filter((a) => a.answer === value).length;
  };

  const getProgressMessage = () => {
    const percentage = (currentQuestion / QUESTIONS.length) * 100;
    if (percentage < 25) return "This is getting interesting 👀";
    if (percentage < 50) return "You're doing great 😏";
    if (percentage < 75) return "Almost there 💖";
    return "Final stretch, love! 💕";
  };

  const getResultMessage = (
    meCount: number,
    partnerCount: number,
    bothCount: number
  ) => {
    const max = Math.max(meCount, partnerCount, bothCount);

    if (bothCount === max && bothCount > 0) {
      return "Looks like you both are perfectly in sync 💖";
    } else if (partnerCount === max) {
      return `Aww, seems like ${yourName} really admires ${partnerName} a lot ❤️`;
    } else if (meCount === max) {
      return `Someone's feeling pretty confident here 😏`;
    }
    return "You two are amazing together! 💕";
  };

  const personalizeMessage = () => {
    return ROMANTIC_MESSAGE.replace("[Partner Name]", partnerName);
  };

  if (screen === "start") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
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
              Answer {QUESTIONS.length} fun questions together 🎮
            </p>
          </motion.div>
        </div>

        <style>{`
          @keyframes blob {
            0%,
            100% {
              transform: translate(0, 0) scale(1);
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
          }
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes pop {
            0% {
              transform: scale(0.8);
              opacity: 0;
            }
            50% {
              transform: scale(1.1);
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
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
          .animate-pop {
            animation: pop 0.4s ease-out;
          }
        `}</style>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (screen === "game") {
    const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="w-full max-w-2xl relative z-10">
          <div className="mb-8 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 space-y-4 animate-fade-in">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-white drop-shadow-md">
                Question {currentQuestion + 1}/{QUESTIONS.length}
              </span>
              <span className="text-sm font-semibold text-white/80 drop-shadow-md italic">
                {getProgressMessage()}
              </span>
              <span className="text-sm font-semibold text-white drop-shadow-md">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden border border-white/20">
              <motion.div
                className="h-full bg-gradient-to-r from-pink-400 to-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              ></motion.div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl p-8 space-y-8"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.4 }}
            >
            <div className="text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg leading-tight">
                {QUESTIONS[currentQuestion]}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.button
                onClick={() => handleAnswer("me")}
                disabled={selectedAnswer !== null}
                whileHover={selectedAnswer === null ? { scale: 1.05 } : {}}
                whileTap={selectedAnswer === null ? { scale: 0.95 } : {}}
                transition={{ type: "spring", stiffness: 300 }}
                className={`group p-8 rounded-2xl border-2 transition-all duration-300 ${
                  selectedAnswer === null
                    ? "bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/40 cursor-pointer"
                    : selectedAnswer === "me"
                    ? "bg-pink-400/30 border-pink-400 shadow-lg shadow-pink-400/50"
                    : "bg-white/5 border-white/10 opacity-50 cursor-not-allowed"
                }`}
              >
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  😎
                </div>
                <div className="font-bold text-lg text-white drop-shadow-md">
                  Me
                </div>
                <div className="text-sm text-white/80 drop-shadow-md mt-1">
                  {yourName}
                </div>
              </motion.button>

              <motion.button
                onClick={() => handleAnswer("both")}
                disabled={selectedAnswer !== null}
                whileHover={selectedAnswer === null ? { scale: 1.05 } : {}}
                whileTap={selectedAnswer === null ? { scale: 0.95 } : {}}
                transition={{ type: "spring", stiffness: 300 }}
                className={`group p-8 rounded-2xl border-2 transition-all duration-300 ${
                  selectedAnswer === null
                    ? "bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/40 cursor-pointer"
                    : selectedAnswer === "both"
                    ? "bg-teal-400/30 border-teal-400 shadow-lg shadow-teal-400/50"
                    : "bg-white/5 border-white/10 opacity-50 cursor-not-allowed"
                }`}
              >
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  🤝
                </div>
                <div className="font-bold text-lg text-white drop-shadow-md">
                  Both
                </div>
                <div className="text-sm text-white/80 drop-shadow-md mt-1">
                  Equal
                </div>
              </motion.button>

              <motion.button
                onClick={() => handleAnswer("partner")}
                disabled={selectedAnswer !== null}
                whileHover={selectedAnswer === null ? { scale: 1.05 } : {}}
                whileTap={selectedAnswer === null ? { scale: 0.95 } : {}}
                transition={{ type: "spring", stiffness: 300 }}
                className={`group p-8 rounded-2xl border-2 transition-all duration-300 ${
                  selectedAnswer === null
                    ? "bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/40 cursor-pointer"
                    : selectedAnswer === "partner"
                    ? "bg-purple-400/30 border-purple-400 shadow-lg shadow-purple-400/50"
                    : "bg-white/5 border-white/10 opacity-50 cursor-not-allowed"
                }`}
              >
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  ❤️
                </div>
                <div className="font-bold text-lg text-white drop-shadow-md">
                  Partner
                </div>
                <div className="text-sm text-white/80 drop-shadow-md mt-1">
                  {partnerName}
                </div>
              </motion.button>
            </div>

            <AnimatePresence>
              {showFeedback && (
                <motion.div
                  className="text-center text-xl text-white/90 drop-shadow-lg font-semibold"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  ✨ Great choice! ✨
                </motion.div>
              )}
            </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </div>

        <style>{`
          @keyframes blob {
            0%,
            100% {
              transform: translate(0, 0) scale(1);
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
          }
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes pop {
            0% {
              transform: scale(0.8);
              opacity: 0;
            }
            50% {
              transform: scale(1.1);
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
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
          .animate-pop {
            animation: pop 0.4s ease-out;
          }
        `}</style>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (screen === "results") {
    const meCount = countAnswers("me");
    const partnerCount = countAnswers("partner");
    const bothCount = countAnswers("both");

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-900 flex flex-col items-center justify-center p-4 relative overflow-hidden py-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-pink-300 text-2xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10px`,
              }}
              animate={{
                y: [-20, -100],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            >
              💕
            </motion.div>
          ))}
        </div>

        <div className="w-full max-w-3xl relative z-10 space-y-6">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg mb-2">
              {coupleDisplay}'s Results 💖
            </h1>
            <p className="text-2xl text-white/90 drop-shadow-md font-semibold">
              {getResultMessage(meCount, partnerCount, bothCount)}
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 text-center hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
              <div className="text-5xl mb-3">😎</div>
              <div className="font-bold text-4xl text-pink-300 drop-shadow-md mb-2">
                {meCount}
              </div>
              <div className="text-white/80 font-semibold drop-shadow-md">
                You
              </div>
              <div className="text-sm text-white/70 drop-shadow-md">
                ({yourName})
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 text-center hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
              <div className="text-5xl mb-3">🤝</div>
              <div className="font-bold text-4xl text-teal-300 drop-shadow-md mb-2">
                {bothCount}
              </div>
              <div className="text-white/80 font-semibold drop-shadow-md">
                Both
              </div>
              <div className="text-sm text-white/70 drop-shadow-md">
                Equally
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 text-center hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
              <div className="text-5xl mb-3">❤️</div>
              <div className="font-bold text-4xl text-purple-300 drop-shadow-md mb-2">
                {partnerCount}
              </div>
              <div className="text-white/80 font-semibold drop-shadow-md">
                Partner
              </div>
              <div className="text-sm text-white/70 drop-shadow-md">
                ({partnerName})
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 space-y-3 max-h-96 overflow-y-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
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
                    <p className="font-semibold text-white drop-shadow-md text-sm md:text-base">
                      {index + 1}. {answer.question}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4 whitespace-nowrap">
                    <span className="text-3xl">{EMOJIS[answer.answer]}</span>
                    <span className="font-bold text-white/90 drop-shadow-md text-sm">
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
          </motion.div>

          <motion.div
            className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="text-white/90 drop-shadow-md leading-relaxed text-center whitespace-pre-wrap font-light text-sm md:text-base">
              {personalizeMessage()}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <motion.button
              onClick={handleRestart}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="w-full bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white font-bold py-4 rounded-xl shadow-lg drop-shadow-lg"
            >
              Play Again 🔁
            </motion.button>
          </motion.div>
        </div>

        <style>{`
          @keyframes blob {
            0%,
            100% {
              transform: translate(0, 0) scale(1);
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
          }
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes pop {
            0% {
              transform: scale(0.8);
              opacity: 0;
            }
            50% {
              transform: scale(1.1);
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
          @keyframes float {
            0% {
              transform: translateY(0px);
              opacity: 0;
            }
            10% {
              opacity: 0.3;
            }
            90% {
              opacity: 0.3;
            }
            100% {
              transform: translateY(100vh);
              opacity: 0;
            }
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
          .animate-pop {
            animation: pop 0.4s ease-out;
          }
          .animate-float {
            opacity: 0.3;
          }
        `}</style>
        </motion.div>
      </AnimatePresence>
    );
  }
}
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
  "Who texts first?",
  "Who calls more?",
  "Who is more obsessed?",
  "Who is more romantic?",
  "Who gets angry faster?",
  "Who takes longer to calm down?",
  "Who is more protective?",
  "Who is more clingy?",
  "Who is more funny?",
  "Who spends more money?",
  "Who plans dates better?",
  "Who would survive a zombie apocalypse?",
  "Who is more lazy?",
  "Who is more hardworking?",
  "Who loves cuddles more?",
  "Who gives better surprises?",
  "Who is more cute?",
];

const TERMS_OF_ENDEARMENT = [
  "Bubu", "Dudu", "Kuchu Puchu", "Sweetheart", "Baby", "My Love", "Honey", "Darling", "Cutie Pie", "My Heart", "Angel", "Lovebug", "Snugglebug", "Muffin", "Boo",
];

const ROMANTIC_MESSAGE = \No matter what these answers say, one thing will never change � you mean everything to me. ??

From the smallest smiles to the biggest moments, every memory feels special because it has you in it. The way you laugh, the way you look at me, the way you hold my hand � all of it makes my heart skip a beat.

You're not just someone I love � you're someone I feel safe with, someone who makes everything lighter, happier, and more meaningful. You've become a part of my everyday thoughts, my comfort, and my peace.

Even on the days when things are messy or imperfect, my heart still finds its way back to you without hesitation. You're my person, my favorite person, and my home.

This game might just be fun and games� but what we have is something real, something rare, something that doesn't need these questions to prove it. Because deep down, I already know � you're the one I choose, every single day, in every single way.

I'm always on your side. Always yours. Always. ??

Yours forever,
Your [Partner Name] ??\;

const EMOJIS = {
  me: "??",
  partner: "??",
  both: "??",
};

export default function Home() {
  const [screen, setScreen] = useState<"start" | "game" | "results">("start");
  const [yourName, setYourName] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<"me" | "partner" | "both" | null>(null);
  const [fadeIn, setFadeIn] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);

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
    setShowFeedback(true);
    
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
        setShowFeedback(false);
        setTimeout(() => {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedAnswer(null);
          setFadeIn(true);
        }, 300);
      } else {
        setScreen("results");
        setFadeIn(true);
        setShowFeedback(false);
      }
    }, 800);
  };

  const handleRestart = () => {
    setScreen("start");
    setYourName("");
    setPartnerName("");
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setFadeIn(true);
    setShowFeedback(false);
  };

  const countAnswers = (value: "me" | "partner" | "both") => {
    return answers.filter((a) => a.answer === value).length;
  };

  const getProgressMessage = () => {
    const percentage = (currentQuestion / QUESTIONS.length) * 100;
    if (percentage < 25) return "This is getting interesting ??";
    if (percentage < 50) return "You're doing great ??";
    if (percentage < 75) return "Almost there ??";
    return "Final stretch, love! ??";
  };

  const getResultMessage = (meCount: number, partnerCount: number, bothCount: number) => {
    const max = Math.max(meCount, partnerCount, bothCount);
    
    if (bothCount === max && bothCount > 0) {
      return "Looks like you both are perfectly in sync ??";
    } else if (partnerCount === max) {
      return \Aww, seems like \ really admires \ a lot ??\;
    } else if (meCount === max) {
      return \Someone's feeling pretty confident here ??\;
    }
    return "You two are amazing together! ??";
  };

  const personalizeMessage = () => {
    const terms = TERMS_OF_ENDEARMENT;
    const randomTerm1 = terms[Math.floor(Math.random() * terms.length)];
    const randomTerm2 = terms[Math.floor(Math.random() * terms.length)];
    const randomTerm3 = terms[Math.floor(Math.random() * terms.length)];
    
    return ROMANTIC_MESSAGE
      .replace("[Partner Name]", partnerName)
      .replace(new RegExp("Bubu", "g"), randomTerm1)
      .replace(new RegExp("Dudu", "g"), randomTerm2)
      .replace(new RegExp("Kuchu Puchu", "g"), randomTerm3);
  };

  if (screen === "start") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl p-8 space-y-6 animate-fade-in">
            <div className="text-center space-y-4">
              <h1 className="text-6xl font-bold mb-2">??</h1>
              <h1 className="text-5xl font-bold text-white drop-shadow-lg">Couple Game</h1>
              <p className="text-white/90 text-lg drop-shadow-md">Let's see how well you know each other ??</p>
            </div>

            <div className="space-y-4 pt-4">
              <div className="group">
                <label className="block text-sm font-semibold text-white/90 mb-2 drop-shadow-md">Your Name</label>
                <input type="text" value={yourName} onChange={(e) => setYourName(e.target.value)} onKeyPress={(e) => e.key === "Enter" && handleStart()} placeholder="Enter your name" className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 focus:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 placeholder-white/50 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/25" />
              </div>
              <div className="group">
                <label className="block text-sm font-semibold text-white/90 mb-2 drop-shadow-md">Partner Name</label>
                <input type="text" value={partnerName} onChange={(e) => setPartnerName(e.target.value)} onKeyPress={(e) => e.key === "Enter" && handleStart()} placeholder="Enter partner's name" className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 focus:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 placeholder-white/50 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/25" />
              </div>
            </div>

            <button onClick={handleStart} className="w-full bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 active:scale-95 drop-shadow-lg">Start Game</button>

            <p className="text-center text-sm text-white/80 drop-shadow-md">Answer {QUESTIONS.length} fun questions together ??</p>
          </div>
        </div>

        <style>{\
          @keyframes blob { 0%, 100% { transform: translate(0, 0) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } }
          @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes pop { 0% { transform: scale(0.8); opacity: 0; } 50% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }
          .animate-blob { animation: blob 7s infinite; }
          .animation-delay-2000 { animation-delay: 2s; }
          .animation-delay-4000 { animation-delay: 4s; }
          .animate-fade-in { animation: fade-in 0.6s ease-out; }
          .animate-pop { animation: pop 0.4s ease-out; }
        \}</style>
      </div>
    );
  }

  if (screen === "game") {
    const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="w-full max-w-2xl relative z-10">
          <div className="mb-8 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 space-y-4 animate-fade-in">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-white drop-shadow-md">Question {currentQuestion + 1}/{QUESTIONS.length}</span>
              <span className="text-sm font-semibold text-white/80 drop-shadow-md italic">{getProgressMessage()}</span>
              <span className="text-sm font-semibold text-white drop-shadow-md">{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden border border-white/20">
              <div className="h-full bg-gradient-to-r from-pink-400 to-purple-500 transition-all duration-500 ease-out rounded-full" style={{ width: \\%\ }}></div>
            </div>
          </div>

          <div className={\g-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl p-8 space-y-8 transition-all duration-300 \\}>
            <div className="text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg leading-tight">{QUESTIONS[currentQuestion]}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button onClick={() => handleAnswer("me")} disabled={selectedAnswer !== null} className={\group p-8 rounded-2xl border-2 transition-all duration-300 transform \\}>
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">??</div>
                <div className="font-bold text-lg text-white drop-shadow-md">Me</div>
                <div className="text-sm text-white/80 drop-shadow-md mt-1">{yourName}</div>
              </button>

              <button onClick={() => handleAnswer("both")} disabled={selectedAnswer !== null} className={\group p-8 rounded-2xl border-2 transition-all duration-300 transform \\}>
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">??</div>
                <div className="font-bold text-lg text-white drop-shadow-md">Both</div>
                <div className="text-sm text-white/80 drop-shadow-md mt-1">Equal</div>
              </button>

              <button onClick={() => handleAnswer("partner")} disabled={selectedAnswer !== null} className={\group p-8 rounded-2xl border-2 transition-all duration-300 transform \\}>
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">??</div>
                <div className="font-bold text-lg text-white drop-shadow-md">Partner</div>
                <div className="text-sm text-white/80 drop-shadow-md mt-1">{partnerName}</div>
              </button>
            </div>

            {showFeedback && <div className="text-center text-xl text-white/90 drop-shadow-lg font-semibold animate-pop">? Great choice! ?</div>}
          </div>
        </div>

        <style>{\
          @keyframes blob { 0%, 100% { transform: translate(0, 0) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } }
          @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes pop { 0% { transform: scale(0.8); opacity: 0; } 50% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }
          .animate-blob { animation: blob 7s infinite; }
          .animation-delay-2000 { animation-delay: 2s; }
          .animation-delay-4000 { animation-delay: 4s; }
          .animate-fade-in { animation: fade-in 0.6s ease-out; }
          .animate-pop { animation: pop 0.4s ease-out; }
        \}</style>
      </div>
    );
  }

  if (screen === "results") {
    const meCount = countAnswers("me");
    const partnerCount = countAnswers("partner");
    const bothCount = countAnswers("both");

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-900 flex flex-col items-center justify-center p-4 relative overflow-hidden py-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="absolute text-pink-300 opacity-30 animate-float" style={{ left: \\%\, top: \-10px\, animation: \loat \s ease-in infinite\, animationDelay: \\s\ }}>??</div>
          ))}
        </div>

        <div className="w-full max-w-3xl relative z-10 space-y-6">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg mb-4">Your Results ??</h1>
            <p className="text-2xl text-white/90 drop-shadow-md font-semibold">{getResultMessage(meCount, partnerCount, bothCount)}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 text-center hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
              <div className="text-5xl mb-3">??</div>
              <div className="font-bold text-4xl text-pink-300 drop-shadow-md mb-2">{meCount}</div>
              <div className="text-white/80 font-semibold drop-shadow-md">You</div>
              <div className="text-sm text-white/70 drop-shadow-md">({yourName})</div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 text-center hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
              <div className="text-5xl mb-3">??</div>
              <div className="font-bold text-4xl text-teal-300 drop-shadow-md mb-2">{bothCount}</div>
              <div className="text-white/80 font-semibold drop-shadow-md">Both</div>
              <div className="text-sm text-white/70 drop-shadow-md">Equally</div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 text-center hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
              <div className="text-5xl mb-3">??</div>
              <div className="font-bold text-4xl text-purple-300 drop-shadow-md mb-2">{partnerCount}</div>
              <div className="text-white/80 font-semibold drop-shadow-md">Partner</div>
              <div className="text-sm text-white/70 drop-shadow-md">({partnerName})</div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 space-y-3 animate-fade-in max-h-96 overflow-y-auto" style={{ animationDelay: "0.2s" }}>
            <h2 className="text-2xl font-bold text-white drop-shadow-md mb-4">Your Answers</h2>
            <div className="space-y-2">
              {answers.map((answer, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white/10 hover:bg-white/15 rounded-xl border border-white/20 transition-all duration-300">
                  <div className="flex-1">
                    <p className="font-semibold text-white drop-shadow-md text-sm md:text-base">{index + 1}. {answer.question}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4 whitespace-nowrap">
                    <span className="text-3xl">{EMOJIS[answer.answer]}</span>
                    <span className="font-bold text-white/90 drop-shadow-md text-sm">{answer.answer === "me" ? yourName : answer.answer === "partner" ? partnerName : "Both"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 space-y-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="text-white/90 drop-shadow-md leading-relaxed text-center whitespace-pre-wrap font-light text-sm md:text-base">{personalizeMessage()}</div>
          </div>

          <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <button onClick={handleRestart} className="w-full bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white font-bold py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 active:scale-95 drop-shadow-lg">Play Again ??</button>
          </div>
        </div>

        <style>{\
          @keyframes blob { 0%, 100% { transform: translate(0, 0) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } }
          @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes pop { 0% { transform: scale(0.8); opacity: 0; } 50% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }
          @keyframes float { 0% { transform: translateY(0px); opacity: 0; } 10% { opacity: 0.3; } 90% { opacity: 0.3; } 100% { transform: translateY(100vh); opacity: 0; } }
          .animate-blob { animation: blob 7s infinite; }
          .animation-delay-2000 { animation-delay: 2s; }
          .animation-delay-4000 { animation-delay: 4s; }
          .animate-fade-in { animation: fade-in 0.6s ease-out; }
          .animate-pop { animation: pop 0.4s ease-out; }
          .animate-float { opacity: 0.3; }
        \}</style>
      </div>
    );
  }
}