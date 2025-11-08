import { Redirect } from "expo-router";

export default function Index() {
  // Uygulama açıldığında doğrudan Görevler sekmesine yönlendir
  return <Redirect href="/gorevler" />;
}
