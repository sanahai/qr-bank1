"use client";
import { ExternalLink } from "lucide-react";

export default function Banner() {
  // 실제로는 DB에서 배너 정보를 가져와야 하지만, MVP에서는 고정값 사용
  const bannerData = {
    title: "동네 주민 특별 혜택",
    desc: "여름 맞이 반영구 눈썹 30% 할인",
    link: "https://example.com",
    bgColor: "bg-white",
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 max-w-md mx-auto w-full ${bannerData.bgColor} border-t border-gray-200 p-4 shadow-[0_-5px_15px_rgba(0,0,0,0.05)] z-50`}>
      <a 
        href={bannerData.link} 
        target="_blank" 
        rel="noreferrer"
        className="flex items-center gap-3 group"
      >
        {/* 배너 이미지 영역 (이미지 없으면 회색 박스) */}
        <div className="w-12 h-12 bg-slate-200 rounded-lg flex-shrink-0 overflow-hidden relative">
            <div className="absolute inset-0 flex items-center justify-center text-[10px] text-gray-400 font-bold">
                AD
            </div>
            {/* <img src="..." className="w-full h-full object-cover" /> */}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="bg-red-50 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded">
                HOT
            </span>
            <span className="text-xs text-gray-500 truncate">
                {bannerData.title}
            </span>
          </div>
          <p className="text-sm font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
            {bannerData.desc}
          </p>
        </div>
        
        <ExternalLink size={18} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
      </a>
    </div>
  );
}