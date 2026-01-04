"use client";

import React, { useState, useEffect } from "react";
import { Save, Download, ExternalLink } from "lucide-react";
import { supabase } from "@/lib/supabase";
import dynamic from "next/dynamic"; // 👈 [중요] 동적 로딩을 위해 추가

// 👈 [수정됨] QR 코드는 브라우저에서만 작동하도록 설정 (SSR 충돌 방지)
const QRCodeCanvas = dynamic(
  () => import("qrcode.react").then((mod) => mod.QRCodeCanvas),
  { ssr: false }
);

export default function AdminDashboard() {
  const [shopName, setShopName] = useState("");
  const [bankName, setBankName] = useState("KB국민");
  const [accountNumber, setAccountNumber] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [shopId, setShopId] = useState(""); 
  const [loading, setLoading] = useState(false);
  
  // [추가] 브라우저 환경인지 확인 (화면 깜빡임 방지)
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleSave = async () => {
    if (!shopName || !accountNumber) return alert("매장명과 계좌번호를 입력해주세요.");
    setLoading(true);

    const { data, error } = await supabase
      .from('shops')
      .upsert({ 
        shop_name: shopName,
        bank_name: bankName,
        bank_account: accountNumber,
        owner_name: ownerName
      })
      .select()
      .single();

    if (error) {
      alert("저장 실패: " + error.message);
    } else {
      setShopId(data.id);
      alert("✅ 저장되었습니다! 우측에 QR이 생성됩니다.");
    }
    setLoading(false);
  };

  const handleDownload = () => {
    const canvas = document.getElementById("qr-code") as HTMLCanvasElement;
    if(canvas) {
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `${shopName}_QR.png`;
      a.click();
    }
  };

  const qrUrl = typeof window !== 'undefined' 
    ? `${window.location.protocol}//${window.location.host}/q/${shopId}`
    : '';

  // 화면 로딩 전에는 아무것도 안 보여줌 (에러 방지)
  if (!mounted) return <div className="min-h-screen bg-gray-50" />;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* 입력 폼 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold mb-6 text-gray-800">매장 정보 입력</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700">매장 이름</label>
              <input type="text" className="w-full border p-3 rounded-lg mt-1 text-black" 
                value={shopName} onChange={e=>setShopName(e.target.value)} placeholder="예: 카페 성수" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700">대표자명</label>
              <input type="text" className="w-full border p-3 rounded-lg mt-1 text-black" 
                value={ownerName} onChange={e=>setOwnerName(e.target.value)} placeholder="예: 홍길동" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1">
                <label className="block text-sm font-bold text-gray-700">은행</label>
                <select className="w-full border p-3 rounded-lg mt-1 text-black bg-white" value={bankName} onChange={e=>setBankName(e.target.value)}>
                  <option>KB국민</option><option>신한</option><option>토스</option><option>카카오</option><option>농협</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-bold text-gray-700">계좌번호</label>
                <input type="text" className="w-full border p-3 rounded-lg mt-1 text-black" 
                  value={accountNumber} onChange={e=>setAccountNumber(e.target.value)} placeholder="하이픈 없이 입력" />
              </div>
            </div>
            <button onClick={handleSave} disabled={loading} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold mt-4 flex justify-center items-center gap-2 hover:bg-slate-800">
              <Save size={20} /> {loading ? "저장 중..." : "정보 저장 및 QR 생성"}
            </button>
          </div>
        </div>

        {/* QR 미리보기 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col items-center justify-center text-center">
          <h2 className="text-xl font-bold mb-2 text-gray-800">QR 코드 미리보기</h2>
          <p className="text-gray-500 text-sm mb-6">정보를 저장하면 QR이 나타납니다.</p>
          
          <div className="bg-white p-4 border-2 border-dashed border-gray-200 rounded-xl mb-6 flex items-center justify-center">
             {shopId ? (
                <QRCodeCanvas 
                  id="qr-code" 
                  value={qrUrl} 
                  size={200} 
                  level={"H"} 
                  includeMargin={true} 
                />
             ) : (
                <div className="w-[200px] h-[200px] bg-gray-50 flex items-center justify-center text-gray-400 rounded-lg">
                    저장 후 생성됨
                </div>
             )}
          </div>

          <div className="flex gap-2 w-full">
            <button onClick={handleDownload} disabled={!shopId} className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold disabled:bg-gray-300 flex justify-center items-center gap-2 hover:bg-blue-700 transition-colors">
              <Download size={18} /> 다운로드
            </button>
            {shopId && (
                <a href={`/q/${shopId}`} target="_blank" className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-bold flex justify-center items-center gap-2 hover:bg-gray-50 transition-colors">
                <ExternalLink size={18} /> 테스트
                </a>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}