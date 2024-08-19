import { useState, useEffect, useCallback } from "react";

const useShakeDetector = () => {
  const [isShaking, setIsShaking] = useState(false);
  const [shakeIntensity, setShakeIntensity] = useState(0);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);

  const handleDeviceMotion = useCallback((event) => {
    const { accelerationIncludingGravity } = event;

    if (!accelerationIncludingGravity) return;

    const { x, y, z } = accelerationIncludingGravity;

    if (x === null || y === null || z === null) return;

    const acceleration = Math.sqrt(x * x + y * y + z * z);
    const SHAKE_THRESHOLD = 15;

    if (acceleration > SHAKE_THRESHOLD) {
      setIsShaking(true);
      setShakeIntensity(acceleration - SHAKE_THRESHOLD);

      setTimeout(() => {
        setIsShaking(false);
        setShakeIntensity(0);
      }, 1000);
    } else {
      setIsShaking(false);
      setShakeIntensity(0);
    }
  }, []);

  const requestPermission = async () => {
    if (DeviceMotionEvent.requestPermission) {
      try {
        const response = await DeviceMotionEvent.requestPermission();
        if (response === "granted") {
          setIsPermissionGranted(true);
          window.addEventListener("devicemotion", handleDeviceMotion);
        } else {
          console.warn("Device motion permission denied.");
        }
      } catch (error) {
        console.error("Permission request failed", error);
      }
    } else {
      // Automatically enable device motion for platforms where no permission request is needed
      setIsPermissionGranted(true);
      window.addEventListener("devicemotion", handleDeviceMotion);
    }
  };

  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    if (isIOS) {
      requestPermission();
    } else {
      // Automatically enable device motion for non-iOS devices
      setIsPermissionGranted(true);
      window.addEventListener("devicemotion", handleDeviceMotion);
    }

    return () => {
      window.removeEventListener("devicemotion", handleDeviceMotion);
    };
  }, [handleDeviceMotion]);

  return { isShaking, shakeIntensity, isPermissionGranted };
};

export default useShakeDetector;
