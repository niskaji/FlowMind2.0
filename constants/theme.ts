/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

// 📊 Analiz ekranı — pasta grafik kategori renkleri
export const AnalysisChartColors = {
  // Genel Özet kartı — Tamamlanan
  completedMain: '#3F6B4A', // Toplam Tamamlanan Ana Görev
  completedSub: '#8FAE7F', // Toplam Tamamlanan Alt Görev
  // Vade kartları — Devam Eden
  ongoingMain: '#B5651D', // Devam Eden Ana Görevler
  ongoingSub: '#E0A458', // Devam Eden Alt Görevler
  // Genel Özet kartı — İptal Edilen
  cancelledMain: '#6E2C3E', // Toplam İptal Edilen Ana Görev
  cancelledSub: '#A85C6F', // Toplam İptal Edilen Alt Görev
} as const;

// 🍂 Raporlama ekranı — sonbahar temalı renk paleti
export const ReportColors = {
  pageBackground: '#F3ECDB', // Ekran arka planı (kırık krem)
  cardBackground: '#FBF6EA', // Kart/chip arka planı (açık krem)
  sageStrong: '#7C9463', // Seçili chip dolgusu / "Filtrele" butonu
  sageSoft: '#A9BE8E', // İkincil vurgular, seçili chip border'ı
  textDark: '#3A2E22', // Başlık ve ana metin
  textMedium: '#6B5D48', // İkincil metin (alt başlık, badge)
  textLight: '#8A7C68', // Kesikli çizgi, placeholder, pasif ikon
} as const;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
