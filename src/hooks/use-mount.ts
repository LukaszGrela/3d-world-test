import { useEffect, EffectCallback } from "react";

// eslint-disable-next-line react-hooks/exhaustive-deps
export const useMount = (func: EffectCallback): void => useEffect(func, []);
