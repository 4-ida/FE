// src/pages/Main.tsx (파일명 변경)

import Nav from "../components/nav";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { CalendarView } from "../components/Calendar";

const Container = styled.div`
  display: flex;
  width: 393px;
  min-height: 852px;
  background-color: #fff;
  flex-direction: column;
  align-items: center;
  color: #333;
`;

const Header = styled.div`
  display: flex;
  width: 100%;
  height: 60px;
  align-items: center;
  padding: 0 15px;
  box-sizing: border-box;
  justify-content: flex-end;
`;

const Ht = styled.div`
  font-family: "Pretendard";
  font-weight: 500;
  font-size: 15px;
  cursor: pointer;
`;

export default function Main() { // Home 대신 Main으로 변경
  const navigate = useNavigate();
  const handleGoToMyPage = () => {
    navigate('/mypage'); 
  };
  
  return (
    <Container>
      <Nav />
      <Header>
        <Ht onClick={handleGoToMyPage}>마이페이지</Ht>
      </Header>
      
      <CalendarView />
    </Container>
  );
}