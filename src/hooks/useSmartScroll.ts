// src/hooks/useSmartScroll.ts
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useRef } from 'react';
import type { FlatList, ScrollView } from 'react-native';
import { InteractionManager } from 'react-native';

type ScrollRef = React.RefObject<ScrollView | FlatList | null>;

interface Options {
  autoScrollToEnd?: boolean; // içerik değişince en alta git
  resetOnFocus?: boolean; // sekme odaklanınca en üste git
  resetAnimated?: boolean;
  toEndAnimated?: boolean;
  resetDelayMs?: number;
}

/**
 * 🔹 FlowMind Smart Scroll Hook – v4.0 (Stable)
 * Tek hook → hem ScrollView hem FlatList desteği.
 * Focus ve içerik değişimi senkronize çalışır.
 */
export function useSmartScroll(
  ref: ScrollRef,
  {
    autoScrollToEnd = false,
    resetOnFocus = true,
    resetAnimated = false,
    toEndAnimated = true,
    resetDelayMs = 100,
  }: Options = {},
) {
  const scrollTimeout = useRef<number | null>(null);

  // 🔹 Sekme veya ekran focus olduğunda en üste kaydır
  useFocusEffect(
    useCallback(() => {
      if (!resetOnFocus) return;

      const timeout = setTimeout(() => {
        const node = ref.current as any;
        if (!node) return;

        // FlatList desteği
        if (typeof node.scrollToOffset === 'function') {
          node.scrollToOffset({ offset: 0, animated: resetAnimated });
        } else if (typeof node.scrollTo === 'function') {
          node.scrollTo({ y: 0, animated: resetAnimated });
        }
      }, resetDelayMs);

      return () => clearTimeout(timeout);
    }, [ref, resetOnFocus, resetAnimated, resetDelayMs]),
  );

  // 🔹 İçerik değiştiğinde (ör. alt görev eklendiğinde) en alta kaydır
  const onContentSizeChange = useCallback(() => {
    if (!autoScrollToEnd || !ref.current) return;
    const node = ref.current as any;

    InteractionManager.runAfterInteractions(() => {
      requestAnimationFrame(() => {
        if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
        scrollTimeout.current = setTimeout(() => {
          try {
            if (typeof node.scrollToEnd === 'function') {
              node.scrollToEnd({ animated: toEndAnimated });
            } else if (typeof node.scrollTo === 'function') {
              node.scrollTo({ y: 999999, animated: toEndAnimated });
            }
          } catch (e) {
            console.warn('SmartScroll hata:', e);
          }
        }, 150);
      });
    });
  }, [ref, autoScrollToEnd, toEndAnimated]);

  return { onContentSizeChange };
}
