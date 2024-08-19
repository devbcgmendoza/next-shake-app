import { useState, useEffect } from 'react';

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

    const handlePermission = async () => {
      const requestPermission = DeviceMotionEvent.requestPermission;

      if (typeof requestPermission === 'function') {
        try {
          const response = await requestPermission();
          if (response === 'granted') {
            window.addEventListener('devicemotion', handleDeviceMotion);
          } else {
            console.warn('Device motion permission denied.');
          }
        } catch (error) {
          console.error('Permission request failed', error);
        }
      } else {
        window.addEventListener('devicemotion', handleDeviceMotion);
      }
    };

    handlePermission();

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('devicemotion', handleDeviceMotion);
    };
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  return { isShaking, shakeIntensity };
};

export default useShakeDetector;
