// -----------------------------------------------------------
// 📱 FlowMind 2.0 — HomeScreen
// MVVM prensibine uygun hale getirilmiş sürüm.
// Görsel (View) ve stil (Style) katmanları ayrıştırıldı.
// -----------------------------------------------------------

import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import { Animated, FlatList, Keyboard, Text, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Uygulama içi bileşenler ve modeller
import NewTaskModal from '../../components/NewTaskModal/NewTaskModal';
import TaskCard from '../../components/TaskCard/TaskCard';
import { useTaskContext } from '../../context/TaskContext';
import { Task } from '../../models/taskModel';

// 🎨 Ayrı stil dosyasından stilleri alıyoruz
import { Colors } from '../../styles/colors';

import { styles } from './HomeScreen.styles';

export default function HomeScreen() {
  // -----------------------------------------------------------------
  // 🧩 Context (ViewModel) erişimi
  // TaskContext, uygulamanın merkezi state'ini yönetir.
  // Buradan hem state (veri) hem de dispatch (aksiyon) alınır.
  // -----------------------------------------------------------------
  const { state, dispatch } = useTaskContext();

  // ------------------------------------------------------------
  // ⚙️ Animasyon kontrolü (Yeni Görev butonundaki scale efekti)
  // ------------------------------------------------------------
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const animateButton = (toValue: number) => {
    Animated.spring(scaleAnim, {
      toValue,
      friction: 3,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  // ------------------------------------------------------------
  // 🔍 Filtreleme (Kısa / Orta / Uzun / Tümü)
  // ------------------------------------------------------------
  const [filter, setFilter] = useState<'all' | 'short' | 'medium' | 'long'>('all');
  const filteredTasks =
    filter === 'all' ? state.tasks : state.tasks.filter(t => t.category === filter);

  // ------------------------------------------------------------
  // 🧭 FlatList referansı ve Navigation event'leri
  // ------------------------------------------------------------
  const flatListRef = useRef<FlatList<Task>>(null);
  const navigation = useNavigation();

  // Sayfa yeniden odaklandığında (örneğin Analiz ekranından geri dönünce)
  // listenin en başa kaymasını sağlar.
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
        }, 50);
      });
    });
    return unsubscribe;
  }, [navigation]);

  // ------------------------------------------------------------
  // ⬇️ Alt görev eklendiğinde ana listeyi en alta kaydır
  // ------------------------------------------------------------
  const handleSubtaskAdded = () => {
    requestAnimationFrame(() => {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 120);
    });
  };

  // ------------------------------------------------------------
  // ➕ Yeni görev ekleme modal kontrolü
  // ------------------------------------------------------------
  const [modalVisible, setModalVisible] = useState(false);

  // Yeni görev kaydetme işlemi
  const handleSaveTask = (data: Omit<Task, 'id' | 'subtasks' | 'status'>) => {
    const id = Date.now().toString();
    const newTask: Task = {
      id,
      title: data.title,
      category: data.category,
      status: 'pending',
      subtasks: [],
    };

    // TaskContext üzerinden state'e yeni görev eklenir.
    dispatch({ type: 'ADD_TASK', payload: newTask });

    // Görev eklendikten sonra listeyi en alta kaydır.
    requestAnimationFrame(() => {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 120);
    });
  };

  // ------------------------------------------------------------
  // 🪄 FlatList renderItem — her bir TaskCard bileşeni
  // ------------------------------------------------------------
  const renderItem = ({ item }: { item: Task }) => (
    <TaskCard task={item} onSubtaskAdded={handleSubtaskAdded} />
  );

  // ------------------------------------------------------------
  // 🎨 Ekran render'ı
  // ------------------------------------------------------------
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Başlık */}
        <Text style={styles.header}>Görevler</Text>

        {/* ➕ Yeni Görev Butonu */}
        <TouchableWithoutFeedback
          onPressIn={() => animateButton(0.97)}
          onPressOut={() => animateButton(1)}
          onPress={() => {
            Keyboard.dismiss();
            setModalVisible(true);
          }}
        >
          <Animated.View style={[styles.addButtonTop, { transform: [{ scale: scaleAnim }] }]}>
            <LinearGradient
              colors={[Colors.lightGreen, Colors.oliveSoft]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradient}
            >
              <Text style={styles.addText}>+ Yeni Görev</Text>
            </LinearGradient>
          </Animated.View>
        </TouchableWithoutFeedback>

        {/* 🔖 Filtre Butonları */}
        <View style={styles.filterRow}>
          {(['all', 'short', 'medium', 'long'] as const).map(cat => (
            <TouchableWithoutFeedback key={cat} onPress={() => setFilter(cat)}>
              <Animated.View
                style={[
                  styles.filterButton,
                  filter === cat && { backgroundColor: Colors.oliveSoft },
                ]}
              >
                <Text style={[styles.filterText, filter === cat && styles.filterTextActive]}>
                  {cat === 'all'
                    ? 'Tümü'
                    : cat === 'short'
                      ? 'Kısa'
                      : cat === 'medium'
                        ? 'Orta'
                        : 'Uzun'}
                </Text>
              </Animated.View>
            </TouchableWithoutFeedback>
          ))}
        </View>

        {/* 📋 Görev Listesi */}
        <FlatList
          ref={flatListRef}
          data={filteredTasks}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 60 }}
          ListEmptyComponent={<Text style={styles.empty}>Henüz görev bulunmuyor 🎯</Text>}
        />

        {/* 🪄 Yeni Görev Modal */}
        <NewTaskModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSave={handleSaveTask}
          defaultCategory={filter === 'all' ? 'short' : filter}
        />
      </View>
    </SafeAreaView>
  );
}
