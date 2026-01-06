"use client";

import React, { useState, useEffect } from "react";
import { Copy, CheckCircle, ExternalLink, ShieldCheck, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabase"; 

// --- [컴포넌트] 은행 앱 자동 실행 로직 (수정됨) ---
const BankApps = () => {
  const banks = [
    // 1. 주요 은행 (앱 스킴 정확도 확인 완료)
    { name: "토스", color: "bg-blue-500", url: "supertoss://", fallback: "https://toss.im" },
    { name: "카카오", color: "bg-yellow-300 text-black", url: "kakaobank://", fallback: "https://www.kakaobank.com" },
    { name: "신한", color: "bg-blue-600", url: "shinhan-sr-auth://", fallback: "https://www.shinhan.com" },
    { name: "NH농협", color: "bg-green-600", url: "nhapp://", fallback: "https://banking.nonghyup.com" },
    { name: "KB국민", color: "bg-gray-600", url: "kbbank://", fallback: "https://www.kbstar.com" },
    { name: "IBK기업", color: "bg-blue-700", url: "ibk-ionebank://", fallback: "https://www.ibk.co.kr" },
    { name: "하나", color: "bg-teal-500", url: "hana1q://", fallback: "https://www.kebhana.com" },
    { name: "우리", color: "bg-cyan-600", url: "wooribank://", fallback: "https://www.wooribank.com" },
    // 2. 인터넷/기타 은행
    { name: "케이뱅크", color: "bg-indigo-900", url: "kbank://", fallback: "https://www.kbanknow.com" },
    { name: "SC제일", color: "bg-green-700", url: "scbank://", fallback: "https://www.standardchartered.co.kr" },
    { name: "씨티", color: "bg-blue-800", url: "citimobile://", fallback: "https://www.citibank.co.kr" },
    { name: "KDB산업", color: "bg-blue-900", url: "kdbbank://", fallback: "https://www.kdb.co.kr" },
    { name: "수협", color: "bg-teal-600", url: "suhyup-heybank://", fallback: "https://www.suhyup-bank.com" },
    // 3. 지방 은행
    { name: "iM뱅크", color: "bg-cyan-700", url: "imbank://", fallback: "https://www.dgb.co.kr" }, 
    { name: "부산", color: "bg-red-600", url: "busanbank://", fallback: "https://www.busanbank.co.kr" },
    { name: "경남", color: "bg-red-500", url: "knbank://", fallback: "https://www.knbank.co.kr" },
    { name: "광주", color: "bg-red-700", url: "kjbank://", fallback: "https://www.kjbank.com" },
    { name: "전북", color: "bg-indigo-600", url: "jbbank://", fallback: "https://www.jbbank.co.kr" },
    { name: "제주", color: "bg-blue-400", url: "jejubank://", fallback: "https://www.e-jejubank.com" },
  ];

  const handleAppClick = (e: React.MouseEvent, bank: any) => {
    e.preventDefault(); // 기본 링크 이동 막기
    
    // 1. 앱 실행 시도 (Deep Link)
    const start = new Date().getTime();
    window.location.href = bank.url; 

    // 2. 앱이 안 깔려있어서 반응이 없으면 -> 0.5초 뒤에 스토어/홈페이지로 이동
    setTimeout(() => {
      if (new Date().getTime() - start < 1000) {
        window.open(bank.fallback, '_blank');
      }
    }, 500);
  };

  return (
    <div className="grid grid-cols-4 gap-3 mb-6">
      {banks.map((bank) => (
        <a 
          key={bank.name} 
          href={bank.url} // 마우스 우클릭 등을 위해 href 유지
          onClick={(e) => handleAppClick(e, bank)} 
          className="flex flex-col items-center justify-center gap-1 group cursor-pointer"
        >
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-sm ${bank.color} transition-transform active:scale-95`}>
            <span className="text-sm font-bold">
              {bank.name.length > 2 && /^[a-zA-Z]/.test(bank.name) ? bank.name.substring(0, 2) : bank.name.substring(0, 1)}
            </span>
          </div>
          <span className="text-[10px] text-gray-500 text-center break-keep leading-tight px-1">{bank.name}</span>
        </a>
      ))}
    </div>
  );
};

// --- 메인 페이지 컴포넌트 ---
export default function QRLandingPage({ params }: { params: { id: string } }) {
  const [shop, setShop] = useState<any>(null);
  const [banner, setBanner] = useState<any>(null); 
  const [loading, setLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const fetchData = async () => {
      // 1. 매장 정보
      const { data: shopData } = await supabase
        .from('shops')
        .select('*')
        .eq('id', params.id)
        .single();
      
      if (shopData) {
        setShop(shopData);
        try { fetch('/api/log', { method: 'POST', body: JSON.stringify({ action_type: 'SCAN', shop_id: params.id }) }); } catch(e) {}
      }

      // 2. 광고 배너
      const { data: bannerData } = await supabase
        .from('banners')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
        
      if (bannerData) setBanner(bannerData);

      setLoading(false);
    };

    fetchData();
  }, [params.id]);

  const handleCopy = async () => {
    if (!shop) return;
    try {
      await navigator.clipboard.writeText(shop.bank_account);
      setIsCopied(true);
      try { fetch('/api/log', { method: 'POST', body: JSON.stringify({ action_type: 'COPY', shop_id: params.id }) }); } catch(e) {}
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      prompt("계좌번호를 복사해주세요:", shop.bank_account);
    }
  };

  if (!mounted || loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50">불러오는 중...</div>;
  if (!shop) return <div className="min-h-screen flex items-center justify-center bg-gray-50">유효하지 않은 QR코드입니다.</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <main className="w-full max-w-md bg-white min-h-screen shadow-lg flex flex-col relative">
        
        {/* 상단: 매장 정보 */}
        <header className="pt-8 pb-4 px-6 text-center bg-white">
          <div className="inline-flex items-center gap-1 text-gray-400 text-xs mb-1">
             <MapPin size={12} /> 매장 정보
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            {shop.shop_name}
          </h1>
        </header>

        {/* 계좌 정보 카드 */}
        <section className="px-5 py-4">
          <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 shadow-sm text-center relative overflow-hidden">
            <div className="absolute top-[-20px] left-[-20px] w-20 h-20 bg-blue-100 rounded-full opacity-50" />
            
            <p className="text-blue-600 font-medium mb-4 text-sm">송금하실 계좌</p>
            
            <div className="flex items-center justify-center gap-2 mb-3">
                <span className="font-bold text-gray-700 text-lg">{shop.bank_name}</span>
                <span className="text-gray-400">|</span>
                <span className="font-bold text-gray-700 text-lg">{shop.owner_name}</span>
            </div>
            
            <div className="text-3xl font-black text-gray-900 tracking-wider mb-6 break-all">
              {shop.bank_account}
            </div>

            <button onClick={handleCopy} className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all duration-200 ${isCopied ? "bg-green-500 text-white shadow-none" : "bg-blue-600 text-white shadow-md active:scale-95"}`}>
              {isCopied ? <><CheckCircle size={20} />복사 완료!</> : <><Copy size={20} />계좌번호 복사하기</>}
            </button>
          </div>
        </section>

        {/* 안전 안내 */}
        <section className="px-5 py-4">
          <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
            <div className="flex items-start gap-2 mb-3">
              <span className="text-lg">🔒</span>
              <h3 className="font-bold text-gray-800 text-sm">안심하고 이용하세요</h3>
            </div>
            <ul className="space-y-2 text-xs text-gray-600">
              <li className="flex items-start gap-2"><span className="text-green-600 mt-0.5">•</span><span>매장에 등록된 공식 계좌입니다</span></li>
              <li className="flex items-start gap-2"><span className="text-green-600 mt-0.5">•</span><span>결제는 은행 앱에서 직접 진행됩니다</span></li>
            </ul>
          </div>
        </section>

        {/* 광고 배너 */}
        {banner && (
          <section className="px-5 py-4">
            <a 
              href={banner.link_url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="block bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl flex-shrink-0 overflow-hidden border border-gray-100 bg-gray-50 relative">
                  <img src={banner.image_url} alt="광고" className="w-full h-full object-cover"/>
                  <div className="absolute bottom-0 right-0 bg-black bg-opacity-30 text-white text-[9px] px-1.5 py-0.5 rounded-tl-lg">AD</div>
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center h-20">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="bg-red-50 text-red-600 border border-red-100 text-[10px] font-bold px-2 py-0.5 rounded-full">HOT</span>
                    <span className="text-xs text-gray-400 truncate">사장님 추천 혜택</span>
                  </div>
                  <p className="text-[15px] font-bold text-gray-800 leading-snug break-keep line-clamp-2">{banner.title}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs text-blue-500 font-medium">자세히 보기</span>
                    <ExternalLink size={12} className="text-blue-500" />
                  </div>
                </div>
              </div>
            </a>
          </section>
        )}

        {/* 은행 앱 리스트 (수정된 컴포넌트) */}
        <section className="px-6 py-4">
          <p className="text-sm font-medium text-gray-700 mb-4">자주 쓰는 은행 앱으로 바로 보내기</p>
          <BankApps />
        </section>

        <div className="mt-auto pb-6 px-6 text-center">
            <div className="border-t border-gray-100 my-4" />
            <div className="flex items-center justify-center gap-1 text-xs text-gray-400 bg-gray-50 py-2 rounded-lg">
                <ShieldCheck size={14} /><span>안심하고 송금하세요. 계좌 정보만 제공합니다.</span>
            </div>
        </div>

      </main>
    </div>
  );
}
