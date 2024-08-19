import { useState, useEffect } from 'react';

const useShakeDetector = () => {
  const [isShaking, setIsShaking] = useState(false);
  const [shakeIntensity, setShakeIntensity] = useState(0);

  useEffect(() => {
    const handleDeviceMotion = (event) => {
      const accelerationIncludingGravity = event.accelerationIncludingGravity;

      if (!accelerationIncludingGravity) return; // Guard clause to handle null

      const { x, y, z } = accelerationIncludingGravity;

      if (x === null || y === null || z === null) return; // Guard clause for null values

      // Calculate the acceleration magnitude
      const acceleration = Math.sqrt(x * x + y * y + z * z);

      // Define thresholds
      const SHAKE_THRESHOLD = 15; // Adjust this value as needed

      // Check if the shake exceeds the threshold
      if (acceleration > SHAKE_THRESHOLD) {
        setIsShaking(true);
        setShakeIntensity(acceleration - SHAKE_THRESHOLD);

        // Optional: reset shaking status after a short delay
        setTimeout(() => {
          setIsShaking(false);
          setShakeIntensity(0);
        }, 1000); // Shake detected for 1 second
      } else {
        setIsShaking(false);
        setShakeIntensity(0);
      }
    };

    const handlePermission = async () => {
      // Check for iOS specific permission request
      const requestPermission = (DeviceMotionEvent.requestPermission && typeof DeviceMotionEvent.requestPermission === 'function') ? DeviceMotionEvent.requestPermission : null;

      if (requestPermission) {
        try {
          const response = await requestPermission();
          if (response === 'granted') {
            window.addEventListener('devicemotion', handleDeviceMotion);
          }
        } catch (error) {
          console.error('Permission request failed', error);
        }
      } else {
        // For non-iOS or where permission is not required
        window.addEventListener('devicemotion', handleDeviceMotion);
      }
    };

    handlePermission();

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('devicemotion', handleDeviceMotion);
    };
  }, []);

  return { isShaking, shakeIntensity };
};

export default useShakeDetector;
