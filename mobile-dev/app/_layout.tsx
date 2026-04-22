import { Stack } from 'expo-router';
import * as NavigationBar from 'expo-navigation-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { AuthProvider } from './context/AuthContext'; // Đảm bảo đúng đường dẫn tới thư mục context

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === 'android') {
      // Ẩn thanh điều hướng hệ thống nhưng giữ nội dung tràn viền
      NavigationBar.setVisibilityAsync("hidden");
      NavigationBar.setBehaviorAsync("overlay-swipe");
    }
  }, []);

  return (
    // Bọc toàn bộ App trong AuthProvider để mọi màn hình đều biết trạng thái đăng nhập
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* 1. Màn hình điều hướng gốc */}
        <Stack.Screen name="index" options={{ href: null }} /> 

        {/* 2. Nhóm Trang chủ (Mặc định vào đây trước) */}
        <Stack.Screen name="(tabs)" />

        {/* 3. Nhóm Đăng nhập (Hiện lên dạng Modal trượt từ dưới) */}
        <Stack.Screen 
          name="(auth)" 
          options={{ 
            presentation: 'modal', 
            animation: 'slide_from_bottom' 
          }} 
        />
      </Stack>
    </AuthProvider>
  );
}