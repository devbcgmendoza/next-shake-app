"use client"

import { useState, useEffect, useCallback } from "react";
import useShakeDetector from "./hooks/useShakeDetector";

export default function Home() {
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(11);

  const { isShaking, shakeIntensity, isPermissionGranted } = useShakeDetector();

  const createCoin = useCallback(() => {
    const coin = document.createElement("div");
    const container = document.getElementById("container");
    if (!container) return;
    coin.className = "coin";
    coin.style.left = Math.random() * 100 + "vw";
    container.appendChild(coin);

    setTimeout(() => {
      if (container.contains(coin)) {
        container.removeChild(coin);
      }
    }, 2000);
  }, []);

  const createCoins = useCallback(() => {
    for (let i = 0; i < 5; i++) {
      setTimeout(createCoin, i * 100);
    }
  }, [createCoin]);

  useEffect(() => {
    if (isShaking && shakeIntensity >= 15) {
      createCoins();
      setScore((prev) => prev + 1);
    }
  }, [isShaking, shakeIntensity, createCoins]);

  useEffect(() => {
    if (timer <= 0) return;

    const timerId = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timer]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-96 h-96 z-10 text-center overflow-hidden" id="container">
        <p>score: {score}</p>
        <p>timer: {timer}</p>

        {!isPermissionGranted && (
          <button
            onClick={() => window.location.reload()} // Triggering a reload to request permission if not granted
            style={{ border: "1px solid red", padding: ".5rem 1rem", borderRadius: "1rem" }}
          >
            Request Device Motion Permission
          </button>
        )}

        {isPermissionGranted && (
          <p>Device motion permission granted. Shake your device!</p>
        )}
      </div>
    </main>
  );
}
