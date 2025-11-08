import Nav from "../components/nav";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import CalendarView from "../components/Calendar";
import Plus from "../assets/AiOutlinePlus.svg?react";
import { useState } from "react";

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

const Title = styled.div`
  font-weight: 500;
  font-size: 20px;
`;

const AddSchedule = styled.div`
  display: flex;
  align-items: center;
  font-size: 15px;
  color: #333;
  cursor: pointer;
`;

const HeaderContainer = styled.div`
  width: 100%;
  padding: 0 15px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
`;

const Footer = styled.div`
  width: 100%;
  margin-top: 30px;
  padding: 0 15px;
  font-size: 16px;
  font-weight: 500;
  box-sizing: border-box;
`;

const ProgressBarWrapper = styled.div`
  margin-top: 12px;
  width: 100%;
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
  position: relative;
`;

const ProgressBar = styled.div<{ $progress: number }>`
  height: 100%;
  width: ${({ $progress }) => $progress}%;
  background-color: #b6f500;
  border-radius: 5px;
`;

const ProgressHandle = styled.div<{ $progress: number }>`
  position: absolute;
  top: 50%;
  left: ${({ $progress }) => $progress}%;
  transform: translate(-50%, -50%);
  width: 18px;
  height: 18px;
  background-color: #b6f500;
  border: 3px solid white;
  border-radius: 50%;
`;

const sampleProgress = 20;

export default function Main() {
  const navigate = useNavigate();
  const [value, setdateValue] = useState(new Date());
  const [activeStartDate, setActiveStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const setValue = (date: Date) => {
    setdateValue(date);
  };
  const formatMonth = (d: Date) =>
    `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}`;

  const handleGoToMyPage = () => {
    navigate("/mypage");
  };

  return (
    <Container>
      <Nav />
      <Header>
        <Ht onClick={handleGoToMyPage}>마이페이지</Ht>
      </Header>
      <HeaderContainer>
        <Title>내 달력</Title>
        <AddSchedule onClick={() => navigate("/drug/register")}>
          일정 추가하기 <Plus style={{ marginLeft: "3px" }} />
        </AddSchedule>
      </HeaderContainer>

      <CalendarView />
      <Footer>
        홍길동 님의 {formatMonth(activeStartDate).split(".")[1]}월 복용률 :{" "}
        {sampleProgress}%
        <ProgressBarWrapper>
          <ProgressBar $progress={sampleProgress} />
          <ProgressHandle $progress={sampleProgress} />
        </ProgressBarWrapper>
      </Footer>
    </Container>
  );
}
