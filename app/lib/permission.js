export const isIOSDevice = () => {
  if (typeof window === "undefined") return false;

  // Get the user agent and platform strings
  const userAgent = navigator.userAgent || '';
  const platform = navigator.platform || '';

  // Check for iOS device based on user agent and platform
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;

  // Alternative check based on platform
  const isIOSPlatform = platform === 'iPad' || platform === 'iPhone' || platform === 'iPod';

  // Return true if either check is true
  return isIOS || isIOSPlatform;
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
