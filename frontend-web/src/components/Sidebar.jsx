export default function Sidebar() {
  const menuItems = [
    "🍎 Trái cây", "🥦 Rau củ", "🥩 Thịt & Hải sản", 
    "🥛 Bơ sữa & Trứng", "🍜 Đồ khô", "🧊 Đồ đông lạnh", 
    "🥤 Đồ uống", "🍬 Bánh kẹo"
  ];

  return (
    <aside className="w-64 hidden lg:block sticky top-20 h-[calc(100vh-80px)] overflow-y-auto pr-4 scrollbar-hide">
      <div className="space-y-1">
        {menuItems.map((item) => (
          <div key={item} className="p-3 rounded-xl hover:bg-white/5 hover:text-blue-400 cursor-pointer transition flex items-center">
            {item}
          </div>
        ))}
      </div>
    </aside>
  );
}