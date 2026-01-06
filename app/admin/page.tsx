"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

// 👇 [관리자 비밀번호 설정]
const ADMIN_PASSWORD = "237823"; 

export default function AdminMainPage() {
  // --- 상태 관리 ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputPassword, setInputPassword] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard"); // 'dashboard' | 'shops' | 'ads'
  
  const [shops, setShops] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 통계 데이터 상태
  const [stats, setStats] = useState({
    today: 0,
    week: 0,
    month: 0,
    total: 0,
    monthlyBreakdown: {} as any
  });

  // 모달 상태 (수정용 / QR보기용)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false); // QR 코드 전용 팝업
  const [selectedQR, setSelectedQR] = useState<any>(null); // 선택된 QR 정보

  const [editMode, setEditMode] = useState<"create" | "edit">("create");
  const [targetId, setTargetId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    shop_name: "", owner_name: "", bank_name: "KB국민", bank_account: "",
    title: "", link_url: "", image_url: ""
  });

  // 🔐 로그인
  const handleLogin = () => {
    if (inputPassword === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      fetchData();
    } else {
      alert("비밀번호가 일치하지 않습니다.");
    }
  };

  // 🔄 데이터 불러오기 및 통계 계산
  const fetchData = async () => {
    setLoading(true);
    const { data: shopData } = await supabase.from('shops').select('*').order('created_at', { ascending: false });
    const { data: bannerData } = await supabase.from('banners').select('*').order('created_at', { ascending: false });
    
    const shopList = shopData || [];
    setShops(shopList);
    setBanners(bannerData || []);

    // 📊 통계 계산 로직
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);
    
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    let todayCount = 0;
    let weekCount = 0;
    let monthCount = 0;
    const monthlyData: any = {};

    shopList.forEach((shop: any) => {
      const created = shop.created_at;
      // 1. 기간별 카운트
      if (created >= todayStart) todayCount++;
      if (created >= oneWeekAgo.toISOString()) weekCount++;
      if (created >= thisMonthStart) monthCount++;

      // 2. 월별 그룹화 (YYYY-MM)
      const monthKey = created.substring(0, 7); // "2024-01" 형태
      if (!monthlyData[monthKey]) monthlyData[monthKey] = 0;
      monthlyData[monthKey]++;
    });

    setStats({
      today: todayCount,
      week: weekCount,
      month: monthCount,
      total: shopList.length,
      monthlyBreakdown: monthlyData
    });

    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) fetchData();
  }, [activeTab, isAuthenticated]);

  // 🗑️ 삭제
  const handleDelete = async (table: string, id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) alert("삭제 실패: " + error.message);
    else {
      alert("삭제되었습니다.");
      fetchData();
    }
  };

  // 📷 QR 모달 열기
  const openQRModal = (shop: any) => {
    setSelectedQR(shop);
    setIsQRModalOpen(true);
  };

  // 📝 등록/수정 모달 열기
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

  // 💾 저장
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

  // --- 로그인 화면 ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-800 p-4 text-white">
        <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm text-center text-black">
          <div className="text-4xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold mb-2">QR BANK Admin</h1>
          <p className="text-sm text-gray-500 mb-6">통합 관리자 시스템</p>
          <input 
            type="password" 
            className="w-full bg-gray-50 border p-4 rounded-xl text-center text-lg mb-4 text-black"
            placeholder="비밀번호"
            value={inputPassword}
            onChange={(e) => setInputPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
          <button onClick={handleLogin} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700">
            접속하기
          </button>
        </div>
      </div>
    );
  }

  // --- 메인 대시보드 ---
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* 사이드바 */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col p-6">
        <h1 className="text-xl font-bold mb-8">QR BANK</h1>
        <nav className="flex-1 space-y-2">
          <button onClick={() => setActiveTab("dashboard")} className={`w-full text-left px-4 py-3 rounded-xl ${activeTab === 'dashboard' ? 'bg-blue-600 font-bold' : 'hover:bg-slate-800'}`}>
            📊 통계 대시보드
          </button>
          <button onClick={() => setActiveTab("shops")} className={`w-full text-left px-4 py-3 rounded-xl ${activeTab === 'shops' ? 'bg-blue-600 font-bold' : 'hover:bg-slate-800'}`}>
            🏪 가맹점 관리
          </button>
          <button onClick={() => setActiveTab("ads")} className={`w-full text-left px-4 py-3 rounded-xl ${activeTab === 'ads' ? 'bg-blue-600 font-bold' : 'hover:bg-slate-800'}`}>
            📢 광고 배너
          </button>
        </nav>
        <button onClick={() => window.location.reload()} className="text-sm text-gray-400 hover:text-white py-2 mt-4 text-left">🔒 로그아웃</button>
      </aside>

      {/* 모바일 탭 */}
      <div className="md:hidden flex bg-white border-b sticky top-0 z-10">
        <button onClick={() => setActiveTab("dashboard")} className={`flex-1 py-3 text-sm font-bold ${activeTab === 'dashboard' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>통계</button>
        <button onClick={() => setActiveTab("shops")} className={`flex-1 py-3 text-sm font-bold ${activeTab === 'shops' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>가맹점</button>
        <button onClick={() => setActiveTab("ads")} className={`flex-1 py-3 text-sm font-bold ${activeTab === 'ads' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>광고</button>
      </div>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        
        {/* --- 📊 대시보드 (통계) 탭 --- */}
        {activeTab === "dashboard" && (
          <div className="max-w-5xl mx-auto space-y-8">
            <h2 className="text-2xl font-bold text-gray-800">📊 가맹점 현황판</h2>
            
            {/* 통계 카드 4개 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-blue-100">
                <div className="text-gray-500 text-xs font-bold mb-1">오늘 신규</div>
                <div className="text-3xl font-black text-blue-600">{stats.today}건</div>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-green-100">
                <div className="text-gray-500 text-xs font-bold mb-1">이번 주</div>
                <div className="text-3xl font-black text-green-600">{stats.week}건</div>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-purple-100">
                <div className="text-gray-500 text-xs font-bold mb-1">이번 달</div>
                <div className="text-3xl font-black text-purple-600">{stats.month}건</div>
              </div>
              <div className="bg-slate-800 p-5 rounded-2xl shadow-sm text-white">
                <div className="text-gray-400 text-xs font-bold mb-1">총 누적 가맹점</div>
                <div className="text-3xl font-black">{stats.total}개</div>
              </div>
            </div>

            {/* 월별 가입 추이 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <h3 className="font-bold text-lg mb-4 text-gray-800">📈 월별 가입 추이</h3>
              <div className="space-y-3">
                {Object.keys(stats.monthlyBreakdown).sort().reverse().map((month) => (
                  <div key={month} className="flex items-center gap-4">
                    <div className="w-20 font-bold text-gray-500">{month}</div>
                    <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                      <div 
                        className="bg-blue-500 h-full rounded-full transition-all duration-1000" 
                        style={{ width: `${(stats.monthlyBreakdown[month] / stats.total) * 100}%` }}
                      ></div>
                    </div>
                    <div className="w-12 text-right font-bold text-gray-800">{stats.monthlyBreakdown[month]}건</div>
                  </div>
                ))}
                {Object.keys(stats.monthlyBreakdown).length === 0 && <div className="text-gray-400 text-sm">데이터가 없습니다.</div>}
              </div>
            </div>

             {/* 바로가기 버튼 */}
             <button onClick={() => setActiveTab('shops')} className="w-full py-4 bg-white border border-gray-300 rounded-xl font-bold text-gray-600 hover:bg-gray-50">
                상세 리스트 관리하러 가기 👉
             </button>
          </div>
        )}

        {/* --- 🏪 가맹점 관리 탭 --- */}
        {activeTab === "shops" && (
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">가맹점 리스트</h2>
              <button onClick={() => openModal("create")} className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-slate-800">➕ 신규 등록</button>
            </div>
            
            <div className="bg-white rounded-xl shadow overflow-hidden">
              {shops.map((shop) => (
                <div key={shop.id} className="p-4 border-b flex flex-col md:flex-row justify-between items-start md:items-center hover:bg-gray-50 gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg text-gray-900">{shop.shop_name}</span>
                      <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{shop.created_at?.substring(0,10)}</span>
                    </div>
                    <div className="text-sm text-gray-500">{shop.owner_name} | {shop.bank_name} {shop.bank_account}</div>
                  </div>
                  
                  <div className="flex gap-2 w-full md:w-auto">
                    {/* QR 보기 버튼 (새로 추가됨!) */}
                    <button onClick={() => openQRModal(shop)} className="flex-1 md:flex-none px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow hover:bg-blue-700">
                      📷 QR생성
                    </button>
                    <button onClick={() => openModal("edit", shop)} className="flex-1 md:flex-none px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-200">
                      수정
                    </button>
                    <button onClick={() => handleDelete('shops', shop.id)} className="flex-1 md:flex-none px-3 py-2 bg-red-50 text-red-500 rounded-lg text-sm font-bold hover:bg-red-100">
                      삭제
                    </button>
                  </div>
                </div>
              ))}
              {shops.length === 0 && <div className="p-8 text-center text-gray-400">등록된 가맹점이 없습니다.</div>}
            </div>
          </div>
        )}

        {/* --- 📢 광고 배너 관리 탭 --- */}
        {activeTab === "ads" && (
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">광고 배너 관리</h2>
              <button onClick={() => openModal("create")} className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-red-600">➕ 새 배너</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {banners.map((banner) => (
                <div key={banner.id} className="bg-white p-4 rounded-xl shadow border flex gap-4 items-center hover:shadow-md transition-shadow">
                  <img src={banner.image_url} className="w-16 h-16 rounded bg-gray-100 object-cover border" alt="배너"/>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold truncate text-gray-900">{banner.title}</div>
                    <div className="text-xs text-blue-500 truncate">{banner.link_url}</div>
                    <div className="mt-2 flex gap-2">
                      <button onClick={() => openModal("edit", banner)} className="text-xs bg-gray-100 px-2 py-1 rounded font-bold text-gray-600 hover:bg-gray-200">수정</button>
                      <button onClick={() => handleDelete('banners', banner.id)} className="text-xs bg-red-50 text-red-500 px-2 py-1 rounded font-bold hover:bg-red-100">삭제</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {banners.length === 0 && <div className="p-8 text-center text-gray-400">등록된 광고가 없습니다.</div>}
          </div>
        )}
      </main>

      {/* 🛠️ 등록/수정 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="font-bold text-lg text-gray-900">{editMode === "create" ? "✨ 새로 등록" : "🛠️ 정보 수정"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-black font-bold">✕ 닫기</button>
            </div>
            
            <div className="space-y-4">
              {(activeTab === "shops" || (activeTab === 'dashboard' && !targetId)) ? (
                <>
                  <input className="w-full border p-3 rounded-lg text-black" value={formData.shop_name} onChange={e=>setFormData({...formData, shop_name: e.target.value})} placeholder="매장 이름 (예: 카페 성수)" />
                  <input className="w-full border p-3 rounded-lg text-black" value={formData.owner_name} onChange={e=>setFormData({...formData, owner_name: e.target.value})} placeholder="대표자명" />
                  <div className="flex gap-2">
                    <select className="w-1/3 border p-3 rounded-lg bg-white text-black" value={formData.bank_name} onChange={e=>setFormData({...formData, bank_name: e.target.value})}>
                      <option>KB국민</option><option>신한</option><option>토스</option><option>카카오</option><option>농협</option><option>우리</option><option>하나</option><option>기업</option>
                    </select>
                    <input className="w-2/3 border p-3 rounded-lg text-black" value={formData.bank_account} onChange={e=>setFormData({...formData, bank_account: e.target.value})} placeholder="계좌번호" />
                  </div>
                </>
              ) : (
                <>
                  <input className="w-full border p-3 rounded-lg text-black" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} placeholder="광고 문구" />
                  <input className="w-full border p-3 rounded-lg text-black" value={formData.image_url} onChange={e=>setFormData({...formData, image_url: e.target.value})} placeholder="이미지 주소 (URL)" />
                  <input className="w-full border p-3 rounded-lg text-black" value={formData.link_url} onChange={e=>setFormData({...formData, link_url: e.target.value})} placeholder="연결 링크 URL" />
                </>
              )}
            </div>

            <div className="mt-8 flex gap-3">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-gray-100 rounded-xl font-bold text-gray-600 hover:bg-gray-200">취소</button>
              <button onClick={handleSave} className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 shadow-lg">저장하기</button>
            </div>
          </div>
        </div>
      )}

      {/* 📷 QR 생성/다운로드 모달 (새로 추가됨!) */}
      {isQRModalOpen && selectedQR && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setIsQRModalOpen(false)}>
          <div className="bg-white p-8 rounded-3xl max-w-sm w-full text-center relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setIsQRModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black">✕</button>
            
            <h3 className="text-xl font-bold mb-1">{selectedQR.shop_name}</h3>
            <p className="text-gray-500 text-sm mb-6">QR코드를 스캔하거나 저장하세요</p>
            
            <div className="bg-gray-50 p-4 rounded-2xl border mb-6 inline-block">
              {/* 외부 QR API 사용 (설치 불필요) */}
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://qrbank.kr/q/${selectedQR.id}`} 
                alt="QR Code" 
                className="w-48 h-48 mix-blend-multiply"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <a 
                href={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=https://qrbank.kr/q/${selectedQR.id}`} 
                download="qr-code.png"
                target="_blank"
                className="py-3 bg-blue-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-1"
              >
                💾 이미지 저장
              </a>
              <a 
                href={`/q/${selectedQR.id}`} 
                target="_blank"
                className="py-3 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm flex items-center justify-center gap-1"
              >
                🔗 페이지 이동
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
