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
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true, // ✅ 쿠키 저장 필수!
          headers: { "Content-Type": "application/json" },
        }
      );

      // if (res.status === 200) {
      //   console.log(" 로그인 성공:", res.data);
      //   alert("로그인 성공");
      //   localStorage.setItem("accessToken", res.data.accessToken);
      //   if (localStorage.getItem("justSignedUp") === "true") {
      //     localStorage.removeItem("justSignedUp"); // 한 번만 쓰고 지움
      //     navigate("/mypage");
      //   } else {
      //     // 일반 로그인은 홈으로
      //     navigate("/");
      //   }
      if (res.status === 200) {
        console.log(" 로그인 성공:", res.data);
        alert("로그인 성공");
        const accessToken = res.data.accessToken;
        localStorage.setItem("accessToken", accessToken);

        // 🔥 1. 프로필 정보를 조회하여 설정 여부를 확인합니다.
        try {
          const profileRes = await axiosInstance.get(
            `/api/v1/users/profile/me`
          );
          const profile = profileRes.data;

          // caffeineSensitivity와 alcoholPattern이 null/undefined/빈 문자열인 경우 확인
          const isProfileIncomplete =
            !profile.caffeineSensitivity ||
            !profile.alcoholPattern ||
            profile.caffeineSensitivity === "" ||
            profile.alcoholPattern === "";

          // 🔥 2. 설정이 불완전하면 마이페이지로 이동하고, 모달 플래그를 설정합니다.
          if (isProfileIncomplete) {
            localStorage.setItem("showInitialProfileSetup", "true");
            navigate("/mypage");
          } else {
            // 두 값 모두 설정되어 있다면 메인 페이지로 이동합니다.
            navigate("/");
          }
        } catch (profileError: any) {
          console.error("프로필 조회 실패:", profileError);
          // 프로필 조회에 실패한 경우 (예: 서버 오류), 안전하게 마이페이지로 이동하도록 처리
          localStorage.setItem("showInitialProfileSetup", "true");
          navigate("/mypage");
        }
      }
    } catch (err: any) {
      console.error(" 로그인 실패:", err);
      const status = err.response?.status;

      if (status === 400) {
        console.error("인증 실패(잘못된 이메일 또는 비밀번호)");
      } else {
        console.error("로그인 중 오류가 발생했습니다.");
      }
    }
  };

  // 구글 소셜 로그인
  const handleGoogleLogin = () => {
    window.location.href = `${
      import.meta.env.VITE_API_URL
    }/oauth2/authorization/google`;
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("accessToken", token);

      navigate("/mypage");
    } else {
      navigate("/login");
    }
  }, []);

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
            <SocialButton>
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
            <SocialButton>
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
