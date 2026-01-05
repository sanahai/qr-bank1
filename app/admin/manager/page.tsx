"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Trash2, ExternalLink, RefreshCw, Store, Megaphone } from "lucide-react";

export default function SuperAdminPage() {
  const [activeTab, setActiveTab] = useState("shops");
  const [shops, setShops] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 광고 입력 상태
  const [adTitle, setAdTitle] = useState("");
  const [adImage, setAdImage] = useState("");
  const [adLink, setAdLink] = useState("https://");

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    if (activeTab === "shops") {
      const { data } = await supabase.from('shops').select('*').order('created_at', { ascending: false });
      setShops(data || []);
    } else {
      const { data } = await supabase.from('banners').select('*').order('created_at', { ascending: false });
      setBanners(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (table: string, id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await supabase.from(table).delete().eq('id', id);
    fetchData();
  };

  const handleAddBanner = async () => {
    if (!adTitle || !adLink || !adImage) return alert("내용을 입력해주세요.");
    const { error } = await supabase.from('banners').insert({
      title: adTitle,
      image_url: adImage,
      link_url: adLink,
      is_active: true
    });
    if (error) alert("오류: " + error.message);
    else {
      alert("광고 등록 완료!");
      setAdTitle("");
      setAdImage("");
      fetchData();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 pb-20">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">👑 운영자 통합 관리</h1>
          <a href="/" className="text-sm text-gray-500 underline">메인으로</a>
        </header>

        <div className="flex gap-2 mb-6">
          <button onClick={() => setActiveTab("shops")} className={`flex-1 py-3 rounded-lg font-bold flex justify-center items-center gap-2 ${activeTab === 'shops' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}>
            <Store size={18}/> 가맹점 관리 ({shops.length})
          </button>
          <button onClick={() => setActiveTab("ads")} className={`flex-1 py-3 rounded-lg font-bold flex justify-center items-center gap-2 ${activeTab === 'ads' ? 'bg-red-500 text-white' : 'bg-white text-gray-600'}`}>
            <Megaphone size={18}/> 배너 광고 관리 ({banners.length})
          </button>
        </div>

        {activeTab === "shops" && (
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between mb-4">
               <h2 className="font-bold text-lg">전체 가맹점 리스트</h2>
               <button onClick={fetchData}><RefreshCw size={16}/></button>
            </div>
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="p-3">매장명</th>
                  <th className="p-3">대표자</th>
                  <th className="p-3">연락처/계좌</th>
                  <th className="p-3 text-right">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {shops.map((shop) => (
                  <tr key={shop.id}>
                    <td className="p-3 font-bold">{shop.shop_name}</td>
                    <td className="p-3 text-gray-500">{shop.owner_name}</td>
                    <td className="p-3 text-gray-500">{shop.bank_name} {shop.bank_account}</td>
                    <td className="p-3 text-right">
                      <button onClick={() => handleDelete('shops', shop.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={16}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "ads" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">📢 새 배너 등록</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                   <label className="block text-xs font-bold text-gray-500 mb-1">광고 문구</label>
                   <input className="w-full border p-2 rounded text-black" value={adTitle} onChange={e=>setAdTitle(e.target.value)} placeholder="예: 주민 특별 할인" />
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-500 mb-1">이동 링크</label>
                   <input className="w-full border p-2 rounded text-black" value={adLink} onChange={e=>setAdLink(e.target.value)} placeholder="https://..." />
                </div>
                <div className="col-span-2">
                   <label className="block text-xs font-bold text-gray-500 mb-1">이미지 주소 (Supabase URL)</label>
                   <input className="w-full border p-2 rounded text-black mb-2" value={adImage} onChange={e=>setAdImage(e.target.value)} placeholder="https://...supabase.co/..." />
                   {adImage && <img src={adImage} alt="미리보기" className="h-20 object-cover rounded border" />}
                </div>
              </div>
              <button onClick={handleAddBanner} className="w-full bg-red-500 text-white font-bold py-3 rounded-lg mt-4 hover:bg-red-600">+ 배너 등록하기</button>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="font-bold text-lg mb-4">운영 중인 광고 ({banners.length})</h2>
              <div className="space-y-4">
                {banners.map((banner) => (
                  <div key={banner.id} className="flex gap-4 border p-4 rounded-lg items-center">
                    <img src={banner.image_url} alt="배너" className="w-24 h-16 object-cover rounded bg-gray-100" />
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800">{banner.title}</h3>
                      <a href={banner.link_url} target="_blank" className="text-xs text-blue-500 flex items-center gap-1">{banner.link_url} <ExternalLink size={10}/></a>
                    </div>
                    <button onClick={() => handleDelete('banners', banner.id)} className="text-gray-400 hover:text-red-500 p-2"><Trash2 size={18}/></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
