"use client";

import Link from "next/link";
import React, { useState } from "react";
import { 
  ArrowRight, ShieldCheck, Zap, Smartphone, 
  MapPin, CheckCircle, Copy, ExternalLink, X 
} from "lucide-react";

export default function Home() {
  // 팝업(모달) 상태 관리
  const [isSampleOpen, setIsSampleOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // 샘플 페이지에서 복사 버튼 눌렀을 때 효과
  const handleSampleCopy = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* --- 네비게이션 --- */}
      <nav className="flex items-center justify-between px-6 py-4 border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="text-xl font-black tracking-tighter">QR BANK</div>
        <div className="flex gap-4">
          <Link href="/admin/manager" className="text-sm font-bold text-gray-500 hover:text-black py-2">
            운영자 로그인
          </Link>
          <Link href="/admin" className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-all">
            가맹점 관리자
          </Link>
        </div>
      </nav>

      {/* --- 히어로 섹션 --- */}
      <header className="px-6 pt-20 pb-32 text-center max-w-4xl mx-auto">
        <div className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold mb-6">
          사장님을 위한 간편 결제 솔루션
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight mb-8">
          계좌번호 묻지마세요.<br />
          <span className="text-blue-600">QR로 바로 입금</span>받으세요.
        </h1>
        <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          카운터에 QR코드 하나만 붙여두세요.<br className="md:hidden"/>
          고객은 카메라로 찍고, 앱으로 바로 송금합니다.<br />
          수수료 0원, 가입비 0원. 지금 바로 시작하세요.
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <Link href="/admin" className="w-full md:w-auto px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
            무료로 QR 만들기 <ArrowRight size={20} />
          </Link>
          <Link href="#preview" className="w-full md:w-auto px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold text-lg hover:bg-gray-200 transition-all">
            서비스 체험하기
          </Link>
        </div>
      </header>

      {/* --- 기능 소개 (3 Grid) --- */}
      <section className="px-6 py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform duration-300">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
              <Zap size={24} fill="currentColor" />
            </div>
            <h3 className="text-xl font-bold mb-3">1초 연결</h3>
            <p className="text-gray-500 leading-relaxed">
              고객이 QR을 찍으면<br/>
              토스, 카카오뱅크 등 은행 앱이<br/>
              자동으로 실행됩니다.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform duration-300">
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-6">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">안전한 계좌</h3>
            <p className="text-gray-500 leading-relaxed">
              사장님의 실명 인증된<br/>
              계좌번호만 안전하게<br/>
              고객에게 전달됩니다.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform duration-300">
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-6">
              <Smartphone size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">간편한 관리</h3>
            <p className="text-gray-500 leading-relaxed">
              복잡한 단말기 필요 없이<br/>
              스마트폰 하나로<br/>
              모든 관리가 가능합니다.
            </p>
          </div>
        </div>
      </section>

      {/* --- 미리보기 섹션 (클릭 시 팝업) --- */}
      <section id="preview" className="px-6 py-24 text-center overflow-hidden">
        <h2 className="text-3xl font-bold mb-4">고객 화면 미리보기</h2>
        <p className="text-gray-500 mb-12">화면을 클릭하면 실제 작동 모습을 체험할 수 있습니다.</p>
        
        {/* 👇 여기를 클릭하면 팝업이 뜹니다! */}
        <div 
          onClick={() => setIsSampleOpen(true)}
          className="relative mx-auto w-64 h-[500px] bg-gray-900 rounded-[3rem] border-8 border-gray-900 shadow-2xl cursor-pointer hover:scale-105 transition-transform duration-300 group"
        >
          {/* 노치 디자인 */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-xl z-20"></div>
          
          {/* 화면 내용 (축소판) */}
          <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative flex flex-col pt-10 px-4 items-center">
            
            {/* [클릭 유도 오버레이] */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 z-30 flex items-center justify-center transition-colors">
              <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full text-sm font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                👆 눌어서 체험하기
              </div>
            </div>

            {/* 가짜 콘텐츠 내용 */}
            <div className="text-xs text-gray-400 mb-2 flex items-center gap-1"><MapPin size={10}/> 매장 정보</div>
            <div className="font-bold text-lg mb-6 text-gray-800">황금 붕어빵</div>
            <div className="w-full bg-blue-50 rounded-2xl p-4 mb-4 border border-blue-100">
              <div className="text-[10px] text-blue-500 font-bold mb-2">송금 계좌</div>
              <div className="font-black text-xl text-gray-900 mb-2">3333-01...</div>
              <div className="w-full bg-blue-600 h-8 rounded-lg"></div>
            </div>
            <div className="w-full grid grid-cols-4 gap-2 opacity-50">
               {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="aspect-square bg-gray-100 rounded-lg"></div>)}
            </div>
          </div>
        </div>
      </section>

      {/* --- 푸터 --- */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-6 text-center text-sm">
        <p className="mb-4 font-bold text-white text-lg">QR BANK</p>
        <p>사업자등록번호 : 326-58-00636 | 대표 : 이동길</p>
        <p>인천광역시 미추홀구 석정로140번길 29</p>
        <p className="mt-8 opacity-50">© 2025 QR BANK. All rights reserved.</p>
      </footer>


      {/* ---------------------------------------------------------------- */}
      {/* 📱 샘플 체험 팝업 (모달) */}
      {/* ---------------------------------------------------------------- */}
      {isSampleOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm h-[85vh] bg-white rounded-[2.5rem] shadow-2xl overflow-y-auto overflow-x-hidden no-scrollbar border-4 border-gray-900">
            
            {/* 닫기 버튼 */}
            <button 
              onClick={() => setIsSampleOpen(false)}
              className="absolute top-4 right-4 z-50 bg-gray-100/80 backdrop-blur p-2 rounded-full hover:bg-gray-200 text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>

            {/* --- [샘플 콘텐츠 시작] --- */}
            <div className="flex flex-col items-center min-h-full pb-8">
              {/* 상단: 매장 정보 */}
              <header className="pt-12 pb-6 px-6 text-center w-full">
                <div className="inline-flex items-center gap-1 text-gray-400 text-xs mb-2 bg-gray-50 px-2 py-1 rounded-full">
                  <MapPin size={12} /> 체험용 샘플 페이지
                </div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  황금 붕어빵
                </h1>
              </header>

              {/* 계좌 정보 카드 */}
              <section className="px-5 py-4 w-full">
                <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 shadow-sm text-center relative overflow-hidden">
                  <div className="absolute top-[-20px] left-[-20px] w-20 h-20 bg-blue-100 rounded-full opacity-50" />
                  
                  <p className="text-blue-600 font-medium mb-4 text-sm">송금하실 계좌</p>
                  
                  <div className="flex items-center justify-center gap-2 mb-3">
                      <span className="font-bold text-gray-700 text-lg">카카오뱅크</span>
                      <span className="text-gray-400">|</span>
                      <span className="font-bold text-gray-700 text-lg">홍*동</span>
                  </div>
                  
                  <div className="text-2xl font-black text-gray-900 tracking-wider mb-6 break-all">
                    3333-01-2345678
                  </div>

                  <button 
                    onClick={handleSampleCopy} 
                    className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all duration-200 ${isCopied ? "bg-green-500 text-white shadow-none" : "bg-blue-600 text-white shadow-md active:scale-95"}`}
                  >
                    {isCopied ? <><CheckCircle size={20} />복사 완료!</> : <><Copy size={20} />계좌번호 복사하기</>}
                  </button>
                </div>
              </section>

              {/* 안전 안내 */}
              <section className="px-5 py-4 w-full">
                <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
                  <div className="flex items-start gap-2 mb-3">
                    <span className="text-lg">🔒</span>
                    <h3 className="font-bold text-gray-800 text-sm">안심하고 이용하세요</h3>
                  </div>
                  <ul className="space-y-2 text-xs text-gray-600">
                    <li className="flex items-start gap-2"><span className="text-green-600 mt-0.5">•</span><span>이 페이지는 체험용 샘플입니다.</span></li>
                    <li className="flex items-start gap-2"><span className="text-green-600 mt-0.5">•</span><span>실제로는 사장님의 계좌가 보입니다.</span></li>
                  </ul>
                </div>
              </section>

              {/* 예시 배너 */}
              <section className="px-5 py-4 w-full">
                <div className="block bg-white border border-gray-200 rounded-2xl p-4 shadow-sm opacity-80 cursor-not-allowed">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gray-200 flex items-center justify-center text-xs text-gray-400">
                      이미지
                    </div>
                    <div className="flex-1 min-w-0">
                       <div className="text-xs text-red-500 font-bold mb-1">사장님 추천</div>
                       <div className="font-bold text-gray-800">단골 손님 10% 할인!</div>
                       <div className="text-xs text-gray-400 mt-1">이곳에 광고 배너가 들어갑니다</div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 은행 앱 예시 */}
              <section className="px-6 py-4 w-full">
                <p className="text-sm font-medium text-gray-700 mb-4 text-center">자주 쓰는 은행 앱으로 바로 보내기</p>
                <div className="grid grid-cols-4 gap-3 opacity-60">
                   {/* 껍데기 아이콘들 */}
                   {['토스','카카오','신한','농협','국민','기업','하나','우리'].map(bank => (
                     <div key={bank} className="flex flex-col items-center gap-1">
                       <div className="w-12 h-12 bg-gray-200 rounded-2xl"></div>
                       <span className="text-[10px] text-gray-400">{bank}</span>
                     </div>
                   ))}
                </div>
              </section>

              <div className="mt-auto pt-8 pb-4 px-6 text-center w-full">
                  <div className="border-t border-gray-100 my-4" />
                  <div className="flex items-center justify-center gap-1 text-xs text-gray-400 bg-gray-50 py-2 rounded-lg">
                      <ShieldCheck size={14} /><span>체험이 완료되었습니다.</span>
                  </div>
              </div>
            </div>
            {/* --- [샘플 콘텐츠 끝] --- */}

          </div>
        </div>
      )}

    </div>
  );
}
