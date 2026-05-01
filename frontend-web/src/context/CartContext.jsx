import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Khởi tạo giỏ hàng từ LocalStorage để không bị mất dữ liệu khi F5
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('demi_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('demi_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, variant, quantity) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.variantId === variant.ma_bien_the);
      if (existingItem) {
        return prevCart.map(item =>
          item.variantId === variant.ma_bien_the ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevCart, {
        id: product.ma_san_pham,
        name: product.ten_san_pham,
        variantId: variant.ma_bien_the,
        variantName: variant.ten_bien_the,
        price: variant.gia_khuyen_mai || variant.gia_ban_le,
        image: product.media?.[0]?.duong_dan_url,
        quantity
      }];
    });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);