"use client";

import React, { useState, useEffect } from "react";
import { Copy, CheckCircle, ShieldCheck } from "lucide-react";
import BankLinks from "@/components/BankLinks";

export default function QRLandingPage({ params }: { params: { id: string } }) {
  const [shop, setShop] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  // API를 통해 매장 정보 불러오기
  useEffect(() => {
    fetch(`/api/shop/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.shop) setShop(data.shop);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [params.id]);

  // 계좌번호 복사 기능
  const handleCopy = async () => {
    if (!shop) return;
    try {
      await navigator.clipboard.writeText(shop.bank_account);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      // 모바일 보안상 클립보드 접근이 막힐 경우 대비
      prompt("계좌번호를 복사해주세요:", shop.bank_account);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">로딩중...</div>;
  if (!shop) return <div className="min-h-screen flex items-center justify-center">유효하지 않은 QR입니다.</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <main className="w-full max-w-md bg-white min-h-screen shadow-lg flex flex-col relative">
        
        {/* 헤더 */}
        <header className="pt-10 pb-6 px-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">{shop.shop_name}</h1>
          <p className="text-sm text-gray-500 mt-1">대표자: {shop.owner_name}</p>
        </header>

        {/* 계좌 카드 */}
        <section className="px-5 py-4">
          <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 shadow-sm text-center">
            <p className="text-blue-600 font-medium mb-2 text-sm">송금하실 계좌</p>
            <div className="font-bold text-gray-700 mb-1">{shop.bank_name}</div>
            <div className="text-3xl font-black text-gray-900 tracking-wider mb-6 break-all">
              {shop.bank_account}
            </div>

            <button
              onClick={handleCopy}
              className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${
                isCopied ? "bg-green-500 text-white" : "bg-blue-600 text-white shadow-md active:scale-95"
              }`}
            >
              {isCopied ? <><CheckCircle size={20} /> 복사 완료!</> : <><Copy size={20} /> 계좌 복사하기</>}
            </button>
          </div>
        </section>

        {/* 은행 앱 링크 */}
        <section className="px-6 py-4 text-center">
          <p className="text-xs text-gray-400 mb-3">자주 쓰는 앱으로 바로 보내기</p>
          <BankLinks />
        </section>

        {/* 하단 안심 문구 */}
        <div className="mt-auto pb-8 text-center">
          <div className="inline-flex items-center gap-1 text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
            <ShieldCheck size={12} /> 안심하세요, 계좌 정보만 제공됩니다.
          </div>
        </div>
      </main>
    </div>
  );
}