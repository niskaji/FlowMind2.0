// -----------------------------------------------------------
// 🗂️ FlowMind 2.0 — CancelledScreen (Raporlama ekranı UI'ı)
// Filtre + sıralama + sonuç listesi — gerçek SQLite sorgularına bağlı
// (bkz. src/models/reportModel.ts — getReportResults artık async).
// -----------------------------------------------------------

import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnalysisChartColors, ReportColors } from '../../../constants/theme';
import { useTaskContext } from '../../context/TaskContext';
import {
  DEFAULT_REPORT_FILTERS,
  getReportResults,
  ReportCategory,
  ReportCategoryFilter,
  ReportDateRangeFilter,
  ReportFilters,
  ReportRecord,
  ReportRecordType,
  ReportSortKey,
  ReportStatusFilter,
  ReportTypeFilter,
} from '../../models/reportModel';
import { formatDateTR } from '../../utils/dateUtils';

import { styles } from './CancelledScreen.styles';

// ------------------------------------------------------------
// 🔖 Chip seçenek tanımları (etiket <-> filtre değeri eşlemesi)
// ------------------------------------------------------------
const CATEGORY_OPTIONS: { value: ReportCategoryFilter; label: string }[] = [
  { value: 'all', label: 'Tümü' },
  { value: 'short', label: 'Kısa' },
  { value: 'medium', label: 'Orta' },
  { value: 'long', label: 'Uzun' },
];

const TYPE_OPTIONS: { value: ReportTypeFilter; label: string }[] = [
  { value: 'all', label: 'Tümü' },
  { value: 'main', label: 'Ana Görev' },
  { value: 'subtask', label: 'Alt Görev' },
];

const STATUS_OPTIONS: { value: ReportStatusFilter; label: string }[] = [
  { value: 'all', label: 'Tümü' },
  { value: 'completed', label: 'Tamamlanan' },
  { value: 'cancelled', label: 'İptal Edilen' },
];

const DATE_RANGE_OPTIONS: { value: ReportDateRangeFilter; label: string }[] = [
  { value: 'all', label: 'Tümü' },
  { value: 'week', label: 'Bu Hafta' },
  { value: 'month', label: 'Bu Ay' },
  { value: 'year', label: 'Bu Yıl' },
];

const SORT_OPTIONS: { value: ReportSortKey; label: string }[] = [
  { value: 'category', label: 'Vadeye göre' },
  { value: 'type', label: 'Görev Tipine göre' },
  { value: 'status', label: 'Duruma göre' },
  { value: 'date', label: 'Tarihe göre' },
];

const CATEGORY_LABELS: Record<ReportCategory, string> = {
  short: 'Kısa Vade',
  medium: 'Orta Vade',
  long: 'Uzun Vade',
};

const TYPE_LABELS: Record<ReportRecordType, string> = {
  main: 'Ana Görev',
  subtask: 'Alt Görev',
};

// ------------------------------------------------------------
// 🧩 Chip — filtre/sıralama seçim butonu
// ------------------------------------------------------------
function Chip({
  label,
  selected,
  onPress,
  dashed,
  icon,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  dashed?: boolean;
  icon?: ReactNode;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.chip, dashed && styles.chipDashed, selected && styles.chipSelected]}
    >
      {icon}
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </TouchableOpacity>
  );
}

// ------------------------------------------------------------
// 🧩 FilterGroup — etiket + chip satırı
// ------------------------------------------------------------
function FilterGroup<T extends string>({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string;
  options: { value: T; label: string }[];
  selected: T;
  onSelect: (value: T) => void;
}) {
  return (
    <View style={styles.filterGroup}>
      <Text style={styles.filterGroupLabel}>{label}</Text>
      <View style={styles.chipRow}>
        {options.map(opt => (
          <Chip
            key={opt.value}
            label={opt.label}
            selected={selected === opt.value}
            onPress={() => onSelect(opt.value)}
          />
        ))}
      </View>
    </View>
  );
}

// ------------------------------------------------------------
// 🧩 ReportResultCard — tek bir sonuç kaydı
// ------------------------------------------------------------
function ReportResultCard({
  record,
  onReactivate,
}: {
  record: ReportRecord;
  onReactivate: (taskId: number) => void;
}) {
  const isCompleted = record.status === 'completed';
  const statusColor = isCompleted ? AnalysisChartColors.completedMain : AnalysisChartColors.cancelledMain;
  const statusLabel = isCompleted
    ? 'Tamamlandı'
    : record.isOverdueCancel
      ? 'Süresi Doldu ve İptal Edildi'
      : 'İptal Edildi';

  return (
    <View style={styles.resultCard}>
      <View style={styles.resultTitleRow}>
        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
        <Text style={styles.resultTitle}>{record.title}</Text>
      </View>

      <View style={styles.badgeRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{TYPE_LABELS[record.type]}</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{CATEGORY_LABELS[record.category]}</Text>
        </View>
      </View>

      <View style={styles.resultFooterRow}>
        <Text style={[styles.resultStatusText, { color: statusColor }]}>
          {statusLabel} · {formatDateTR(record.date)}
        </Text>

        {/* ♻️ Sadece ana görevler için — alt görevlerde gösterilmez */}
        {record.type === 'main' && (
          <TouchableOpacity
            style={styles.reactivateButton}
            onPress={() => onReactivate(record.taskId)}
          >
            <Ionicons name="refresh" size={13} color={ReportColors.sageStrong} />
            <Text style={styles.reactivateButtonText}>Yeniden Aktifleştir</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

// ------------------------------------------------------------
// 🧠 Logic Section — Filtre/Sıralama State ve Veri Erişimi
// ------------------------------------------------------------
export default function CancelledScreen() {
  const { state, dispatch } = useTaskContext();

  // Chip seçimleri (taslak) — "Filtrele" butonuna basılana kadar sorguyu tetiklemez
  const [draftFilters, setDraftFilters] = useState<ReportFilters>(DEFAULT_REPORT_FILTERS);
  // Uygulanan filtreler — sadece "Filtrele" butonuyla güncellenir
  const [appliedFilters, setAppliedFilters] = useState<ReportFilters>(DEFAULT_REPORT_FILTERS);
  // Sıralama seçimi anında uygulanır (ayrı bir onay adımı gerekmez)
  const [sortKey, setSortKey] = useState<ReportSortKey>('date');

  const [results, setResults] = useState<ReportRecord[]>([]);

  const refreshResults = useCallback(() => {
    getReportResults(appliedFilters, sortKey).then(setResults);
  }, [appliedFilters, sortKey]);

  // Filtre/sıralama değiştiğinde VEYA paylaşılan görev listesi değiştiğinde
  // (örn. bu ekrandaki "Yeniden Aktifleştir" veya başka bir ekrandaki bir
  // mutasyon sonrası) sonuçlar yeniden sorgulanır.
  useEffect(() => {
    refreshResults();
  }, [refreshResults, state.tasks]);

  // Sekmeye her odaklanıldığında da tazele (ekstra güvence)
  useFocusEffect(
    useCallback(() => {
      refreshResults();
    }, [refreshResults]),
  );

  const handleApplyFilters = () => setAppliedFilters(draftFilters);

  const handleReactivate = (taskId: number) => {
    dispatch({ type: 'REACTIVATE_TASK', payload: taskId });
  };

  // 🗓️ Native tarih aralığı seçici ileride (persistence adımında) buraya bağlanacak.
  // Şimdilik sadece görsel bir buton — no-op.
  const handleCustomDatePress = () => undefined;

  // 🧾 Filtre/sıralama UI'ı — FlatList'in ListHeaderComponent'i olarak render edilir,
  // böylece sonuç listesi windowing/virtualization'dan faydalanır (bkz. performans notu).
  const listHeader = (
    <>
      {/* Header */}
      <Text style={styles.header}>Raporlama</Text>
      <Text style={styles.subHeader}>Geçmiş görevlerini ara ve filtrele</Text>

      {/* Filtre Kartı */}
      <View style={styles.filterCard}>
        <FilterGroup
          label="Vade"
          options={CATEGORY_OPTIONS}
          selected={draftFilters.category}
          onSelect={value => setDraftFilters(f => ({ ...f, category: value }))}
        />

        <FilterGroup
          label="Görev Tipi"
          options={TYPE_OPTIONS}
          selected={draftFilters.type}
          onSelect={value => setDraftFilters(f => ({ ...f, type: value }))}
        />

        <FilterGroup
          label="Durum"
          options={STATUS_OPTIONS}
          selected={draftFilters.status}
          onSelect={value => setDraftFilters(f => ({ ...f, status: value }))}
        />

        <View style={styles.filterGroup}>
          <Text style={styles.filterGroupLabel}>Tarih Aralığı</Text>
          <View style={styles.chipRow}>
            {DATE_RANGE_OPTIONS.map(opt => (
              <Chip
                key={opt.value}
                label={opt.label}
                selected={draftFilters.dateRange === opt.value}
                onPress={() => setDraftFilters(f => ({ ...f, dateRange: opt.value }))}
              />
            ))}
            <Chip
              label="Özel Tarih"
              selected={false}
              dashed
              onPress={handleCustomDatePress}
              icon={
                <Ionicons
                  name="calendar-outline"
                  size={13}
                  color={ReportColors.textMedium}
                  style={styles.chipIcon}
                />
              }
            />
          </View>
        </View>
      </View>

      {/* Filtrele Butonu */}
      <TouchableOpacity style={styles.applyButton} onPress={handleApplyFilters}>
        <Text style={styles.applyButtonText}>Filtrele</Text>
      </TouchableOpacity>

      {/* Sonuç Sayısı & Sıralama */}
      <View style={styles.resultsHeaderRow}>
        <Text style={styles.resultsCountText}>{results.length} sonuç bulundu</Text>
      </View>

      <View style={styles.sortSection}>
        <Text style={styles.sortLabel}>Sırala</Text>
        <View style={styles.chipRow}>
          {SORT_OPTIONS.map(opt => (
            <Chip
              key={opt.value}
              label={opt.label}
              selected={sortKey === opt.value}
              onPress={() => setSortKey(opt.value)}
            />
          ))}
        </View>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={results}
        keyExtractor={record => record.id}
        renderItem={({ item }) => (
          <ReportResultCard record={item} onReactivate={handleReactivate} />
        )}
        contentContainerStyle={styles.container}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Seçilen filtrelere uygun kayıt bulunamadı</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
