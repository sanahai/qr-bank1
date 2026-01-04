import Link from "next/link";
import { QrCode, ArrowRight, Store } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-center">
      
      <div className="bg-white/10 p-4 rounded-2xl mb-6 backdrop-blur-sm">
        <QrCode size={64} className="text-white" />
      </div>

      <h1 className="text-4xl font-black mb-2 tracking-tight">
        LOCAL PAY QR
      </h1>
      <p className="text-blue-100 mb-10 text-lg">
        사장님은 간편하게,<br />
        손님은 3초 만에 송금 끝!
      </p>

      <div className="w-full max-w-sm space-y-4">
        <Link 
          href="/admin/login"
          className="flex items-center justify-center w-full bg-white text-blue-700 font-bold py-4 rounded-xl shadow-lg hover:bg-gray-50 transition-all active:scale-95"
        >
          <Store className="mr-2" size={20} />
          사장님 로그인 / 가입
        </Link>

        {/* 테스트용 링크 (개발 중에만 사용) */}
        <div className="pt-8 border-t border-white/20">
            <p className="text-xs text-blue-200 mb-2">개발자 테스트용 바로가기</p>
            <Link 
            href="/q/test"
            className="text-sm text-white underline decoration-white/50 underline-offset-4"
            >
            고객 화면 미리보기 (Mock)
            </Link>
        </div>
      </div>
      
      <footer className="absolute bottom-6 text-xs text-blue-200/60">
        © 2024 LOCAL PAY QR Team
      </footer>
    </main>
  );
}