import styled from "styled-components";
import React, { useEffect, useState } from "react";
import KakaoImg from "../assets/kakao.svg";
import NaverImg from "../assets/naver.svg";
import GoogleImg from "../assets/google.svg";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const GotoSignup = () => {
    navigate("/Signup");
  };
  return (
    <Screen>
      <Header>
        <Logo>로고</Logo>
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
                type="string"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
              ></Box>
            </NameBox>

            <LoginButton>로그인</LoginButton>
          </ContentBox>
          <SignupButton onClick={GotoSignup}>회원가입</SignupButton>
        </Logincontent>
        <SocialLogin>
          <SocialText>SNS 계정으로 로그인</SocialText>
          <SocialLine>
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
  flex-direction: column;
  align-items: flex-start;
  padding: 18px 17px;
  gap: 10px;
  isolation: isolate;

  position: absolute;
  width: 393px;
  height: 60px;
  left: 0px;
  top: 0px;
`;
const Logo = styled.div`
  position: absolute;
  width: 85px;
  height: 27px;
  left: calc(50% - 85px / 2);
  top: calc(50% - 27px / 2 + 0.5px);

  font-family: "Pretendard";
  font-style: normal;
  font-weight: 600;
  font-size: 23px;
  line-height: 27px;

  color: #333333;

  /* 내부 오토레이아웃 */
  flex: none;
  order: 0;
  flex-grow: 0;
  z-index: 0;
`;
const ContentContainer = styled.div`
  /* Frame 1707485872 */

  /* 오토레이아웃 */
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
  curosr: pointer;
`;
const LoginButton = styled.div`
  width: 363px;
  height: 50px;
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
  font-size: 20px;
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
