// -----------------------------------------------------------
// 💅 FlowMind 2.0 — NewTaskModal.styles
// -----------------------------------------------------------

import { StyleSheet } from 'react-native';

import { Colors } from '../../styles/colors';

export const styles = StyleSheet.create({
  // 🔲 Arka plan karartması
  backdrop: { backgroundColor: Colors.shadowDark, flex: 1 },

  // 🪶 Kart görünümü
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    elevation: 6,
    padding: 16,
    shadowColor: Colors.shadowBlack,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },

  // 🎯 Merkezde konumlandırma
  center: {
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    padding: 20,
    position: 'absolute',
    right: 0,
    top: 0,
  },

  // 🏷️ Etiket
  label: { color: Colors.textSecondary, fontSize: 13, marginBottom: 6 },

  // 📌 Başlık
  title: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },

  // ✏️ Input alanı
  input: {
    backgroundColor: Colors.creamLight,
    borderColor: Colors.beigeBorder,
    borderRadius: 10,
    borderWidth: 1,
    color: Colors.textPrimary,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  // 🔘 Vade seçim segmenti
  segment: { flexDirection: 'row', gap: 8 },
  segmentBtn: {
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 10,
    flex: 1,
    paddingVertical: 10,
  },
  segmentBtnActive: { backgroundColor: Colors.oliveSoft },
  segmentText: { color: Colors.textPrimary, fontWeight: '600' },
  segmentTextActive: { color: Colors.white, fontWeight: '700' },

  // 🧩 Alt buton grubu
  row: { flexDirection: 'row', gap: 10, marginTop: 14 },
  btn: {
    alignItems: 'center',
    borderRadius: 10,
    flex: 1,
    paddingVertical: 12,
  },
  cancel: { backgroundColor: Colors.softCream },
  save: { backgroundColor: Colors.success },
  btnText: { color: Colors.textPrimary, fontWeight: '700' },
});
