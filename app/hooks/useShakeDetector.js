function useShakeDetector() {
  let isShaking = false;
  let shakeIntensity = 0;

  const SHAKE_THRESHOLD = 15; // Adjust this value as needed

  const handleDeviceMotion = (event) => {
    const accelerationIncludingGravity = event.accelerationIncludingGravity;

    if (!accelerationIncludingGravity) return; // Guard clause to handle null

    const { x, y, z } = accelerationIncludingGravity;

    if (x === null || y === null || z === null) return; // Guard clause for null values

    // Calculate the acceleration magnitude
    const acceleration = Math.sqrt(x * x + y * y + z * z);

    // Check if the shake exceeds the threshold
    if (acceleration > SHAKE_THRESHOLD) {
      isShaking = true;
      shakeIntensity = acceleration - SHAKE_THRESHOLD;

      // Optional: reset shaking status after a short delay
      setTimeout(() => {
        isShaking = false;
        shakeIntensity = 0;
        // Optional: Call any callback or update UI here if needed
      }, 1000); // Shake detected for 1 second
    } else {
      isShaking = false;
      shakeIntensity = 0;
    }
  };

  const handlePermission = async () => {
    // Check if requestPermission method is available
    const requestPermission = DeviceMotionEvent.requestPermission;

    const isIOS = typeof requestPermission === 'function';
    if (isIOS) {
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

  // Call permission handler
  handlePermission();

  // Return an object with the state variables (could be used for further operations)
  return { isShaking, shakeIntensity };
}
