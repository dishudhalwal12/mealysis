const iOSPlatforms = ["iPhone", "iPad", "iPod"];
export const isIOS = iOSPlatforms.some((platform) => navigator.userAgent.includes(platform));

export const isAndroid = /Android/i.test(navigator.userAgent);

const standalone = (window.navigator as any).standalone;
export const isIOSApp =
  isIOS &&
  (standalone === undefined ? false : !navigator.userAgent.includes("Safari") || standalone);

export const isAndroidApp = isAndroid && navigator.userAgent.includes("wv");

export const isIOSSafari = isIOS && navigator.userAgent.includes("Safari") && !standalone;

export const isAndroidChrome = isAndroid && navigator.userAgent.includes("Chrome");

export const isAppBrowser = isIOS ? isIOSApp : isAndroid ? isAndroidApp : false;
