import styled from "styled-components";
import Dropdown from "../pages/DropDown";
import React, { useState } from "react";
export default function Mypage() {
  const caffeineOptions = ["약함", "보통", "강함"];
  const drinkOptions = ["없음", "가끔", "자주"];
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [caffeine, setCaffeine] = useState("");
  const [drink, setDrink] = useState("");
  return (
    <Screen>
      <Header>
        <Logo>로고</Logo>
      </Header>
      <Profile>
        <Picture></Picture>
        <Hello>“ 홍길동님, 안녕하세요! ”</Hello>
      </Profile>
      <Content>
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
          <Name>이메일</Name>
          <Box
            type="text"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
          ></Box>
        </NameBox>
        <Dropdown
          label="카페인 민감도"
          selected={caffeine}
          options={caffeineOptions}
          onSelect={setCaffeine}
        />
        <Dropdown
          label="음주 패턴"
          selected={drink}
          options={drinkOptions}
          onSelect={setDrink}
        />
      </Content>
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
  width: 359px;
  height: 26px;
  left: 0px;
  top: 0px;
`;
const Logo = styled.div`
  position: absolute;
  width: 35px;
  height: 24px;
  left: calc(50% - 35px / 2 - 1px);
  top: calc(50% - 24px / 2);

  font-family: "Pretendard";
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  color: #333333;
  flex: none;
  order: 0;
  flex-grow: 0;
  z-index: 0;
`;
const Profile = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;

  position: absolute;
  width: 363px;
  height: 78px;
  left: 15px;
  top: 80px;
`;
const Picture = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 10px;
  width: 78px;
  height: 78px;
  background: #d9d9d9;
  border-radius: 55px;
  flex: none;
  order: 0;
  flex-grow: 0;
`;
const Hello = styled.div`
  position: absolute;
  width: 200px;
  height: 24px;
  left: calc(50% - 200px / 2 + 0.5px);
  top: calc(50% - 24px / 2);
  margin-left: 43px;
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 24px;
  color: #333333;
`;
const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 20px;
  position: absolute;
  width: 363px;
  height: 336px;
  left: 15px;
  top: 178px;
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
  width: 363px;
  height: 40px;
  box-sizing: border-box;
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
