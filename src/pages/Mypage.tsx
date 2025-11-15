import styled from "styled-components";
import Dropdown from "../pages/DropDown";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bb from "../assets/backbutton.svg";
import Modal from "./modal/mymodal";
import axiosInstance from "../axiosInstance";
import Logo from "../assets/logo.svg?react";

export default function Mypage() {
  const caffeineOptions = ["약함", "보통", "강함"];
  const drinkOptions = ["없음", "가끔", "자주"];
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [caffeineSensitivity, setCaffeineSensitivity] = useState("");
  const [drinkingPattern, setDrinkingPattern] = useState("");

  // modal
  const [showModal, setShowModal] = useState(false);
  const [caffeineError, setCaffeineError] = useState(false);
  const [alcoholError, setAlcoholError] = useState(false);

  const navigate = useNavigate();
  const handleGoBack = () => {
    // 로그인 상태 확인
    const isLoggedIn = !!localStorage.getItem("accessToken");
    if (isLoggedIn) {
      // 로그인되어 있으면 메인 페이지로 이동
      navigate("/");
    } else {
      // 로그인되어 있지 않으면 이전 페이지로 이동
      navigate(-1);
    }
  };

  // 로그아웃 처리
  const handleLogout = () => {
    console.log("🔓 [로그아웃] 처리 시작");
    
    // 확인 메시지 표시
    const confirmed = window.confirm("로그아웃하시겠습니까?");
    if (!confirmed) {
      console.log("📥 로그아웃 취소됨");
      return;
    }

    try {
      // localStorage에서 모든 인증 정보 제거
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      localStorage.removeItem("tokenExpiresAt");
      localStorage.removeItem("showInitialProfileSetup");
      
      console.log("✅ [로그아웃] localStorage 정리 완료");
      console.log("📥 제거된 항목: accessToken, user, tokenExpiresAt, showInitialProfileSetup");
      
      // 로그인 페이지로 리다이렉트
      console.log("📥 로그인 페이지로 리다이렉트");
      navigate("/login", { replace: true });
    } catch (error: any) {
      console.error("❌ [로그아웃] 처리 중 오류 발생");
      console.error("📥 에러 메시지:", error.message);
      console.error("📥 전체 에러 객체:", JSON.stringify(error, null, 2));
      
      // 에러가 발생해도 로그인 페이지로 이동
      alert("로그아웃 처리 중 오류가 발생했습니다.");
      navigate("/login", { replace: true });
    }
  };
  const sensitivityMap: Record<string, string> = {
    약함: "WEAK",
    보통: "NORMAL",
    강함: "STRONG",
  };

  const alcoholMap: Record<string, string> = {
    없음: "NONE",
    가끔: "SOMETIMES",
    자주: "OFTEN",
  };

  // 프로필 조회 API
  const fetchMyPage = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      console.error("❌ 토큰 없음 → 로그인 필요");
      return;
    }

    try {
      const res = await axiosInstance.get(`/api/v1/users/profile/me`);

      console.log("✅ [프로필 조회] 성공");
      console.log("📥 응답 상태:", res.status);
      console.log("📥 응답 데이터:", JSON.stringify(res.data, null, 2));
      setName(res.data.name);
      setEmail(res.data.email);
      // 필요한 경우 caffeineSensitivity, drinkingPattern 도 여기서 설정
      const reverseSensitivityMap: Record<string, string> = {
        WEAK: "약함",
        NORMAL: "보통",
        STRONG: "강함",
      };
      const reverseAlcoholMap: Record<string, string> = {
        NONE: "없음",
        SOMETIMES: "가끔",
        OFTEN: "자주",
      };
      if (res.data.caffeineSensitivity)
        setCaffeineSensitivity(
          reverseSensitivityMap[res.data.caffeineSensitivity]
        );

      if (res.data.alcoholPattern)
        setDrinkingPattern(reverseAlcoholMap[res.data.alcoholPattern]);
    } catch (err: any) {
      console.error("조회 실패:", err.response);
    }
  };

  useEffect(() => {
    fetchMyPage();
    if (localStorage.getItem("showInitialProfileSetup") === "true") {
      setShowModal(true);
    }
    // handleUpdateProfile();
  }, []);

  // 모달
  useEffect(() => {
    if (caffeineSensitivity) setCaffeineError(false);
  }, [caffeineSensitivity]);

  useEffect(() => {
    if (drinkingPattern) setAlcoholError(false);
  }, [drinkingPattern]);

  // 🔥 모달 닫기 핸들러
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // 프로필 수정 API
  // const handleUpdateProfile = async () => {
  //   const token = localStorage.getItem("accessToken");
  //   if (!token) {
  //     console.error("❌ 토큰 없음 → 로그인 필요");
  //     return;
  //   }

  //   //모달
  //   const isCaffeineSelected = caffeineSensitivity !== "";
  //   const isAlcoholSelected = drinkingPattern !== "";

  //   setCaffeineError(!isCaffeineSelected);
  //   setAlcoholError(!isAlcoholSelected);

  //   // 필수 항목이 선택되지 않았다면 API 호출 중단 및 경고
  //   if (!isCaffeineSelected || !isAlcoholSelected) {
  //     // 경고 메시지는 이미 필드 옆에 표시됨
  //     return; // 페이지 이동 안 됨
  //   }

  //   try {
  //     const res = await axiosInstance.put(`/api/v1/users/profile/me`, {
  //       name,
  //       email,
  //       caffeineSensitivity: sensitivityMap[caffeineSensitivity],
  //       alcoholPattern: alcoholMap[drinkingPattern],
  //     });

  //     console.log("🟡 보낼 데이터:", {
  //       name,
  //       email,
  //       caffeineSensitivity: sensitivityMap[caffeineSensitivity],
  //       alcoholPattern: alcoholMap[drinkingPattern],
  //     });

  //     //모달
  //     localStorage.removeItem("showInitialProfileSetup");
  //     navigate("/"); // 메인 페이지로 이동

  //     const reverseSensitivityMap: Record<string, string> = {
  //       WEAK: "약함",
  //       NORMAL: "보통",
  //       STRONG: "강함",
  //     };
  //     const reverseAlcoholMap: Record<string, string> = {
  //       NONE: "없음",
  //       SOMETIMES: "가끔",
  //       OFTEN: "자주",
  //     };

  //     if (res.data.caffeineSensitivity)
  //       setCaffeineSensitivity(
  //         reverseSensitivityMap[res.data.caffeineSensitivity]
  //       );

  //     if (res.data.alcoholPattern)
  //       setDrinkingPattern(reverseAlcoholMap[res.data.alcoholPattern]);

  //     fetchMyPage(); // 🔥 이렇게 바로 다시 조회해서 최신 데이터 반영
  //   } catch (err) {
  //     console.error("조회 실패:");
  //   }
  // };

  const handleUpdateProfile = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("❌ 토큰 없음 → 로그인 필요");
      return;
    }

    // 🔥 유효성 검사 및 경고 메시지 표시
    const isCaffeineSelected = caffeineSensitivity !== "";
    const isAlcoholSelected = drinkingPattern !== "";

    setCaffeineError(!isCaffeineSelected);
    setAlcoholError(!isAlcoholSelected);

    // 필수 항목이 선택되지 않았다면 API 호출 중단 및 경고
    if (!isCaffeineSelected || !isAlcoholSelected) {
      // 경고 메시지가 필드 옆에 표시되므로 alert는 생략하고 return만 남김
      return; // 페이지 이동 안 됨
    }

    try {
      const res = await axiosInstance.put(`/api/v1/users/profile/me`, {
        name,
        email,
        caffeineSensitivity: sensitivityMap[caffeineSensitivity],
        alcoholPattern: alcoholMap[drinkingPattern],
      });

      console.log("✅ [프로필 수정] 성공");
      console.log("📥 응답 상태:", res.status);
      console.log("📥 응답 데이터:", JSON.stringify(res.data, null, 2));

      // 🔥 수정 성공 시 플래그 제거 및 메인 페이지로 이동
      localStorage.removeItem("showInitialProfileSetup");
      alert("프로필이 성공적으로 저장되었습니다.");
      navigate("/");
    } catch (err: any) {
      console.error("수정 실패:", err.response);
      alert("프로필 저장에 실패했습니다.");
    }
  };

  return (
    <Screen>
      <LoGoWrapper onClick={() => navigate("/")}>
        <LoGo />
      </LoGoWrapper>
      {showModal && <Modal isOpen={showModal} onClose={handleCloseModal} />}
      <Header>
        <Back src={bb} alt="뒤로 가기" onClick={handleGoBack} />
        <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
      </Header>
      <Profile>
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
          <EmailBox type="text" value={email} disabled></EmailBox>
        </NameBox>
        {/* <Dropdown
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
        /> */}

        <DropdownContainer>
          <Dropdown
            label="카페인 민감도" // Name에서 라벨을 이미 표시하므로 빈 문자열로 설정
            selected={caffeineSensitivity}
            options={caffeineOptions}
            onSelect={setCaffeineSensitivity}
          />
          <Name>
            {caffeineError && <ErrorMessage> *선택해 주세요</ErrorMessage>}
          </Name>
        </DropdownContainer>

        {/* 🔥 음주 패턴 드롭다운 (경고 표시를 위해 NameBox 구조 사용) */}
        <DropdownContainer>
          <Dropdown
            label="음주 패턴"
            selected={drinkingPattern}
            options={drinkOptions}
            onSelect={setDrinkingPattern}
          />
          <Name>
            {alcoholError && <ErrorMessage> *선택해 주세요</ErrorMessage>}
          </Name>
        </DropdownContainer>
        <SignUpButton onClick={handleUpdateProfile}>저장하기</SignUpButton>
      </Content>
    </Screen>
  );
}

const ErrorMessage = styled.span`
  color: #ff3b30; /* 빨간색 */
  font-size: 14px;
  font-weight: 400;
  margin-left: 8px;
`;

// 드롭다운 컴포넌트와 Name 컴포넌트를 묶어주는 컨테이너 (기존 NameBox와 동일한 역할을 하되, 경고 표시를 위해 분리)
const DropdownContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  width: 363px;
  flex: none;
  order: 0;
  justify-content: space-between;
  align-self: stretch;
  flex-grow: 0;
`;

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
const LogoutButton = styled.button`
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  color: #767676;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 5px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f5f5f5;
  }

  &:active {
    background-color: #ebebeb;
  }
`;
const Profile = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0px;

  position: absolute;
  width: 363px;
  height: 78px;
  left: 15px;
  top: 80px;
`;
const Hello = styled.div`
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 24px;
  color: #333333;
  text-align: center;
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

const LoGoWrapper = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const LoGo = styled(Logo)`
  position: absolute;
  top: 15px;
  left: 139px;
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

const EmailBox = styled.input`
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
