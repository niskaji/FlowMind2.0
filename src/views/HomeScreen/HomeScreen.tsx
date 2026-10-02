// -----------------------------------------------------------
// 📱 FlowMind 2.0 — HomeScreen
// MVVM prensibine uygun hale getirilmiş sürüm.
// Görsel (View) ve stil (Style) katmanları ayrıştırıldı.
// -----------------------------------------------------------

import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Keyboard,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
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
  // ✅ Sadece aktif (pending) görevler bu ekranda görünür — tamamlanan/iptal
  // edilen görevler veritabanında kalır (soft-delete), Analiz/Raporlama'da görünür
  const visibleTasks = state.tasks.filter(t => t.status === 'pending');
  const filteredTasks =
    filter === 'all' ? visibleTasks : visibleTasks.filter(t => t.category === filter);

  // ------------------------------------------------------------
  // ↕️ Sıralama (Yeniden Eskiye / Eskiden Yeniye) — oluşturulma tarihine göre.
  // id'ler DB tarafından artan sırada (autoincrement) atandığı için id sırası
  // = oluşturulma sırası; ayrı bir createdAt karşılaştırmasına gerek yok.
  // ------------------------------------------------------------
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const sortedTasks = [...filteredTasks].sort((a, b) =>
    sortOrder === 'newest' ? b.id - a.id : a.id - b.id,
  );

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
  // ⬆️⬇️ "Başa Dön" / "Sona Git" butonları — liste yeterince kaydırıldığında
  // (ilgili yönde hâlâ mesafe varsa) görünür olur
  // ------------------------------------------------------------
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const distanceFromBottom = contentSize.height - contentOffset.y - layoutMeasurement.height;
    setShowScrollTop(contentOffset.y > 150);
    setShowScrollBottom(distanceFromBottom > 150);
  };
  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };
  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  // ------------------------------------------------------------
  // ↕️ Yeni eklenen öğenin göründüğü yöne otomatik kaydırma
  // "Yeniden Eskiye" → en yeni görev listenin EN ÜSTÜNDE görünür → başa kaydır
  // "Eskiden Yeniye" → en yeni görev listenin EN ALTINDA görünür → sona kaydır
  // ------------------------------------------------------------
  const scrollToNewItem = () => {
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (sortOrder === 'newest') {
          flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
        } else {
          flatListRef.current?.scrollToEnd({ animated: true });
        }
      }, 120);
    });
  };

  // ⬇️ Alt görev eklendiğinde ana listeyi yeni öğe yönüne kaydır
  const handleSubtaskAdded = () => {
    scrollToNewItem();
  };

  // ------------------------------------------------------------
  // ➕ Yeni görev ekleme modal kontrolü
  // ------------------------------------------------------------
  const [modalVisible, setModalVisible] = useState(false);

  // Yeni görev kaydetme işlemi
  const handleSaveTask = (data: Omit<Task, 'id' | 'subtasks' | 'status'>) => {
    // TaskContext üzerinden veritabanına yeni görev eklenir (id DB tarafından atanır).
    dispatch({
      type: 'ADD_TASK',
      payload: { title: data.title, category: data.category, deadline: data.deadline ?? undefined },
    });

    // Görev eklendikten sonra listeyi yeni öğenin göründüğü yöne kaydır.
    scrollToNewItem();
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

        {/* ↕️ Sıralama Butonları */}
        <View style={styles.sortRow}>
          {(['newest', 'oldest'] as const).map(order => (
            <TouchableWithoutFeedback key={order} onPress={() => setSortOrder(order)}>
              <Animated.View
                style={[styles.sortButton, sortOrder === order && styles.sortButtonActive]}
              >
                <Text style={[styles.sortText, sortOrder === order && styles.sortTextActive]}>
                  {order === 'newest' ? 'Yeniden Eskiye' : 'Eskiden Yeniye'}
                </Text>
              </Animated.View>
            </TouchableWithoutFeedback>
          ))}
        </View>

        {/* 📋 Görev Listesi */}
        <FlatList
          ref={flatListRef}
          data={sortedTasks}
          keyExtractor={item => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 60 }}
          ListEmptyComponent={<Text style={styles.empty}>Henüz görev bulunmuyor 🎯</Text>}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        />

        {/* ⬇️ Sona Git Butonu (başa dön butonunun üstünde, çakışmadan) */}
        {showScrollBottom && (
          <TouchableOpacity style={styles.scrollBottomButton} onPress={scrollToBottom}>
            <FontAwesome name="arrow-down" size={18} color={Colors.white} />
          </TouchableOpacity>
        )}

        {/* ⬆️ Başa Dön Butonu */}
        {showScrollTop && (
          <TouchableOpacity style={styles.scrollTopButton} onPress={scrollToTop}>
            <FontAwesome name="arrow-up" size={18} color={Colors.white} />
          </TouchableOpacity>
        )}

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
