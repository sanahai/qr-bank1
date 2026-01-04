"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Store } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // [MVP] 임시 테스트 계정 (나중에 Supabase Auth로 교체)
    if (email === "test" && password === "1234") {
      alert("로그인 성공 (테스트 모드)");
      router.push("/admin/dashboard");
    } else {
      alert("아이디 또는 비밀번호가 틀렸습니다.\n(테스트 계정: test / 1234)");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full">
        <div className="flex justify-center mb-4 text-blue-600">
            <Store size={40} />
        </div>
        <h1 className="text-2xl font-bold text-center mb-6">사장님 로그인</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">아이디</label>
            <input 
              type="text" 
              className="w-full border p-3 rounded-lg" 
              placeholder="test"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
            <input 
              type="password" 
              className="w-full border p-3 rounded-lg" 
              placeholder="1234"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />
          </div>
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700">
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}