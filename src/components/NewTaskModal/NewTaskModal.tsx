// -----------------------------------------------------------
// 📋 FlowMind 2.0 — NewTaskModal Component
// MVVM prensibine göre refaktored (stiller ayrı dosyada)
// -----------------------------------------------------------

import { useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import type { Task } from '../../models/taskModel';
import { Colors } from '../../styles/colors';

import { styles } from './NewTaskModal.styles'; // 🎨 Ayrı stil dosyası import edildi

interface Props {
  visible: boolean;
  onClose: () => void;

  onSave: (data: Omit<Task, 'id' | 'subtasks' | 'status'>) => void;
  defaultCategory?: Task['category'];
}

export default function NewTaskModal({
  visible,
  onClose,
  onSave,
  defaultCategory = 'short',
}: Props) {
  // ------------------------------------------------------------
  // 🧠 Local state ve input referansları
  // ------------------------------------------------------------
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Task['category']>(defaultCategory);
  const inputRef = useRef<TextInput>(null);

  // ------------------------------------------------------------
  // 🔹 Modal açıldığında input’a otomatik odaklama
  // ------------------------------------------------------------
  useEffect(() => {
    if (visible) {
      Keyboard.dismiss();
      setTitle('');
      setCategory(defaultCategory);

      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [visible, defaultCategory]);

  // ------------------------------------------------------------
  // 💾 Kaydetme işlemi
  // ------------------------------------------------------------
  const handleSave = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    onSave({ title: trimmed, category });
    onClose();
    setTitle('');
  };

  // ------------------------------------------------------------
  // 🎨 Render
  // ------------------------------------------------------------
  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      {/* Arka plan (karartma) */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      {/* Modal içeriği */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.center}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Yeni Görev</Text>

          {/* Görev Adı Alanı */}
          <Text style={styles.label}>Görev Adı</Text>
          <TextInput
            ref={inputRef}
            value={title}
            onChangeText={setTitle}
            placeholder="Örn: Haftalık raporu hazırla"
            placeholderTextColor={Colors.textSecondary}
            style={styles.input}
            returnKeyType="done"
            onSubmitEditing={handleSave}
          />

          {/* Vade Seçimi */}
          <Text style={[styles.label, { marginTop: 12 }]}>Vade</Text>
          <View style={styles.segment}>
            {(['short', 'medium', 'long'] as const).map(cat => (
              <TouchableOpacity
                key={cat}
                onPress={() => setCategory(cat)}
                style={[styles.segmentBtn, category === cat && styles.segmentBtnActive]}
              >
                <Text style={[styles.segmentText, category === cat && styles.segmentTextActive]}>
                  {cat === 'short' ? 'Kısa' : cat === 'medium' ? 'Orta' : 'Uzun'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Alt Butonlar */}
          <View style={styles.row}>
            <TouchableOpacity style={[styles.btn, styles.cancel]} onPress={onClose}>
              <Text style={styles.btnText}>Vazgeç</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.save]} onPress={handleSave}>
              <Text style={[styles.btnText, { color: Colors.white }]}>Kaydet</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
