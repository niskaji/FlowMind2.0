// -----------------------------------------------------------
// 📅 FlowMind 2.0 — DeadlinePicker Component
// Görev oluşturma/düzenleme akışında son tarih (deadline) seçimi
// -----------------------------------------------------------

import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';

import { formatDateTR, parseDateOnlyISO, toDateOnlyISO } from '../../utils/dateUtils';

import { styles } from './DeadlinePicker.styles';

interface DeadlinePickerProps {
  value?: string; // "YYYY-MM-DD"
  onChange: (value: string | undefined) => void;
  // Seçilebilecek en geç tarih (örn. alt görev, bağlı olduğu ana görevin
  // deadline'ını geçemez) — verilmezse herhangi bir tarih seçilebilir.
  maximumDate?: Date;
}

// 🛡️ Native DateTimePicker (Android/iOS) bazı sürümlerde maximumDate hiç
// verilmediğinde (undefined) veya minimumDate'ten önceki bir tarih olarak
// verildiğinde ("ters aralık": max < min) ara sıra sessiz native crash
// yaşanabildiği bilinen bir risktir (bkz. react-native-datetimepicker
// GitHub issue #996, #253 — minimumDate/maximumDate tutarsızlığı native
// tarafta beklenmeyen davranışa yol açabiliyor). Bu yüzden maximumDate'i
// hiç geçmemek yerine her zaman açık, geçerli ve minimumDate'ten (bugün)
// büyük/eşit bir Date veriyoruz.
const FAR_FUTURE_DATE = new Date(2099, 11, 31);

export default function DeadlinePicker({ value, onChange, maximumDate }: DeadlinePickerProps) {
  const [showPicker, setShowPicker] = useState(false);

  // Geçmiş tarihler seçilemez — takvimde bugünden önceki günler pasif görünür.
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // "Henüz seçilmedi" durumunda picker BUGÜNÜ gösterir (asla epoch/1970'e
  // düşmez). Düzenlenen görevin deadline'ı zaten geçmişse (overdue), picker'ın
  // başlangıç konumu minimumDate ile çelişmesin diye bugüne sabitlenir —
  // kullanıcı dokunmadığı sürece kayıtlı değer değişmez.
  const parsedDate = value ? parseDateOnlyISO(value) : today;
  const currentDate = parsedDate < today ? today : parsedDate;

  // maximumDate hiç verilmemişse veya (ana görev overdue olduğu için)
  // bugünden önceyse, native tarafa her zaman geçerli/tutarlı bir üst sınır
  // gitsin diye uzak bir gelecek tarihe düşüyoruz — yukarıdaki risk notuna bak.
  const effectiveMaximumDate =
    maximumDate && maximumDate >= today ? maximumDate : FAR_FUTURE_DATE;

  const handleChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') setShowPicker(false);
    if (event.type === 'dismissed' || !selected) return;
    onChange(toDateOnlyISO(selected));
  };

  // 🍏 iOS — 'compact' modu native, her zaman görünür küçük bir kontrol
  // olarak render edilir; dokunulduğunda kendi popover takvimini açar.
  // Kendi tetikleyici butonumuzu koyarsak çift dokunma gerekir, bu yüzden
  // native kontrolü DOĞRUDAN gösteriyoruz (eski 'inline' modu satırın
  // içinde kocaman bir takvim açıp layout'u bozuyordu).
  if (Platform.OS === 'ios') {
    return (
      <View style={styles.row}>
        <Text style={styles.iosLabel}>📅 Son Tarih:</Text>
        <DateTimePicker
          value={currentDate}
          mode="date"
          display="compact"
          onChange={handleChange}
          minimumDate={today}
          maximumDate={effectiveMaximumDate}
        />
        {value && (
          <TouchableOpacity style={styles.clearButton} onPress={() => onChange(undefined)}>
            <Text style={styles.clearText}>Kaldır</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // 🤖 Android — 'default' modu bir dialog olarak açılır, kendi butonumuzla tetikleriz.
  return (
    <View>
      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={() => setShowPicker(true)}>
          <Text style={styles.buttonText}>
            {value ? `📅 ${formatDateTR(value)}` : '📅 Son Tarih Seç'}
          </Text>
        </TouchableOpacity>

        {value && (
          <TouchableOpacity style={styles.clearButton} onPress={() => onChange(undefined)}>
            <Text style={styles.clearText}>Kaldır</Text>
          </TouchableOpacity>
        )}
      </View>

      {showPicker && (
        <DateTimePicker
          value={currentDate}
          mode="date"
          display="default"
          onChange={handleChange}
          minimumDate={today}
          maximumDate={effectiveMaximumDate}
        />
      )}
    </View>
  );
}
