import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext'; // Đảm bảo đúng đường dẫn tới AuthContext
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // 1. GIAO DIỆN KHI CHƯA ĐĂNG NHẬP
  if (!user) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#0f172a', '#1e1b4b']} style={styles.guestHeader}>
          <Ionicons name="person-circle-outline" size={80} color="#60a5fa" />
          <Text style={styles.guestTitle}>Chào mừng Demi!</Text>
          <Text style={styles.guestSubtitle}>Đăng nhập để theo dõi đơn hàng và nhận ưu đãi riêng cho bạn.</Text>
          
          <TouchableOpacity 
            style={styles.loginBtn} 
            onPress={() => router.push('/(auth)/login')}
          >
            <Text style={styles.loginBtnText}>ĐĂNG NHẬP / ĐĂNG KÝ</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }

  // 2. GIAO DIỆN KHI ĐÃ ĐĂNG NHẬP THÀNH CÔNG
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Phần Header thông tin User */}
        <View style={styles.userHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>
          <Text style={styles.userName}>{user.full_name || 'Người dùng DemiMart'}</Text>
          <Text style={styles.userEmail}>{user.email || user.username}</Text>
          
          <TouchableOpacity style={styles.editBadge}>
            <Text style={styles.editBadgeText}>Thành viên Bạc</Text>
          </TouchableOpacity>
        </View>

        {/* Danh sách Menu chức năng */}
        <View style={styles.menuGroup}>
          <Text style={styles.sectionTitle}>Tài khoản của tôi</Text>
          <MenuOption icon="document-text-outline" label="Lịch sử đơn hàng" color="#60a5fa" />
          <MenuOption icon="location-outline" label="Địa chỉ nhận hàng" color="#34d399" />
          <MenuOption icon="heart-outline" label="Sản phẩm yêu thích" color="#fb7185" />
          <MenuOption icon="settings-outline" label="Cài đặt hệ thống" color="#94a3b8" />
        </View>

        {/* NÚT ĐĂNG XUẤT */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Ionicons name="log-out-outline" size={22} color="#ef4444" />
          <Text style={styles.logoutText}>Đăng xuất tài khoản</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Phiên bản 1.0.0 (Beta)</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// Component phụ cho các dòng Menu
function MenuOption({ icon, label, color }: any) {
  return (
    <TouchableOpacity style={styles.menuItem}>
      <View style={styles.menuLeft}>
        <View style={[styles.iconBg, { backgroundColor: color + '15' }]}>
          <Ionicons name={icon} size={20} color={color} />
        </View>
        <Text style={styles.menuLabel}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#475569" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  // Styles cho khách (Guest)
  guestHeader: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  guestTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 20 },
  guestSubtitle: { color: '#94a3b8', textAlign: 'center', marginTop: 10, marginBottom: 30, lineHeight: 20 },
  loginBtn: { backgroundColor: '#2563eb', paddingVertical: 15, paddingHorizontal: 35, borderRadius: 15 },
  loginBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },

  // Styles cho User đã đăng nhập
  userHeader: { alignItems: 'center', paddingTop: 40, paddingBottom: 30 },
  avatarContainer: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#1e293b', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#60a5fa' },
  avatarText: { color: '#60a5fa', fontSize: 32, fontWeight: 'bold' },
  userName: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginTop: 15 },
  userEmail: { color: '#64748b', fontSize: 14, marginTop: 5 },
  editBadge: { backgroundColor: '#1e293b', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, marginTop: 10 },
  editBadgeText: { color: '#60a5fa', fontSize: 11, fontWeight: 'bold' },

  menuGroup: { paddingHorizontal: 20, marginTop: 10 },
  sectionTitle: { color: '#475569', fontSize: 13, fontWeight: 'bold', marginBottom: 15, textTransform: 'uppercase', letterSpacing: 1 },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0f172a', padding: 15, borderRadius: 15, marginBottom: 10 },
  menuLeft: { flexDirection: 'row', alignItems: 'center' },
  iconBg: { padding: 8, borderRadius: 10, marginRight: 15 },
  menuLabel: { color: '#cbd5e1', fontSize: 16 },

  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 30, padding: 15 },
  logoutText: { color: '#ef4444', fontWeight: 'bold', marginLeft: 10, fontSize: 16 },
  version: { color: '#334155', textAlign: 'center', marginTop: 20, fontSize: 12, marginBottom: 40 }
});