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
  monthSchedules?: SchedulesByDate;
}

interface DrugScheduleBase {
  id: string;
  pillName: string;
  time: string;
}

interface SchedulesByDate {
  [date: string]: DrugScheduleBase[]; // 예: "2025-11-01": [...]
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

// ⭐️ renderDot 함수를 제대로 정의하고 로직을 함수 내부에 포함시킵니다.
function renderDot(
  { date, view }: { date: Date; view: string },
  isForModal?: boolean,
  schedulesByDate: SchedulesByDate = {}
) {
  if (view !== "month" || isForModal) return null;

  const savedSchedulesString = localStorage.getItem("drugSchedules");
  if (!savedSchedulesString) return null;

  // interface DotSchedule {
  //   registrationDate: string; // YYYY-MM-DD 형식의 날짜 문자열
  // }

  // let schedules: DotSchedule[] = [];
  // try {
  //   schedules = JSON.parse(savedSchedulesString);
  // } catch (e) {
  //   console.error("Failed to parse drugSchedules:", e);
  //   return null;
  // }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const dateString = `${year}-${month}-${day}`;

  const schedulesForDate = schedulesByDate[dateString];
  const shouldShowDot = schedulesForDate && schedulesForDate.length > 0;

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
  selectRange = false, // 단일 날짜 선택으로 기본값 변경
  isForModal,
  activeStartDate,
  onActiveStartDateChange,
  monthSchedules = {},
}: CalendarProps) {
  const [internalValue, setInternalValue] = useState<Value>(value ?? null);
  const [scheduleUpdateKey, setScheduleUpdateKey] = useState(0); // ⭐️ 스케줄 업데이트 키 추가

  // 컴포넌트 마운트 시/새로운 일정이 등록되었을 때 localStorage를 다시 읽도록 강제
  // (Main.tsx에서 drugSchedules가 업데이트되면 CalendarView를 다시 렌더링하도록 처리 필요)

  const formatMonth = (d: Date) =>
    `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}`;

  const handleChange = (nextValue: Value) => {
    setInternalValue(nextValue);
    onChange?.(nextValue);
    // ⭐️ 일정을 등록하고 돌아올 때 강제 업데이트
    setScheduleUpdateKey((prev) => prev + 1);
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
    <CalendarWrapper key={scheduleUpdateKey}>
      {" "}
      {/* ⭐️ key를 사용하여 강제 업데이트 유도 */}
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
        // ⭐️ renderDot 함수 호출 수정
        tileContent={({ date, view }) =>
          renderDot({ date, view }, isForModal, monthSchedules)
        }
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
