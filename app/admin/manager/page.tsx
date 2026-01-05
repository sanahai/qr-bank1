"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Trash2, Edit, ExternalLink, RefreshCw, Store, Megaphone, Lock, LogIn, X, Save } from "lucide-react";

// 👇 [관리자 비밀번호]
const ADMIN_PASSWORD = "237823"; 

export default function SuperAdminPage() {
  // --- 🔐 로그인 및 기본 상태 ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputPassword, setInputPassword] = useState("");
  const [activeTab, setActiveTab] = useState("shops"); // 'shops' | 'ads'
  const [shops, setShops] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // --- 🛠️ 모달(팝업) 및 수정 상태 ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState<"create" | "edit">("create");
  const [targetId, setTargetId] = useState<number | null>(null);

  // 입력 폼 데이터 (가맹점/배너 공용 사용)
  const [formData, setFormData] = useState({
    // 가맹점용
    shop_name: "", owner_name: "", bank_name: "KB국민", bank_account: "",
    // 배너용
    title: "", link_url: "", image_url: ""
  });

  // 🔐 로그인 처리
  const handleLogin = () => {
    if (inputPassword === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      fetchData();
    } else {
      alert("비밀번호가 틀렸습니다.");
    }
  };

  // 🔄 데이터 불러오기
  const fetchData = async () => {
    setLoading(true);
    if (activeTab === "shops") {
      const { data, error } = await supabase.from('shops').select('*').order('created_at', { ascending: false });
      if (error) console.error("가맹점 로딩 실패:", error);
      setShops(data || []);
    } else {
      const { data, error } = await supabase.from('banners').select('*').order('created_at', { ascending: false });
      if (error) console.error("배너 로딩 실패:", error);
      setBanners(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) fetchData();
  }, [activeTab, isAuthenticated]);

  // 🗑️ 삭제 기능 (공통)
  const handleDelete = async (table: string, id: number) => {
    if (!confirm("정말 삭제하시겠습니까? (복구 불가)")) return;

    const { error } = await supabase.from(table).delete().eq('id', id);
    
    if (error) {
      alert("삭제 실패! Supabase에서 Delete 정책(RLS)을 확인해주세요.\n에러내용: " + error.message);
    } else {
      alert("삭제되었습니다.");
      fetchData();
    }
  };

  // 📝 수정/등록 모달 열기
  const openModal = (type: "create" | "edit", item?: any) => {
    setEditMode(type);
    setIsModalOpen(true);
    
    if (type === "edit" && item) {
      setTargetId(item.id);
      // 기존 데이터 채워넣기
      setFormData({
        shop_name: item.shop_name || "",
        owner_name: item.owner_name || "",
        bank_name: item.bank_name || "KB국민",
        bank_account: item.bank_account || "",
        title: item.title || "",
        link_url: item.link_url || "",
        image_url: item.image_url || ""
      });
    } else {
      // 초기화
      setTargetId(null);
      setFormData({
        shop_name: "", owner_name: "", bank_name: "KB국민", bank_account: "",
        title: "", link_url: "", image_url: ""
      });
    }
  };

  // 💾 저장 (생성 및 수정 통합)
  const handleSave = async () => {
    const table = activeTab === "shops" ? "shops" : "banners";
    let payload: any = {};

    // 데이터 준비
    if (activeTab === "shops") {
      if (!formData.shop_name || !formData.bank_account) return alert("매장명과 계좌번호는 필수입니다.");
      payload = {
        shop_name: formData.shop_name,
        owner_name: formData.owner_name,
        bank_name: formData.bank_name,
        bank_account: formData.bank_account
      };
    } else {
      if (!formData.title || !formData.image_url) return alert("광고 문구와 이미지 주소는 필수입니다.");
      payload = {
        title: formData.title,
        link_url: formData.link_url,
        image_url: formData.image_url,
        is_active: true
      };
    }

    let error;
    if (editMode === "create") {
      // 신규 등록
      const res = await supabase.from(table).insert(payload);
      error = res.error;
    } else {
      // 수정 (Update)
      const res = await supabase.from(table).update(payload).eq('id', targetId);
      error = res.error;
    }

    if (error) {
      alert("저장 실패: " + error.message);
    } else {
      alert(editMode === "create" ? "등록되었습니다." : "수정되었습니다.");
      setIsModalOpen(false);
      fetchData();
    }
  };

  // --- 🔒 로그인 화면 ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm text-center">
          <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600">
            <Lock size={32} />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-6">관리자 접속</h1>
          <input 
            type="password" 
            className="w-full border p-3 rounded-lg mb-4 text-center text-lg tracking-widest"
            placeholder="비밀번호"
            value={inputPassword}
            onChange={(e) => setInputPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            autoFocus
          />
          <button onClick={handleLogin} className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800">
            접속하기
          </button>
        </div>
      </div>
    );
  }

  // --- ✅ 메인 관리 화면 ---
  return (
    <div className="min-h-screen bg-gray-100 p-6 pb-20">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">👑 운영자 통합 관리</h1>
          <button onClick={() => window.location.reload()} className="text-sm text-red-500 underline font-medium">로그아웃</button>
        </header>

        {/* 탭 메뉴 */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setActiveTab("shops")} className={`flex-1 py-3 rounded-lg font-bold flex justify-center items-center gap-2 transition-colors ${activeTab === 'shops' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
            <Store size={18}/> 가맹점 관리
          </button>
          <button onClick={() => setActiveTab("ads")} className={`flex-1 py-3 rounded-lg font-bold flex justify-center items-center gap-2 transition-colors ${activeTab === 'ads' ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
            <Megaphone size={18}/> 배너 광고 관리
          </button>
        </div>

        {/* 상단 액션 바 */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg text-gray-800">
            {activeTab === 'shops' ? `가맹점 목록 (${shops.length})` : `배너 목록 (${banners.length})`}
          </h2>
          <div className="flex gap-2">
            <button onClick={fetchData} className="p-2 bg-white rounded-lg border hover:bg-gray-50"><RefreshCw size={18} className={loading ? "animate-spin" : ""}/></button>
            <button onClick={() => openModal("create")} className="px-4 py-2 bg-slate-800 text-white rounded-lg font-bold text-sm hover:bg-slate-900">
              + {activeTab === 'shops' ? "가맹점 수동 등록" : "새 배너 등록"}
            </button>
          </div>
        </div>

        {/* 리스트 영역 */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 border-b">
              <tr>
                {activeTab === 'shops' ? (
                  <>
                    <th className="p-4">매장명</th>
                    <th className="p-4">대표자/계좌</th>
                    <th className="p-4 text-right">관리</th>
                  </>
                ) : (
                  <>
                    <th className="p-4">이미지/내용</th>
                    <th className="p-4">링크</th>
                    <th className="p-4 text-right">관리</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y">
              {activeTab === 'shops' ? (
                shops.map((shop) => (
                  <tr key={shop.id} className="hover:bg-gray-50">
                    <td className="p-4 font-bold text-gray-800">{shop.shop_name}</td>
                    <td className="p-4 text-gray-600">
                      <div className="font-medium">{shop.owner_name}</div>
                      <div className="text-xs text-blue-600">{shop.bank_name} {shop.bank_account}</div>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => openModal("edit", shop)} className="p-2 text-blue-500 hover:bg-blue-50 rounded"><Edit size={16}/></button>
                      <button onClick={() => handleDelete('shops', shop.id)} className="p-2 text-red-500 hover:bg-red-50 rounded"><Trash2 size={16}/></button>
                    </td>
                  </tr>
                ))
              ) : (
                banners.map((banner) => (
                  <tr key={banner.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={banner.image_url} className="w-12 h-12 rounded object-cover bg-gray-100 border" alt="배너" />
                        <span className="font-bold text-gray-800 line-clamp-1">{banner.title}</span>
                      </div>
                    </td>
                    <td className="p-4 text-blue-500 truncate max-w-[200px]">
                      <a href={banner.link_url} target="_blank" className="flex items-center gap-1 hover:underline">{banner.link_url} <ExternalLink size={12}/></a>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => openModal("edit", banner)} className="p-2 text-blue-500 hover:bg-blue-50 rounded"><Edit size={16}/></button>
                      <button onClick={() => handleDelete('banners', banner.id)} className="p-2 text-red-500 hover:bg-red-50 rounded"><Trash2 size={16}/></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {((activeTab === 'shops' && shops.length === 0) || (activeTab === 'ads' && banners.length === 0)) && (
            <div className="p-8 text-center text-gray-400">데이터가 없습니다.</div>
          )}
        </div>
      </div>

      {/* 🛠️ 수정/등록 모달 (팝업창) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-5 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg text-gray-900">
                {editMode === "create" ? "✨ 새로 등록" : "🛠️ 정보 수정"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
            </div>
            
            <div className="p-6 space-y-4">
              {activeTab === "shops" ? (
                <>
                  <div>
                    <label className="text-xs font-bold text-gray-500">매장 이름</label>
                    <input className="w-full border p-2 rounded mt-1 text-black" value={formData.shop_name} onChange={e=>setFormData({...formData, shop_name: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500">대표자명</label>
                    <input className="w-full border p-2 rounded mt-1 text-black" value={formData.owner_name} onChange={e=>setFormData({...formData, owner_name: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-xs font-bold text-gray-500">은행</label>
                      <select className="w-full border p-2 rounded mt-1 text-black bg-white" value={formData.bank_name} onChange={e=>setFormData({...formData, bank_name: e.target.value})}>
                        <option>KB국민</option><option>신한</option><option>토스</option><option>카카오</option><option>농협</option><option>우리</option><option>하나</option><option>기업</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs font-bold text-gray-500">계좌번호</label>
                      <input className="w-full border p-2 rounded mt-1 text-black" value={formData.bank_account} onChange={e=>setFormData({...formData, bank_account: e.target.value})} />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="text-xs font-bold text-gray-500">광고 문구 (Title)</label>
                    <input className="w-full border p-2 rounded mt-1 text-black" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500">이미지 주소 (URL)</label>
                    <input className="w-full border p-2 rounded mt-1 text-black" value={formData.image_url} onChange={e=>setFormData({...formData, image_url: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500">연결 링크 (URL)</label>
                    <input className="w-full border p-2 rounded mt-1 text-black" value={formData.link_url} onChange={e=>setFormData({...formData, link_url: e.target.value})} />
                  </div>
                </>
              )}
            </div>

            <div className="p-5 border-t bg-gray-50 flex gap-2">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-white border border-gray-300 rounded-xl font-bold text-gray-600 hover:bg-gray-100">취소</button>
              <button onClick={handleSave} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 flex items-center justify-center gap-2">
                <Save size={18}/> {editMode === "create" ? "등록하기" : "수정 저장"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
