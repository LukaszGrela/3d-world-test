import { useEffect, useMemo, useState } from "react";

interface IControlsFlags {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
}
type TControlFlagsKeys = keyof IControlsFlags;
const supportedControlKeys = {
  KeyW: 1,
  KeyS: 1,
  KeyA: 1,
  KeyD: 1,
  Space: 1,
  ArrowUp: 1,
  ArrowDown: 1,
  ArrowLeft: 1,
  ArrowRight: 1,
  ShiftRight: 1,
  Enter: 1,
  NumpadEnter: 1,
  ControlRight: 1,
};
type TKeys = keyof typeof supportedControlKeys;
function isControlKey(key: string): key is TKeys {
  return (
    Object.keys(supportedControlKeys).findIndex(
      (item: string): boolean => item === key
    ) !== -1
  );
}
type TKeyboardMapping = {
  [key in TControlFlagsKeys]: TKeys;
};
const defaultKeyboard: TKeyboardMapping = {
  jump: "Space",
  backward: "KeyS",
  forward: "KeyW",
  left: "KeyA",
  right: "KeyD",
};
type TFieldMapping = {
  [key in TKeys]?: TControlFlagsKeys;
};
function mapKey(
  key: string,
  keys: TFieldMapping
): TControlFlagsKeys | undefined {
  if (isControlKey(key)) {
    return keys[key];
  }
  return undefined;
}

function usePlayerControls(keyboard = defaultKeyboard): IControlsFlags {
  const keys: TFieldMapping = useMemo((): TFieldMapping => {
    const fields = Object.keys(keyboard) as TControlFlagsKeys[];
    return fields.reduce(
      (o: TFieldMapping, key: TControlFlagsKeys): TFieldMapping => ({
        ...o,
        [keyboard[key] as TKeys]: key,
      }),
      {}
    );
  }, [keyboard]);

  const [movement, setMovement] = useState<IControlsFlags>({
    backward: false,
    forward: false,
    jump: false,
    left: false,
    right: false,
  });

  useEffect((): (() => void) => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setMovement((m) => {
        const field = mapKey(e.code, keys);
        const state = {
          ...m,
        };
        if (field) {
          state[field] = true;
        }
        return state;
      });
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      setMovement((m) => {
        const field = mapKey(e.code, keys);
        const state = {
          ...m,
        };
        if (field) {
          state[field] = false;
        }
        return state;
      });
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return (): void => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [keys]);

  return movement;
}

export { usePlayerControls };
