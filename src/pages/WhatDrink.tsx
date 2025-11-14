import styled from "styled-components";
import { useState, useEffect } from "react";
import Nav from "../components/nav";
import bb from "../assets/backbutton.svg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "../assets/logo.svg?react";
import axiosInstance from "../axiosInstance";

export default function WhatDrink() {
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };
  const handleGoToMyPage = () => {
    navigate("/mypage");
  };
  const GotoDrinkCaffaine = () => {
    navigate("/drink/caffaine");
  };
  const GotoDrinkAlcohol = () => {
    navigate("/drink/alcohol");
  };
  const [intakeData, setIntakeData] = useState<IntakeData | null>(null);
  const [caffeineRemaining, setCaffeineRemaining] = useState<number | null>(null);
  const [alcoholRemaining, setAlcoholRemaining] = useState<number | null>(null);
  const [activeTimerType, setActiveTimerType] = useState<"caffeine" | "alcohol" | null>(null);

  // 섭취 약물 리스트 연동
  interface TimerItem {
    intakeId: number;
    name: string;
    amount: number;
    intakeType: string;
    abv?: number;
  }

  interface IntakeData {
    caffeineTimer: TimerItem | null;
    alcoholTimer: TimerItem | null;
  }

  // 활성 타이머 리스트 조회 연동
  useEffect(() => {
    const Details = async () => {
      try {
        console.log("📖 [활성 타이머 조회] 요청 시작");
        const res = await axiosInstance.get(
          `/api/v1/intakespage/intakes/active-timers`
        );
        if (res.status === 200) {
          console.log("✅ [활성 타이머 조회] 성공");
          console.log("📥 응답 데이터:", JSON.stringify(res.data, null, 2));
          setIntakeData(res.data);
        }
      } catch (err: any) {
        console.error("❌ [활성 타이머 조회] 실패");
        if (err.response) {
          console.error("📥 에러 상태 코드:", err.response.status);
          console.error("📥 에러 응답 데이터:", JSON.stringify(err.response.data, null, 2));
        } else {
          console.error("📥 에러 메시지:", err.message);
        }
      }
    };
    Details();
  }, []);

  // 카페인 잔존 타이머 조회 연동
  useEffect(() => {
    const fetchCaffeineRemaining = async () => {
      // 활성 카페인 타이머가 있을 때만 조회
      if (!intakeData?.caffeineTimer) {
        setCaffeineRemaining(null);
        return;
      }

      const intakeId = intakeData.caffeineTimer.intakeId;
      console.log("⏱️ [카페인 잔존 타이머 조회] 요청 시작");
      console.log("📤 intakeId:", intakeId);

      try {
        const res = await axiosInstance.get(
          `/api/v1/intakespage/intakes/caffeine/${intakeId}/timer`
        );
        if (res.status === 200) {
          console.log("✅ [카페인 잔존 타이머 조회] 성공");
          console.log("📥 응답 데이터:", JSON.stringify(res.data, null, 2));
          const remainingSeconds = res.data.remainingSeconds || res.data.remaining || res.data;
          console.log("📥 추출된 카페인 잔존 시간:", remainingSeconds, "초");
          setCaffeineRemaining(remainingSeconds);
        }
      } catch (err: any) {
        console.error("❌ [카페인 잔존 타이머 조회] 실패");
        console.error("📤 시도한 intakeId:", intakeId);
        if (err.response) {
          const status = err.response.status;
          console.error("📥 에러 상태 코드:", status);
          console.error("📥 에러 응답 데이터:", JSON.stringify(err.response.data, null, 2));
          
          if (status === 500) {
            console.error("🚨 [500 Internal Server Error] 서버 내부 오류");
            console.log("🔄 대체 엔드포인트 시도 중...");
            try {
              const altRes = await axiosInstance.get(
                `/api/v1/intakespage/intakes/caffeine/remaining-timer`
              );
              if (altRes.status === 200) {
                console.log("✅ [카페인 잔존 타이머 조회] 대체 엔드포인트 성공");
                const remainingSeconds = altRes.data.remainingSeconds || altRes.data.remaining || altRes.data;
                setCaffeineRemaining(remainingSeconds);
                return;
              }
            } catch (altErr: any) {
              console.error("❌ 대체 엔드포인트도 실패:", JSON.stringify(altErr.response?.data, null, 2));
            }
          }
        } else {
          console.error("📥 에러 메시지:", err.message);
        }
        setCaffeineRemaining(null);
      }
    };

    fetchCaffeineRemaining();
    
    // 주기적으로 갱신 (30초마다)
    const interval = setInterval(fetchCaffeineRemaining, 30000);
    return () => clearInterval(interval);
  }, [intakeData?.caffeineTimer]);

  // 카페인과 알코올 잔존 타이머 비교하여 더 긴 시간이 남은 타이머만 활성화
  useEffect(() => {
    console.log("🔄 [타이머 활성화 결정]");
    console.log("📊 카페인 잔존 시간:", caffeineRemaining !== null ? `${caffeineRemaining}초` : "없음");
    console.log("📊 알코올 잔존 시간:", alcoholRemaining !== null ? `${alcoholRemaining}초` : "없음");
    
    if (caffeineRemaining === null && alcoholRemaining === null) {
      setActiveTimerType(null);
      console.log("📥 결과: 두 타이머 모두 없음");
      return;
    }
    
    if (caffeineRemaining === null && alcoholRemaining !== null) {
      setActiveTimerType("alcohol");
      console.log("📥 결과: 알코올 타이머만 활성화");
      return;
    }
    
    if (caffeineRemaining !== null && alcoholRemaining === null) {
      setActiveTimerType("caffeine");
      console.log("📥 결과: 카페인 타이머만 활성화");
      return;
    }
    
    // 둘 다 있는 경우 더 긴 시간 비교
    if (caffeineRemaining !== null && alcoholRemaining !== null) {
      if (caffeineRemaining > alcoholRemaining) {
        setActiveTimerType("caffeine");
        console.log("📥 결과: 카페인 타이머 활성화");
        console.log("   이유: 카페인(" + caffeineRemaining + "초) > 알코올(" + alcoholRemaining + "초)");
      } else {
        setActiveTimerType("alcohol");
        console.log("📥 결과: 알코올 타이머 활성화");
        console.log("   이유: 알코올(" + alcoholRemaining + "초) > 카페인(" + caffeineRemaining + "초)");
      }
    }
  }, [caffeineRemaining, alcoholRemaining]);

  // 알코올 잔존 타이머 조회 연동
  useEffect(() => {
    const fetchAlcoholRemaining = async () => {
      // 활성 알코올 타이머가 있을 때만 조회
      if (!intakeData?.alcoholTimer) {
        setAlcoholRemaining(null);
        return;
      }

      const intakeId = intakeData.alcoholTimer.intakeId;
      console.log("⏱️ [알코올 잔존 타이머 조회] 요청 시작");
      console.log("📤 intakeId:", intakeId);

      try {
        const res = await axiosInstance.get(
          `/api/v1/intakespage/intakes/alcohol/${intakeId}/timer`
        );
        if (res.status === 200) {
          console.log("✅ [알코올 잔존 타이머 조회] 성공");
          console.log("📥 응답 데이터:", JSON.stringify(res.data, null, 2));
          const remainingSeconds = res.data.remainingSeconds || res.data.remaining || res.data;
          console.log("📥 추출된 알코올 잔존 시간:", remainingSeconds, "초");
          setAlcoholRemaining(remainingSeconds);
        }
      } catch (err: any) {
        console.error("❌ [알코올 잔존 타이머 조회] 실패");
        console.error("📤 시도한 intakeId:", intakeId);
        if (err.response) {
          const status = err.response.status;
          console.error("📥 에러 상태 코드:", status);
          console.error("📥 에러 응답 데이터:", JSON.stringify(err.response.data, null, 2));
          
          if (status === 500) {
            console.error("🚨 [500 Internal Server Error] 서버 내부 오류");
            console.log("🔄 대체 엔드포인트 시도 중...");
            try {
              const altRes = await axiosInstance.get(
                `/api/v1/intakespage/intakes/alcohol/remaining-timer`
              );
              if (altRes.status === 200) {
                console.log("✅ [알코올 잔존 타이머 조회] 대체 엔드포인트 성공");
                const remainingSeconds = altRes.data.remainingSeconds || altRes.data.remaining || altRes.data;
                setAlcoholRemaining(remainingSeconds);
                return;
              }
            } catch (altErr: any) {
              console.error("❌ 대체 엔드포인트도 실패:", JSON.stringify(altErr.response?.data, null, 2));
            }
          }
        } else {
          console.error("📥 에러 메시지:", err.message);
        }
        setAlcoholRemaining(null);
      }
    };

    fetchAlcoholRemaining();
    
    // 주기적으로 갱신 (30초마다)
    const interval = setInterval(fetchAlcoholRemaining, 30000);
    return () => clearInterval(interval);
  }, [intakeData?.alcoholTimer]);

  return (
    <Screen>
      <Header>
        {/* <Back src={bb} alt="뒤로 가기" onClick={handleGoBack} /> */}
        <Logo />
        <Ht onClick={handleGoToMyPage}>마이페이지</Ht>
      </Header>
      <ContentContainer>
        <ButtonLine>
          <CaffainePlus onClick={GotoDrinkCaffaine}>카페인 추가</CaffainePlus>
          <AlcoholPlus onClick={GotoDrinkAlcohol}>알코올 추가</AlcoholPlus>
        </ButtonLine>
        <TakenBox>
          현재 섭취한 음료
          {intakeData?.caffeineTimer && activeTimerType === "caffeine" && (
            <CoffeeLine>
              <Coffee>{intakeData.caffeineTimer.name}</Coffee>
              <Coffee>{intakeData.caffeineTimer.amount} mg</Coffee>
            </CoffeeLine>
          )}
          {intakeData?.caffeineTimer && activeTimerType !== "caffeine" && (
            <CoffeeLine>
              <Coffee>{intakeData.caffeineTimer.name}</Coffee>
              <Coffee>{intakeData.caffeineTimer.amount} mg</Coffee>
            </CoffeeLine>
          )}
          {/* 알코올 표시 */}
          {intakeData?.alcoholTimer && activeTimerType === "alcohol" && (
            <CoffeeLine>
              <Alcohol>{intakeData.alcoholTimer.name}</Alcohol>
              <Alcohol>{intakeData.alcoholTimer.amount} ml</Alcohol>
              <Alcohol>{intakeData.alcoholTimer.abv}%</Alcohol>
            </CoffeeLine>
          )}
          {intakeData?.alcoholTimer && activeTimerType !== "alcohol" && (
            <CoffeeLine>
              <Alcohol>{intakeData.alcoholTimer.name}</Alcohol>
              <Alcohol>{intakeData.alcoholTimer.amount} ml</Alcohol>
              <Alcohol>{intakeData.alcoholTimer.abv}%</Alcohol>
            </CoffeeLine>
          )}
        </TakenBox>
        
      </ContentContainer>
      <Nav></Nav>
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
  justify-content: flex-end;
  gap: 60px;
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
  align-items: flex-start;
  padding: 0px;
  gap: 20px;

  position: absolute;
  width: 363px;
  height: auto;
  left: 15px;
  top: 72px;
`;

const ButtonLine = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0px;
  gap: 6px;

  width: 363px;
  height: 42px;

  /* Inside auto layout */
  flex: none;
  order: 2;
  align-self: stretch;
  flex-grow: 0;
`;
const CaffainePlus = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;

  width: 170px;
  height: 42px;

  background: #ebebeb;
  border-radius: 5px;

  /* Inside auto layout */
  flex: none;
  order: 0;
  flex-grow: 0;

  font-family: "Pretendard";
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 24px;
  /* identical to box height */
  text-align: center;

  color: #000000;
`;
const AlcoholPlus = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;

  width: 180px;
  height: 42px;

  background: #b6f500;
  border-radius: 5px;

  /* Inside auto layout */
  flex: none;
  order: 1;
  flex-grow: 0;
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 24px;
  /* identical to box height */
  text-align: center;

  color: #000000;
`;
const TakenBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 15px;

  width: 363px;
  height: 131px;
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 21px;

  color: #333333;
`;
const CoffeeLine = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 0px;
  gap: 10px;

  width: 100%;
  height: 40px;

  /* Inside auto layout */
  flex: none;
  order: 1;
  align-self: stretch;
  flex-grow: 0;
`;
const Coffee = styled.div`
  flex: 1;
  height: 40px;
  display: flex;
  padding-right: 10px;
  justify-content: flex-end;
  align-items: center;
  background: #ffffff;
  border: 1.5px solid #ebebeb;
  border-radius: 5px;
  padding-left: 10px;
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  color: #333333;
`;

const Alcohol = styled.div`
  width: 101px;
  height: 40px;
  display: flex;
  padding-right: 10px;
  justify-content: flex-end;
  align-items: center;
  background: #ffffff;
  border: 1.5px solid #ebebeb;
  border-radius: 5px;
  right: 10px;
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  /* identical to box height */

  color: #333333;
`;
