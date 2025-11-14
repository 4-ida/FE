import styled from "styled-components";
import React, { useEffect, useState } from "react";
import KakaoImg from "../assets/kakao.svg";
import NaverImg from "../assets/naver.svg";
import GoogleImg from "../assets/google.svg";
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

      console.log("✅ [일반 로그인] 성공");
      console.log("📥 응답 상태:", res.status);
      console.log("📥 응답 데이터:", res.data);

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

  // 구글 소셜 로그인
  const handleGoogleLogin = () => {
    const baseURL = import.meta.env.VITE_API_URL;
    if (!baseURL) {
      console.error("❌ [구글 소셜 로그인] API URL이 설정되지 않았습니다.");
      alert("서버 설정 오류가 발생했습니다.");
      return;
    }

    // Spring Security OAuth2는 redirect_uri를 자동으로 처리하므로 수동 추가하지 않음
    const oauthUrl = `${baseURL}/oauth2/authorization/google`;
    
    console.log("🔐 [구글 소셜 로그인] 요청 시작");
    console.log("📤 API Base URL:", baseURL);
    console.log("📤 최종 OAuth URL:", oauthUrl);
    console.log("📤 현재 Origin:", window.location.origin);
    
    window.location.href = oauthUrl;
  };

  // 카카오 소셜 로그인
  const handleKakaoLogin = () => {
    const oauthUrl = `${import.meta.env.VITE_API_URL}/oauth2/authorization/kakao`;
    console.log("🔐 [카카오 소셜 로그인] 요청 시작");
    console.log("📤 OAuth URL:", oauthUrl);
    window.location.href = oauthUrl;
  };

  // 네이버 소셜 로그인
  const handleNaverLogin = () => {
    const oauthUrl = `${import.meta.env.VITE_API_URL}/oauth2/authorization/naver`;
    console.log("🔐 [네이버 소셜 로그인] 요청 시작");
    console.log("📤 OAuth URL:", oauthUrl);
    window.location.href = oauthUrl;
  };

  // OAuth 콜백 처리 (소셜 로그인 후 리다이렉트)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const error = params.get("error");
    const code = params.get("code"); // OAuth authorization code
    const state = params.get("state");

    console.log("🔄 [OAuth 콜백] 처리 시작");
    console.log("📥 현재 URL:", window.location.href);
    console.log("📥 URL 파라미터:", Object.fromEntries(params.entries()));
    console.log("📥 token 파라미터:", token);
    console.log("📥 error 파라미터:", error);
    console.log("📥 code 파라미터:", code);
    console.log("📥 state 파라미터:", state);

    // 에러 처리
    if (error) {
      console.error("❌ [OAuth 콜백] 에러 발생");
      console.error("📥 에러 파라미터:", error);
      console.error("📥 에러 설명:", params.get("error_description"));
      
      let errorMessage = "소셜 로그인에 실패했습니다.";
      if (error === "access_denied") {
        errorMessage = "소셜 로그인이 취소되었습니다.";
      } else if (error === "invalid_request") {
        errorMessage = "잘못된 요청입니다. (400 에러)";
      }
      
      alert(errorMessage + " (" + error + ")");
      navigate("/login");
      return;
    }

    // 토큰이 있는 경우 (성공)
    if (token) {
      console.log("✅ [OAuth 콜백] 토큰 수신 성공");
      console.log("📥 토큰:", token.substring(0, 20) + "...");
      
      localStorage.setItem("accessToken", token);
      console.log("📥 토큰이 localStorage에 저장됨");

      // 일반 로그인과 동일하게 프로필 확인 후 적절한 페이지로 이동
      const checkProfileAndNavigate = async () => {
        try {
          console.log("📖 [OAuth 콜백] 프로필 정보 조회 시작");
          const profileRes = await axiosInstance.get(`/api/v1/users/profile/me`);
          const profile = profileRes.data;

          console.log("✅ [OAuth 콜백] 프로필 조회 성공");
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

          // 설정이 불완전하면 마이페이지로 이동하고, 모달 플래그를 설정합니다.
          if (isProfileIncomplete) {
            console.log("📥 프로필이 불완전하여 마이페이지로 이동");
            localStorage.setItem("showInitialProfileSetup", "true");
            navigate("/mypage");
          } else {
            console.log("📥 프로필이 완성되어 메인 페이지로 이동");
            navigate("/main");
          }
        } catch (profileError: any) {
          console.error("❌ [OAuth 콜백] 프로필 조회 실패");
          console.error("📥 에러 상태 코드:", profileError.response?.status);
          console.error("📥 에러 응답 데이터:", profileError.response?.data);
          console.error("📥 전체 에러 객체:", profileError);
          
          // 프로필 조회에 실패한 경우 (예: 서버 오류), 안전하게 마이페이지로 이동
          localStorage.setItem("showInitialProfileSetup", "true");
          navigate("/mypage");
        }
      };

      checkProfileAndNavigate();
    } else if (code) {
      // Authorization code가 있는 경우 (서버에서 토큰으로 교환해야 함)
      console.log("📥 [OAuth 콜백] Authorization code 수신");
      console.log("📥 Code:", code);
      console.warn("⚠️ Authorization code를 토큰으로 교환하는 로직이 필요할 수 있습니다.");
      // 일반적으로 서버에서 자동으로 처리하지만, 필요시 여기서 처리
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
        <SocialLogin>
          <SocialText>SNS 계정으로 로그인</SocialText>
          <SocialLine>
            <SocialButton onClick={handleKakaoLogin}>
              <img
                src={KakaoImg}
                alt="카카오 소셜로그인"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  padding: "5px",
                  gap: "5px",
                  isolation: "isolate",

                  width: "40px",
                  height: "40px",

                  background: "#F9E000",
                  borderRadius: "100px",
                  cursor: "pointer",
                }}
              />
            </SocialButton>
            <SocialButton onClick={handleNaverLogin}>
              <img
                src={NaverImg}
                alt="네이버 소셜로그인"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  padding: "5px",
                  gap: "5px",
                  isolation: "isolate",

                  width: "40px",
                  height: "40px",

                  background: "#2BC622",
                  borderRadius: "100px",
                  cursor: "pointer",
                }}
              />
            </SocialButton>
            <SocialButton onClick={handleGoogleLogin}>
              <img
                src={GoogleImg}
                alt="구글 소셜로그인"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  padding: "5px",
                  gap: "5px",
                  isolation: "isolate",

                  width: "40px",
                  height: "40px",

                  background: "#FFFFFF",
                  borderRadius: "100px",
                  border: "1px solid #767676",
                  cursor: "pointer",
                }}
              />
            </SocialButton>
          </SocialLine>
        </SocialLogin>
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
const SocialLogin = styled.div`
  /* Frame 1707485852 */

  /* 오토레이아웃 */
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px;
  gap: 12px;

  width: 363px;
  height: 82px;

  /* 내부 오토레이아웃 */
  flex: none;
  order: 1;
  align-self: stretch;
  flex-grow: 0;
`;
const SocialText = styled.div`
  /* Frame 1707485798 */
  display: flex;
  justify-content: center;
  width: 363px;
  height: 20px;

  /* 내부 오토레이아웃 */
  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;
  /* SNS 계정으로 로그인 */

  font-family: "Pretendard";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  /* 상자 높이와 동일 */

  color: #767676;
`;
const SocialLine = styled.div`
  /* Frame 1707485851 */

  /* 오토레이아웃 */
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 30px;

  width: 210px;
  height: 50px;

  /* 내부 오토레이아웃 */
  flex: none;
  order: 1;
  flex-grow: 0;
`;
const SocialButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  border-radius: 50%; /* 동그랗게 만들기 */

  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;
