"use client";

import { useState, useEffect } from "react";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Player {
  name: string;
  answers: { [key: number]: string };
}

interface Room {
  players: { [key: string]: Player };
  questions: string[];
  createdAt: number;
}

export default function Game() {
  const [roomId, setRoomId] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [joined, setJoined] = useState(false);
  const [playerId] = useState(() => `player_${Date.now()}`);
  const [room, setRoom] = useState<Room | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const questions = [
    "What is your favorite food?",
    "What is your favorite movie?",
    "Where do you want to travel next?",
    "What is your favorite hobby?",
    "What is your dream job?",
  ];

  useEffect(() => {
    if (!joined || !roomId) return;

    const unsubscribe = onSnapshot(
      doc(collection(db, "rooms"), roomId),
      (snapshot) => {
        if (snapshot.exists()) {
          setRoom(snapshot.data() as Room);
        }
      },
      (error) => {
        console.error("Error listening to room:", error);
      }
    );

    return () => unsubscribe();
  }, [joined, roomId]);

  const handleJoinRoom = async () => {
    if (!roomId.trim() || !playerName.trim()) {
      alert("Please enter room ID and name");
      return;
    }

    setLoading(true);

    try {
      const roomRef = doc(collection(db, "rooms"), roomId);
      const roomSnap = await getDoc(roomRef);

      if (!roomSnap.exists()) {
        await setDoc(roomRef, {
          players: {
            [playerId]: {
              name: playerName,
              answers: {},
            },
          },
          questions: questions,
          createdAt: Date.now(),
        });
      } else {
        const existingPlayers = roomSnap.data().players || {};
        if (!existingPlayers[playerId]) {
          await updateDoc(roomRef, {
            [`players.${playerId}`]: {
              name: playerName,
              answers: {},
            },
          });
        }
      }

      setJoined(true);
    } catch (error) {
      console.error("Error joining room:", error);
      alert("Error joining room");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim()) {
      alert("Please enter an answer");
      return;
    }

    try {
      const roomRef = doc(collection(db, "rooms"), roomId);
      await updateDoc(roomRef, {
        [`players.${playerId}.answers.${currentQuestionIndex}`]: currentAnswer,
      });

      setCurrentAnswer("");

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      alert("Error submitting answer");
    }
  };

  if (!joined) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white rounded-lg shadow-lg p-8 w-96">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Game
          </h1>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleJoinRoom}
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 disabled:bg-gray-400"
            >
              {loading ? "Joining..." : "Join Room"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-lg text-gray-600">Loading room...</div>
      </div>
    );
  }

  const players = Object.entries(room.players);
  const currentQuestion = questions[currentQuestionIndex];
  const isAnswered = room.players[playerId]?.answers?.[currentQuestionIndex];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Game</h1>
          <p className="text-sm text-gray-600 mt-2">Room: {roomId}</p>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Players:</h3>
          <ul className="space-y-2">
            {players.map(([id, player]) => (
              <li key={id} className="flex items-center text-gray-800">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                {player.name}
                {id === playerId && " (You)"}
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t pt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Question {currentQuestionIndex + 1} of {questions.length}
          </h2>
          <p className="text-lg text-gray-700 mb-6">{currentQuestion}</p>

          {!isAnswered && (
            <div className="space-y-4 mb-6">
              <input
                type="text"
                placeholder="Enter your answer"
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSubmitAnswer}
                className="w-full px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600"
              >
                Submit Answer
              </button>
            </div>
          )}

          {isAnswered && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800">
                Your answer: {room.players[playerId].answers[currentQuestionIndex]}
              </p>
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-700 mb-3">
              Other Players' Answers:
            </h3>
            <ul className="space-y-2">
              {players
                .filter(([id]) => id !== playerId)
                .map(([id, player]) => (
                  <li key={id} className="text-gray-700">
                    <span className="font-semibold">{player.name}:</span>{" "}
                    {player.answers[currentQuestionIndex] || (
                      <span className="text-gray-400">Not answered yet</span>
                    )}
                  </li>
                ))}
            </ul>
          </div>

          <div className="flex gap-4">
            {currentQuestionIndex < questions.length - 1 && (
              <button
                onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600"
              >
                Next Question
              </button>
            )}

            {currentQuestionIndex === questions.length - 1 && isAnswered && (
              <div className="flex-1 text-center text-green-600 font-semibold py-2">
                All questions answered!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
