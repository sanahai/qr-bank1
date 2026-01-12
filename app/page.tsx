"use client";

import Link from "next/link";
import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  ShieldCheck, Zap, Smartphone, MapPin, 
  CheckCircle, Copy, X, MousePointerClick, FileText 
} from "lucide-react";

export default function Home() {
  // 팝업 상태 관리
  const [isSampleOpen, setIsSampleOpen] = useState(false);
  const [isApplyOpen, setIsApplyOpen] = useState(false); // 신청 폼 모달
  const [isCopied, setIsCopied] = useState(false);

  // 신청 폼 데이터
  const [applyForm, setApplyForm] = useState({
    shop_name: "", owner_name: "", bank_name: "KB국민", bank_account: "", contact: ""
  });

  // 샘플 복사 효과
  const handleSampleCopy = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // 📝 신청서 제출 함수
  const handleSubmit = async () => {
    if (!applyForm.shop_name || !applyForm.owner_name || !applyForm.bank_account) {
      alert("필수 정보를 모두 입력해주세요.");
      return;
    }

    const { error } = await supabase.from('applications').insert([applyForm]);

    if (error) {
      alert("신청 중 오류가 발생했습니다: " + error.message);
    } else {
      alert("🎉 신청이 접수되었습니다!\n운영자가 확인 후 QR코드를 제작하여 연락드립니다.");
      setIsApplyOpen(false);
      setApplyForm({ shop_name: "", owner_name: "", bank_name: "KB국민", bank_account: "", contact: "" });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 네비게이션 */}
      <nav className="flex items-center justify-between px-6 py-3 border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <Link href="/" className="text-xl font-black tracking-tighter hover:opacity-70 transition-opacity cursor-pointer">
          QR BANK
        </Link>
        <div>
          <Link href="/admin" className="text-sm font-bold text-gray-500 hover:text-black py-2 px-2 transition-colors">
            운영자 로그인
          </Link>
        </div>
      </nav>

      {/* 히어로 섹션 */}
      <header className="px-6 pt-10 pb-16 text-center max-w-4xl mx-auto">
        <div className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold mb-4">
          사장님을 위한 간편 결제 솔루션
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight mb-6">
          계좌번호 묻지마세요.<br />
          <span className="text-blue-600">QR로 바로 입금</span>받으세요.
        </h1>
        <p className="text-base md:text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          카운터에 QR코드 하나만 붙여두세요.<br className="md:hidden"/>
          고객은 카메라로 찍고, 앱으로 바로 송금합니다.<br />
          수수료 0원, 가입비 0원. 지금 바로 시작하세요.
        </p>
        
        {/* 버튼 영역 (체험하기 + 신청하기) */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-3">
          <Link 
            href="#preview" 
            className="w-full md:w-auto px-8 py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold text-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
          >
            <MousePointerClick size={20} /> 서비스 체험하기
          </Link>
          <button 
            onClick={() => setIsApplyOpen(true)}
            className="w-full md:w-auto px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
          >
            <FileText size={20} /> 서비스 신청하기
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-3">👆 지금 신청하면 무료로 제작해 드립니다</p>
      </header>

      {/* 기능 소개 */}
      <section className="px-6 py-10 bg-gray-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform duration-300">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4"><Zap size={20} fill="currentColor" /></div>
            <h3 className="text-lg font-bold mb-2">1초 연결</h3>
            <p className="text-sm text-gray-500">고객이 QR을 찍으면<br/>은행 앱이 자동 실행됩니다.</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform duration-300">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-4"><ShieldCheck size={20} /></div>
            <h3 className="text-lg font-bold mb-2">안전한 계좌</h3>
            <p className="text-sm text-gray-500">실명 인증된 계좌번호만<br/>안전하게 전달됩니다.</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform duration-300">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-4"><Smartphone size={20} /></div>
            <h3 className="text-lg font-bold mb-2">간편한 관리</h3>
            <p className="text-sm text-gray-500">복잡한 단말기 필요 없이<br/>스마트폰 하나로 해결됩니다.</p>
          </div>
        </div>
      </section>

      {/* 미리보기 섹션 */}
      <section id="preview" className="px-6 py-12 text-center overflow-hidden">
        <h2 className="text-2xl font-bold mb-3">고객 화면 미리보기</h2>
        <p className="text-gray-500 mb-8 text-sm">화면을 클릭하면 실제 작동 모습을 체험할 수 있습니다.</p>
        <div onClick={() => setIsSampleOpen(true)} className="relative mx-auto w-56 h-[450px] bg-gray-900 rounded-[2.5rem] border-8 border-gray-900 shadow-2xl cursor-pointer hover:scale-105 transition-transform duration-300 group">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-gray-900 rounded-b-lg z-20"></div>
          <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden relative flex flex-col pt-8 px-4 items-center">
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 z-30 flex items-center justify-center transition-colors">
              <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full text-sm font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 text-blue-600 flex items-center gap-1"><MousePointerClick size={16}/> 눌러서 체험하기</div>
            </div>
            <div className="text-[10px] text-gray-400 mb-2 flex items-center gap-1"><MapPin size={10}/> 매장 정보</div>
            <div className="font-bold text-base mb-4 text-gray-800">황금 붕어빵</div>
            <div className="w-full bg-blue-50 rounded-xl p-3 mb-3 border border-blue-100">
              <div className="text-[9px] text-blue-500 font-bold mb-1">송금 계좌</div>
              <div className="font-black text-lg text-gray-900 mb-1">3333-01...</div>
              <div className="w-full bg-blue-600 h-6 rounded-lg"></div>
            </div>
            <div className="w-full grid grid-cols-4 gap-2 opacity-50">{[1,2,3,4,5,6,7,8].map(i => <div key={i} className="aspect-square bg-gray-100 rounded-md"></div>)}</div>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-6 text-center text-xs">
        <p className="mb-3 font-bold text-white text-base">QR BANK</p>
        <div className="space-y-1">
          <p>사업자등록번호 : 326-58-00636 | 대표 : 이동길</p>
          <p>인천광역시 미추홀구 석정로140번길 29</p>
        </div>
        <p className="mt-6 opacity-50">© 2025 QR BANK. All rights reserved.</p>
      </footer>

      {/* 📝 서비스 신청 폼 (모달) */}
      {isApplyOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative animate-in zoom-in duration-200">
            <button onClick={() => setIsApplyOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black">✕</button>
            <h3 className="text-xl font-bold mb-2 text-gray-900">✨ 서비스 신청하기</h3>
            <p className="text-sm text-gray-500 mb-6">정보를 입력해주시면 확인 후 바로 제작해 드립니다.</p>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">매장 이름 (필수)</label>
                <input className="w-full border p-3 rounded-lg text-black bg-gray-50" value={applyForm.shop_name} onChange={e=>setApplyForm({...applyForm, shop_name: e.target.value})} placeholder="예: 황금 붕어빵" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">대표자 성함 (필수)</label>
                <input className="w-full border p-3 rounded-lg text-black bg-gray-50" value={applyForm.owner_name} onChange={e=>setApplyForm({...applyForm, owner_name: e.target.value})} placeholder="예: 홍길동" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">입금받을 계좌 (필수)</label>
                <div className="flex gap-2">
                  <select className="w-1/3 border p-3 rounded-lg bg-white text-black" value={applyForm.bank_name} onChange={e=>setApplyForm({...applyForm, bank_name: e.target.value})}>
                     <option value="KB국민">KB국민</option><option value="신한">신한</option><option value="토스">토스</option><option value="카카오">카카오</option><option value="NH농협">NH농협</option><option value="하나">하나</option><option value="우리">우리</option><option value="IBK기업">IBK기업</option><option value="케이뱅크">케이뱅크</option><option value="SC제일">SC제일</option><option value="씨티">씨티</option><option value="수협">수협</option><option value="부산">부산</option><option value="경남">경남</option><option value="대구">대구</option><option value="광주">광주</option><option value="전북">전북</option><option value="제주">제주</option><option value="우체국">우체국</option>
                  </select>
                  <input className="w-2/3 border p-3 rounded-lg text-black bg-gray-50" value={applyForm.bank_account} onChange={e=>setApplyForm({...applyForm, bank_account: e.target.value})} placeholder="계좌번호 (- 없이 입력)" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">연락처 (선택)</label>
                <input className="w-full border p-3 rounded-lg text-black bg-gray-50" value={applyForm.contact} onChange={e=>setApplyForm({...applyForm, contact: e.target.value})} placeholder="완료되면 연락받으실 번호/이메일" />
              </div>
            </div>

            <button onClick={handleSubmit} className="w-full mt-6 bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 shadow-lg">
              신청서 제출하기
            </button>
          </div>
        </div>
      )}

      {/* 📱 샘플 체험 팝업 (기존 유지) */}
      {isSampleOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
           {/* (기존 샘플 팝업 코드와 동일) */}
           <div className="relative w-full max-w-sm h-[85vh] bg-white rounded-[2.5rem] shadow-2xl overflow-y-auto overflow-x-hidden no-scrollbar border-4 border-gray-900">
            <button onClick={() => setIsSampleOpen(false)} className="absolute top-4 right-4 z-50 bg-gray-100/80 backdrop-blur p-2 rounded-full hover:bg-gray-200 text-gray-600 transition-colors"><X size={20} /></button>
            <div className="flex flex-col items-center min-h-full pb-8">
              <header className="pt-12 pb-6 px-6 text-center w-full"><div className="inline-flex items-center gap-1 text-gray-400 text-xs mb-2 bg-gray-50 px-2 py-1 rounded-full"><MapPin size={12} /> 체험용 샘플 페이지</div><h1 className="text-2xl font-bold text-gray-900 tracking-tight">황금 붕어빵</h1></header>
              <section className="px-5 py-4 w-full"><div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 shadow-sm text-center relative overflow-hidden"><div className="absolute top-[-20px] left-[-20px] w-20 h-20 bg-blue-100 rounded-full opacity-50" /><p className="text-blue-600 font-medium mb-4 text-sm">송금하실 계좌</p><div className="flex items-center justify-center gap-2 mb-3"><span className="font-bold text-gray-700 text-lg">카카오뱅크</span><span className="text-gray-400">|</span><span className="font-bold text-gray-700 text-lg">홍*동</span></div><div className="text-2xl font-black text-gray-900 tracking-wider mb-6 break-all">3333-01-2345678</div><button onClick={handleSampleCopy} className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all duration-200 ${isCopied ? "bg-green-500 text-white shadow-none" : "bg-blue-600 text-white shadow-md active:scale-95"}`}>{isCopied ? <><CheckCircle size={20} />복사 완료!</> : <><Copy size={20} />계좌번호 복사하기</>}</button></div></section>
              <section className="px-5 py-4 w-full"><div className="bg-green-50 border border-green-100 rounded-2xl p-4"><div className="flex items-start gap-2 mb-3"><span className="text-lg">🔒</span><h3 className="font-bold text-gray-800 text-sm">안심하고 이용하세요</h3></div><ul className="space-y-2 text-xs text-gray-600"><li className="flex items-start gap-2"><span className="text-green-600 mt-0.5">•</span><span>이 페이지는 체험용 샘플입니다.</span></li><li className="flex items-start gap-2"><span className="text-green-600 mt-0.5">•</span><span>실제로는 사장님의 계좌가 보입니다.</span></li></ul></div></section>
              <section className="px-5 py-4 w-full"><div className="block bg-white border border-gray-200 rounded-2xl p-4 shadow-sm opacity-80 cursor-not-allowed"><div className="flex items-center gap-4"><div className="w-16 h-16 rounded-xl bg-gray-200 flex items-center justify-center text-xs text-gray-400">이미지</div><div className="flex-1 min-w-0"><div className="text-xs text-red-500 font-bold mb-1">사장님 추천</div><div className="font-bold text-gray-800">단골 손님 10% 할인!</div><div className="text-xs text-gray-400 mt-1">이곳에 광고 배너가 들어갑니다</div></div></div></div></section>
              <section className="px-6 py-4 w-full"><p className="text-sm font-medium text-gray-700 mb-4 text-center">자주 쓰는 은행 앱으로 바로 보내기</p><div className="grid grid-cols-4 gap-3 opacity-60">{['토스','카카오','신한','농협','국민','기업','하나','우리'].map(bank => (<div key={bank} className="flex flex-col items-center gap-1"><div className="w-12 h-12 bg-gray-200 rounded-2xl"></div><span className="text-[10px] text-gray-400">{bank}</span></div>))}</div></section>
              <div className="mt-auto pt-8 pb-4 px-6 text-center w-full"><div className="border-t border-gray-100 my-4" /><div className="flex items-center justify-center gap-1 text-xs text-gray-400 bg-gray-50 py-2 rounded-lg"><ShieldCheck size={14} /><span>체험이 완료되었습니다.</span></div></div>
            </div>
           </div>
        </div>
      )}
    </div>
  );
}
