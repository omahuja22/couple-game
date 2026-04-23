"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { doc, onSnapshot, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { QUESTIONS } from "@/lib/constants";

interface RoomData {
  id: string;
  players: string[];
  currentQuestion: number;
  answers: { [key: string]: { [key: string]: string } };
  createdAt: number;
}

export default function RoomPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const roomId = params.id as string;
  const userName = searchParams.get("name") || "Guest";

  const [room, setRoom] = useState<RoomData | null>(null);
  const [loading, setLoading] = useState(true);
  const [joined, setJoined] = useState(false);
  const [answering, setAnswering] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  useEffect(() => {
    if (!roomId) return;

    const unsubscribe = onSnapshot(
      doc(db, "rooms", roomId),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          const roomData: RoomData = {
            id: snapshot.id,
            players: data.players || [],
            currentQuestion: data.currentQuestion ?? 0,
            answers: data.answers || {},
            createdAt: data.createdAt || Date.now(),
          };
          setRoom(roomData);

          if (roomData.players.includes(userName)) {
            setJoined(true);
          }

          if (roomData.currentQuestion >= QUESTIONS.length) {
            setGameCompleted(true);
          }
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching room:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [roomId, userName]);

  const handleJoinRoom = async () => {
    if (!room || joined) return;

    try {
      await updateDoc(doc(db, "rooms", roomId), {
        players: arrayUnion(userName),
      });
      setJoined(true);
    } catch (error) {
      console.error("Error joining room:", error);
      alert("Error joining room");
    }
  };

  const handleAnswer = async (answer: string) => {
    if (!room || answering) return;

    setAnswering(true);

    try {
      await updateDoc(doc(db, "rooms", roomId), {
        [`answers.${room.currentQuestion}.${userName}`]: answer,
      });
    } catch (error) {
      console.error("Error submitting answer:", error);
      alert("Error submitting answer");
    } finally {
      setAnswering(false);
    }
  };

  const handleNextQuestion = async () => {
    if (!room) return;

    try {
      await updateDoc(doc(db, "rooms", roomId), {
        currentQuestion: room.currentQuestion + 1,
      });
    } catch (error) {
      console.error("Error advancing to next question:", error);
      alert("Error advancing to next question");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-lg text-red-600">Room not found</div>
      </div>
    );
  }

  if (!joined) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white rounded-lg shadow-lg p-8 w-96">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Couple Game
          </h1>
          <div className="mb-6">
            <p className="text-sm text-gray-600">Room ID:</p>
            <p className="text-lg font-mono bg-gray-50 p-2 rounded mt-1">
              {roomId}
            </p>
          </div>
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-3">Players:</p>
            <ul className="space-y-2">
              {room.players.map((player, index) => (
                <li key={index} className="flex items-center text-gray-800">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  {player}
                </li>
              ))}
            </ul>
          </div>
          <button
            onClick={handleJoinRoom}
            className="w-full px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600"
          >
            Join Room
          </button>
        </div>
      </div>
    );
  }

  if (gameCompleted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white rounded-lg shadow-lg p-8 w-96 text-center">
          <h1 className="text-4xl font-bold text-green-600 mb-4">
            Game Completed 🎉
          </h1>
          <p className="text-gray-700 text-lg">
            You answered all {QUESTIONS.length} questions!
          </p>
        </div>
      </div>
    );
  }

  const currentQuestion = QUESTIONS[room.currentQuestion];
  const currentAnswers = room.answers?.[room.currentQuestion] || {};
  const userAnswered = currentAnswers?.[userName];
  const otherPlayers = room.players.filter((p) => p !== userName);
  const allAnswered = Object.keys(currentAnswers).length === room.players.length;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Couple Game</h1>
          <p className="text-sm text-gray-600 mt-2">
            Question {room.currentQuestion + 1} of {QUESTIONS.length}
          </p>
        </div>

        <div className="mb-8 pb-8 border-b">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {currentQuestion}
          </h2>

          {!userAnswered && (
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleAnswer("Me")}
                disabled={answering}
                className="px-6 py-4 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 disabled:bg-gray-400 text-xl"
              >
                Me
              </button>
              <button
                onClick={() => handleAnswer("You")}
                disabled={answering}
                className="px-6 py-4 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 disabled:bg-gray-400 text-xl"
              >
                You
              </button>
            </div>
          )}

          {userAnswered && !allAnswered && (
            <div className="text-center py-4">
              <p className="text-lg text-gray-700">
                Your answer: <span className="font-bold">{userAnswered}</span>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Waiting for {otherPlayers.join(", ")}...
              </p>
            </div>
          )}
        </div>

        {allAnswered && (
          <div className="mb-8 space-y-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Answers:</h3>
            {room.players.map((player) => (
              <div
                key={player}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4"
              >
                <p className="text-gray-700">
                  <span className="font-semibold">{player}</span> chose:{" "}
                  <span
                    className={`font-bold text-lg ${
                      currentAnswers[player] === "Me"
                        ? "text-blue-600"
                        : "text-purple-600"
                    }`}
                  >
                    {currentAnswers[player]}
                  </span>
                </p>
              </div>
            ))}

            {room.currentQuestion < QUESTIONS.length - 1 && (
              <button
                onClick={handleNextQuestion}
                className="w-full px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 mt-6"
              >
                Next Question
              </button>
            )}

            {room.currentQuestion === QUESTIONS.length - 1 && (
              <button
                onClick={handleNextQuestion}
                className="w-full px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 mt-6"
              >
                Complete Game
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
