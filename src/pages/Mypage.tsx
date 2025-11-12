import styled from "styled-components";
import Dropdown from "../pages/DropDown";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bb from "../assets/backbutton.svg";
import axios from "axios";

export default function Mypage() {
  const caffeineOptions = ["약함", "보통", "강함"];
  const drinkOptions = ["없음", "가끔", "자주"];
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [caffeineSensitivity, setCaffeineSensitivity] = useState("");
  const [drinkingPattern, setDrinkingPattern] = useState("");
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };
  const sensitivityMap: Record<string, string> = {
    약함: "LOW",
    보통: "NORMAL",
    강함: "STRONG",
  };

  const alcoholMap: Record<string, string> = {
    가끔: "NONE",
    자주: "SOMETIMES",
    매일: "OFTEN",
  };
  useEffect(() => {
    const fetchMyPage = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        console.error("❌ 토큰 없음 → 로그인 필요");
        return;
      }

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/users/profile/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // ✅ 토큰 보내기
            },
          }
        );

        console.log("✅ 프로필 조회 성공:", res.data);
      } catch (err: any) {
        console.error("조회 실패:", err.response);
      }
    };

    fetchMyPage();
  }, []);

  const handleUpdateProfile = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      console.error("❌ 토큰 없음 → 로그인 필요");
      return;
    }

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/users/profile/me`,
        {
          name,
          email,
          caffeineSensitivity: sensitivityMap[caffeineSensitivity],
          alcoholPattern: alcoholMap[drinkingPattern],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ 토큰 포함
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ 프로필 수정 성공:", res.data);
    } catch (err: any) {
      console.error("수정 실패:", err.response);
    }
  };

  return (
    <Screen>
      <Header>
        <Back src={bb} alt="뒤로 가기" onClick={handleGoBack} />
      </Header>
      <Profile>
        <Picture></Picture>
        <Hello>“ {name}님, 안녕하세요! ”</Hello>
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
          selected={caffeineSensitivity}
          options={caffeineOptions}
          onSelect={setCaffeineSensitivity}
        />
        <Dropdown
          label="음주 패턴"
          selected={drinkingPattern}
          options={drinkOptions}
          onSelect={setDrinkingPattern}
        />
        <SignUpButton onClick={handleUpdateProfile}>저장하기</SignUpButton>
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
`;
const SignUpButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 363px;
  height: 45px;
  background: #b6f500;
  border-radius: 5px;
  border: none;
  font-family: "Pretendard";
  font-weight: 500;
  font-size: 18px;
  color: #333333;
  cursor: pointer;
  padding: 10px;
  text-align: center;
`;
