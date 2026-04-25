/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Thứ tự ưu tiên: Font thiết kế -> Font hệ thống hiện đại -> Font không chân mặc định
        sans: [
          '"Plus Jakarta Sans"', 
          'Inter', 
          'ui-sans-serif', 
          'system-ui', 
          '-apple-system', 
          'BlinkMacSystemFont', 
          '"Segoe UI"', 
          'Roboto', 
          'sans-serif'
        ],
      },
      colors: {
        // Thêm màu thương hiệu Demi Mart vào đây để dùng cho tiện
        demiGreen: '#006c49',
        demiDark: '#161b22',
      }
    },
  },
  plugins: [
    // Nếu bạn muốn ẩn thanh cuộn ở Sidebar như đã làm trước đó, nên cài thêm plugin này
    // npm install tailwind-scrollbar-hide
    require('tailwind-scrollbar-hide'),
  ],
}