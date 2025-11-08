import styled from "styled-components";
import React, { useState } from "react";
import Nav from "../components/nav";
import bb from "../assets/backbutton.svg";
import { useNavigate } from "react-router-dom";

export default function DrinkCaffaine() {
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };
  const handleGoToMyPage = () => {
    navigate("/mypage");
  };
  return (
    <Screen>
      <Header>
        <Back src={bb} alt="뒤로 가기" onClick={handleGoBack} />
        <Ht onClick={handleGoToMyPage}>마이페이지</Ht>
      </Header>
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
