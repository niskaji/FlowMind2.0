# ⚙️ FlowMind 2.0 — Workflow, Hafıza ve Otomasyon Planı

## 🧭 Genel Amaç

FlowMind projesinde amaç yalnızca görev yönetimi değil, **akıllı bir üretkenlik sistemi** kurmak.
Bu sistem hem manuel kontrol (geliştirici tarafından), hem de **yarı otomatik agent**’lar tarafından desteklenecek.

---

## 🧠 Hafıza Yönetimi ve Komutlar

ChatGPT’nin belleğinde saklanan ana tetikleyiciler:

| Komut                                        | Anlamı                         | Eylem                                              |
| -------------------------------------------- | ------------------------------ | -------------------------------------------------- |
| “nerede kalmıştık”                           | Son checkpoint’ten devam       | Kod, bağlam ve hedefler geri yüklenir              |
| “buradaki işler bitti var mı hatırlatacağın” | Refactoring planı hatırlatılır | views/components styles planı gösterilir           |
| “ne vardı başka hatırlatacağın”              | Devam eden plan hatırlatılır   | AsyncStorage (veri kalıcılığı) safhası anımsatılır |

---

## ⚙️ Linting ve Kod Kalite Süreci

### Güncel Durum:

- ESLint 9.39.1 sürümünde Flat Config sistemi aktif
- Prettier ile çakışmalar yaşandı
- `@eslint/eslintrc` → artık desteklenmiyor
- `.eslintignore` yerine `ignores` kullanılması gerekiyor

### Plan:

- Flat Config yapısını _profesyonel ve kalıcı şekilde modernize etmek_
- Geçici “cmd+s’te siliniyor” sorunlarını değil, **kalıcı lint-prettier uyumu** kurmak
- Gerekirse alternatif lint çözümüne (örneğin **Biome**) geçmek
- Prettier sabit kalacak, çünkü stabil ve yaygın bir biçimlendirme aracı

---

## 🔄 Workflow (Kısa Vadeli Plan)

### 1️⃣ Teknik Tamamlama

- [x] JSX namespace fix
- [x] Alt görev scroll fix
- [ ] TaskCard spacing & animasyon optimizasyonu
- [ ] Navigasyon cleanup (`index path`, `tab icons`)
- [ ] Veri kalıcılığı (AsyncStorage)
- [ ] CancelledScreen: “Yeniden Başlat / Sil” akışı

### 2️⃣ Refactor

- Views ve Components için `.styles.ts` dosyalarının ayrıştırılması
- Modüler ve okunabilir CSS mimarisi
- Kod yorumları ve gereksiz importların temizlenmesi

### 3️⃣ Otomasyon & Agent Planı

- **Workflow Agent:**
  Gelecekte `TaskAgent` isimli bir süreç, kod analizini ve commit sonrası kontrolleri otomatik yapacak.
- **Memory Manifest:**
  `FlowMind.manifest.md` dosyası ile konuşma belleği otomatik senkronize edilecek.
- **Build Reporter:**
  Her `expo start` sonrası son değişiklikleri özetleyen küçük CLI çıktısı eklenecek.

---

## 🧩 Uzun Vadeli Hedefler

- Cloud senkronizasyonu (Firebase veya Supabase)
- Kullanıcı bazlı oturum desteği
- “Flow Analytics” sekmesiyle görev performans raporu
- Hata izleme (Sentry)
- Temalar: Soft Autumn, Deep Winter

---

## 🧱 Geçiş Planı (Flat Config → Eski Yapı)

Eğer Flat Config kararlı hale gelmezse:

- ESLint 8.x’e downgrade
- `.eslintrc.js`’e dönüş
- `FlatCompat` kaldırılacak
- Prettier tam kontrolü devralacak

---

## 🗂 Dizin Notları

`Project_Notes/` dizini, gelecekte proje hafızası olarak kullanılacak.
ChatGPT her yeni oturumda bu dizini okur,
ve otomatik olarak bağlamı geri yükler.

---

## 🧭 Kısa Vadeli Yol Haritası

| Aşama                         | Açıklama                              | Durum |
| ----------------------------- | ------------------------------------- | ----- |
| **Alt Görev Scroll Fix**      | FlatList.scrollToEnd() entegre edildi | ✅    |
| **TaskCard Etkileşimleri**    | spacing + basılma animasyonu          | ⏳    |
| **Navigasyon Cleanup**        | index & tab title fix                 | ⏳    |
| **AsyncStorage Entegrasyonu** | Veri kalıcılığı için                  | ⏳    |
| **CancelledScreen Akışı**     | “Yeniden Başlat / Sil” mantığı        | ⏳    |

---

## 📌 Not

Bu dosya, **FlowMind projesinin çalışma prensipleri ve ChatGPT hafıza bağlantısı** için referanstır.
Yeni bir konuşma penceresi açıldığında bu dosya okunursa, proje bağlamı tam olarak geri yüklenebilir.
