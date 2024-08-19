export const isIOSDevice = () => {
  // Ensure this code runs only in the browser
  if (typeof window === "undefined") return false;

  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
};

export const requestPermission = async () => {
  if (isIOSDevice() && typeof DeviceMotionEvent.requestPermission === 'function') {
    try {
      const response = await DeviceMotionEvent.requestPermission();
      return response === 'granted';
    } catch (error) {
      console.error('Permission request failed', error);
      return false;
    }
  } else {
    // If not on iOS or permission request is not supported, assume permission is granted
    return true;
  }
};
