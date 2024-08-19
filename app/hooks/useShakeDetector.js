import { useState, useEffect } from 'react';
import { requestPermission } from '../lib/permission'; // Adjust path as needed

const useShakeDetector = () => {
  const [isShaking, setIsShaking] = useState(false);
  const [shakeIntensity, setShakeIntensity] = useState(0);

  useEffect(() => {
    const handleDeviceMotion = (event) => {
      const accelerationIncludingGravity = event.accelerationIncludingGravity;

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
    };

    const setupEventListeners = async () => {
      const permissionGranted = await requestPermission();
      if (permissionGranted) {
        window.addEventListener('devicemotion', handleDeviceMotion);
      }
    };

    setupEventListeners();

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('devicemotion', handleDeviceMotion);
    };
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  return { isShaking, shakeIntensity };
};

export default useShakeDetector;
