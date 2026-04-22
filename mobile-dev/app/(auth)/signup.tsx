import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import api from '../../api/axios'; // Đảm bảo đường dẫn này đúng tới file axios.js của bạn

export default function SignupScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '', 
    password: '', 
    email: '', 
    full_name: '',
    phone: '', 
    gender: 'Nam', 
    birth_date: '2000-01-01', // Giá trị mặc định để tránh lỗi DB
    address: 'Vietnam'
  });

  // HÀM XỬ LÝ ĐĂNG KÝ
  const handleSignup = async () => {
    // 1. Kiểm tra nhanh các trường bắt buộc
    if (!formData.username || !formData.password || !formData.email || !formData.full_name) {
      Alert.alert("Thông báo", "Demi ơi, bạn điền thiếu thông tin rồi!");
      return;
    }

    setLoading(true);
    try {
      console.log("🚀 Đang gửi dữ liệu tới Backend:", formData);
      
      // Gọi tới endpoint: http://IP:5000/api/auth/signup
      const res = await api.post('/auth/signup', formData);

      if (res.status === 201 || res.status === 200) {
        Alert.alert("Thành công", "Tài khoản của Demi đã được tạo rực rỡ!", [
          { text: "Đăng nhập ngay", onPress: () => router.replace('/(auth)/login') }
        ]);
      }
    } catch (error: any) {
      console.error("❌ Lỗi Đăng ký:", error.response?.data || error.message);
      const errorMsg = error.response?.data?.message || "Không thể kết nối server. Demi check lại Wi-Fi/IP nhé!";
      Alert.alert("Lỗi Đăng Ký", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#0f172a', '#1e1b4b']} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.header}>
            <Text style={styles.logoText}>DEMI<Text style={{color: '#60a5fa'}}>MART</Text></Text>
            <Text style={styles.tagline}>Nâng tầm trải nghiệm mua sắm</Text>
          </View>

          <View style={styles.glassCard}>
            <Text style={styles.cardTitle}>Đăng ký tài khoản</Text>
            
            {/* Input Họ tên */}
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color="#60a5fa" style={styles.icon} />
              <TextInput 
                placeholder="Họ và tên" 
                placeholderTextColor="#475569"
                style={styles.input}
                onChangeText={(v) => setFormData({...formData, full_name: v})}
              />
            </View>

            {/* Input Email */}
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color="#60a5fa" style={styles.icon} />
              <TextInput 
                placeholder="Email" 
                placeholderTextColor="#475569"
                keyboardType="email-address"
                style={styles.input}
                onChangeText={(v) => setFormData({...formData, email: v})}
              />
            </View>

            {/* Input Username */}
            <View style={styles.inputWrapper}>
              <Ionicons name="at-outline" size={20} color="#60a5fa" style={styles.icon} />
              <TextInput 
                placeholder="Tên đăng nhập" 
                placeholderTextColor="#475569"
                autoCapitalize="none"
                style={styles.input}
                onChangeText={(v) => setFormData({...formData, username: v})}
              />
            </View>

            {/* Input Password */}
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#60a5fa" style={styles.icon} />
              <TextInput 
                placeholder="Mật khẩu" 
                placeholderTextColor="#475569"
                secureTextEntry
                style={styles.input}
                onChangeText={(v) => setFormData({...formData, password: v})}
              />
            </View>

            {/* NÚT XÁC NHẬN */}
            <TouchableOpacity 
              style={styles.buttonActive} 
              onPress={handleSignup}
              disabled={loading}
            >
              <LinearGradient 
                colors={['#2563eb', '#7c3aed']} 
                start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                style={styles.gradientBtn}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>XÁC NHẬN ĐĂNG KÝ</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.footerText}>Đã có tài khoản? <Text style={styles.linkText}>Đăng nhập</Text></Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 30, paddingTop: 80, paddingBottom: 50 },
  header: { alignItems: 'center', marginBottom: 40 },
  logoText: { color: '#fff', fontSize: 42, fontWeight: '900', letterSpacing: -2 },
  tagline: { color: '#94a3b8', fontSize: 12, marginTop: 5, textTransform: 'uppercase', letterSpacing: 1 },
  glassCard: { 
    backgroundColor: 'rgba(255, 255, 255, 0.05)', 
    borderRadius: 30, 
    padding: 25, 
    borderWidth: 1, 
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 25, textAlign: 'center' },
  inputWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#0f172a', 
    borderRadius: 15, 
    marginBottom: 15, 
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#334155'
  },
  icon: { marginRight: 10 },
  input: { flex: 1, color: '#fff', paddingVertical: 15, fontSize: 15 },
  buttonActive: { marginTop: 20, borderRadius: 15, overflow: 'hidden' },
  gradientBtn: { paddingVertical: 18, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },
  footerText: { color: '#64748b', textAlign: 'center', marginTop: 30 },
  linkText: { color: '#60a5fa', fontWeight: 'bold' }
});