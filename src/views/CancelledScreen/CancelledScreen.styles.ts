// -----------------------------------------------------------
// 🎨 FlowMind 2.0 — CancelledScreen.styles (Raporlama ekranı)
// Renk paleti constants/theme.ts (ReportColors) üzerinden — sonbahar teması
// -----------------------------------------------------------
import { StyleSheet } from 'react-native';

import { ReportColors } from '../../../constants/theme';
import { Colors } from '../../styles/colors';

export const styles = StyleSheet.create({
  safeArea: { backgroundColor: ReportColors.pageBackground, flex: 1 },
  container: { paddingBottom: 40, paddingHorizontal: 18, paddingTop: 14 },

  // 🏷️ Header
  header: {
    color: ReportColors.textDark,
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
  },
  subHeader: {
    color: ReportColors.textMedium,
    fontSize: 14,
    marginBottom: 18,
    marginTop: 4,
    textAlign: 'center',
  },

  // 🧰 Filtre Kartı
  filterCard: {
    backgroundColor: ReportColors.cardBackground,
    borderRadius: 20,
    elevation: 4,
    marginBottom: 16,
    padding: 16,
    shadowColor: Colors.shadowBlack,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  filterGroup: { marginBottom: 14 },
  filterGroupLabel: {
    color: ReportColors.textDark,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },

  // 🔘 Chip
  chip: {
    alignItems: 'center',
    backgroundColor: ReportColors.cardBackground,
    borderColor: ReportColors.textLight,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipSelected: {
    backgroundColor: ReportColors.sageStrong,
    borderColor: ReportColors.sageStrong,
  },
  chipDashed: { borderStyle: 'dashed' },
  chipIcon: { marginRight: 4 },
  chipText: {
    color: ReportColors.textDark,
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextSelected: {
    color: ReportColors.cardBackground,
    fontWeight: '700',
  },

  // ✅ Filtrele Butonu
  applyButton: {
    alignItems: 'center',
    backgroundColor: ReportColors.sageStrong,
    borderRadius: 16,
    marginBottom: 20,
    paddingVertical: 14,
  },
  applyButtonText: {
    color: ReportColors.cardBackground,
    fontSize: 16,
    fontWeight: '700',
  },

  // 🔢 Sonuç sayısı & Sıralama
  resultsHeaderRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  resultsCountText: {
    color: ReportColors.textDark,
    fontSize: 15,
    fontWeight: '700',
  },
  sortSection: { marginBottom: 16 },
  sortLabel: {
    color: ReportColors.textMedium,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },

  // 📄 Sonuç Kartı
  resultCard: {
    backgroundColor: ReportColors.cardBackground,
    borderRadius: 16,
    elevation: 2,
    marginBottom: 12,
    padding: 14,
    shadowColor: Colors.shadowBlack,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  resultTitleRow: { alignItems: 'center', flexDirection: 'row', marginBottom: 8 },
  statusDot: { borderRadius: 5, height: 10, marginRight: 8, width: 10 },
  resultTitle: {
    color: ReportColors.textDark,
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
  },
  badgeRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  badge: {
    backgroundColor: ReportColors.pageBackground,
    borderColor: ReportColors.sageSoft,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    color: ReportColors.textMedium,
    fontSize: 12,
    fontWeight: '600',
  },
  resultFooterRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  resultStatusText: { fontSize: 13, fontWeight: '700' },

  // ♻️ Yeniden Aktifleştir
  reactivateButton: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    paddingVertical: 4,
  },
  reactivateButtonText: {
    color: ReportColors.sageStrong,
    fontSize: 12,
    fontWeight: '700',
  },

  // 🗒️ Boş durum
  emptyContainer: { alignItems: 'center', marginTop: 40 },
  emptyText: {
    color: ReportColors.textMedium,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    width: '85%',
  },
});
