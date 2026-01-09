"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as Tabs from "@radix-ui/react-tabs";
import { Building2, Mail, Lock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * 로그인 화면
 * @description 일반회원/중개사 탭 전환, 소셜 로그인 지원
 */
export default function LoginPage() {
  const router = useRouter();

  // 상태 관리
  const [userType, setUserType] = useState<"general" | "broker">("general");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [autoLogin, setAutoLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  // 로그인 처리
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // 간단한 유효성 검사
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = "이메일을 입력해주세요";
    if (!password) newErrors.password = "비밀번호를 입력해주세요";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    // 로그인 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);

    // 홈으로 이동
    router.push("/");
  };

  // 소셜 로그인
  const handleSocialLogin = (provider: string) => {
    alert(`${provider} 로그인 기능은 준비 중입니다.`);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center px-6 py-12">
      {/* 로고 */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
          <Building2 size={32} className="text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-blue-600">온시아</h1>
        <p className="text-gray-500 mt-2">부동산의 새로운 기준</p>
      </div>

      {/* 탭 (일반회원 / 중개사) */}
      <Tabs.Root value={userType} onValueChange={(v) => setUserType(v as "general" | "broker")}>
        <Tabs.List className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <Tabs.Trigger
            value="general"
            className={cn(
              "flex-1 py-3 text-sm font-medium rounded-lg transition-colors",
              userType === "general" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"
            )}
          >
            일반회원
          </Tabs.Trigger>
          <Tabs.Trigger
            value="broker"
            className={cn(
              "flex-1 py-3 text-sm font-medium rounded-lg transition-colors",
              userType === "broker" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"
            )}
          >
            중개사
          </Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>

      {/* 로그인 폼 */}
      <form onSubmit={handleLogin}>
        <Input
          label="이메일"
          type="email"
          placeholder="이메일을 입력하세요"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors({ ...errors, email: undefined });
          }}
          leftIcon={<Mail size={20} />}
          error={errors.email}
        />

        <Input
          label="비밀번호"
          type="password"
          placeholder="비밀번호를 입력하세요"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors({ ...errors, password: undefined });
          }}
          leftIcon={<Lock size={20} />}
          error={errors.password}
        />

        {/* 자동 로그인 / 비밀번호 찾기 */}
        <div className="flex items-center justify-between mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={autoLogin}
              onChange={(e) => setAutoLogin(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">자동 로그인</span>
          </label>

          <button type="button" className="text-sm text-gray-500 underline">
            비밀번호 찾기
          </button>
        </div>

        {/* 로그인 버튼 */}
        <Button type="submit" size="full" loading={isLoading}>
          로그인
        </Button>
      </form>

      {/* 회원가입 */}
      <div className="flex items-center justify-center gap-2 mt-6">
        <span className="text-sm text-gray-500">아직 회원이 아니신가요?</span>
        <button className="text-sm font-semibold text-blue-600">회원가입</button>
      </div>

      {/* 구분선 */}
      <div className="flex items-center gap-4 my-8">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-sm text-gray-400">간편 로그인</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* 소셜 로그인 버튼들 */}
      <div className="flex justify-center gap-4">
        {/* 카카오 */}
        <button
          onClick={() => handleSocialLogin("카카오")}
          className="w-13 h-13 flex items-center justify-center rounded-full bg-[#FEE500]"
        >
          <MessageCircle size={24} className="text-[#3C1E1E]" />
        </button>

        {/* 네이버 */}
        <button
          onClick={() => handleSocialLogin("네이버")}
          className="w-13 h-13 flex items-center justify-center rounded-full bg-[#03C75A] text-white font-bold text-xl"
        >
          N
        </button>

        {/* 구글 */}
        <button
          onClick={() => handleSocialLogin("구글")}
          className="w-13 h-13 flex items-center justify-center rounded-full bg-white border border-gray-300"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        </button>

        {/* 애플 */}
        <button
          onClick={() => handleSocialLogin("애플")}
          className="w-13 h-13 flex items-center justify-center rounded-full bg-black"
        >
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
