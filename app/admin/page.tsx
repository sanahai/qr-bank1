"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
// ❌ lucide-react 아이콘 import를 모두 제거했습니다. (배포 에러 원인 차단)

// 👇 [관리자 비밀번호 설정]
const ADMIN_PASSWORD = "237823"; 

export default function AdminMainPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputPassword, setInputPassword] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  
  const [shops, setShops] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState<"create" | "edit">("create");
  const [targetId, setTargetId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    shop_name: "", owner_name: "", bank_name: "KB국민", bank_account: "",
    title: "", link_url: "", image_url: ""
  });

  const handleLogin = () => {
    if (inputPassword === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      fetchData();
    } else {
      alert("비밀번호가 일치하지 않습니다.");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const { data: shopData } = await supabase.from('shops').select('*').order('created_at', { ascending: false });
    const { data: bannerData } = await supabase.from('banners').select('*').order('created_at', { ascending: false });
    
    setShops(shopData || []);
    setBanners(bannerData || []);
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) fetchData();
  }, [activeTab, isAuthenticated]);

  const handleDelete = async (table: string, id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) alert("삭제 실패: " + error.message);
    else {
      alert("삭제되었습니다.");
      fetchData();
    }
  };

  const openModal = (type: "create" | "edit", item?: any, category?: string) => {
    if(category === 'shops') setActiveTab('shops');
    if(category === 'ads') setActiveTab('ads');

    setEditMode(type);
    setIsModalOpen(true);
    
    if (type === "edit" && item) {
      setTargetId(item.id);
      setFormData({
        shop_name: item.shop_name || "", owner_name: item.owner_name || "",
        bank_name: item.bank_name || "KB국민", bank_account: item.bank_account || "",
        title: item.title || "", link_url: item.link_url || "", image_url: item.image_url || ""
      });
    } else {
      setTargetId(null);
      setFormData({
        shop_name: "", owner_name: "", bank_name: "KB국민", bank_account: "",
        title: "", link_url: "", image_url: ""
      });
    }
  };

  const handleSave = async () => {
    const currentTab = activeTab === 'dashboard' ? 'shops' : activeTab;
    const table = currentTab === "shops" ? "shops" : "banners";
    
    let payload: any = {};

    if (currentTab === "shops") {
      if (!formData.shop_name) return alert("매장명을 입력해주세요.");
      payload = {
        shop_name: formData.shop_name, owner_name: formData.owner_name,
        bank_name: formData.bank_name, bank_account: formData.bank_account
      };
    } else {
      if (!formData.title) return alert("광고 제목을 입력해주세요.");
      payload = {
        title: formData.title, link_url: formData.link_url, 
        image_url: formData.image_url, is_active: true
      };
    }

    const { error } = editMode === "create" 
      ? await supabase.from(table).insert(payload)
      : await supabase.from(table).update(payload).eq('id', targetId);

    if (error) alert("저장 실패: " + error.message);
    else {
      alert("완료되었습니다!");
      setIsModalOpen(false);
      fetchData();
    }
  };

  // 로그인 화면
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-800 p-4 text-white">
        <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm text-center text-black">
          <div className="text-4xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold mb-2">QR BANK Admin</h1>
          <p className="text-sm text-gray-500 mb-6">관리자 전용 대시보드</p>
          <input 
            type="password" 
            className="w-full bg-gray-50 border p-4 rounded-xl text-center text-lg mb-4 text-black"
            placeholder="비밀번호"
            value={inputPassword}
            onChange={(e) => setInputPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
          <button onClick={handleLogin} className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl">
            접속하기
          </button>
        </div>
      </div>
    );
  }

  // 메인 대시보드
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* 사이드바 (PC) */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col p-4">
        <h1 className="text-xl font-bold mb-8 px-2">QR BANK</h1>
        <nav className="flex-1 space-y-2">
          <button onClick={() => setActiveTab("dashboard")} className={`w-full text-left px-4 py-3 rounded-xl ${activeTab === 'dashboard' ? 'bg-blue-600 font-bold' : 'hover:bg-slate-800'}`}>
            🏠 대시보드 홈
          </button>
          <button onClick={() => setActiveTab("shops")} className={`w-full text-left px-4 py-3 rounded-xl ${activeTab === 'shops' ? 'bg-blue-600 font-bold' : 'hover:bg-slate-800'}`}>
            🏪 가맹점 관리
          </button>
          <button onClick={() => setActiveTab("ads")} className={`w-full text-left px-4 py-3 rounded-xl ${activeTab === 'ads' ? 'bg-blue-600 font-bold' : 'hover:bg-slate-800'}`}>
            📢 광고 배너
          </button>
        </nav>
        <button onClick={() => window.location.reload()} className="text-sm text-gray-400 hover:text-white py-2">🔒 로그아웃</button>
      </aside>

      {/* 모바일 헤더 */}
      <div className="md:hidden bg-white p-4 border-b flex justify-between items-center">
        <h1 className="font-bold">관리자 모드</h1>
        <button onClick={() => window.location.reload()} className="text-sm text-red-500">로그아웃</button>
      </div>

      {/* 모바일 탭 */}
      <div className="md:hidden flex bg-white border-b">
        <button onClick={() => setActiveTab("dashboard")} className={`flex-1 py-3 text-sm font-bold ${activeTab === 'dashboard' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>홈</button>
        <button onClick={() => setActiveTab("shops")} className={`flex-1 py-3 text-sm font-bold ${activeTab === 'shops' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>가맹점</button>
        <button onClick={() => setActiveTab("ads")} className={`flex-1 py-3 text-sm font-bold ${activeTab === 'ads' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>광고</button>
      </div>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {activeTab === "dashboard" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold">👋 안녕하세요!</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="text-gray-500 text-sm">총 가맹점</div>
                <div className="text-3xl font-black">{shops.length}개</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="text-gray-500 text-sm">운영 중인 광고</div>
                <div className="text-3xl font-black text-red-500">{banners.length}개</div>
              </div>
              <button onClick={() => { setActiveTab('shops'); openModal('create', null, 'shops'); }} className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg text-left hover:bg-blue-700">
                <div className="font-bold text-lg mb-1">+ 바로 등록</div>
                <div className="text-blue-200 text-sm">가맹점 추가</div>
              </button>
            </div>
          </div>
        )}

        {activeTab === "shops" && (
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">가맹점 관리</h2>
              <button onClick={() => openModal("create")} className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold">+ 신규 등록</button>
            </div>
            <div className="bg-white rounded-xl shadow overflow-hidden">
              {shops.map((shop) => (
                <div key={shop.id} className="p-4 border-b flex justify-between items-center hover:bg-gray-50">
                  <div>
                    <div className="font-bold text-lg">{shop.shop_name}</div>
                    <div className="text-sm text-gray-500">{shop.owner_name} | {shop.bank_name}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openModal("edit", shop)} className="px-3 py-1 bg-gray-100 rounded text-sm font-bold">수정</button>
                    <button onClick={() => handleDelete('shops', shop.id)} className="px-3 py-1 bg-red-50 text-red-500 rounded text-sm font-bold">삭제</button>
                    <a href={`/q/${shop.id}`} target="_blank" className="px-3 py-1 bg-blue-50 text-blue-600 rounded text-sm font-bold">QR</a>
                  </div>
                </div>
              ))}
              {shops.length === 0 && <div className="p-8 text-center text-gray-400">등록된 가맹점이 없습니다.</div>}
            </div>
          </div>
        )}

        {activeTab === "ads" && (
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">광고 배너 관리</h2>
              <button onClick={() => openModal("create")} className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold">+ 새 배너</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {banners.map((banner) => (
                <div key={banner.id} className="bg-white p-4 rounded-xl shadow border flex gap-4 items-center">
                  <img src={banner.image_url} className="w-16 h-16 rounded bg-gray-100 object-cover" alt="배너"/>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold truncate">{banner.title}</div>
                    <div className="text-xs text-blue-500 truncate">{banner.link_url}</div>
                    <div className="mt-2 flex gap-2">
                      <button onClick={() => openModal("edit", banner)} className="text-xs bg-gray-100 px-2 py-1 rounded font-bold">수정</button>
                      <button onClick={() => handleDelete('banners', banner.id)} className="text-xs bg-red-50 text-red-500 px-2 py-1 rounded font-bold">삭제</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {banners.length === 0 && <div className="p-8 text-center text-gray-400">등록된 광고가 없습니다.</div>}
          </div>
        )}
      </main>

      {/* 모달 팝업 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">{editMode === "create" ? "✨ 새로 등록" : "🛠️ 정보 수정"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400">닫기</button>
            </div>
            
            <div className="space-y-4">
              {(activeTab === "shops" || (activeTab === 'dashboard' && !targetId)) ? (
                <>
                  <input className="w-full border p-2 rounded" value={formData.shop_name} onChange={e=>setFormData({...formData, shop_name: e.target.value})} placeholder="매장 이름" />
                  <input className="w-full border p-2 rounded" value={formData.owner_name} onChange={e=>setFormData({...formData, owner_name: e.target.value})} placeholder="대표자명" />
                  <select className="w-full border p-2 rounded bg-white" value={formData.bank_name} onChange={e=>setFormData({...formData, bank_name: e.target.value})}>
                    <option>KB국민</option><option>신한</option><option>토스</option><option>카카오</option><option>농협</option><option>우리</option><option>하나</option><option>기업</option>
                  </select>
                  <input className="w-full border p-2 rounded" value={formData.bank_account} onChange={e=>setFormData({...formData, bank_account: e.target.value})} placeholder="계좌번호" />
                </>
              ) : (
                <>
                  <input className="w-full border p-2 rounded" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} placeholder="광고 문구" />
                  <input className="w-full border p-2 rounded" value={formData.image_url} onChange={e=>setFormData({...formData, image_url: e.target.value})} placeholder="이미지 URL" />
                  <input className="w-full border p-2 rounded" value={formData.link_url} onChange={e=>setFormData({...formData, link_url: e.target.value})} placeholder="연결 링크 URL" />
                </>
              )}
            </div>

            <div className="mt-6 flex gap-2">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-gray-100 rounded-xl font-bold">취소</button>
              <button onClick={handleSave} className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold">저장하기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
