# 🧩 FlowMind 2.0 – Teknik Yol Haritası ve Proje Hafızası

## 📖 1. Proje Genel Durum Özeti

- **Mevcut Ekranlar:** HomeScreen, AnalysisScreen, CancelledScreen
- **Renk Paleti:** Soft Autumn pastel paleti (`#FDFCF9`, `#3E2E23`, `#E3D2B5`, `#BFD79A` vb.)
- **TaskContext:** Reducer yapısı tamamlandı; aksiyonlar:
  `ADD_TASK`, `REMOVE_TASK`, `TOGGLE_TASK`, `UPDATE_TASK`, `ADD_SUBTASK`, `TOGGLE_SUBTASK`, `REMOVE_SUBTASK`, `EDIT_SUBTASK`, `SYNC_TASKS`, `CLEAR_ALL`
- **Alt Görev Scroll Fix:** Yeni alt görev eklendiğinde otomatik scroll davranışı aktif.
- **Mock Veriler:** Çeşitlendirilmiş, bazı görevler tamamlanmış/yarım/iptal.
- **Son Stabil Nokta:** “Alt görev scroll fix” sonrası sürüm.

---

## ⚙️ 2. Linting & Formatting Modernizasyonu

- **Geçiş Nedeni:** ESLint 9.x sürümü Flat Config sistemine geçti, klasik `.eslintrc.js` artık desteklenmiyor.
- **Sorun:** Flat Config bazı plugin importlarını otomatik siliyor (`@eslint/eslintrc`, `typescript-eslint`, `expo`).
- **Karar:** Tam modernizasyon yerine klasik ESLint + Prettier yapısına geri dönüldü.
- **Prettier Entegrasyonu:** Aktif (`eslint-plugin-prettier` senkron).

🎯 **Hedef:** Kararlı, manuel kontrol odaklı linting ve format sistemi.

---

## ⚡ 3. Workflow & Agent Planı

- **Amaç:** Lint → Test → Commit zincirini otomatikleştirmek.
- **Agent Rolleri:**
  - **CodeGuardian:** Lint + format denetimi
  - **CommitManager:** Commit mesaj standardizasyonu
  - **TestRunner:** Jest/Expo testleri
  - **BuildAgent:** Release öncesi Prettier + TypeCheck

📜 **Manifest.md:** Tüm Agent’ların görev tanımları burada tutulacak.

---

## 🧭 4. Kısa Vadeli Yapılacaklar

| Öncelik | Görev                                      | Durum        |
| ------- | ------------------------------------------ | ------------ |
| ✅      | TaskCard spacing/padding kontrolü          | Devam ediyor |
| ✅      | Navigation/Layout cleanup                  | Planlandı    |
| 🕐      | AsyncStorage veri kalıcılığı               | Yakında      |
| 🕐      | `.styles.ts` dosyalarının ayrıştırılması   | Bekliyor     |
| 🕐      | CancelledScreen akışı (yeniden başlat/sil) | Tasarımda    |

---

## 🚀 5. Uzun Vadeli Yol Haritası

- Context verilerinin persist edilmesi (AsyncStorage → Cloud).
- Analiz ekranı dinamik veri seti.
- Tema geçişi (Soft Autumn ↔ Dark Pastel).
- Çoklu dil desteği (i18n).
- Cloud senkronizasyonu (Firebase veya Realm).

---

## 🧠 6. Kodlama Standartları

### 📁 Dosya Konvansiyonu

src/
┣ views/
┃ ┣ HomeScreen/
┃ ┣ AnalysisScreen/
┃ ┗ CancelledScreen/
┣ components/
┃ ┣ TaskCard/
┃ ┗ NewTaskModal/
┣ context/
┣ hooks/
┣ models/
┗ styles/

markdown
Kodu kopyala

### 💡 Kurallar

- **Dil:** TypeScript (`.ts` / `.tsx`)
- **Fonksiyonlar:** `const` + arrow function
- **Stiller:** Ayrı `.styles.ts` dosyalarında

### 💬 Commit Mesaj Formatı

feat: Yeni özellik eklendi
fix: Hata düzeltildi
style: Görsel düzenleme / format
refactor: Kod yapısı düzenlendi
chore: Yapılandırma değişikliği

markdown
Kodu kopyala

### 🧹 Prettier Kuralları

- Tek tırnak `' '`
- Satır sonu `;`
- Maks satır uzunluğu `100`
- Autoformat: **Kaydetmede kapalı, manuel tetikleme**

---

## 🧩 7. Kısa Vadeli Planlar (Yeni Nesil Otomasyon)

### Workflow Otomasyonu

- `lint + format + test + commit` zincirini otomatik çalıştıracak `scripts/workflow.js` hazırlanacak.
- Git hook’ları entegre edilecek.

### Manifest.md

- Tüm Agent’ların görev tanımlarını içeren belge.

---

## 🧷 8. Hatırlatmalar (Kalıcı Hafıza)

- “Alt görev scroll fix” sonrası sürüm FlowMind 2.0 referans noktasıdır.
- AsyncStorage aşamasına geçilmeden önce TaskContext dondurulacak.
- `.styles.ts` refaktör tamamlanmadan tema sistemine geçilmemeli.

---

📅 **Son Güncelleme:** 7 Kasım 2025
**Hazırlayan:** ChatGPT (GPT-5) + Orkun Şanlıtürk
**Dosya Konumu:** `Project_Notes/FlowMind_Engineering_Workflow_and_Linting_Plan.md`
