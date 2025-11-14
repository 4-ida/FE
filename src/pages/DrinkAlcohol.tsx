import styled from "styled-components";
import React, { useState } from "react";
import Nav from "../components/nav";
import bb from "../assets/backbutton.svg";
import { useNavigate } from "react-router-dom";
import Dropdown from "../pages/DropDown";

export default function DrinkAlcohol() {
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

  const [showContain, setShowContain] = useState(false);
  const handleCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowContain(e.target.checked);
  };

  const [drink, setDrink] = useState("");
  const drinkOptions = [
    "맥주 (4.5%)",
    "소주 (17%)",
    "와인 (12%)",
    "위스키 (40%)",
  ];
  const [two, setTwo] = useState("");
  const [percent, setPercent] = useState("");
  const twoOptions = ["오전", "오후"];
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
  const [caffaine, setCaffaine] = useState("");
  const [minute, setMinute] = useState("");
  const [cup, setCup] = useState("");
  const first = {
    drink: "",
    caffaine: "",
    two: "",
    cup: "",
    time: "",
    minute: "",
    percent: "",
  };
  const handleReset = () => {
    setDrink(first.drink);
    setTime(first.time);
    setCaffaine(first.caffaine);
    setCup(first.cup);
    setMinute(first.minute);
    setTwo(first.two);
    setPercent(first.percent);
  };

  // 알코올 섭취 페이지 연동

  return (
    <Screen>
      <Header>
        <Back src={bb} alt="뒤로 가기" onClick={handleGoBack} />
        <Ht onClick={handleGoToMyPage}>마이페이지</Ht>
      </Header>
      <Container>
        <Drop
          label="섭취 알코올 종류"
          selected={drink}
          options={drinkOptions}
          onSelect={setDrink}
        ></Drop>
        <LongBox>
          <CupText>마신 잔 수</CupText>
          <CupBox>
            <Cup
              type="number"
              value={cup}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCup(e.target.value)
              }
            ></Cup>
            <Count>잔</Count>
          </CupBox>
          <ChangeContainer>
            <Check checked={showContain} onChange={handleCheckChange} />
            <ChangeText>도수 및 용량 변경</ChangeText>
          </ChangeContainer>
        </LongBox>
        {showContain && (
          <ContainBox>
            <CaffaineBox>
              <CaffaineText>도수 변경</CaffaineText>
              <CaffaineWrapper>
                <Caffaine
                  type="number"
                  value={caffaine}
                  onChange={(e) => setCaffaine(e.target.value)}
                />
                <Text>%</Text>
              </CaffaineWrapper>
            </CaffaineBox>
            <CaffaineBox>
              <CaffaineText>용량 변경</CaffaineText>
              <CaffaineWrapper>
                <Caffaine
                  type="number"
                  value={percent}
                  onChange={(e) => setPercent(e.target.value)}
                />
                <Text>ml</Text>
              </CaffaineWrapper>
            </CaffaineBox>
          </ContainBox>
        )}
        <DrinkBox>
          <DrinkText>섭취 시간</DrinkText>
          <DropdownLine>
            <Dropdown
              variant="custom"
              selected={two}
              options={twoOptions}
              onSelect={setTwo}
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
        <AlcoholPlus onClick={GotoWhatDrink}>완료</AlcoholPlus>
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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 30px;
  position: absolute;
  width: 363px;
  height: 452px;
  left: 15px;
  top: 85px;
`;

const Drop = styled(Dropdown)`
  display: flex;
  flex: none;
  flex-direction: column;
  gap: 8px;
`;

const CaffaineBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 8px;

  width: 174px;
  height: auto;

  /* 내부 오토레이아웃 */
  flex: none;
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

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
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

const ContainBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 15px;

  width: 363px;
  height: auto;

  /* 내부 오토레이아웃 */
  flex: none;

  flex-grow: 0;
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

const DropdownLine = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 8px;
  width: 363px;
  /* Inside auto layout */
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

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;
const UnitLabel = styled.span`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  color: #333;
  pointer-events: none;

  font-family: "Pretendard";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;

  color: #333333;
`;
const LongBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 8px;

  width: 363px;
  height: auto;

  /* 내부 오토레이아웃 */
  flex: none;
`;

const CupText = styled.div`
  width: 363px;
  height: 21px;

  font-family: "Pretendard";
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 21px;

  color: #333333;
`;

const CupBox = styled.div`
  position: relative;
  display: inline-block;
`;

const ChangeContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Check = styled.input.attrs({ type: "checkbox" })`
  width: 16px;
  height: 16px;
  accent-color: #b6f500; /* 체크 표시 색 */
  border: 2px solid #b6f500;
  border-radius: 6px;
  cursor: pointer;
`;

const ChangeText = styled.div`
  font-size: 15px;
  font-weight: 400;
`;

const Cup = styled.input`
  position: relative;
  width: 323px;
  height: 40px;
  padding-right: 30px;
  border: 1.5px solid #ebebeb;
  border-radius: 5px;
  padding-left: 10px;
  /* 내부 오토레이아웃 */
  flex: none;

  align-self: stretch;
  flex-grow: 0;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;
const Count = styled.div`
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
