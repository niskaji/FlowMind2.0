// -----------------------------------------------------------
// 📊 FlowMind 2.0 — AnalysisScreen (MVVM Refactored)
// Tüm stiller ayrı bir dosyada toplandı
// -----------------------------------------------------------

import { useMemo, useRef } from 'react';
import { Dimensions, ScrollView, Text, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTaskContext } from '../../context/TaskContext';
import { useSmartScroll } from '../../hooks/useSmartScroll';
import { Task } from '../../models/taskModel';
import { Colors } from '../../styles/colors';

import { styles } from './AnalysisScreen.styles';

const screenWidth = Dimensions.get('window').width;

// 🎨 Chart config — (stillerden bağımsız, mantıksal config)
const chartConfig = {
  color: () => Colors.textPrimary,
  backgroundColor: Colors.background,
  backgroundGradientFrom: Colors.background,
  backgroundGradientTo: Colors.background,
};

export default function AnalysisScreen(): JSX.Element {
  const { state } = useTaskContext();
  const tasks: Task[] = state?.tasks ?? [];
  const removedTasks: Task[] = state?.removedTasks ?? [];

  // 🔹 Scroll referansı ve Smart Scroll Hook
  const scrollRef = useRef<ScrollView>(null);
  useSmartScroll(scrollRef, { resetOnFocus: true });

  // 🔹 useMemo ile sabit kategori tanımı
  const categories = useMemo(
    () => [
      { key: 'short' as const, label: 'Kısa Vadeli Görevler' },
      { key: 'medium' as const, label: 'Orta Vadeli Görevler' },
      { key: 'long' as const, label: 'Uzun Vadeli Görevler' },
    ],
    [],
  );

  const groupByCategory = (category: Task['category']) =>
    tasks.filter(t => t.category === category);

  // 🔸 Kategori kartı render fonksiyonu
  const renderCategory = (categoryKey: Task['category'], label: string) => {
    const catTasks = groupByCategory(categoryKey);
    const completed = catTasks.filter(t => t.status === 'completed').length;
    const ongoing = catTasks.filter(t => t.status !== 'completed').length;

    const data = [
      {
        name: 'Tamamlanan',
        population: completed,
        color: Colors.success,
        legendFontColor: Colors.textPrimary,
        legendFontSize: 13,
      },
      {
        name: 'Devam Eden',
        population: ongoing,
        color: Colors.warning,
        legendFontColor: Colors.textPrimary,
        legendFontSize: 13,
      },
    ];

    const total = completed + ongoing;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    return (
      <View style={[styles.card, styles.shadow]} key={label}>
        <Text style={styles.cardTitle}>{label}</Text>

        <View style={styles.row}>
          {/* Sol taraf */}
          <View style={styles.legendContainer}>
            <Text style={[styles.statusText, { color: Colors.success }]}>
              ● Tamamlanan: {completed}
            </Text>
            <Text style={[styles.statusText, { color: Colors.warning }]}>
              ● Devam Eden: {ongoing}
            </Text>
          </View>

          {/* Sağ taraf */}
          <PieChart
            data={data}
            width={Math.max(160, screenWidth * 0.42)}
            height={130}
            chartConfig={chartConfig as any}
            accessor="population"
            backgroundColor="transparent"
            center={[0, 0]}
            hasLegend={false}
            paddingLeft="12"
            absolute
          />
        </View>

        <Text style={styles.percentText}>Tamamlanma Oranı: %{percent}</Text>
      </View>
    );
  };

  // ✅ Genel analiz hesaplamaları
  const completedMainTasks = tasks.filter(
    t =>
      t.status === 'completed' && (!t.subtasks || t.subtasks.every(s => s.status === 'completed')),
  );

  const partialCompletedTasks = tasks.filter(
    t =>
      t.status === 'completed' &&
      t.subtasks?.length &&
      t.subtasks.some(s => s.status !== 'completed'),
  );

  const cancelledMainTasks = removedTasks;

  // 📊 Dataset'ler
  const completedData = [
    {
      name: 'Tamamlanan Ana Görevler',
      population: completedMainTasks.length,
      color: Colors.success,
      legendFontColor: Colors.textPrimary,
      legendFontSize: 13,
    },
    {
      name: 'Kısmen Tamamlanan Ana Görevler',
      population: partialCompletedTasks.length,
      color: Colors.warning,
      legendFontColor: Colors.textPrimary,
      legendFontSize: 13,
    },
  ];

  const cancelledData = [
    {
      name: 'İptal Edilen Ana Görevler',
      population: cancelledMainTasks.length,
      color: Colors.error,
      legendFontColor: Colors.textPrimary,
      legendFontSize: 13,
    },
  ];

  const completedTotal = completedMainTasks.length + partialCompletedTasks.length;
  const completedPercent =
    completedTotal > 0 ? Math.round((completedMainTasks.length / completedTotal) * 100) : 0;

  const totalTasks = tasks.length + removedTasks.length;
  const cancelledPercent =
    totalTasks > 0 ? Math.round((cancelledMainTasks.length / totalTasks) * 100) : 0;

  // ------------------------------------------------------------
  // 🖼️ Render
  // ------------------------------------------------------------
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView ref={scrollRef} contentContainerStyle={styles.container}>
        <Text style={styles.header}>Analiz</Text>

        {/* 🔸 Kısa / Orta / Uzun Vadeli Kartlar */}
        {categories.map(cat => renderCategory(cat.key, cat.label))}

        {/* 🟩 Tamamlanan Görevler */}
        <View style={[styles.card, styles.shadow]}>
          <Text style={styles.cardTitle}>Tamamlanan Görevler</Text>

          <View style={styles.row}>
            <View style={styles.legendContainer}>
              <Text style={[styles.statusText, { color: Colors.success }]}>
                ● Tamamlanan Ana Görevler: {completedMainTasks.length}
              </Text>
              <Text style={[styles.statusText, { color: Colors.warning }]}>
                ● Kısmen Tamamlanan Ana Görevler: {partialCompletedTasks.length}
              </Text>
            </View>

            <PieChart
              data={completedData}
              width={Math.max(160, screenWidth * 0.42)}
              height={130}
              chartConfig={chartConfig as any}
              accessor="population"
              backgroundColor="transparent"
              center={[0, 0]}
              hasLegend={false}
              paddingLeft="12"
              absolute
            />
          </View>

          <Text style={styles.percentText}>Tamamlanma Oranı: %{completedPercent}</Text>
        </View>

        {/* 🗑️ İptal Edilen Görevler */}
        {cancelledMainTasks.length > 0 && (
          <View style={[styles.card, styles.shadow]}>
            <Text style={styles.cardTitle}>İptal Edilen Görevler</Text>

            <View style={styles.row}>
              <View style={styles.legendContainer}>
                <Text style={[styles.statusText, { color: Colors.error }]}>
                  ● İptal Edilen Ana Görevler: {cancelledMainTasks.length}
                </Text>
              </View>

              <PieChart
                data={cancelledData}
                width={Math.max(160, screenWidth * 0.42)}
                height={130}
                chartConfig={chartConfig as any}
                accessor="population"
                backgroundColor="transparent"
                center={[0, 0]}
                hasLegend={false}
                paddingLeft="12"
                absolute
              />
            </View>

            <Text style={styles.percentText}>İptal Oranı: %{cancelledPercent}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
