import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/** Respeita a preferência do sistema "reduzir movimento". */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let ativo = true;
    AccessibilityInfo.isReduceMotionEnabled().then((v) => ativo && setReduced(v));
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduced);
    return () => {
      ativo = false;
      sub.remove();
    };
  }, []);

  return reduced;
}
