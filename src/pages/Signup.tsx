import styled from "styled-components";
import React, { useEffect, useState } from "react";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailcheck, SetEmailCheck] = useState("");
  const [passwordcheck, setPasswordCheck] = useState("");

  return (
    <Screen>
      <Header>
        <Logo>회원가입</Logo>
      </Header>
      <ContentContainer>
        <NameBox>
          <Name>이름</Name>
          <Box
            type="text"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
          ></Box>
        </NameBox>
        <NameBox>
          <Name>이메일 (아이디)</Name>
          <Box
            type="text"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
          ></Box>
        </NameBox>
        <NameBox>
          <Name>이메일 (중복확인)</Name>
          <Box
            type="text"
            value={emailcheck}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              SetEmailCheck(e.target.value)
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
        <NameBox>
          <Name>비밀번호 확인</Name>
          <Box
            type="string"
            value={passwordcheck}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPasswordCheck(e.target.value)
            }
          ></Box>
        </NameBox>

        <SignUpButton>가입하기</SignUpButton>
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
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 24px;

  position: absolute;
  width: 363px;
  height: 549px;
  left: calc(50% - 363px / 2);
  top: 80px;
`;

const NameBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
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
  width: 353px;
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
const SignUpButton = styled.div`
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
  cursor: pointer;

  color: #333333;
`;
