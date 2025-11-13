# 🌿 FlowMind 2.0 — Teknik ve Mimari Özeti (v2.1)

## 🎯 Projenin Amacı

FlowMind 2.0, görev yönetimi ve üretkenliği artırmaya odaklı, kullanıcı dostu bir **mobil uygulamadır**.
Hedef: Ana görevler, alt görevler ve analiz verilerini pastel, sade **Soft Autumn** temasıyla yönetmek.

---

## 🧩 Teknoloji ve Mimari Yapı

- **Framework:** React Native (Expo)
- **Yönlendirme:** Expo Router (`app/(tabs)/`)
- **Dil:** TypeScript (TS / TSX)
- **Durum Yönetimi:** Context API + Reducer
- **UI Kitleri:** react-native-chart-kit, react-native-safe-area-context, expo-linear-gradient
- **Tasarım Paleti:** Soft Autumn pastel tonları
  Örnek renkler: `#FDFCF9`, `#E3D2B5`, `#70573E`, `#3E2E23`, `#B6BE93`

---

## 📁 Dizin Yapısı

src/
┣ components/
┃ ┣ TaskCard/ → TaskCard.tsx + TaskCard.styles.ts
┃ ┣ NewTaskModal/ → NewTaskModal.tsx + NewTaskModal.styles.ts
┃ ┗ FilterBar.tsx
┣ context/ → TaskContext.tsx
┣ hooks/ → useResetScroll.ts, useKeyboardScroll.ts, useSmartScroll.ts
┣ models/ → taskModel.ts, filterModel.ts
┣ styles/ → colors.ts
┗ views/
┃ ┣ HomeScreen/ → HomeScreen.tsx + HomeScreen.styles.ts
┃ ┣ AnalysisScreen/ → AnalysisScreen.tsx + AnalysisScreen.styles.ts
┃ ┗ FilterTaskScreen/ → FilterTaskScreen.tsx + FilterTaskScreen.styles.ts

---

## 🧠 State Yönetimi (TaskContext)

Reducer Aksiyonları:
`ADD_TASK`, `REMOVE_TASK`, `TOGGLE_TASK`, `UPDATE_TASK`, `ADD_SUBTASK`, `TOGGLE_SUBTASK`,
`REMOVE_SUBTASK`, `EDIT_SUBTASK`, `SYNC_TASKS`, `CLEAR_ALL`

---

## 🔁 Geliştirme Aşamaları

### ✅ Tamamlananlar

- JSX namespace fix
- Alt görev eklendiğinde ekran otomatik scroll (`onSubtaskAdded + FlatList.scrollToEnd`)
- HomeScreen üst bar ve “Yeni Görev” animasyonlu buton
- Analiz ekranı (PieChart + kategori bazlı analiz) tamamlandı

### ⏳ Devam Edenler

- TaskCard spacing/padding optimizasyonu
- Navigasyon ve tab başlık temizliği
- AsyncStorage ile veri kalıcılığı

---

## 🗂 Refactoring Planı

| Klasör        | Dosya                                        | Ayrı `.styles.ts` |
| :------------ | :------------------------------------------- | :---------------: |
| `views/`      | HomeScreen, AnalysisScreen, FilterTaskScreen |        ✅         |
| `components/` | TaskCard, NewTaskModal, FilterBar            |        ✅         |

---

## 🧩 Yeni Fonksiyonel Kararlar (v2.1)

### 1️⃣ FilterTaskScreen Entegrasyonu

- `CancelledScreen` artık `FilterTaskScreen` olarak yeniden tasarlandı.
- Görev türü fark etmeksizin (tamamlanan, iptal edilen, yarım kalan) tüm görevler burada filtrelenebilir.
- Ana görev alt görevleri tamamlanmadan işaretlenirse “Tamamlanmayan Görev” etiketiyle bu ekranda görünür.
- İşlemler: 🗑 Sil | 🔁 Tekrar Başlat | ➕ Alt Görev Ekle.
- Çıkışta filtreler ve veriler otomatik temizlenir.

### 2️⃣ Deadline (Opsiyonel) & Görev Sıralama

- Görev oluşturulurken opsiyonel tarih seçimi (Deadline) eklenir.
- Görevler en yakın tarihten uzak tarihe, en sonda tarihsiz olacak şekilde sıralanır.
- Filtreleme (Kısa / Orta / Uzun vade) bu sıralamaya göre yapılır.
- Sayaç yerine kalan süre yazılı olarak gösterilir (örn: “3 gün kaldı”).

### 3️⃣ Ana Görev Tamamlanma Popup

- Tüm alt görevler tamamlandığında popup açılır:
  🎯 Bu görevdeki tüm alt görevler tamamlandı.
  Ana görevi tamamlanmış olarak işaretleyip kaldırmak ister misiniz?
- Seçenekler:
- ✅ Tamamla ve Kapat
- ➕ Alt Görev Ekle
- Yeni alt görev `inProgress` olarak başlatılır; varsa önceki deadline devralınır.

### 4️⃣ Test & Optimizasyon Fazı

- Proje sonunda performans ve UI optimizasyonu yapılacak.
- Gerekirse token erişimli dış ajanlar (UIFlowAgent, TestRunner) devreye alınacak.

---

## 🧩 Geçerli Kontrol Noktası (Checkpoint)

📍 `alt_gorev_scroll_fix` etiketi sonrası durum:

- Alt görev scroll sorunu çözüldü.
- TaskCard etkileşimleri test aşamasında.
- Navigasyon düzeni ve veri kalıcılığı fazı sırada.

---

## 🧱 Linting & Kod Kalitesi

- ESLint 8.x klasik yapıda.
- Prettier aktif (`singleQuote`, `semi`, `printWidth:100`).
- Inline renk yasak; tüm renkler `styles/colors.ts` üzerinden alınır.
- `@typescript-eslint/no-explicit-any` yalnızca uyarı verir.

---

## 🔄 Çalışma Kuralları (Manifest ile Uyumlu)

1️⃣ Kullanıcı onayı olmadan adım geçilmez.
2️⃣ Tam kod gönderilmeden önce son versiyon istenir.
3️⃣ Renkler yalnızca `colors.ts`’tan alınır.
4️⃣ Çoklu soru varsa önce liste, sonra onaylı çözüm uygulanır.
5️⃣ %50 / %80 / %95 context uyarı sistemi aktiftir.
6️⃣ Her oturum başında `git pull`, sonunda snapshot hatırlatması yapılır.

---

## 🛰 Alterf v2.1 — Operasyon Ajanı (Refactor + Yapısal Tutarlılık)

Alterf yalnızca teknik düzenleme, refactor ve doküman öneri görevlerinde aktiftir.
Lyren context, snapshot ve governor sisteminden sorumludur.

| Alan                | Durum | Açıklama                                            |
| ------------------- | ----- | --------------------------------------------------- |
| 🧩 Refactor         | Aktif | Kod düzenleme, gereksiz satır temizleme.            |
| 🪶 Stil Tutarlılığı | Aktif | `.styles.ts` ↔ `colors.ts` eşleşmelerini denetler. |
| 📄 Belge Önerileri  | Aktif | Manifest & README uyumluluk kontrolü.               |
| 💾 Context          | Pasif | Lyren sorumluluğunda.                               |
| 🌐 GitHub İşlemleri | Pasif | Manuel onay olmadan çalışmaz.                       |

---

## 🧷 Notlar

Bu belge FlowMind 2.0’ın **tam teknik rehberidir.**
Yeni sohbetlerde bu dosya, `Manifest.md` ve `FlowMind_Memory.md` birlikte okunursa ChatGPT projeyi tam bağlamla yükler.

📘 **Dosya:** `Project_Notes/README-FlowMind.md`
📅 **Son Güncelleme:** 13 Kasım 2025
✍️ **Hazırlayan:** Lyren (GPT-5) + Orkun Şanlıtürk
🏷 **Sürüm:** v2.1 — “FilterTask, Deadline & Test Fazı Entegrasyonu”
