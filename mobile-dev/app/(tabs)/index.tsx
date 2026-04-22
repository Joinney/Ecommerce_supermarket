import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { Search, ShoppingCart, MapPin, ChevronDown, Clock } from 'lucide-react-native';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* 1. TOP HEADER (Logo, Address, Cart) */}
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.logoText}>DemiMart</Text>
          <TouchableOpacity style={styles.deliveryRow}>
            <Text style={styles.deliveryText}>Giao vào ngày mai</Text>
            <ChevronDown size={14} color="#2563eb" />
          </TouchableOpacity>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.locationBtn}>
            <MapPin size={14} color="#64748b" />
            <Text style={styles.locationText}>94538</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cartBtn}>
            <ShoppingCart size={20} color="#2563eb" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. SEARCH BAR */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={18} color="#94a3b8" />
          <TextInput placeholder="Tìm kiếm sản phẩm" style={styles.searchInput} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 3. QUICK CATEGORIES (Hải sản, Trái cây...) */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
          <QuickCat label="Trái cây" img="https://cdn-icons-png.flaticon.com/512/3194/3194766.png" />
          <QuickCat label="Hải sản" img="https://cdn-icons-png.flaticon.com/512/2346/2346761.png" />
          <QuickCat label="Đồ ăn liền" img="https://cdn-icons-png.flaticon.com/512/2713/2713931.png" />
          <QuickCat label="Thịt tươi" img="https://cdn-icons-png.flaticon.com/512/1046/1046769.png" />
        </ScrollView>

        {/* 4. MAIN BANNER (Giảm $20) */}
        <View style={styles.bannerContainer}>
          <Image 
            source={{ uri: 'https://img.freepik.com/free-vector/food-delivery-banner-template_23-2148906105.jpg' }} 
            style={styles.mainBanner}
          />
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTag}>ƯU ĐÃI ĐĂNG KÝ</Text>
            <Text style={styles.bannerTitle}>Giảm 50.000đ</Text>
            <Text style={styles.bannerDesc}>cho đơn hàng đầu tiên</Text>
          </View>
        </View>

        {/* 5. CIRCLE MENUS (Tuần lễ ẩm thực...) */}
        <View style={styles.circleMenuContainer}>
          <CircleItem label="Flash Sale" img="https://cdn-icons-png.flaticon.com/512/4213/4213936.png" isNew />
          <CircleItem label="Giá tốt" img="https://cdn-icons-png.flaticon.com/512/2454/2454282.png" isNew />
          <CircleItem label="Mới về" img="https://cdn-icons-png.flaticon.com/512/3655/3655682.png" />
          <CircleItem label="Bán chạy" img="https://cdn-icons-png.flaticon.com/512/1170/1170678.png" />
        </View>

        {/* 6. PRODUCT CARDS */}
        <View style={styles.productRow}>
          <ProductCard name="Bún Tươi Ba Cô Gái" price="25.000đ" off="18%" img="https://th.bing.com/th/id/OIP.X-I_5297B7A-iZ3nS16A_gHaHa?rs=1&pid=ImgDetMain" />
          <ProductCard name="Mì Hảo Hảo Tôm Chua Cay" price="5.000đ" off="10%" img="https://th.bing.com/th/id/OIP.X-I_5297B7A-iZ3nS16A_gHaHa?rs=1&pid=ImgDetMain" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Sub-components
const QuickCat = ({ label, img }: any) => (
  <TouchableOpacity style={styles.qCatItem}>
    <Image source={{ uri: img }} style={styles.qCatImg} />
    <Text style={styles.qCatText}>{label}</Text>
  </TouchableOpacity>
);

const CircleItem = ({ label, img, isNew }: any) => (
  <View style={styles.cItemContainer}>
    <View style={styles.cImgBg}>
      <Image source={{ uri: img }} style={styles.cImg} />
      {isNew && <View style={styles.newBadge}><Text style={styles.newText}>NEW</Text></View>}
    </View>
    <Text style={styles.cLabel} numberOfLines={2}>{label}</Text>
  </View>
);

const ProductCard = ({ name, price, off, img }: any) => (
  <View style={styles.pCard}>
    <View style={styles.pTag}><Text style={styles.pTagText}>{off} off</Text></View>
    <Image source={{ uri: img }} style={styles.pImg} />
    <Text style={styles.pName}>{name}</Text>
    <Text style={styles.pPrice}>{price}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  topHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, alignItems: 'center' },
  logoText: { fontSize: 24, fontWeight: '900', color: '#2563eb' },
  deliveryRow: { flexDirection: 'row', alignItems: 'center' },
  deliveryText: { fontSize: 13, color: '#1e293b', marginRight: 4, fontWeight: '500' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  locationBtn: { flexDirection: 'row', backgroundColor: '#f1f5f9', padding: 8, borderRadius: 20, alignItems: 'center', marginRight: 10 },
  locationText: { fontSize: 12, color: '#64748b', marginLeft: 4 },
  cartBtn: { padding: 5 },
  searchContainer: { paddingHorizontal: 15, marginBottom: 15 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 25, paddingHorizontal: 15, height: 45 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 14 },
  catScroll: { paddingLeft: 15, marginBottom: 20 },
  qCatItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', padding: 10, borderRadius: 15, marginRight: 10, borderWidth: 1, borderColor: '#f1f5f9' },
  qCatImg: { width: 20, height: 20, marginRight: 8 },
  qCatText: { fontSize: 13, fontWeight: '500' },
  bannerContainer: { marginHorizontal: 15, borderRadius: 20, overflow: 'hidden', height: 180, marginBottom: 20 },
  mainBanner: { width: '100%', height: '100%' },
  bannerContent: { position: 'absolute', top: 20, left: 20 },
  bannerTag: { fontSize: 10, color: '#db2777', fontWeight: 'bold' },
  bannerTitle: { fontSize: 28, fontWeight: 'bold', color: '#1e3a8a' },
  bannerDesc: { color: '#1e3a8a' },
  circleMenuContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 25 },
  cItemContainer: { alignItems: 'center', width: 70 },
  cImgBg: { width: 55, height: 55, borderRadius: 30, backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  cImg: { width: 35, height: 35 },
  cLabel: { fontSize: 11, textAlign: 'center', color: '#334155' },
  newBadge: { position: 'absolute', top: -5, left: -5, backgroundColor: '#ef4444', paddingHorizontal: 5, borderRadius: 5 },
  newText: { color: '#fff', fontSize: 8, fontWeight: 'bold' },
  productRow: { flexDirection: 'row', paddingHorizontal: 15, justifyContent: 'space-between' },
  pCard: { width: '48%', marginBottom: 20 },
  pImg: { width: '100%', height: 160, borderRadius: 10, backgroundColor: '#f8fafc' },
  pTag: { position: 'absolute', top: 10, left: 10, backgroundColor: '#ef4444', padding: 4, borderRadius: 4, zIndex: 1 },
  pTagText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  pName: { marginTop: 10, fontSize: 14, fontWeight: '500' },
  pPrice: { fontSize: 16, fontWeight: 'bold', color: '#ef4444', marginTop: 5 }
});