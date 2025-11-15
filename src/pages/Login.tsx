import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bb from "../assets/backbutton.svg";
import axiosInstance from "../axiosInstance";

export default function Signup() {
  const handleGoBack = () => {
    navigate(-1);
  };
  const handleGoToMyPage = () => {
    navigate("/mypage");
  };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const GotoSignup = () => {
    navigate("/Signup");
  };

  //일반 로그인
  const handleLogin = async () => {
    const requestData = {
      email,
      password,
    };

    console.log("🔐 [일반 로그인] 요청 시작");
    console.log("📤 요청 URL: POST /api/v1/auth/login");
    console.log("📤 요청 데이터:", { ...requestData, password: "***" }); // 비밀번호는 마스킹

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/login`,
        requestData,
        {
          withCredentials: true, // ✅ 쿠키 저장 필수!
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("✅ [로그인] 성공");
      console.log("📥 응답 상태:", res.status);
      console.log("📥 응답 데이터:", JSON.stringify(res.data, null, 2));

      if (res.status === 200) {
        const accessToken = res.data.accessToken;
        localStorage.setItem("accessToken", accessToken);
        console.log("📥 토큰이 localStorage에 저장됨");

        // 🔥 1. 프로필 정보를 조회하여 설정 여부를 확인합니다.
        try {
          console.log("📖 [일반 로그인] 프로필 정보 조회 시작");
          const profileRes = await axiosInstance.get(
            `/api/v1/users/profile/me`
          );
          const profile = profileRes.data;

          console.log("✅ [일반 로그인] 프로필 조회 성공");
          console.log("📥 프로필 데이터:", profile);

          // caffeineSensitivity와 alcoholPattern이 null/undefined/빈 문자열인 경우 확인
          const isProfileIncomplete =
            !profile.caffeineSensitivity ||
            !profile.alcoholPattern ||
            profile.caffeineSensitivity === "" ||
            profile.alcoholPattern === "";

          console.log("📥 프로필 완성도:", isProfileIncomplete ? "불완전" : "완료");
          console.log("📥 카페인 민감도:", profile.caffeineSensitivity || "없음");
          console.log("📥 음주 패턴:", profile.alcoholPattern || "없음");

          // 🔥 2. 설정이 불완전하면 마이페이지로 이동하고, 모달 플래그를 설정합니다.
          if (isProfileIncomplete) {
            console.log("📥 프로필이 불완전하여 마이페이지로 이동");
            localStorage.setItem("showInitialProfileSetup", "true");
            navigate("/mypage");
          } else {
            console.log("📥 프로필이 완성되어 메인 페이지로 이동");
            navigate("/main");
          }
        } catch (profileError: any) {
          console.error("❌ [일반 로그인] 프로필 조회 실패");
          console.error("📥 에러 상태 코드:", profileError.response?.status);
          console.error("📥 에러 응답 데이터:", profileError.response?.data);
          console.error("📥 전체 에러 객체:", profileError);
          
          // 프로필 조회에 실패한 경우 (예: 서버 오류), 안전하게 마이페이지로 이동하도록 처리
          localStorage.setItem("showInitialProfileSetup", "true");
          navigate("/mypage");
        }
      }
    } catch (err: any) {
      console.error("❌ [일반 로그인] 실패");
      console.error("📤 요청 데이터:", { ...requestData, password: "***" });
      
      if (err.response) {
        console.error("📥 에러 상태 코드:", err.response.status);
        console.error("📥 에러 응답 데이터:", err.response.data);
        console.error("📥 에러 응답 헤더:", err.response.headers);
        
        const status = err.response.status;
        if (status === 400) {
          console.error("🚨 [400 Bad Request] 인증 실패(잘못된 이메일 또는 비밀번호)");
          alert("이메일 또는 비밀번호가 올바르지 않습니다.");
        } else if (status === 401) {
          console.error("🚨 [401 Unauthorized] 인증 실패");
          alert("인증에 실패했습니다.");
        } else {
          console.error("🚨 기타 에러:", status);
          alert("로그인 중 오류가 발생했습니다.");
        }
      } else if (err.request) {
        console.error("📥 요청은 전송되었지만 응답을 받지 못했습니다:", err.request);
        alert("서버에 연결할 수 없습니다.");
      } else {
        console.error("📥 에러 메시지:", err.message);
        alert("로그인 중 오류가 발생했습니다.");
      }
      console.error("📥 전체 에러 객체:", err);
    }
  };

  // OAuth 콜백 처리 (소셜 로그인 후 리다이렉트)
  useEffect(() => {
    // 현재 경로 확인 (Spring Security OAuth2 콜백 경로)
    const currentPath = window.location.pathname;
    const isOAuthCallback = currentPath.startsWith('/login/oauth2/code/');
    
    console.log("🔄 [OAuth 콜백] 처리 시작");
    console.log("📥 현재 경로:", currentPath);
    console.log("📥 전체 URL:", window.location.href);
    console.log("📥 OAuth 콜백 경로인가?", isOAuthCallback);
    
    // Spring Security OAuth2 콜백 경로인 경우 (예: /login/oauth2/code/google)
    if (isOAuthCallback) {
      console.log("📥 [Spring Security OAuth2 콜백] 경로 감지");
      console.log("📥 경로:", currentPath);
      console.log("📥 전체 URL:", window.location.href);
      
      // URL 파라미터 확인 (에러나 code가 있을 수 있음)
      const params = new URLSearchParams(window.location.search);
      const error = params.get("error");
      const errorDescription = params.get("error_description");
      const code = params.get("code");
      const state = params.get("state");
      
      console.log("📥 URL 파라미터:", Object.fromEntries(params.entries()));
      console.log("📥 error 파라미터:", error || "없음");
      console.log("📥 error_description 파라미터:", errorDescription || "없음");
      console.log("📥 code 파라미터:", code ? code.substring(0, 30) + "..." : "없음");
      console.log("📥 state 파라미터:", state || "없음");
      
      // 에러가 있는 경우
      if (error) {
        console.error("❌ [OAuth 콜백] 에러 발생");
        console.error("📥 에러 타입:", error);
        console.error("📥 에러 설명:", errorDescription || "설명 없음");
        console.error("📥 전체 에러 정보:", JSON.stringify({
          error,
          error_description: errorDescription,
          code,
          state,
          currentUrl: window.location.href,
          currentPath: window.location.pathname,
        }, null, 2));
        
        let errorMessage = "소셜 로그인에 실패했습니다.";
        if (error === "access_denied") {
          errorMessage = "소셜 로그인이 취소되었습니다.";
        } else if (error === "invalid_request") {
          errorMessage = "잘못된 요청입니다. (400 Bad Request)\n\n서버 설정을 확인해주세요:\n1. OAuth2 제공자에 redirect_uri 등록 확인\n2. 서버의 OAuth2 클라이언트 설정 확인";
        } else if (error === "invalid_client") {
          errorMessage = "클라이언트 인증에 실패했습니다. (401 Unauthorized)";
        }
        
        const fullErrorMessage = errorDescription 
          ? `${errorMessage}\n\n상세: ${errorDescription}` 
          : errorMessage;
        
        alert(fullErrorMessage + `\n\n에러 코드: ${error}`);
        navigate("/login", { replace: true });
        return;
      }
      
      // 서버가 이 경로를 처리하고 리다이렉트해야 함
      // 만약 여기까지 왔다면 서버에서 리다이렉트가 제대로 처리되지 않은 것
      // 서버가 /login?token=... 로 리다이렉트하지 못했거나, 404/400 에러가 발생한 경우
      console.warn("⚠️ [OAuth 콜백] 서버가 콜백을 처리하지 못했습니다.");
      console.warn("⚠️ 서버 설정을 확인하세요:");
      console.warn("  1. OAuth2 제공자(Google/카카오/네이버)에 redirect_uri 등록 확인");
      console.warn("  2. 서버의 application.yml에서 redirect-uri 설정 확인");
      console.warn("  3. OAuth2 클라이언트 설정 확인");
      console.warn("  4. OAuth2 성공 핸들러 설정 확인");
      console.warn("  5. 서버 로그에서 404/400 에러 원인 확인");
      
      // provider 추출 (google, kakao, naver)
      const provider = currentPath.split('/').pop() || 'unknown';
      console.warn("📥 OAuth 제공자:", provider);
      
      // 잠시 대기 후 로그인 페이지로 리다이렉트
      setTimeout(() => {
        alert(`소셜 로그인 처리 중 오류가 발생했습니다.\n\n서버 설정을 확인해주세요:\n1. ${provider} OAuth2 제공자에 redirect_uri 등록 확인\n2. 서버 OAuth2 설정 확인\n3. 서버 로그에서 404/400 에러 원인 확인\n\n예상 redirect_uri: ${window.location.origin}/login/oauth2/code/${provider}`);
        navigate("/login", { replace: true });
      }, 1000);
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const error = params.get("error");
    const errorDescription = params.get("error_description");
    const errorUri = params.get("error_uri");
    const code = params.get("code"); // OAuth authorization code
    const state = params.get("state");

    console.log("📥 URL 파라미터:", Object.fromEntries(params.entries()));
    console.log("📥 token 파라미터:", token ? token.substring(0, 20) + "..." : "없음");
    console.log("📥 error 파라미터:", error || "없음");
    console.log("📥 error_description 파라미터:", errorDescription || "없음");
    console.log("📥 error_uri 파라미터:", errorUri || "없음");
    console.log("📥 code 파라미터:", code ? code.substring(0, 20) + "..." : "없음");
    console.log("📥 state 파라미터:", state || "없음");

    // 에러 처리 (400 에러 포함)
    if (error) {
      console.error("❌ [OAuth 콜백] 에러 발생");
      console.error("📥 에러 타입:", error);
      console.error("📥 에러 설명:", errorDescription || "설명 없음");
      console.error("📥 에러 URI:", errorUri || "URI 없음");
      console.error("📥 전체 에러 정보:", JSON.stringify({
        error,
        error_description: errorDescription,
        error_uri: errorUri,
        code,
        state,
        currentUrl: window.location.href,
        currentPath: window.location.pathname,
        searchParams: window.location.search,
      }, null, 2));
      
      let errorMessage = "소셜 로그인에 실패했습니다.";
      if (error === "access_denied") {
        errorMessage = "소셜 로그인이 취소되었습니다.";
      } else if (error === "invalid_request") {
        errorMessage = "잘못된 요청입니다. (400 Bad Request)\n\n서버 설정을 확인해주세요:\n1. Google Cloud Console에 redirect_uri 등록 확인\n2. 서버의 OAuth2 클라이언트 설정 확인";
        console.error("🚨 [400 Bad Request] 가능한 원인:");
        console.error("  1. redirect_uri가 Google Cloud Console에 등록되지 않음");
        console.error("  2. redirect_uri가 서버 설정과 일치하지 않음");
        console.error("  3. client_id가 잘못됨");
        console.error("  4. OAuth 서버 설정 오류");
        console.error("  5. 요청 파라미터 누락 또는 잘못됨");
        console.error("📥 예상 redirect_uri:", `${window.location.origin}/login/oauth2/code/google`);
      } else if (error === "invalid_client") {
        errorMessage = "클라이언트 인증에 실패했습니다. (401 Unauthorized)";
      } else if (error === "invalid_grant") {
        errorMessage = "인증 코드가 유효하지 않습니다.";
      } else if (error === "unsupported_response_type") {
        errorMessage = "지원하지 않는 응답 타입입니다.";
      } else if (error === "invalid_scope") {
        errorMessage = "요청한 권한 범위가 유효하지 않습니다.";
      }
      
      const fullErrorMessage = errorDescription 
        ? `${errorMessage}\n\n상세: ${errorDescription}` 
        : errorMessage;
      
      alert(fullErrorMessage + `\n\n에러 코드: ${error}`);
      navigate("/login", { replace: true });
      return;
    }

    // 토큰이 있는 경우 (성공) - 구글/카카오/네이버 공통 처리
    if (token) {
      console.log("✅ [OAuth 콜백] 토큰 수신 성공");
      console.log("📥 토큰 (앞 20자):", token.substring(0, 20) + "...");
      console.log("📥 토큰 길이:", token.length);
      
      // 토큰을 localStorage에 저장
      localStorage.setItem("accessToken", token);
      console.log("📥 토큰이 localStorage에 저장됨");

      // 일반 로그인과 동일하게 프로필 확인 후 적절한 페이지로 이동
      const checkProfileAndNavigate = async () => {
        try {
          console.log("📖 [OAuth 콜백] 프로필 정보 조회 시작");
          const profileRes = await axiosInstance.get(`/api/v1/users/profile/me`);
          const profile = profileRes.data;

          console.log("✅ [OAuth 콜백] 프로필 조회 성공");
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

          // 설정이 불완전하면 마이페이지로 이동하고, 모달 플래그를 설정합니다.
          if (isProfileIncomplete) {
            console.log("📥 프로필이 불완전하여 마이페이지로 이동");
            localStorage.setItem("showInitialProfileSetup", "true");
            navigate("/mypage", { replace: true });
          } else {
            console.log("📥 프로필이 완성되어 메인 페이지로 이동");
            navigate("/main", { replace: true });
          }
        } catch (profileError: any) {
          console.error("❌ [OAuth 콜백] 프로필 조회 실패");
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
      };

      checkProfileAndNavigate();
    } else if (code) {
      // Authorization code가 있는 경우 - 서버가 처리해야 함
      // Spring Security OAuth2는 자동으로 code를 토큰으로 교환하고
      // 성공 시 /login?token=... 로 리다이렉트해야 함
      console.log("📥 [OAuth 콜백] Authorization code 수신됨");
      console.log("📥 Code:", code ? code.substring(0, 30) + "..." : "없음");
      console.log("📥 State:", state || "없음");
      console.log("📥 현재 경로:", window.location.pathname);
      console.warn("⚠️ [OAuth 콜백] 서버가 code를 처리하지 못했습니다.");
      console.warn("⚠️ Spring Security OAuth2가 code를 토큰으로 교환하고 /login?token=... 로 리다이렉트해야 합니다.");
      console.warn("⚠️ 서버 설정을 확인하세요:");
      console.warn("  1. OAuth2 클라이언트 설정 확인");
      console.warn("  2. OAuth2 성공 핸들러 설정 확인");
      console.warn("  3. 리다이렉트 URI 설정 확인");
      console.warn("  4. Google Cloud Console에 redirect_uri 등록 확인");
      
      // 서버가 처리하지 못한 경우, 잠시 대기 후 로그인 페이지로 이동
      setTimeout(() => {
        alert("소셜 로그인 처리 중 오류가 발생했습니다.\n서버 설정을 확인해주세요.\n\n가능한 원인:\n1. Google Cloud Console에 redirect_uri 미등록\n2. 서버 OAuth2 설정 오류\n3. 클라이언트 ID/Secret 오류");
        navigate("/login", { replace: true });
      }, 2000);
    } else {
      // 토큰도 code도 없으면 일반 로그인 페이지 (OAuth 콜백이 아님)
      console.log("📥 [OAuth 콜백] 토큰/코드 없음 - 일반 로그인 페이지");
    }
  }, [navigate]);

  return (
    <Screen>
      <Header>
        <Back src={bb} alt="뒤로 가기" onClick={handleGoBack} />
        <Ht onClick={handleGoToMyPage}>마이페이지</Ht>
      </Header>
      <ContentContainer>
        <Logincontent>
          <ContentBox>
            <NameBox>
              <Name>이메일</Name>
              <Box
                type="text"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
              ></Box>
            </NameBox>

            <NameBox>
              <Name>비밀번호</Name>
              <Box
                type="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
              ></Box>
            </NameBox>

            <LoginButton onClick={handleLogin}>로그인</LoginButton>
          </ContentBox>
          <SignupButton onClick={GotoSignup}>회원가입</SignupButton>
        </Logincontent>
      </ContentContainer>
    </Screen>
  );
}
const Screen = styled.div`
  position: relative;
  width: 393px;
  height: 852px;
  background: #ffffff;
`;
const Header = styled.div`
  display: flex;
  width: 100%;
  height: 60px;
  align-items: center;
  padding: 0 15px;
  box-sizing: border-box;
  justify-content: space-between;
`;
const Back = styled.img`
  color: #333;
  cursor: pointer;
`;

const Ht = styled.div`
  font-family: "Pretendard";
  font-weight: 500;
  font-size: 15px;
  cursor: pointer;
`;
const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0px;
  gap: 50px;

  position: absolute;
  width: 363px;
  height: 394px;
  left: 15px;
  top: 100px;
`;
const Logincontent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0px;
  gap: 10px;

  width: 363px;
  height: 262px;

  /* 내부 오토레이아웃 */
  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;
`;
const ContentBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 24px;
  width: 363px;
  height: 232px;
`;
const NameBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 8px;
  width: 363px;
  height: 69px;
  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;
`;
const Name = styled.div`
  width: 363px;
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 21px;
  color: #333333;
  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;
`;
const Box = styled.input<{ type: string; value: string }>`
  width: 343px;
  height: 40px;
  background: #ffffff;
  border: 1.5px solid #ebebeb;
  border-radius: 5px;
  flex: none;
  order: 1;
  align-self: stretch;
  flex-grow: 0;
  padding-left: 10px;
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  &:focus {
    outline: none;
    border: 1.5px solid #b6f500;
  }

  &:active {
    outline: none;
  }
`;
const LoginButton = styled.div`
  width: 363px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  background: #b6f500;
  border-radius: 5px;

  /* 내부 오토레이아웃 */
  flex: none;
  order: 1;
  align-self: stretch;
  flex-grow: 0;
  /* 가입하기 */

  font-family: "Pretendard";
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 24px;
  /* 상자 높이와 동일 */

  color: #333333;
`;
const SignupButton = styled.div`
  width: 363px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;

  /* 내부 오토레이아웃 */
  flex: none;
  order: 1;
  align-self: stretch;
  flex-grow: 0;
  cursor: pointer;
`;
