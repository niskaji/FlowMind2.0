// -----------------------------------------------------------
// 💅 FlowMind 2.0 — HomeScreen.styles
// -----------------------------------------------------------
import { StyleSheet } from 'react-native';

import { Colors } from '../../styles/colors';

export const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 10 },
  // Başlık stili

  header: {
    color: Colors.textPrimary,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 15,
    marginTop: 10,
    textAlign: 'center',
  },

  safeArea: { backgroundColor: Colors.background, flex: 1 },

  // Yeni görev butonu stili
  addButtonTop: {
    borderRadius: 16,
    elevation: 5,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: Colors.shadowBlack,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  gradient: { borderRadius: 16, paddingVertical: 13 },
  addText: {
    color: Colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },

  // Filtre bar ve butonları
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  filterButton: {
    backgroundColor: Colors.card,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  filterText: { color: Colors.textPrimary, fontSize: 14, fontWeight: '500' },
  filterTextActive: { color: Colors.white, fontWeight: '700' },

  // Boş liste mesajı
  empty: {
    color: Colors.textSecondary,
    marginTop: 40,
    textAlign: 'center',
  },
});
