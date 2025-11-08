// -----------------------------------------------------------
// 🎨 FlowMind 2.0 — CancelledScreen.styles.ts
// Açıklama: SafeArea ve pastel tonlarda dengeli arayüz
// -----------------------------------------------------------
import { StyleSheet } from 'react-native';

import { Colors } from '../../styles/colors';

export const styles = StyleSheet.create({
  container: {
    paddingBottom: 30,
    paddingHorizontal: 18,
    paddingTop: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    flex: 1,
    marginTop: 50,
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    width: '85%',
  },
  safeArea: {
    backgroundColor: Colors.background,
    flex: 1,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 15,
    textAlign: 'center',
  },
});
