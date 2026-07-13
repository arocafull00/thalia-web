import { bind, play, setEnabled } from "cuelume";
import type { SoundName } from "cuelume";
import { toast } from "react-toastify";

function isSoundDisabled(): boolean {
  if (typeof window === "undefined") {
    return true;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function initSounds(): void {
  if (isSoundDisabled()) {
    return;
  }

  bind();
}

export function playSound(name: SoundName): void {
  if (isSoundDisabled()) {
    return;
  }

  play(name);
}

export function notifySuccess(message: string): void {
  playSound("success");
  toast.success(message);
}

export { setEnabled as setSoundEnabled };
