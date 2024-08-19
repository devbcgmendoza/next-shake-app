"use client";

import { useState, useEffect, useCallback } from "react";
import useShakeDetector from "./hooks/useShakeDetector";

export default function Home() {
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(11);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);

  const { isShaking, shakeIntensity } = useShakeDetector();

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

  const requestPermission = async () => {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      try {
        const response = await DeviceMotionEvent.requestPermission();
        if (response === 'granted') {
          setIsPermissionGranted(true);
        } else {
          console.warn('Device motion permission denied.');
        }
      } catch (error) {
        console.error('Permission request failed', error);
      }
    } else {
      // In case permission request is not supported, assume permission is granted
      setIsPermissionGranted(true);
    }
  };

  useEffect(() => {
    const handleLoad = () => {
      requestPermission();
    };

    // Trigger onload event handler
    window.addEventListener('load', handleLoad);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-96 h-96 z-10 text-center overflow-hidden" id="container">
        <p>score: {score}</p>
        <p>timer: {timer}</p>
        <button onClick={requestPermission}>
          Request Permission
        </button>
      </div>
    </main>
  );
}
