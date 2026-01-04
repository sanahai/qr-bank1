"use client";
import React from "react";

const BANKS = [
  { name: "토스", url: "supertoss://", color: "bg-blue-500" },
  { name: "카카오뱅크", url: "kakaobank://", color: "bg-yellow-300 text-black" },
  { name: "KB국민", url: "kbbank://", color: "bg-gray-600" },
  { name: "신한 쏠", url: "shinhan://", color: "bg-blue-600" },
  { name: "NH농협", url: "nhapp://", color: "bg-green-600" },
  { name: "우리WON", url: "wooribank://", color: "bg-blue-400" },
];

export default function BankLinks() {
  return (
    <div className="grid grid-cols-4 gap-2 mb-6">
      {BANKS.map((bank) => (
        <a
          key={bank.name}
          href={bank.url}
          className="flex flex-col items-center justify-center gap-1 group"
          onClick={() => {
            // 앱이 없으면 아무 반응이 없을 수 있음 (MVP 단계)
          }}
        >
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm ${bank.color}`}>
            <span className="text-sm font-bold">{bank.name.substring(0, 1)}</span>
          </div>
          <span className="text-xs text-gray-500">{bank.name}</span>
        </a>
      ))}
    </div>
  );
}