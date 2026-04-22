import { Redirect } from 'expo-router';

export default function Index() {
  // Thay đổi ở đây: Nhảy vào trang chủ trước
  return <Redirect href="/(tabs)" />;
}