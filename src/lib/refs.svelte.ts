import { browser } from "$app/environment";

const getOS = () => {
  if (browser) {
    const userAgent = window.navigator.userAgent;

    if (/Windows/i.test(userAgent)) return "Windows";
    else if (/Mac/i.test(userAgent)) return "macOS";
    else if (/Linux/i.test(userAgent)) return "Linux";
    // else if (/Android/i.test(userAgent)) return "Android";
    // else if (/iPhone|iPad|iPod/i.test(userAgent)) return "iOS";
  }
};

/* eslint-disable-next-line */
const ref = <T>(initial: T) => {
  let v = $state(initial);
  const reset = () => (v = initial);

  return {
    set v(value) { v = value; },
    get v() { return v; },
    reset,
  };
};

export const selectedTaskList = ref("Cursor Control");
export const enterPressed = ref(false);
export const isRandomized = ref(true);
export const os = ref(getOS());
