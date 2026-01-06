"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Trash2, Edit, ExternalLink, RefreshCw, Store, Megaphone, 
  Lock, LogIn, Save, Plus 
} from "lucide-react"; 
// 👆 에러 원인이 될 수 있는 LayoutDashboard, LogOut, X, ChevronRight 등을 제거했습니다.

// 👇 [관리자 비밀번호 설정]
const ADMIN_PASSWORD = "237823"; 

export default function AdminMainPage() {
  // --- 🔐 로그인 및 상태 관리 ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputPassword, setInputPassword] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard"); // 'dashboard' | 'shops' | 'ads'
  
  // 데이터 상태
  const [shops, setShops] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 모달(팝업) 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState<"create" | "edit">("create");
  const [targetId, setTargetId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    shop_name: "", owner_name: "", bank_name: "KB국민", bank_account: "",
    title: "", link_url: "", image_url: ""
  });

  // 🔐 로그인 처리
  const handleLogin = () => {
    if (inputPassword === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      fetchData();
    } else {
      alert("비밀번호가 일치하지 않습니다.");
    }
  };

  // 🔄 데이터 불러오기
  const fetchData = async () => {
    setLoading(true);
    const { data: shopData } = await supabase.from('shops').select('*').order('created_at', { ascending: false });
    const { data: bannerData } = await supabase.from('banners').select('*').order('created_at', { ascending: false });
    
    setShops(shopData || []);
    setBanners(bannerData || []);
    setLoading(false);
  };

  // 탭 변경 시 데이터 최신화
  useEffect(() => {
    if (isAuthenticated) fetchData();
  }, [activeTab, isAuthenticated]);

  // 🗑️ 삭제 기능
  const handleDelete = async (table: string, id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) alert("삭제 실패: " + error.message);
    else {
      alert("삭제되었습니다.");
      fetchData();
    }
  };

  // 📝 모달 열기
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

  // 💾 저장 기능
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

  // ------------------------------------------------------------------
  // 🛑 [화면 1] 로그인 대기 화면
  // ------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
        <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <div className="mb-6">
            <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-700 shadow-inner">
              <Lock size={36} />
            </div>
            <h1 className="text-2xl font-black text-gray-900">QR BANK Admin</h1>
            <p className="text-sm text-gray-500 mt-2">관리자 전용 대시보드입니다.</p>
          </div>
          
          <div className="space-y-4">
            <input 
              type="password" 
              className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl text-center text-lg tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-black"
              placeholder="••••"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              autoFocus
            />
            <button 
              onClick={handleLogin}
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <LogIn size={20} /> 접속하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // ✅ [화면 2] 통합 관리자 대시보드
  // ------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* 1. 사이드바 메뉴 (PC용) */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold tracking-wider">QR BANK</h1>
          <p className="text-xs text-slate-400">Management System</p>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <button onClick={() => setActiveTab("dashboard")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-blue-600 shadow-lg shadow-blue-900/50 font-bold' : 'text-slate-400 hover:bg-slate-800'}`}>
            <Store size={20} /> 대시보드 홈
          </button>
          <button onClick={() => setActiveTab("shops")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'shops' ? 'bg-blue-600 shadow-lg shadow-blue-900/50 font-bold' : 'text-slate-400 hover:bg-slate-800'}`}>
            <Store size={20} /> 가맹점 관리
          </button>
          <button onClick={() => setActiveTab("ads")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'ads' ? 'bg-blue-600 shadow-lg shadow-blue-900/50 font-bold' : 'text-slate-400 hover:bg-slate-800'}`}>
            <Megaphone size={20} /> 광고 배너
          </button>
        </nav>
        <div className="p-4">
          <button onClick={() => window.location.reload()} className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-white py-2 text-sm">
            <Lock size={16} /> 로그아웃
          </button>
        </div>
      </aside>

      {/* 2. 메인 컨텐츠 영역 */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* 모바일용 헤더 */}
        <header className="bg-white border-b p-4 flex justify-between items-center md:hidden">
          <h1 className="font-bold text-lg">관리자 모드</h1>
          <button onClick={() => window.location.reload()} className="text-sm text-red-500">로그아웃</button>
        </header>

        {/* 탭 버튼 (모바일용) */}
        <div className="md:hidden flex bg-white border-b">
          <button onClick={() => setActiveTab("dashboard")} className={`flex-1 py-3 text-sm font-bold ${activeTab === 'dashboard' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>홈</button>
          <button onClick={() => setActiveTab("shops")} className={`flex-1 py-3 text-sm font-bold ${activeTab === 'shops' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>가맹점</button>
          <button onClick={() => setActiveTab("ads")} className={`flex-1 py-3 text-sm font-bold ${activeTab === 'ads' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>광고</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          
          {/* --- 🏠 대시보드 홈 탭 --- */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">👋 안녕하세요, 운영자님!</h2>
              
              {/* 요약 카드 */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="text-gray-500 text-sm font-medium mb-1">총 가맹점</div>
                  <div className="text-3xl font-black text-slate-900">{shops.length}개</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="text-gray-500 text-sm font-medium mb-1">운영 중인 광고</div>
                  <div className="text-3xl font-black text-red-500">{banners.length}개</div>
                </div>
                <div className="bg-blue-600 p-6 rounded-2xl shadow-lg text-white flex flex-col justify-center items-start cursor-pointer hover:bg-blue-700 transition-colors"
                     onClick={() => { setActiveTab('shops'); openModal('create', null, 'shops'); }}>
                  <div className="font-bold text-lg mb-1 flex items-center gap-2">
                    <Plus size={20} /> 바로 등록
                  </div>
                  <div className="text-blue-200 text-sm">새 가맹점 추가하기</div>
                </div>
              </div>

              {/* 최근 등록 리스트 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5 border-b flex justify-between items-center">
                  <h3 className="font-bold text-gray-800">최근 등록된 가맹점</h3>
                  <button onClick={() => setActiveTab("shops")} className="text-xs text-blue-500 flex items-center gap-1 hover:underline">
                    전체보기 &gt;
                  </button>
                </div>
                <div className="divide-y">
                  {shops.slice(0, 5).map((shop) => (
                    <div key={shop.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                      <div>
                        <div className="font-bold text-gray-800">{shop.shop_name}</div>
                        <div className="text-xs text-gray-500">{shop.created_at?.substring(0,10)}</div>
                      </div>
                      <div className="text-sm text-gray-600">{shop.owner_name}</div>
                    </div>
                  ))}
                  {shops.length === 0 && <div className="p-6 text-center text-gray-400 text-sm">등록된 매장이 없습니다.</div>}
                </div>
              </div>
            </div>
          )}

          {/* --- 🏪 가맹점 관리 탭 --- */}
          {activeTab === "shops" && (
            <div className="max-w-5xl mx-auto animate-in fade-in duration-300">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">가맹점 관리</h2>
                <button onClick={() => openModal("create")} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-slate-800 shadow-lg shadow-slate-200">
                  + 신규 등록
                </button>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500 border-b">
                    <tr>
                      <th className="p-4 font-medium">매장명</th>
                      <th className="p-4 font-medium hidden md:table-cell">계좌정보</th>
                      <th className="p-4 font-medium text-right">관리</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {shops.map((shop) => (
                      <tr key={shop.id} className="hover:bg-gray-50">
                        <td className="p-4">
                          <div className="font-bold text-gray-900">{shop.shop_name}</div>
                          <div className="text-xs text-gray-500 md:hidden">{shop.owner_name}</div>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <span className="font-bold text-blue-600">{shop.bank_name}</span> 
                          <span className="text-gray-600 ml-2">{shop.bank_account}</span>
                          <div className="text-xs text-gray-400 mt-1">예금주: {shop.owner_name}</div>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button onClick={() => openModal("edit", shop)} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-xs font-bold inline-flex items-center gap-1">
                            <Edit size={14}/> <span className="hidden md:inline">수정</span>
                          </button>
                          <button onClick={() => handleDelete('shops', shop.id)} className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg text-xs font-bold inline-flex items-center gap-1">
                            <Trash2 size={14}/> <span className="hidden md:inline">삭제</span>
                          </button>
                          <a href={`/q/${shop.id}`} target="_blank" className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-bold inline-flex items-center gap-1">
                            <ExternalLink size={14}/> <span className="hidden md:inline">QR확인</span>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* --- 📢 광고 배너 관리 탭 --- */}
          {activeTab === "ads" && (
            <div className="max-w-5xl mx-auto animate-in fade-in duration-300">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">광고 배너 관리</h2>
                <button onClick={() => openModal("create")} className="bg-red-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-red-600 shadow-lg shadow-red-200">
                  + 새 배너 등록
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {banners.map((banner) => (
                  <div key={banner.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-center">
                    <img src={banner.image_url} className="w-20 h-20 rounded-xl object-cover bg-gray-100 border" alt="배너" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-800 truncate">{banner.title}</h3>
                      <a href={banner.link_url} target="_blank" className="text-xs text-blue-500 hover:underline truncate block mb-2">{banner.link_url}</a>
                      <div className="flex gap-2">
                        <button onClick={() => openModal("edit", banner)} className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 font-bold">수정</button>
                        <button onClick={() => handleDelete('banners', banner.id)} className="text-xs bg-red-50 px-2 py-1 rounded text-red-500 font-bold">삭제</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {banners.length === 0 && <div className="text-center p-10 text-gray-400">등록된 광고가 없습니다.</div>}
            </div>
          )}

        </div>
      </main>

      {/* 🛠️ 통합 모달 (팝업) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-5 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg text-gray-900">
                {editMode === "create" ? "✨ 새로 등록" : "🛠️ 정보 수정"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">닫기</button>
            </div>
            
            <div className="p-6 space-y-4">
              {activeTab === "shops" || (activeTab === 'dashboard' && !targetId) ? (
                <>
                  <div>
                    <label className="text-xs font-bold text-gray-500">매장 이름</label>
                    <input className="w-full border p-3 rounded-lg mt-1 text-black bg-gray-50 focus:bg-white transition-colors" value={formData.shop_name} onChange={e=>setFormData({...formData, shop_name: e.target.value})} placeholder="예: 카페 성수" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500">대표자명</label>
                    <input className="w-full border p-3 rounded-lg mt-1 text-black bg-gray-50 focus:bg-white transition-colors" value={formData.owner_name} onChange={e=>setFormData({...formData, owner_name: e.target.value})} placeholder="예: 홍길동" />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-xs font-bold text-gray-500">은행</label>
                      <select className="w-full border p-3 rounded-lg mt-1 text-black bg-white" value={formData.bank_name} onChange={e=>setFormData({...formData, bank_name: e.target.value})}>
                        <option>KB국민</option><option>신한</option><option>토스</option><option>카카오</option><option>농협</option><option>우리</option><option>하나</option><option>기업</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs font-bold text-gray-500">계좌번호</label>
                      <input className="w-full border p-3 rounded-lg mt-1 text-black bg-gray-50 focus:bg-white transition-colors" value={formData.bank_account} onChange={e=>setFormData({...formData, bank_account: e.target.value})} placeholder="하이픈 없이 입력" />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="text-xs font-bold text-gray-500">광고 문구 (Title)</label>
                    <input className="w-full border p-3 rounded-lg mt-1 text-black bg-gray-50 focus:bg-white transition-colors" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} placeholder="예: 주민 특별 할인" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500">이미지 주소 (URL)</label>
                    <input className="w-full border p-3 rounded-lg mt-1 text-black bg-gray-50 focus:bg-white transition-colors" value={formData.image_url} onChange={e=>setFormData({...formData, image_url: e.target.value})} placeholder="Supabase 이미지 주소" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500">연결 링크 (URL)</label>
                    <input className="w-full border p-3 rounded-lg mt-1 text-black bg-gray-50 focus:bg-white transition-colors" value={formData.link_url} onChange={e=>setFormData({...formData, link_url: e.target.value})} placeholder="https://..." />
                  </div>
                </>
              )}
            </div>

            <div className="p-5 border-t bg-gray-50 flex gap-3">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-white border border-gray-300 rounded-xl font-bold text-gray-600 hover:bg-gray-100">취소</button>
              <button onClick={handleSave} className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 flex items-center justify-center gap-2 shadow-lg shadow-slate-200">
                <Save size={18}/> 저장하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
