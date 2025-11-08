import { useEffect } from 'react';
import { Keyboard, ScrollView } from 'react-native';

/**
 * Klavye açıldığında veya kapandığında otomatik kaydırma sağlar.
 * ScrollView referansını doğru tipe kavuşturur.
 */
export function useKeyboardScroll(scrollRef: React.RefObject<ScrollView>) {
  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    });

    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      scrollRef.current?.scrollToEnd({ animated: true });
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [scrollRef]);
}
