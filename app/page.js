"use client";

import { useState, useEffect, useCallback } from "react";
import useShakeDetector from "./hooks/useShakeDetector";
import { IOSView } from "react-device-detect"

export default function Home() {
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(11);
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

  const getPermission = async () => {
    const requestPermission = DeviceMotionEvent.requestPermission
    if (typeof requestPermission === 'function') {
      try {
        const response = await requestPermission();
        if(response === "granted") {
          window.location.reload()
        }
      } catch (error) {
        console.error('Permission request failed', error);
      }
    } else {
      // If not on iOS or permission request is not supported, assume permission is granted
      return true;
    }
  };


  useEffect(() => {
    const permission = document.getElementById("permission")
    if(!permission) return
    permission.style.display = "block"
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-96 h-96 z-10 text-center overflow-hidden" id="container">
        <p>score: {score}</p>
        <p>timer: {timer}</p>
          <IOSView>
          <div onClick={getPermission} style={{ display: "none" }} id="permission">
            Shake shake fries needs to access your device motion gesture and device orientation.
          </div>
        </IOSView>
      </div>
    </main>
  );
}
