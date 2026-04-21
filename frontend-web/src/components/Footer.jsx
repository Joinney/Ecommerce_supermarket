export default function Footer() {
  return (
    <footer className="bg-[#0d1117] border-t border-white/5 pt-16 pb-8 px-10 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
        <div>
          <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Về chúng tôi</h4>
          <ul className="text-gray-500 text-sm space-y-2">
            <li className="hover:text-blue-400 cursor-pointer">Câu chuyện Demi Mart</li>
            <li className="hover:text-blue-400 cursor-pointer">Tuyển dụng</li>
            <li className="hover:text-blue-400 cursor-pointer">Hệ thống cửa hàng</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Hỗ trợ khách hàng</h4>
          <ul className="text-gray-500 text-sm space-y-2">
            <li className="hover:text-blue-400 cursor-pointer">Chính sách đổi trả</li>
            <li className="hover:text-blue-400 cursor-pointer">Phí vận chuyển</li>
            <li className="hover:text-blue-400 cursor-pointer">Câu hỏi thường gặp</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Hợp tác</h4>
          <ul className="text-gray-500 text-sm space-y-2">
            <li className="hover:text-blue-400 cursor-pointer">Bán hàng cùng Demi</li>
            <li className="hover:text-blue-400 cursor-pointer">Tiếp thị liên kết</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Tải ứng dụng</h4>
          <div className="space-y-3">
             <div className="bg-white/5 p-2 rounded-lg border border-white/10 text-center text-xs">App Store</div>
             <div className="bg-white/5 p-2 rounded-lg border border-white/10 text-center text-xs">Google Play</div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/5 pt-8 text-center text-gray-600 text-xs">
        <p>© 2026 Demi Supermarket. Built for ETECHS Internship Project.</p>
      </div>
    </footer>
  );
}