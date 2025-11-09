import styled from "styled-components";
import React, { useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import Nav from "../components/nav";
import bb from "../assets/backbutton.svg";
import { useNavigate } from "react-router-dom";

export default function WhatDrink() {
  const navigate = useNavigate();

  const [drug, setDrug] = useState("");
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

  return (
    <Screen>
      <Header>
        <Back src={bb} alt="뒤로 가기" onClick={handleGoBack} />
        <Ht onClick={handleGoToMyPage}>마이페이지</Ht>
      </Header>
      <ContentContainer>
        <DrugBox>
          <DrugText>현재 복용하고 있는 약</DrugText>
          <DrugLine>
            <TakeDurg
              type="string"
              value={drug}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDrug(e.target.value)
              }
            ></TakeDurg>
            <Plus></Plus>
          </DrugLine>
        </DrugBox>
        <ButtonLine>
          <CaffainePlus onClick={GotoDrinkCaffaine}>카페인 추가</CaffainePlus>
          <AlcoholPlus onClick={GotoDrinkAlcohol}>알코올 추가</AlcoholPlus>
        </ButtonLine>
        <NoBox>
          <Notext>금지 시간 분석</Notext>
          <No></No>
        </NoBox>
        <TakenBox>
          현재 섭취한 음료
          <CoffeeLine>
            <Coffee></Coffee>
            <Coffee>mg</Coffee>
          </CoffeeLine>
          <CoffeeLine>
            <Alcohol></Alcohol>
            <Alcohol>ml</Alcohol>
            <Alcohol>%</Alcohol>
          </CoffeeLine>
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

const DrugBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 8px;

  width: 363px;
  height: 69px;

  /* 내부 오토레이아웃 */
  flex: none;

  align-self: stretch;
  flex-grow: 0;
`;
const DrugText = styled.div`
  width: 363px;
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
const DrugLine = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0px;
  gap: 13px;

  width: 363px;
  height: 40px;

  /* 내부 오토레이아웃 */
  flex: none;

  align-self: stretch;
  flex-grow: 0;
`;
const TakeDurg = styled.input<{ type: string }>`
  /* Frame 6 */

  margin: 0 auto;
  width: 311px;
  height: 40px;

  border: 1.5px solid #ebebeb;
  border-radius: 5px;

  /* 내부 오토레이아웃 */
  flex: none;

  flex-grow: 0;
  padding-left: 10px;
`;
const Plus = styled(AiOutlinePlusCircle)`
  margin: 0 auto;
  width: 28px;
  height: 28px;

  /* 내부 오토레이아웃 */
  flex: none;

  flex-grow: 0;
  border-color: #b6f500;
  cursor: pointer;
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
const NoBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px;
  gap: 8px;

  width: 363px;
  height: 144px;

  /* Inside auto layout */
  flex: none;
  order: 2;
  align-self: stretch;
  flex-grow: 0;
`;
const Notext = styled.div`
  width: 103px;
  height: 21px;

  font-family: "Pretendard";
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 21px;
  text-align: center;

  color: #333333;

  /* Inside auto layout */
  flex: none;
  order: 0;
  flex-grow: 0;
`;
const No = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 9px;
  gap: 10px;
  isolation: isolate;

  width: 363px;
  height: 115px;

  background: #ffffff;
  border: 1.5px solid #ebebeb;
  border-radius: 5px;
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
