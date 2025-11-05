import { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Plus from "../assets/AiOutlinePlus.svg?react";
import { useNavigate } from "react-router-dom";

const CalendarStyles = createGlobalStyle`
  .react-calendar {
    border: none !important;
    font-family: 'Pretendard', sans-serif !important;
    width: 100% !important;
    max-width: 363px !important;
    background: none !important;
  }

  /* 기본 navigation 숨기고 커스텀 헤더 사용 */
  .react-calendar__navigation {
    display: none;
  }

  .react-calendar__month-view__weekdays {
    text-align: center;
    font-size: 14px;
  }

  .react-calendar__month-view__weekdays__weekday abbr {
    text-decoration: none;
    font-weight: 500;
  }

  .react-calendar__month-view__weekdays__weekday:nth-child(1) abbr {
    color: #FF6666;
  }

  .react-calendar__tile {
    height: 40px;
    padding: 5px 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    font-weight: 500;
    border-radius: 50%;
    background: none;
    border: none;
  }

  .react-calendar__tile--now {
    background-color: #B6F500 !important;
    color: white !important;
    border-radius: 50%;
  }

  .react-calendar__month-view__days__day--neighboringMonth {
    opacity: 0.4;
  }
`;

const CalendarWrapper = styled.div`
  width: 100%;
  max-width: 363px;
  padding: 0 15px;
  box-sizing: border-box;
  margin-top: 30px;
  font-family: "Pretendard", sans-serif;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
  padding: 0 15px;
  box-sizing: border-box;
`;

const Title = styled.div`
  font-family: "Pretendard";
  font-weight: 400;
  font-size: 20px;
`;

const MonthNavigation = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  color: #333;
`;

const NavArrow = styled.button`
  cursor: pointer;
  font-size: 20px;
  margin: 0 10px;
  user-select: none;
  background: transparent;
  border: none;
  padding: 4px 6px;
  border-radius: 6px;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
`;

const AddSchedule = styled.div`
  display: flex;
  align-items: center;
  font-size: 15px;
  font-weight: 400;
  color: #333;
  cursor: pointer;
`;

const Dot = styled.div`
  width: 5px;
  height: 5px;
  background-color: #b6f500;
  border-radius: 50%;
  margin-top: 3px;
`;

const Footer = styled.div`
  margin-top: 30px;
  font-size: 15px;
  font-weight: 500;
`;

const ProgressBarWrapper = styled.div`
  margin-top: 10px;
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
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
`;

const sampleProgress = 20;

const isMedicationDay = (date: Date) => {
  return date.getDate() % 3 === 0;
};

export function CalendarView() {
  const navigate = useNavigate();
  const [value, setValue] = useState<Date | Date[] | null>(new Date());
  // activeStartDate로 달 이동 제어 (각 달의 1일로 설정)
  const [activeStartDate, setActiveStartDate] = useState<Date>(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const formatActiveMonth = (date: Date) => {
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <CalendarWrapper>
      <CalendarStyles />

      <HeaderContainer>
        <Title>내 달력</Title>

        <AddSchedule onClick={() => navigate("/drug/register")}>
          일정 추가하기
          <Plus style={{ marginLeft: "3px" }} />
        </AddSchedule>
      </HeaderContainer>

      <Calendar
        onChange={(date) => {
          // date: Date | Date[]
          setValue(date as Date | Date[] | null);
          const selected = Array.isArray(date) ? date[0] : date;
          if (selected instanceof Date) {
            setActiveStartDate(
              new Date(selected.getFullYear(), selected.getMonth(), 1)
            );
          }
        }}
        value={value as any}
        calendarType="iso8601"
        formatDay={(_locale, date) => date.getDate().toString()}
        // navigationLabel은 내부 네비게이션을 숨겼으므로 사용하지 않음
        // navigationLabel={navigationLabel}
        showNeighboringMonth={true}
        view="month"
        tileContent={({ date, view }) =>
          view === "month" && isMedicationDay(date) ? <Dot /> : null
        }
        activeStartDate={activeStartDate}
        onActiveStartDateChange={({ activeStartDate: newStart }) => {
          if (newStart instanceof Date) setActiveStartDate(newStart);
        }}
        prev2Label={null}
        next2Label={null}
      />

      <Footer>
        홍길동 님의 {formatActiveMonth(activeStartDate).split(".")[1]}월 복용률
        : {sampleProgress}%
        <ProgressBarWrapper>
          <ProgressBar $progress={sampleProgress} />
          <ProgressHandle $progress={sampleProgress} />
        </ProgressBarWrapper>
      </Footer>
    </CalendarWrapper>
  );
}
