import styled from "styled-components";
import { useState, useEffect } from "react";
import Nav from "../components/nav";
import bb from "../assets/backbutton.svg";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
    const token = localStorage.getItem("accessToken");
    const Details = async () => {
      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/api/v1/intakespage/intakes/active-timers`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.status === 200) {
          console.log("약물 리스트 조회 성공");
          console.log(res.data);
          setIntakeData(res.data);
        }
      } catch (err: any) {
        console.error("약물 리스트 조회 실패", err);
      }
    };
    Details();
  }, []);

  // 카페인 잔존 타이머 조회 연동

  return (
    <Screen>
      <Header>
        <Back src={bb} alt="뒤로 가기" onClick={handleGoBack} />
        <Ht onClick={handleGoToMyPage}>마이페이지</Ht>
      </Header>
      <ContentContainer>
        <ButtonLine>
          <CaffainePlus onClick={GotoDrinkCaffaine}>카페인 추가</CaffainePlus>
          <AlcoholPlus onClick={GotoDrinkAlcohol}>알코올 추가</AlcoholPlus>
        </ButtonLine>
        <TakenBox>
          현재 섭취한 음료
          {intakeData?.caffeineTimer && (
            <CoffeeLine>
              <Coffee>{intakeData.caffeineTimer.name}</Coffee>
              <Coffee>{intakeData.caffeineTimer.amount} mg</Coffee>
            </CoffeeLine>
          )}
          {/* 알코올 표시 */}
          {intakeData?.alcoholTimer && (
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
  gap: 15px;

  width: 363px;
  height: 40px;

  /* Inside auto layout */
  flex: none;
  order: 1;
  align-self: stretch;
  flex-grow: 0;
`;
const Coffee = styled.div`
  display: flex;
  padding-right: 10px;
  justify-content: flex-end;
  align-items: center;

  width: 154px;
  height: 40px;

  background: #ffffff;
  border: 1.5px solid #ebebeb;
  border-radius: 5px;

  /* Inside auto layout */
  flex: none;
  order: 0;
  flex-grow: 1;
  /* 커피 */
  padding-left: 10px;

  font-family: "Pretendard";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  /* identical to box height */

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
