import { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Right from "../assets/arrow-right.svg?react";
import Left from "../assets/arrow-left.svg?react";

// ✅ props 타입 정의 추가
type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface CalendarProps {
  onChange?: (value: Value) => void;
  value?: Value;
  isForModal?: boolean;
  selectRange?: boolean;
  activeStartDate?: Date;
  onActiveStartDateChange?: (date: Date) => void;
}

const CalendarStyles = createGlobalStyle`
  /* 스타일 동일 */
  .react-calendar {
    border: none !important;
    font-family: 'Pretendard', sans-serif !important;
    width: 100% !important;
    background: none !important;
    margin: 0 auto;
    box-sizing: border-box;
  }

  .react-calendar__navigation {
    display: none !important;
  }

  .react-calendar__month-view__weekdays,
  .react-calendar__month-view__weekdays__weekday,
  .react-calendar__month-view__weekdays__weekday abbr {
    text-align: center !important;
    font-size: 15px !important;
    font-weight: 500 !important;
    margin-bottom: 1px;
    text-decoration: none !important;
  }

  .react-calendar__tile.red-day abbr {
    color: #D80000 !important;
  }

  .react-calendar__tile.saturday-day abbr {
    color: #333 !important;
  }

  .react-calendar__tile {
    height: 60px !important;
    padding: 6px 0 !important;
    display: flex !important;
    justify-content: flex-start !important;
    align-items: center !important;
    background: none !important;
    border: none !important;
    font-size: 15px !important;
    font-weight: 400 !important;
    box-sizing: border-box;
    flex-direction: column;
  }

  .react-calendar__month-view__days__day--neighboringMonth {
    opacity: 0.4 !important;
  }

  .react-calendar__tile--now {
    background-color: #ebebeb !important;
    border-radius: 5px !important;
  }

  .react-calendar__tile--active {
    background: #b6f500 !important;
    color: #333 !important;
    border-radius: 5px !important;
  }

  /* 모달용 스타일 */
  .react-calendar.modal-style .react-calendar__tile--now {
    background: none !important;
    border-radius: 5px;
  }

  .react-calendar.modal-style .react-calendar__tile {
    height: 51px !important;
    align-items: center !important;
    justify-content: center !important;
  }

  .react-calendar.modal-style .react-calendar__tile--active {
    border-radius: 50% !important;
  }


 /* ✅ 범위 전체 배경 */
.react-calendar.modal-style .react-calendar__tile--range,
.react-calendar.modal-style .react-calendar__tile--rangeStart,
.react-calendar.modal-style .react-calendar__tile--rangeEnd {
  background: #ebebeb !important; /* 범위 배경색 */
  color: #333 !important;
  border-radius: 0 !important;
}

.react-calendar.modal-style .react-calendar__tile--rangeStart {
  background: #b6f500 !important;
  border-radius: 50% !important;
}

.react-calendar.modal-style .react-calendar__tile--rangeEnd {
  background: #b6f500 !important;
  border-radius: 50% !important;
}

`;

const CalendarWrapper = styled.div`
  width: 100%;
  padding-top: 12px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

const MonthNavigation = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  font-size: 20px;
  font-weight: 500;
`;

const NavArrow = styled.button`
  cursor: pointer;
  margin: 0 20px;
  background: none;
  border: none;
  padding: 0;
`;

const isHoliday = (date: Date) =>
  date.getFullYear() === 2025 &&
  date.getMonth() === 11 &&
  date.getDate() === 25;

const getTileClass = ({ date, view }: { date: Date; view: string }) => {
  if (view !== "month") return "";
  const day = date.getDay();
  if (isHoliday(date) || day === 0) return "red-day";
  if (day === 6) return "saturday-day";
  return "";
};

const dayMapping: { [key: number]: string } = {
  0: "일",
  1: "월",
  2: "화",
  3: "수",
  4: "목",
  5: "금",
  6: "토",
};

// function renderDot(date: Date, isForModal?: boolean) {
//   if (isForModal) return null; // 모달이면 점 표시 안함

//   // ✅ 단일 기간/요일 대신 통합 스케줄 배열을 불러옵니다.
//   const savedSchedulesString = localStorage.getItem("drugSchedules");
//   if (!savedSchedulesString) return null;

//   let schedules;
//   try {
//     schedules = JSON.parse(savedSchedulesString);
//   } catch (e) {
//     console.error("Failed to parse drugSchedules:", e);
//     return null;
//   }

//   // 현재 날짜의 요일을 한글로 가져옵니다. (0: 일, 1: 월, ..., 6: 토)
//   const currentDayInKorean = dayMapping[date.getDay()];

//   // ✅ 모든 스케줄을 순회하며 하나라도 조건을 만족하는지 확인합니다.
//   const shouldShowDot = schedules.some(
//     (schedule: { days: string; start: string; end: string }) => {
//       // 1. 기간 조건 확인
//       const startDate = new Date(schedule.start);
//       const endDate = new Date(schedule.end);
//       const isInPeriod = date >= startDate && date <= endDate;

//       if (!isInPeriod) return false;

//       // 2. 요일 조건 확인
//       const scheduledDays = schedule.days.split(",").map((day) => day.trim());
//       const isScheduledDay = scheduledDays.includes(currentDayInKorean);

//       return isScheduledDay;
//     }
//   );

//   // ✅ 하나라도 조건을 만족하면 점 표시
//   if (shouldShowDot) {
//     return (
//       <div
//         style={{
//           width: "6px",
//           height: "6px",
//           borderRadius: "50%",
//           backgroundColor: "#b6f500",
//           marginTop: "20px",
//         }}
//       ></div>
//     );
//   }

//   return null;
// }

function renderDot(date: Date, isForModal?: boolean) {
  if (isForModal) return null; // 모달이면 점 표시 안함

  // ✅ 단일 기간/요일 대신 통합 스케줄 배열을 불러옵니다.
  const savedSchedulesString = localStorage.getItem("drugSchedules");
  if (!savedSchedulesString) return null;

  let schedules;
  try {
    schedules = JSON.parse(savedSchedulesString);
  } catch (e) {
    console.error("Failed to parse drugSchedules:", e);
    return null;
  }

  // 현재 날짜의 요일을 한글로 가져옵니다. (0: 일, 1: 월, ..., 6: 토)
  const currentDayInKorean = dayMapping[date.getDay()];

  // ✅ 모든 스케줄을 순회하며 하나라도 조건을 만족하는지 확인합니다.
  const shouldShowDot = schedules.some(
    (schedule: { days: string; start: string; end: string }) => {
      // 1. 기간 조건 확인
      const startDate = new Date(schedule.start);
      const endDate = new Date(schedule.end);

      // 날짜만 비교하기 위해 시간 정보 제거 (자정 기준)
      const dateOnly = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
      const startOnly = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate()
      );
      const endOnly = new Date(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate()
      );

      const isInPeriod = dateOnly >= startOnly && dateOnly <= endOnly;

      if (!isInPeriod) return false;

      // 2. 요일 조건 확인
      const scheduledDays = schedule.days.split(",").map((day) => day.trim());
      const isScheduledDay = scheduledDays.includes(currentDayInKorean);

      return isScheduledDay;
    }
  );

  // ✅ 하나라도 조건을 만족하면 점 표시
  if (shouldShowDot) {
    return (
      <div
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          backgroundColor: "#b6f500",
          marginTop: "20px",
        }}
      ></div>
    );
  }

  return null;
}

export default function CalendarView({
  onChange,
  value,
  selectRange = true,
  isForModal,
  activeStartDate,
  onActiveStartDateChange,
}: CalendarProps) {
  const [internalValue, setInternalValue] = useState<Value>(value ?? null);

  // const [activeStartDate, setActiveStartDate] = useState(
  //   new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  // );

  const formatMonth = (d: Date) =>
    `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}`;

  const handleChange = (nextValue: Value) => {
    setInternalValue(nextValue);
    onChange?.(nextValue);
  };

  const handleActiveStartDateChange = ({
    activeStartDate,
  }: {
    activeStartDate: Date | null;
    view: string;
  }) => {
    if (activeStartDate && onActiveStartDateChange) {
      onActiveStartDateChange(activeStartDate);
    }
  };

  return (
    <CalendarWrapper>
      <CalendarStyles />
      <MonthNavigation>
        <NavArrow
          onClick={() => {
            if (activeStartDate && onActiveStartDateChange) {
              onActiveStartDateChange(
                new Date(
                  activeStartDate.getFullYear(),
                  activeStartDate.getMonth() - 1,
                  1
                )
              );
            }
          }}
        >
          <Left />
        </NavArrow>
        {activeStartDate && formatMonth(activeStartDate)}
        <NavArrow
          onClick={() => {
            if (activeStartDate && onActiveStartDateChange) {
              onActiveStartDateChange(
                new Date(
                  activeStartDate.getFullYear(),
                  activeStartDate.getMonth() + 1,
                  1
                )
              );
            }
          }}
        >
          <Right />
        </NavArrow>
      </MonthNavigation>

      <Calendar
        selectRange={selectRange}
        onChange={handleChange}
        value={value ?? internalValue}
        locale="ko-KR"
        calendarType="gregory"
        tileClassName={getTileClass}
        tileContent={({ date }) => renderDot(date, isForModal)}
        formatDay={(_, date) => date.getDate().toString()}
        showNeighboringMonth={true}
        view="month"
        activeStartDate={activeStartDate}
        onActiveStartDateChange={handleActiveStartDateChange}
        prevLabel={null}
        nextLabel={null}
        prev2Label={null}
        next2Label={null}
        className={isForModal ? "modal-style" : ""}
      />
    </CalendarWrapper>
  );
}
