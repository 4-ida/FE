import styled from "styled-components";
import React, { useEffect, useState } from "react";
import Nav from "../components/nav";
import bb from "../assets/backbutton.svg";
import { useNavigate } from "react-router-dom";
import Dropdown from "../pages/DropDown";
import axios from "axios";
import axiosInstance from "../axiosInstance";

export default function DrinkCaffaine() {
  const [beverageName, setBeverageName] = useState("");
  const [morning, setMorning] = useState("");
  const drinkOptions = ["오전", "오후"];
  const [time, setTime] = useState("시");
  const timeOptions = [
    "1시",
    "2시",
    "3시",
    "4시",
    "5시",
    "6시",
    "7시",
    "8시",
    "9시",
    "10시",
    "11시",
    "12시",
  ];
  const [caffeineMg, setCaffeineMg] = useState("");
  const [intakeRatio, setIntakeRatio] = useState("");
  const [minute, setMinute] = useState("");
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };
  const handleGoToMyPage = () => {
    navigate("/mypage");
  };
  const GotoWhatDrink = () => {
    navigate("/whatdrink");
  };
  const first = {
    beverageName: "",
    caffeineMg: "",
    intakeRatio: "",
    ampm: "",
    time: "",
    minute: "",
    morning: "",
  };
  const handleReset = () => {
    setBeverageName(first.beverageName);
    setTime(first.time);
    setCaffeineMg(first.caffeineMg);
    setIntakeRatio(first.intakeRatio);
    setMinute(first.minute);
    setMorning(first.morning);
  };

  const handleCaffaine = async () => {
    try {
      const res = await axiosInstance.post(
        `${import.meta.env.VITE_API_URL}/api/v1/intakespage/intakes/caffeine `
      );

      if (res.status === 200) {
        console.log("카페인 섭취 등록 성공 ");
        console.log(res.data);
      }
    } catch (err: any) {
      console.error("카페인 섭취등록 실패 ", err);
    }
  };

  return (
    <Screen>
      <Header>
        <Back src={bb} alt="뒤로 가기" onClick={handleGoBack} />
        <Ht onClick={handleGoToMyPage}>마이페이지</Ht>
      </Header>
      <Container>
        <DrinkBox>
          <DrinkText>섭취 음료</DrinkText>
          <LongBox
            type="text"
            value={beverageName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setBeverageName(e.target.value)
            }
          />
        </DrinkBox>
        <ContainBox>
          <CaffaineBox>
            <CaffaineText>카페인 함량</CaffaineText>
            <CaffaineWrapper>
              <Caffaine
                type="number"
                value={caffeineMg}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCaffeineMg(e.target.value)
                }
              ></Caffaine>
              <Text>mg</Text>
            </CaffaineWrapper>
          </CaffaineBox>
          <CaffaineBox>
            <CaffaineText>섭취 비율</CaffaineText>
            <CaffaineWrapper>
              <Caffaine
                type="number"
                value={intakeRatio}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setIntakeRatio(e.target.value)
                }
              ></Caffaine>
              <Text>%</Text>
            </CaffaineWrapper>
          </CaffaineBox>
        </ContainBox>
        <DrinkBox>
          <DrinkText>섭취 시간</DrinkText>
          <DropdownLine>
            <Dropdown
              variant="custom"
              selected={morning}
              options={drinkOptions}
              onSelect={setMorning}
            ></Dropdown>
            <Dropdown
              variant="custom"
              selected={time}
              options={timeOptions}
              onSelect={setTime}
            ></Dropdown>

            <div style={{ position: "relative", display: "inline-block" }}>
              <Time
                type="number"
                value={minute}
                onChange={(e) => setMinute(e.target.value)}
              />
              <UnitLabel>분</UnitLabel>
            </div>
          </DropdownLine>
        </DrinkBox>
      </Container>
      <ButtonLine>
        <CaffainePlus onClick={handleReset}>초기화</CaffainePlus>
        <AlcoholPlus onClick={handleCaffaine}>완료</AlcoholPlus>
      </ButtonLine>
      <Nav />
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
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 25px;

  position: absolute;
  width: 363px;
  height: 534px;
  left: 14px;
  top: 85px;
`;

const DrinkBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 15px;

  width: 363px;
  height: auto;

  /* Inside auto layout */
  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;
`;
const DrinkText = styled.div`
  width: 363px;
  height: 21px;

  font-family: "Pretendard";
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 21px;

  color: #333333;

  /* Inside auto layout */
  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;
`;
const LongBox = styled.input`
  width: 353px;
  height: 40px;

  border: 1.5px solid #ebebeb;
  border-radius: 5px;

  /* Inside auto layout */
  flex: none;
  order: 0;
  flex-grow: 0;
  align-content: center;
  padding-left: 10px;
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  /* identical to box height */

  color: #333333;
`;
const ContainBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 15px;

  width: 363px;
  height: 67px;

  /* 내부 오토레이아웃 */
  flex: none;

  flex-grow: 0;
`;
const CaffaineBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 8px;

  width: 174px;
  height: 69px;

  /* 내부 오토레이아웃 */
  flex: none;

  flex-grow: 1;
`;
const CaffaineText = styled.div`
  /* 카페인 함량 */

  width: 174px;
  height: 21px;

  font-family: "Pretendard";
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 21px;

  color: #333333;

  /* 내부 오토레이아웃 */
  flex: none;

  align-self: stretch;
  flex-grow: 0;
`;
const CaffaineWrapper = styled.div`
  position: relative;
  display: inline-block;
`;
const Caffaine = styled.input`
  position: relative;
  width: 134px;
  height: 40px;
  padding-right: 30px;
  border: 1.5px solid #ebebeb;
  border-radius: 5px;
  padding-left: 10px;
  /* 내부 오토레이아웃 */
  flex: none;

  align-self: stretch;
  flex-grow: 0;
`;
const Text = styled.div`
  position: absolute;
  width: auto;
  height: 21px;
  right: 10px;
  padding-right: 10px;
  top: calc(50% - 21px / 2 - 0.5px);
  pointer-events: none;
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 21px;

  color: #333333;
`;
const DropdownLine = styled.div`
  display: flex;
  flex-direction: row;
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

const Time = styled.input`
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  /* identical to box height */

  color: #333333;

  /* Inside auto layout */
  flex: none;
  order: 0;
  flex-grow: 0;

  width: 111px;
  height: 40px;

  background: #ffffff;
  border: 1.5px solid #ebebeb;
  border-radius: 5px;
  box-sizing: border-box;
  padding-left: 10px;
`;
const UnitLabel = styled.span`
  position: absolute;
  left: 35px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  color: #333;
  pointer-events: none;

  font-family: "Pretendard";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  /* identical to box height */

  color: #333333;
`;
const ButtonLine = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0px;
  gap: 6px;

  position: fixed;
  bottom: 99px;
  width: 363px;
  height: 42px;
  transform: translateX(4%);
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
