// -----------------------------------------------------------
// 📊 FlowMind 2.0 — AnalysisScreen (MVVM Refactored)
// Vade kartları (Devam Eden Ana/Alt + Tamamlanan Ana/Alt) + Genel Özet kartı
// (tüm vadelerin toplam Tamamlanan/İptal Edilen sayıları)
// Tüm sayılar her render'da context'teki (DB'den gelen) güncel `tasks`
// listesinden useMemo selector'larla CANLI ve sıfırdan hesaplanır — statik/
// kümülatif sayaç yok. Tek tablo modeli: iptal edilen görevler de artık
// `tasks` içinde kalır (status='cancelled'), ayrı bir removedTasks yok.
// -----------------------------------------------------------

import { useMemo, useRef } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnalysisChartColors } from '../../../constants/theme';
import CategoryPieChart, { PieChartSlice } from '../../components/CategoryPieChart/CategoryPieChart';
import { useTaskContext } from '../../context/TaskContext';
import { useSmartScroll } from '../../hooks/useSmartScroll';
import { Task } from '../../models/taskModel';

import { styles } from './AnalysisScreen.styles';

const CATEGORY_DEFS = [
  { key: 'short' as const, label: 'Kısa Vadeli Görevler' },
  { key: 'medium' as const, label: 'Orta Vadeli Görevler' },
  { key: 'long' as const, label: 'Uzun Vadeli Görevler' },
];

interface LegendRow {
  key: string;
  label: string;
  value: number;
  color: string;
}

// 🧩 Ortak kart render'ı — hem vade kartları hem Genel Özet kartı için
function StatCard({ title, rows }: { title: string; rows: LegendRow[] }) {
  const total = rows.reduce((sum, r) => sum + r.value, 0);
  const chartData: PieChartSlice[] = rows.map(r => ({ key: r.key, value: r.value, color: r.color }));

  return (
    <View style={[styles.card, styles.shadow]}>
      <Text style={styles.cardTitle}>{title}</Text>

      <View style={styles.row}>
        <View style={styles.legendContainer}>
          {rows.map(r => (
            <Text key={r.key} style={[styles.statusText, { color: r.color }]}>
              ● {r.label}: {r.value}
            </Text>
          ))}
        </View>

        <View style={styles.chartWrapper}>
          {total > 0 ? (
            <CategoryPieChart data={chartData} size={140} />
          ) : (
            <Text style={styles.emptyChartText}>Henüz veri yok</Text>
          )}
        </View>
      </View>
    </View>
  );
}

export default function AnalysisScreen(): JSX.Element {
  const { state } = useTaskContext();
  const tasks: Task[] = state?.tasks ?? [];

  // 🔹 Scroll referansı ve Smart Scroll Hook
  const scrollRef = useRef<ScrollView>(null);
  useSmartScroll(scrollRef, { resetOnFocus: true });

  // 🔸 Vade kartları — "Devam Eden Ana/Alt" + "Tamamlanan Ana/Alt" (4 kategori)
  // Her sayı SADECE o vadeye (kısa/orta/uzun) özel hesaplanır. İptal edilen
  // görevler bu kartlara hiç dahil edilmez — o veri sadece Genel Özet'te kalır.
  const categoryStats = useMemo(() => {
    return CATEGORY_DEFS.map(cat => {
      const catTasks = tasks.filter(t => t.category === cat.key);
      const activeCatTasks = catTasks.filter(t => t.status === 'pending');
      const completedCatTasks = catTasks.filter(t => t.status === 'completed');

      const ongoingMain = activeCatTasks.length;
      let ongoingSub = 0;
      activeCatTasks.forEach(t => {
        t.subtasks?.forEach(s => {
          if (s.status !== 'completed') ongoingSub += 1;
        });
      });

      const completedMain = completedCatTasks.length;
      // Tamamlanan alt görevler, ana görevin GÜNCEL durumundan bağımsız sayılır
      // (Genel Özet'teki "Toplam Tamamlanan Alt Görev" ile aynı mantık).
      let completedSub = 0;
      catTasks.forEach(t => {
        t.subtasks?.forEach(s => {
          if (s.status === 'completed') completedSub += 1;
        });
      });

      const rows: LegendRow[] = [
        {
          key: 'ongoingMain',
          label: 'Devam Eden Ana Görevler',
          value: ongoingMain,
          color: AnalysisChartColors.ongoingMain,
        },
        {
          key: 'ongoingSub',
          label: 'Devam Eden Alt Görevler',
          value: ongoingSub,
          color: AnalysisChartColors.ongoingSub,
        },
        {
          key: 'completedMain',
          label: 'Tamamlanan Ana Görevler',
          value: completedMain,
          color: AnalysisChartColors.completedMain,
        },
        {
          key: 'completedSub',
          label: 'Tamamlanan Alt Görevler',
          value: completedSub,
          color: AnalysisChartColors.completedSub,
        },
      ];

      return { key: cat.key, label: cat.label, rows };
    });
  }, [tasks]);

  // 🔸 Genel Özet — TÜM vadelerin toplamı (4 kategori)
  const summaryRows = useMemo<LegendRow[]>(() => {
    let completedMain = 0;
    let completedSub = 0;
    let cancelledMain = 0;
    // "İptal Edilen Alt Görev": kendisi tamamlanmamış AMA ana görevi iptal
    // edilmiş alt görevler — CANLI türetilir (subtask.status hiçbir zaman
    // 'cancelled' olarak yazılmaz, bkz. taskModel.ts). Ana görev yeniden
    // aktifleştirildiğinde bu sayı otomatik düşer (statik/cache değil).
    let cancelledSub = 0;

    tasks.forEach(t => {
      if (t.status === 'completed') {
        completedMain += 1;
      } else if (t.status === 'cancelled') {
        cancelledMain += 1;
      }

      t.subtasks?.forEach(s => {
        if (s.status === 'completed') {
          completedSub += 1;
        } else if (t.status === 'cancelled') {
          cancelledSub += 1;
        }
      });
    });

    return [
      {
        key: 'completedMain',
        label: 'Toplam Tamamlanan Ana Görev',
        value: completedMain,
        color: AnalysisChartColors.completedMain,
      },
      {
        key: 'completedSub',
        label: 'Toplam Tamamlanan Alt Görev',
        value: completedSub,
        color: AnalysisChartColors.completedSub,
      },
      {
        key: 'cancelledMain',
        label: 'Toplam İptal Edilen Ana Görev',
        value: cancelledMain,
        color: AnalysisChartColors.cancelledMain,
      },
      {
        key: 'cancelledSub',
        label: 'Toplam İptal Edilen Alt Görev',
        value: cancelledSub,
        color: AnalysisChartColors.cancelledSub,
      },
    ];
  }, [tasks]);

  // ------------------------------------------------------------
  // 🖼️ Render
  // ------------------------------------------------------------
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView ref={scrollRef} contentContainerStyle={styles.container}>
        <Text style={styles.header}>Analiz</Text>

        {/* 🔸 Genel Özet — tüm vadelerin toplamı */}
        <StatCard title="Genel Özet" rows={summaryRows} />

        {/* 🔸 Kısa / Orta / Uzun Vadeli Kartlar — Devam Eden + Tamamlanan Ana/Alt */}
        {categoryStats.map(cat => (
          <StatCard key={cat.key} title={cat.label} rows={cat.rows} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
