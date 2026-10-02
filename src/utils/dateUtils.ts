// -----------------------------------------------------------
// 🗓️ FlowMind 2.0 — Tarih yardımcı fonksiyonları
// Görev deadline'ları için ortak tarih işlemleri
// -----------------------------------------------------------

// Date nesnesini "YYYY-MM-DD" formatına çevirir (yerel saat dilimine göre)
export function toDateOnlyISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// "YYYY-MM-DD" formatındaki string'i güvenli şekilde Date nesnesine çevirir
export function parseDateOnlyISO(value: string): Date {
  return new Date(`${value}T00:00:00`);
}

// "YYYY-MM-DD" -> "GG.AA.YYYY"
export function formatDateTR(value: string): string {
  const date = parseDateOnlyISO(value);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

// Verilen tarih bugünden önce mi? (deadline geçmiş mi kontrolü)
export function isPastDeadline(value: string): boolean {
  const target = parseDateOnlyISO(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return target.getTime() < today.getTime();
}

// a tarihi b tarihinden sonra mı? (örn. iptal tarihi > deadline tarihi)
export function isDateAfter(a: string, b: string): boolean {
  return parseDateOnlyISO(a).getTime() > parseDateOnlyISO(b).getTime();
}

// Bugünden verilen tarihe kalan süreyi "X yıl Y ay Z gün kaldı" olarak hesaplar
export function getRemainingTimeLabel(value: string): string {
  const target = parseDateOnlyISO(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  if (target.getTime() < today.getTime()) return 'Süresi geçti';
  if (target.getTime() === today.getTime()) return 'Bugün son gün';

  let years = target.getFullYear() - today.getFullYear();
  let months = target.getMonth() - today.getMonth();
  let days = target.getDate() - today.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const parts: string[] = [];
  if (years > 0) parts.push(`${years} yıl`);
  if (months > 0) parts.push(`${months} ay`);
  if (days > 0 || parts.length === 0) parts.push(`${days} gün`);

  return `${parts.join(' ')} kaldı`;
}
