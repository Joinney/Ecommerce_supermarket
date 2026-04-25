import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          "search_placeholder": "Search products at Demi Mart...",
          "deliver_to": "Deliver to",
          "welcome": "Hi Demi!",
          "login": "Login",
          "select_lang": "Select Language"
        }
      },
      vi: {
        translation: {
          "search_placeholder": "Tìm sản phẩm tại Demi Mart...",
          "deliver_to": "Giao tại",
          "welcome": "Chào Demi!",
          "login": "Đăng nhập",
          "select_lang": "Chọn ngôn ngữ"
        }
      }
    },
    lng: "vi", // Mặc định khi mở web
    fallbackLng: "vi",
    interpolation: { escapeValue: false }
  });

export default i18n;