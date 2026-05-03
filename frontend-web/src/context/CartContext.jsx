import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Khởi tạo giỏ hàng từ LocalStorage
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('demi_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Tự động lưu vào LocalStorage khi giỏ hàng thay đổi
  useEffect(() => {
    localStorage.setItem('demi_cart', JSON.stringify(cart));
  }, [cart]);

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = (product, variant, quantity) => {
    setCart(prevCart => {
      // Tìm xem biến thể này đã có trong giỏ hàng chưa
      const existingItem = prevCart.find(item => item.variantId === variant.ma_bien_the);
      
      if (existingItem) {
        return prevCart.map(item =>
          item.variantId === variant.ma_bien_the 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      }

      // Nếu chưa có, thêm mới với đầy đủ thông tin để tạo URL
      return [...prevCart, {
        id: product.ma_san_pham,
        name: product.ten_san_pham,
        variantId: variant.ma_bien_the,
        variantName: variant.ten_bien_the,
        price: variant.gia_khuyen_mai || variant.gia_ban_le,
        image: product.media?.[0]?.duong_dan_url,
        quantity,
        // LƯU THÊM DỮ LIỆU ĐỂ TẠO URL HOÀN CHỈNH
        countryCode: product.country_code, // Lấy từ API mới đã JOIN bảng vùng miền
        categorySlug: product.slug_danh_muc // Lấy từ API mới đã JOIN bảng danh mục
      }];
    });
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = (variantId) => {
    setCart(prevCart => prevCart.filter(item => item.variantId !== variantId));
  };

  // Cập nhật số lượng (Tăng/Giảm)
  const updateQuantity = (variantId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(prevCart =>
      prevCart.map(item =>
        item.variantId === variantId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Tính tổng tiền giỏ hàng
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Tính tổng số lượng item
  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      getCartTotal, 
      getCartCount 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);