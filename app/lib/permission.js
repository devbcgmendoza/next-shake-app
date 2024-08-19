export const isIOSDevice = () => {
  // Ensure this code runs only in the browser
  if (typeof window === "undefined") return false;

  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
};

export const getPermission = async () => {
  const requestPermission = DeviceMotionEvent.requestPermission
  if (typeof requestPermission === 'function') {
    try {
      const response = await requestPermission();
      if(response === "granted") return true
    } catch (error) {
      console.error('Permission request failed', error);
      return false;
    }
  } else {
    // If not on iOS or permission request is not supported, assume permission is granted
    return true;
  }
};
