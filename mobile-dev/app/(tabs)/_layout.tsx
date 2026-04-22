import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
      headerShown: false,
      tabBarStyle: { 
        backgroundColor: '#ffffff', // Hoặc màu tối tùy giao diện Demi
        height: 65,
        paddingBottom: 10,
        display: 'flex', // Đảm bảo nó luôn hiển thị
      },
      tabBarActiveTintColor: '#2563eb',
    }}>
      <Tabs.Screen name="index" options={{ title: 'Trang chủ', tabBarIcon: ({color}) => <Ionicons name="home" size={24} color={color} /> }} />
      <Tabs.Screen name="explore" options={{ title: 'Khám phá', tabBarIcon: ({color}) => <Ionicons name="search" size={24} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Tài khoản', tabBarIcon: ({color}) => <Ionicons name="person" size={24} color={color} /> }} />
    </Tabs>
  );
}