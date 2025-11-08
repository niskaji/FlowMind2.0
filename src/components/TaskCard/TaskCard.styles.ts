// -----------------------------------------------------------
// 💅 FlowMind 2.0 — TaskCard.styles
// -----------------------------------------------------------

import { StyleSheet } from 'react-native';

import { Colors } from '../../styles/colors';

export const styles = StyleSheet.create({
  card: { backgroundColor: Colors.card, borderRadius: 16, marginBottom: 15, padding: 15 },
  // ✅ Checkbox
  checkbox: {
    alignItems: 'center',
    borderColor: Colors.lightGold,
    borderRadius: 6,
    borderWidth: 1,
    height: 22,
    justifyContent: 'center',
    marginRight: 10,
    width: 22,
  },
  checkboxChecked: { backgroundColor: Colors.lightGreen },

  header: { alignItems: 'center', flexDirection: 'row' },

  // 🧩 Görev başlığı
  taskTitle: { color: Colors.textPrimary, flex: 1, fontSize: 16 },
  titleCompleted: { color: Colors.midGray, textDecorationLine: 'line-through' },
  titleInput: {
    borderBottomWidth: 1,
    borderColor: Colors.beigeBorder,
    color: Colors.textPrimary,
    flex: 1,
    fontSize: 16,
  },

  // 🏷️ Kategori & Progress bar
  categoryLabel: { color: Colors.mediumBrown, fontSize: 12, marginTop: 5 },
  progressBarContainer: {
    backgroundColor: Colors.softCream,
    borderRadius: 3,
    height: 6,
    marginBottom: 8,
    marginTop: 6,
  },
  progressBar: { backgroundColor: Colors.success, borderRadius: 3, height: '100%' },

  // 📜 Alt görev listesi
  subtasksContainer: { maxHeight: 200, paddingBottom: 10 },
  subtaskRow: { alignItems: 'center', flexDirection: 'row', marginTop: 5, paddingLeft: 20 },
  subCheckbox: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderColor: Colors.lightGold,
    borderRadius: 5,
    borderWidth: 1,
    height: 18,
    justifyContent: 'center',
    marginRight: 8,
    width: 18,
  },
  subtaskText: { color: Colors.textPrimary, flex: 1, fontSize: 14 },
  subInputEdit: {
    borderBottomWidth: 1,
    borderColor: Colors.beigeBorder,
    color: Colors.textPrimary,
    flex: 1,
    fontSize: 14,
  },

  // ➕ Alt görev ekleme satırı
  subInput: {
    borderBottomWidth: 1,
    borderColor: Colors.beigeBorder,
    color: Colors.textPrimary,
    flex: 1,
    fontSize: 14,
  },
  addSubtaskRow: { alignItems: 'center', flexDirection: 'row', marginTop: 10, paddingLeft: 20 },

  // 🎯 Ortak ikon butonları
  iconButton: { marginLeft: 8 },

  // 🌫️ Gölge efekti
  shadow: {
    elevation: 6,
    shadowColor: Colors.shadowBlack,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },

  // 📊 İlerleme metni
  progressText: {
    color: Colors.mediumBrown,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
});
