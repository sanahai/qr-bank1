"use client";

import React, { useState, useEffect } from "react";
import { Copy, CheckCircle, ExternalLink, ShieldCheck, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabase"; // Supabase 클라이언트 가져오기

// --- [컴포넌트] 은행 앱 링크 목록 (디자인 그대로 유지) ---
const BankApps = () => {
  const banks = [
    { name: "토스", color: "bg-blue-500", url: "supertoss://" },
    { name: "카카오뱅크", color: "bg-yellow-300 text-black", url: "kakaobank://" },
    { name: "KB국민", color: "bg-gray-600", url: "kbbank://" },
    { name: "신한", color: "bg-blue-600", url: "shinhan://" },
    { name: "우리", color: "bg-cyan-600", url: "wooribank://" },
    { name: "하나", color: "bg-green-600", url: "hanabank://" },
    { name: "NH농협", color: "bg-green-700", url: "nhbank://" },
    { name: "IBK기업", color: "bg-gray-700", url: "ibkbank://" },
    { name: "케이뱅크", color: "bg-yellow-400 text-black", url: "kbank://" },
    { name: "수협", color: "bg-blue-800", url: "suhyup://" },
    { name: "신협", color: "bg-teal-600", url: "cu://" },
    { name: "우체국", color: "bg-red-600", url: "epostbank://" },
  ];

  return (
    <div className="grid grid-cols-4 gap-3 mb-6">
      {banks.map((bank) => (
        <a
          key={bank.name}
          href={bank.url}
          className="flex flex-col items-center justify-center gap-1 group"
        >
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-sm ${bank.color}`}>
            <span className="text-sm font-bold">{bank.name.substring(0, 1)}</span>
          </div>
          <span className="text-xs text-gray-500 text-center">{bank.name}</span>
        </a>
      ))}
    </div>
  );
};

// --- 메인 페이지 컴포넌트 ---
export default function QRLandingPage({ params }: { params: { id: string } }) {
  const [shop, setShop] = useState<any>(null); // 진짜 데이터를 담을 그릇
  const [loading, setLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 1. 데이터 불러오기 (DB 연결)
  useEffect(() => {
    setMounted(true);
    
    // Supabase에서 매장 정보 가져오기
    const fetchShop = async () => {
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('id', params.id)
        .single();
        
      if (data) {
        setShop(data);
        // 방문 로그 남기기 (선택 사항)
        fetch('/api/log', {
            method: 'POST',
            body: JSON.stringify({ action_type: 'SCAN', shop_id: params.id })
        });
      }
      setLoading(false);
    };

    fetchShop();
  }, [params.id]);

  // 2. 계좌번호 복사 로직
  const handleCopy = async () => {
    if (!shop) return;
    try {
      await navigator.clipboard.writeText(shop.bank_account);
      setIsCopied(true);
      
      // 복사 로그 남기기
      fetch('/api/log', {
          method: 'POST',
          body: JSON.stringify({ action_type: 'COPY', shop_id: params.id })
      });

      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      // 보안상 이유로 자동 복사가 막힌 경우
      prompt("계좌번호를 복사해주세요:", shop.bank_account);
    }
  };

  // 로딩 중일 때
  if (!mounted || loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50">불러오는 중...</div>;
  
  // 데이터가 없을 때
  if (!shop) return <div className="min-h-screen flex items-center justify-center bg-gray-50">유효하지 않은 QR코드입니다.</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <main className="w-full max-w-md bg-white min-h-screen shadow-lg flex flex-col relative">
        
        {/* 1. 상단: 매장 정보 */}
        <header className="pt-8 pb-4 px-6 text-center bg-white">
          <div className="inline-flex items-center gap-1 text-gray-400 text-xs mb-1">
             <MapPin size={12} /> 매장 정보
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            {shop.shop_name}
          </h1>
        </header>

        {/* 2. 핵심: 계좌 정보 카드 */}
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

            <button
              onClick={handleCopy}
              className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all duration-200 ${
                isCopied 
                  ? "bg-green-500 text-white shadow-none" 
                  : "bg-blue-600 text-white shadow-md active:scale-95"
              }`}
            >
              {isCopied ? (
                <>
                  <CheckCircle size={20} />
                  복사 완료!
                </>
              ) : (
                <>
                  <Copy size={20} />
                  계좌번호 복사하기
                </>
              )}
            </button>
          </div>
        </section>

        {/* 3. 안전 안내 문구 */}
        <section className="px-5 py-4">
          <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
            <div className="flex items-start gap-2 mb-3">
              <span className="text-lg">🔒</span>
              <h3 className="font-bold text-gray-800 text-sm">안심하고 이용하세요</h3>
            </div>
            <ul className="space-y-2 text-xs text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">•</span>
                <span>매장에 등록된 공식 계좌입니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">•</span>
                <span>결제는 은행 앱에서 직접 진행됩니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">•</span>
                <span>본 서비스는 돈을 보관하거나 중개하지 않습니다</span>
              </li>
            </ul>
          </div>
        </section>

        {/* 4. 중간 광고 배너 (현재는 고정, 나중에 DB 연결 가능) */}
        <section className="px-5 py-4">
          <a 
            href="https://example.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block bg-gradient-to-r from-red-50 to-pink-50 border border-red-100 rounded-2xl p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className="w-20 h-20 bg-gray-200 rounded-xl flex-shrink-0 overflow-hidden">
                <img 
                  src="https://via.placeholder.com/600x150/FF6B6B/FFFFFF?text=Premium+Event" 
                  alt="광고" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1 mb-1">
                  <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">HOT</span>
                  <span className="text-xs text-gray-500">지역 제휴 혜택</span>
                </div>
                <p className="text-sm font-bold text-gray-800 leading-tight">
                  동네 주민 특별 할인 쿠폰 받기
                </p>
              </div>
              <ExternalLink size={16} className="text-gray-400" />
            </div>
          </a>
        </section>

        {/* 5. 은행 앱 바로가기 */}
        <section className="px-6 py-4">
          <p className="text-sm font-medium text-gray-700 mb-4">자주 쓰는 은행 앱으로 바로 보내기</p>
          <BankApps />
        </section>

        {/* 구분선 및 신뢰 문구 */}
        <div className="mt-auto pb-6 px-6 text-center">
            <div className="border-t border-gray-100 my-4" />
            <div className="flex items-center justify-center gap-1 text-xs text-gray-400 bg-gray-50 py-2 rounded-lg">
                <ShieldCheck size={14} />
                <span>안심하고 송금하세요. 계좌 정보만 제공합니다.</span>
            </div>
        </div>

      </main>
    </div>
  );
}
