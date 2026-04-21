import React from 'react';

const products = [
  { id: 1, name: "Táo Envy Mỹ", price: "120.000đ", img: "https://via.placeholder.com/150" },
  { id: 2, name: "Thịt bò ba chỉ", price: "250.000đ", img: "https://via.placeholder.com/150" },
  { id: 3, name: "Sữa tươi organic", price: "45.000đ", img: "https://via.placeholder.com/150" },
  { id: 4, name: "Mì tôm Hảo Hảo", price: "4.000đ", img: "https://via.placeholder.com/150" },
];

export default function Home() {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Hero Banner - Glassmorphism style */}
      <div className="relative h-64 rounded-3xl overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 flex items-center px-12 shadow-2xl">
        <div className="z-10 space-y-4">
          <h1 className="text-5xl font-black text-white">Demi Supermarket</h1>
          <p className="text-white/80 text-xl">America's largest online Asian supermarket clone.</p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold hover:scale-105 transition">Mua ngay</button>
        </div>
        <div className="absolute right-0 top-0 opacity-20 text-[200px] font-bold select-none">MART</div>
      </div>

      {/* 2. Trending Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          🔥 Trending Store Favorites
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {products.map((p) => (
            <div key={p.id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 hover:border-blue-500/50 transition cursor-pointer group">
              <div className="aspect-square bg-gray-800 rounded-xl mb-4 overflow-hidden">
                <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition" />
              </div>
              <p className="font-semibold text-gray-200">{p.name}</p>
              <p className="text-blue-400 font-bold mt-2">{p.price}</p>
              <button className="w-full mt-4 py-2 bg-white/10 rounded-lg text-sm hover:bg-blue-600 transition">
                + Thêm vào giỏ
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}