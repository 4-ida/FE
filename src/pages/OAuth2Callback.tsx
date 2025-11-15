import  { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import styled from "styled-components";

interface OAuth2CallbackData {
  message: string;
  accessToken: string;
  tokenType: "Bearer";
  expiresInMillis: number;
  user: {
    id: number;
    email: string;
    name: string;
  };
  firstLogin: boolean;
}

export default function OAuth2Callback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<string>("로그인 처리 중...");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log("🔄 [OAuth2 콜백] 처리 시작");
        console.log("📥 현재 URL:", window.location.href);

        // URL 파라미터에서 data 추출
        const params = new URLSearchParams(window.location.search);
        const encodedData = params.get("data");

        console.log("📥 URL 파라미터:", Object.fromEntries(params.entries()));
        console.log("📥 encodedData 존재 여부:", !!encodedData);

        if (!encodedData) {
          console.error("❌ [OAuth2 콜백] data 파라미터가 없습니다.");
          setStatus("로그인 처리 실패: 데이터가 없습니다.");
          alert("로그인 처리에 실패했습니다. 다시 시도해주세요.");
          setTimeout(() => {
            navigate("/login", { replace: true });
          }, 2000);
          return;
        }

        // URL 디코딩 및 JSON 파싱
        let data: OAuth2CallbackData;
        try {
          const decodedData = decodeURIComponent(encodedData);
          console.log("📥 디코딩된 데이터 (일부):", decodedData.substring(0, 200) + "...");
          data = JSON.parse(decodedData);
          console.log("✅ [OAuth2 콜백] 데이터 파싱 성공");
          console.log("📥 응답 데이터:", JSON.stringify(data, null, 2));
        } catch (parseError: any) {
          console.error("❌ [OAuth2 콜백] 데이터 파싱 실패");
          console.error("📥 파싱 에러:", parseError.message);
          console.error("📥 전체 에러 객체:", JSON.stringify(parseError, null, 2));
          setStatus("로그인 처리 실패: 데이터 파싱 오류");
          alert("로그인 처리에 실패했습니다. 다시 시도해주세요.");
          setTimeout(() => {
            navigate("/login", { replace: true });
          }, 2000);
          return;
        }

        // accessToken이 없으면 에러
        if (!data.accessToken) {
          console.error("❌ [OAuth2 콜백] accessToken이 없습니다.");
          setStatus("로그인 처리 실패: 토큰이 없습니다.");
          alert("로그인 처리에 실패했습니다. 다시 시도해주세요.");
          setTimeout(() => {
            navigate("/login", { replace: true });
          }, 2000);
          return;
        }

        // 토큰을 localStorage에 저장
        localStorage.setItem("accessToken", data.accessToken);
        console.log("✅ [OAuth2 콜백] 토큰이 localStorage에 저장됨");

        // 사용자 정보도 저장
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
          console.log("✅ [OAuth2 콜백] 사용자 정보가 localStorage에 저장됨");
        }

        // 토큰 만료 시간 저장
        if (data.expiresInMillis) {
          const expiresAt = Date.now() + data.expiresInMillis;
          localStorage.setItem("tokenExpiresAt", expiresAt.toString());
          console.log("✅ [OAuth2 콜백] 토큰 만료 시간이 localStorage에 저장됨");
        }

        setStatus("프로필 정보 확인 중...");

        // 프로필 정보 조회하여 설정 여부 확인
        try {
          console.log("📖 [OAuth2 콜백] 프로필 정보 조회 시작");
          const profileRes = await axiosInstance.get(`/api/v1/users/profile/me`);
          const profile = profileRes.data;

          console.log("✅ [OAuth2 콜백] 프로필 조회 성공");
          console.log("📥 프로필 데이터:", JSON.stringify(profile, null, 2));

          // caffeineSensitivity와 alcoholPattern이 null/undefined/빈 문자열인 경우 확인
          const isProfileIncomplete =
            !profile.caffeineSensitivity ||
            !profile.alcoholPattern ||
            profile.caffeineSensitivity === "" ||
            profile.alcoholPattern === "";

          console.log("📥 프로필 완성도:", isProfileIncomplete ? "불완전" : "완료");
          console.log("📥 카페인 민감도:", profile.caffeineSensitivity || "없음");
          console.log("📥 음주 패턴:", profile.alcoholPattern || "없음");
          console.log("📥 첫 로그인:", data.firstLogin);

          // 설정이 불완전하면 마이페이지로 이동하고, 모달 플래그를 설정합니다.
          if (isProfileIncomplete || data.firstLogin) {
            console.log("📥 프로필이 불완전하거나 첫 로그인이어서 마이페이지로 이동");
            localStorage.setItem("showInitialProfileSetup", "true");
            navigate("/mypage", { replace: true });
          } else {
            console.log("📥 프로필이 완성되어 메인 페이지로 이동");
            navigate("/", { replace: true });
          }
        } catch (profileError: any) {
          console.error("❌ [OAuth2 콜백] 프로필 조회 실패");
          if (profileError.response) {
            console.error("📥 에러 상태 코드:", profileError.response.status);
            console.error("📥 에러 응답 데이터:", JSON.stringify(profileError.response.data, null, 2));
          } else {
            console.error("📥 에러 메시지:", profileError.message);
          }
          console.error("📥 전체 에러 객체:", profileError);

          // 프로필 조회에 실패한 경우 (예: 서버 오류), 안전하게 마이페이지로 이동
          localStorage.setItem("showInitialProfileSetup", "true");
          navigate("/mypage", { replace: true });
        }
      } catch (error: any) {
        console.error("❌ [OAuth2 콜백] 예상치 못한 에러 발생");
        console.error("📥 에러 메시지:", error.message);
        console.error("📥 전체 에러 객체:", JSON.stringify(error, null, 2));
        setStatus("로그인 처리 중 오류가 발생했습니다.");
        alert("로그인 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 2000);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <Container>
      <LoadingContainer>
        <LoadingText>{status}</LoadingText>
        <Spinner />
      </LoadingContainer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  background: #ffffff;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const LoadingText = styled.div`
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 24px;
  color: #333333;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #ebebeb;
  border-top: 4px solid #b6f500;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

