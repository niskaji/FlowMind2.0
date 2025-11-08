// -----------------------------------------------------------
// 🗑️ FlowMind 2.0 — CancelledScreen (MVVM Refactored)
// Görev durumu: "cancelled", "incomplete" veya "partial"
// Bu ekran, iptal edilen veya eksik kalan görevleri listeler.
// Dynamic Island (Safe Area) uyumlu hale getirilmiştir.
// -----------------------------------------------------------

import { useRef } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // ✅ Çentik uyumu

import TaskCard from '../../components/TaskCard/TaskCard';
import { useTaskContext } from '../../context/TaskContext';
import { useSmartScroll } from '../../hooks/useSmartScroll';

import { styles } from './CancelledScreen.styles'; // 🎨 Ayrı stil dosyası

// ------------------------------------------------------------
// 🧠 Logic Section — Veri Hazırlığı & Filtreleme
// ------------------------------------------------------------
export default function CancelledScreen() {
  const { state } = useTaskContext();
  const allTasks = state?.tasks || [];

  // 🔹 Scroll referansı & SmartScroll Hook
  const scrollRef = useRef<ScrollView>(null);
  useSmartScroll(scrollRef, {
    resetOnFocus: true, // sekme değişiminde en üste kaydır
    autoScrollToEnd: false,
  });

  // 🔹 İptal edilen veya eksik görevleri filtrele
  const cancelledTasks = allTasks.filter(
    task =>
      task.status === 'cancelled' || task.status === 'incomplete' || task.status === 'partial',
  );

  // ------------------------------------------------------------
  // 🖼️ Render Section — Arayüz & Layout
  // ------------------------------------------------------------
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView ref={scrollRef} contentContainerStyle={styles.container}>
        <Text style={styles.title}>İptal Edilen ve Eksik Görevler</Text>

        {cancelledTasks.length > 0 ? (
          cancelledTasks.map(task => <TaskCard key={task.id} task={task} />)
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Harika! Şu anda iptal edilmiş veya eksik görev bulunmuyor 🎉
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
