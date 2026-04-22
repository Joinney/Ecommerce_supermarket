import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../../api/axios';
import { useAuth } from '../context/AuthContext'; // Kiểm tra lại đường dẫn này cho đúng

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth(); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Thông báo", "Demi đừng quên nhập tài khoản và mật khẩu nhé!");
      return;
    }

    setLoading(true);
    try {
      // 1. Gọi API Đăng nhập
      const res = await api.post('/auth/signin', { username, password });
      
      if (res.status === 200) {
        // 2. TRUYỀN NGUYÊN res.data
        // Giả sử Backend trả về: { user: {...}, token: "..." }
        // Hàm login trong Context sẽ tự tách user để hiện và token để lưu
        await login(res.data); 
        
        const displayName = res.data.user.full_name || res.data.user.username || 'Demi';
        Alert.alert("Thành công", `Chào mừng ${displayName} quay trở lại!`);
        
        // 3. Chuyển vào trang chủ
        router.replace('/(tabs)'); 
      }
    } catch (error: any) {
      console.error("Lỗi đăng nhập:", error.response?.data || error.message);
      const msg = error.response?.data?.message || "Sai tên đăng nhập hoặc mật khẩu!";
      Alert.alert("Lỗi", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>WELCOME <Text style={{ color: '#60a5fa' }}>BACK</Text></Text>
      
      <View style={styles.form}>
        <TextInput 
          placeholder="Tên đăng nhập" 
          style={styles.input} 
          placeholderTextColor="#475569"
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput 
          placeholder="Mật khẩu" 
          secureTextEntry 
          style={styles.input} 
          placeholderTextColor="#475569"
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity 
        style={[styles.button, loading && { opacity: 0.7 }]} 
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>ĐĂNG NHẬP</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
        <Text style={styles.footerLink}>
          Chưa có tài khoản? <Text style={{ color: '#60a5fa', fontWeight: 'bold' }}>Đăng ký</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 30, backgroundColor: '#020617', justifyContent: 'center' },
  logo: { color: '#fff', fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 50, letterSpacing: 1 },
  form: { marginBottom: 30 },
  input: { 
    backgroundColor: '#0f172a', 
    color: '#fff', 
    padding: 18, 
    borderRadius: 15, 
    marginBottom: 15, 
    borderWidth: 1, 
    borderColor: '#1e293b' 
  },
  button: { 
    backgroundColor: '#2563eb', 
    padding: 18, 
    borderRadius: 15, 
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  footerLink: { color: '#64748b', textAlign: 'center', marginTop: 25, fontSize: 14 }
});