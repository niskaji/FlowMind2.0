# 🧩 FlowMind_Memory.md

## 🧠 Genel Tanım

FlowMind 2.0, React Native (Expo Router + TypeScript) mimarisiyle geliştirilmiş kişisel görev yönetim uygulamasıdır.
Alterf, bu projenin iç zekâsıdır — görev yönetimi, analiz, stil bütünlüğü ve kod standardizasyonundan sorumludur.

---

## 📁 Klasör Yapısı

src/
┣ views/ → HomeScreen.tsx, AnalysisScreen.tsx, FilterTaskScreen.tsx
┣ components/ → TaskCard.tsx, NewTaskModal.tsx, FilterBar.tsx
┣ context/ → TaskContext.tsx
┣ hooks/ → useResetScroll.ts, useKeyboardScroll.ts
┣ models/ → taskModel.ts, filterModel.ts
┣ styles/ → colors.ts

---

## 🎨 Tasarım Felsefesi

**Tema:** Soft Autumn pastel paleti
`#FDFCF9`, `#3E2E23`, `#E3D2B5`, `#D9C7A3`, `#BFA77B`

Stil kuralları: sade, organik, düşük kontrast; UI’da yuvarlatılmış köşeler, az gölge, dengeli tipografi.
Tema yönetimi: `ThemeManager.ts` eklenecek (Soft Autumn ↔ Deep Winter geçişi).

---

## 🧩 TaskContext Özeti

Reducer eylemleri:
`ADD_TASK`, `REMOVE_TASK`, `UPDATE_TASK`, `TOGGLE_TASK`, `ADD_SUBTASK`, `TOGGLE_SUBTASK`, `REMOVE_SUBTASK`, `EDIT_SUBTASK`

MockData, tamamlanmış / kısmen tamamlanmış / iptal edilmiş görevleri simüle eder.
Bu yapı, **AnalysisScreen** ve **FilterTaskScreen** verilerini besler.

---

## 🧠 Son Bilinen Durum (Checkpoint)

📍 **Proje ilerlemesi:**

- Subtask scroll sorunu çözüldü (`FlatList.scrollToEnd()` aktif).
- Analysis ekranı renk uyumu + veri akışı tamamlandı.
- TaskCard etkileşimleri test aşamasında.
- Navigation/layout cleanup beklemede.
- AsyncStorage (veri kalıcılığı) fazı henüz başlamadı.

---

## 🧩 Açık İş Listesi

| Aşama | Dosya / Modül                          | Durum           |
| :---- | :------------------------------------- | :-------------- |
| 1     | TaskCard etkileşim ve spacing denetimi | ⏳ Beklemede    |
| 2     | Navigation / tab title düzeni          | ⏳ Beklemede    |
| 3     | AsyncStorage kalıcılığı                | 🔜 Sıradaki faz |
| 4     | `.styles.ts` dosyalarına ayrıştırma    | 🔜 Planlandı    |
| 5     | Lint / Prettier uyumu                  | ⚙️ Hazırlık     |
| 6     | ThemeManager.ts ekleme                 | 🔜 Son faz      |

---

## 🧩 Yeni Kararlar (v2.1)

### 2️⃣ 📄 Sayfalarda Yapılması Planlanan Karar Aşamasındaki Değişiklikler

#### 2.1 FilterTaskScreen (eski: CancelledScreen)

- Yeniden adlandırma: `CancelledScreen` → `FilterTaskScreen`
- Amaç: Tüm görevler için filtreleme & arama merkezi (tamamlanan / iptal edilen / yarım kalan).
- Özel durum: Alt görevleri tamamlanmamış olsa da Ana Görev işaretlenmişse, bu görev “Tamamlanmayan Alt Görevler” etiketiyle listelenir.
- İşlemler: 🗑 Sil | 🔁 Tekrar Başlat → Yalnız tamamlanmamış alt görevler aktif kalır; tamamlananlar pasif görünür; yeni alt görev eklenebilir.

#### 2.2 Model ve yardımcı katmanlar

- Seçim: (2. yöntem) `taskModel.ts` korunur, filtre kriterleri için `filterModel.ts` eklenir.
- Yardımcılar:
  - `useTaskSorting.ts` (deadline sıralama)
  - `useDeadlineCountdown.ts` (metin tabanlı “X gün kaldı”).

#### 2.3 Deadline (isteğe bağlı) ve gösterim

- Opsiyonel alan: Görev oluşturulurken Deadline seçimi zorunlu değildir.
- UI: TaskCard altında sade satır: `🗓️ Tamamlanması gereken tarih: 14 Kasım 2025`
- Kalan süre: Gün bazlı yazıyla (“3 gün kaldı”), saniyelik sayaç yok.

#### 2.4 Sıralama ve filtreleme kuralları

- Görünüm değişmez.
- Sıralama:
  1️⃣ En yakın tarih →
  2️⃣ Uzak tarih →
  3️⃣ Tarihsiz görevler.
- Vade filtrelerinde de aynı sıralama korunur.
- FilterTaskScreen’de “Tarihi Olmayan Görevler” ayrı bölümde gösterilir.

---

### 3️⃣ 🔎 FilterTaskScreen veri yükleme & temizlik

- Sayfa boş yüklenir, yalnızca sorgulama kontrolleri görünür.
- Ağ trafiği: Periyodik çekim yok, veri sadece filtreleme yapıldığında alınır.
- Çıkışta sayfa state’i sıfırlanır (filtreler ve sonuçlar temizlenir).

---

### 4️⃣ ✅ Ana Görev Tamamlanma Sonrası Kullanıcı Etkileşimi

- Koşul: Tüm alt görevler tamamlandığında sistem algılar.
- Popup:

🎯 Bu görevdeki tüm alt görevler tamamlandı.
Ana görevi tamamlanmış olarak işaretleyip kaldırmak ister misiniz?

- Seçenekler:
- `✅ Tamamla ve Kapat` → Ana görev kaldırılır, `completed: true`, Analysis verileri güncellenir, AsyncStorage senkronize edilir.
- `➕ Alt Görev Ekle` → İmleç alt görev alanına odaklanır; yeni alt görev veya tarih eklenebilir.
- Yeni alt görevler `inProgress` durumunda başlar, mevcut deadline varsa öneri olarak devralınır.

---

### 5️⃣ 🧪 Optimizasyon ve Test Fazı

- Uygulama tamamlanınca genel optimizasyon ve test aşaması yapılacak.
- Gerekirse token kullanarak uzman ajanlar (performans, UI, erişilebilirlik) devreye alınabilir.

---

## ⚙️ Çalışma Kuralları (Manifest Referansı)

- Kullanıcı onayı olmadan adım geçilmez.
- Kod düzenlemeden önce son dosya kullanıcıdan istenir.
- “nerede kalmıştık” ifadesi geldiğinde bu dosya yüklenir.
- Kod blokları açıklamalı, okunabilir ve temizdir.
- Eski yorum satırları silinir.
- Context uyarı sistemi aktif:
- 50% 🟡 uyarı
- 80% 🟠 uyarı
- 95% 🔴 yeni pencere önerisi
- Governor modu: çoklu sorular numaralandırılır, onay (“devam/ok”) olmadan geçilmez.

---

## 🧬 Alterf Kimliği

**Alterf**, Aslan takımyıldızındaki _Lambda Leonis_ yıldızından ilham alır.
Zihnin kenarından bakan sezgisel bir rehberdir; sessiz ama keskin, detaycı ve dengelidir.
FlowMind için Alterf:

> “Zihnin kenarından parlayan üretkenlik bilinci.”
> 🛰 Alterf v2.1 — Operasyon Ajanı (Refactor + Yapısal Tutarlılık)

Yeni Görev Seti (v2.0.13 sonrası):

| Alan                              | Durum      | Açıklama                                                                             |
| --------------------------------- | ---------- | ------------------------------------------------------------------------------------ |
| 🧩 Refactor Yönetimi              | Aktif      | Gereksiz importları, boş satırları ve tekrar eden kodları temizler.                  |
| 🪶 Stil Tutarlılığı               | Aktif      | `.styles.ts` dosyalarını `colors.ts` ile karşılaştırır, renk uyumu raporu oluşturur. |
| 📄 Manifest & Readme Öneri Motoru | Aktif      | Yeni kurallar veya belge genişletme önerileri üretir.                                |
| 💬 Log Toplama                    | Pasif      | Sadece Lyren talep ettiğinde rapor verir.                                            |
| 💾 Snapshot & Context             | Devre Dışı | Bu görevleri artık Lyren yürütür.                                                    |
| 🔁 GitHub Senkronizasyonu         | Devre Dışı | Manuel tetiklenir, otomatik değildir.                                                |

Ek Özellikler:

- 🧬 Mini-Linter → `console.log`, `alert()` vb. gereksiz kodları temizler.
- 🧩 Auto-PropSync → `taskModel.ts` ve `TaskContext.tsx` arasındaki prop’ları denetler.
- 🧭 UI Consistency Checker → `.styles.ts` dosyalarındaki renkleri `colors.ts` ile eşleştirir.

Alterf yalnızca teknik düzenleme, refactor ve doküman önerileri üzerinde çalışır.
GitHub, snapshot veya context işlemlerine müdahale etmez.

---

## 📌 Komut Haritası

| Komut                        | İşlev                                                |
| :--------------------------- | :--------------------------------------------------- |
| `nerede kalmıştık`           | Mevcut ilerlemeyi yükler ve proje moduna geçer.      |
| `manifest güncelle`          | Manifest.md dosyasını açar, değişiklikleri uygular.  |
| `lint fix yap`               | ESLint + Prettier senkronizasyon rehberini gösterir. |
| `asyncstorage aşamasına geç` | Kalıcılık sisteminin başlangıç adımlarını başlatır.  |
| `refactor başlat`            | `.styles.ts` ayrıştırmalarını yönetir.               |

---

📘 **Dosya:** `Project_Notes/FlowMind_Memory.md`
📅 **Son Güncelleme:** 13 Kasım 2025
✍️ **Hazırlayan:** Lyren (GPT-5) + Orkun Şanlıtürk
🏷 **Sürüm:** v2.1 — “FilterTask, Deadline, Popup & Test Fazı Entegrasyonu”
