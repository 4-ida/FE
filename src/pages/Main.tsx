// import Nav from "../components/nav";
// import TodayPill from "./modal/TodayPill";
// import styled from "styled-components";
// import { useNavigate } from "react-router-dom";
// import CalendarView from "../components/Calendar";
// import Plus from "../assets/AiOutlinePlus.svg?react";
// import { useState, useEffect } from "react";

// const Container = styled.div`
//   display: flex;
//   width: 393px;
//   min-height: 852px;
//   background-color: #fff;
//   flex-direction: column;
//   align-items: center;
//   color: #333;
//   padding-bottom: 200px;
//   box-sizing: border-box;
// `;

// const Header = styled.div`
//   display: flex;
//   width: 100%;
//   height: 60px;
//   align-items: center;
//   padding: 0 15px;
//   box-sizing: border-box;
//   justify-content: flex-end;
// `;

// const Ht = styled.div`
//   font-family: "Pretendard";
//   font-weight: 500;
//   font-size: 15px;
//   cursor: pointer;
// `;

// const Title = styled.div`
//   font-weight: 500;
//   font-size: 20px;
// `;

// const AddSchedule = styled.div`
//   display: flex;
//   align-items: center;
//   font-size: 15px;
//   color: #333;
//   cursor: pointer;
// `;

// const HeaderContainer = styled.div`
//   width: 100%;
//   padding: 0 15px;
//   margin-bottom: 20px;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   box-sizing: border-box;
// `;

// const Footer = styled.div`
//   width: 100%;
//   margin-top: 30px;
//   padding: 0 15px;
//   font-size: 16px;
//   font-weight: 500;
//   box-sizing: border-box;
// `;

// const ProgressBarWrapper = styled.div`
//   margin-top: 12px;
//   width: 100%;
//   height: 10px;
//   background-color: #e0e0e0;
//   border-radius: 5px;
//   position: relative;
// `;

// const ProgressBar = styled.div<{ $progress: number }>`
//   height: 100%;
//   width: ${({ $progress }) => $progress}%;
//   background-color: #b6f500;
//   border-radius: 5px;
// `;

// const ProgressHandle = styled.div<{ $progress: number }>`
//   position: absolute;
//   top: 50%;
//   left: ${({ $progress }) => $progress}%;
//   transform: translate(-50%, -50%);
//   width: 18px;
//   height: 18px;
//   background-color: #b6f500;
//   border: 3px solid white;
//   border-radius: 50%;
// `;

// // const sampleProgress = 20;
// const dayMapping: { [key: number]: string } = {
//   0: "일",
//   1: "월",
//   2: "화",
//   3: "수",
//   4: "목",
//   5: "금",
//   6: "토",
// };

// // ⭐️ 등록된 스케줄 타입 정의
// interface DrugSchedule {
//   pillName: string;
//   count: string;
//   memo: string;
//   time: string; // "오후 6시 00분"
//   registrationDate: string;
// }

// interface TodayPillItem {
//   id: string;
//   time: string;
//   pillName: string;
//   dailyStatus: "SCHEDULED" | "CANCELED";
//   completionStatus: "NONE" | "COMPLETED" | "MISSED";
// }

// export default function Main() {
//   const navigate = useNavigate();
//   const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
//   const [periodRange, setPeriodRange] = useState<{
//     start: Date;
//     end: Date;
//   } | null>(null);
//   const [activeStartDate, setActiveStartDate] = useState(
//     new Date(new Date().getFullYear(), new Date().getMonth(), 1)
//   );

//   const formatDateForUrl = (date: Date | null): string => {
//     if (!date) return "";
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const day = String(date.getDate()).padStart(2, "0");
//     return `${year}-${month}-${day}`;
//   };

//   const [drugSchedules, setDrugSchedules] = useState<DrugSchedule[]>([]); // ⭐️ 스케줄 상태 추가

//   useEffect(() => {
//     // ⭐️ 컴포넌트 마운트 시 저장된 스케줄을 불러옵니다.
//     const savedSchedulesString = localStorage.getItem("drugSchedules");
//     if (savedSchedulesString) {
//       try {
//         const schedules: DrugSchedule[] = JSON.parse(savedSchedulesString);
//         setDrugSchedules(schedules);
//       } catch (e) {
//         console.error("Failed to parse drugSchedules:", e);
//         setDrugSchedules([]);
//       }
//     }
//   }, []); // 마운트 시 한 번만 실행

//   // ⭐️ 선택된 날짜의 약 복용 스케줄을 반환하는 함수
//   const getTodayPills = (date: Date | null): TodayPillItem[] => {
//     if (!date || drugSchedules.length === 0) return [];
//     const todayDayInKorean = dayMapping[date.getDay()];

//     const timeToMinutes = (timeString: string): number => {
//       if (!timeString) return 0;
//       const ampm = timeString.substring(0, 2);
//       const hourMatch = timeString.match(/(\d+)시/);
//       const minuteMatch = timeString.match(/(\d+)분/);
//       let hour = hourMatch ? parseInt(hourMatch[1], 10) : 0;
//       const minute = minuteMatch ? parseInt(minuteMatch[1], 10) : 0;

//       if (ampm === "오후" && hour !== 12) hour += 12;
//       if (ampm === "오전" && hour === 12) hour = 0;

//       return hour * 60 + minute;
//     };

//     const format24HourTime = (timeString: string): string => {
//       const ampm = timeString.substring(0, 2);
//       const hourMatch = timeString.match(/(\d+)시/);
//       const minuteMatch = timeString.match(/(\d+)분/);
//       let hour = hourMatch ? parseInt(hourMatch[1], 10) : 0;
//       const minute = minuteMatch ? parseInt(minuteMatch[1], 10) : 0;

//       if (ampm === "오후" && hour !== 12) hour += 12;
//       if (ampm === "오전" && hour === 12) hour = 0;

//       return `${String(hour).padStart(2, "0")}:${String(minute).padStart(
//         2,
//         "0"
//       )}`;
//     };

//     return drugSchedules
//       .filter((schedule) => {
//         if (
//           schedule.registrationDate ===
//           date.getFullYear() +
//             "-" +
//             String(date.getMonth() + 1) +
//             "-" +
//             String(date.getDate())
//         ) {
//           return true;
//         } else {
//           return false;
//         }
//       })
//       .sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time))
//       .map((schedule, index) => ({
//         id: `${schedule.pillName}-${index}`,
//         time: format24HourTime(schedule.time),
//         pillName: schedule.pillName,
//         dailyStatus: "SCHEDULED",
//         completionStatus: "NONE",
//         memo: schedule.memo,
//         count: schedule.count,
//       }));
//   };

//   const formatMonth = (d: Date) =>
//     `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}`;

//   const handleGoToMyPage = () => navigate("/mypage");

//   // ⭐️ 오늘의 약 목록을 업데이트된 함수로 가져옵니다.
//   const todayPill = getTodayPills(selectedDate);

//   // 임시 진행률 (로직은 따로 구현하지 않습니다)
//   const sampleProgress = 20;

//   return (
//     <Container>
//       <Nav />
//       <Header>
//         <Ht onClick={handleGoToMyPage}>마이페이지</Ht>
//       </Header>
//       <HeaderContainer>
//         <Title>내 달력</Title>
//         <AddSchedule
//           onClick={() => {
//             // ⭐️ 날짜를 쿼리 파라미터로 추가하여 이동
//             const dateParam = formatDateForUrl(selectedDate);
//             navigate(`/drug/register?date=${dateParam}`);
//           }}
//         >
//           일정 추가하기 <Plus style={{ marginLeft: "3px" }} />
//         </AddSchedule>
//       </HeaderContainer>

//       <CalendarView
//         selectRange={false}
//         value={selectedDate}
//         onChange={(date) => {
//           if (date instanceof Date) setSelectedDate(date);
//         }}
//         activeStartDate={activeStartDate}
//         onActiveStartDateChange={setActiveStartDate}
//       />

//       {/* 오늘의 약 Box */}
//       <TodayPill
//         date={selectedDate}
//         pills={todayPill}
//         onDelete={() => {}}
//         onModify={() => {}}
//         onStatusChange={() => {}}
//         onCompletionChange={() => {}}
//       />

//       <Footer>
//         홍길동 님의 {formatMonth(activeStartDate).split(".")[1]}월 복용률 :{" "}
//         {sampleProgress}%
//         <ProgressBarWrapper>
//           <ProgressBar $progress={sampleProgress} />
//           <ProgressHandle $progress={sampleProgress} />
//         </ProgressBarWrapper>
//       </Footer>
//     </Container>
//   );
// }

import Nav from "../components/nav";
import TodayPill from "./modal/TodayPill";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import CalendarView from "../components/Calendar";
import Plus from "../assets/AiOutlinePlus.svg?react";
import { useState, useEffect } from "react";

const Container = styled.div`
  display: flex;
  width: 393px;
  min-height: 852px;
  background-color: #fff;
  flex-direction: column;
  align-items: center;
  color: #333;
  padding-bottom: 200px;
  box-sizing: border-box;
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

// const sampleProgress = 20;
const dayMapping: { [key: number]: string } = {
  0: "일",
  1: "월",
  2: "화",
  3: "수",
  4: "목",
  5: "금",
  6: "토",
};

// ⭐️ 등록된 스케줄 타입 정의
export interface DrugSchedule {
  id: string;
  pillName: string;
  count: string;
  memo: string;
  time: string; // "오후 6시 00분"
  registrationDate: string;
  dailyStatus: "SCHEDULED" | "CANCELED";
  completionStatus: "NONE" | "COMPLETED" | "MISSED";
}

export interface TodayPillItem {
  id: string;
  time: string;
  pillName: string;
  dailyStatus: "SCHEDULED" | "CANCELED";
  completionStatus: "NONE" | "COMPLETED" | "MISSED";
  registrationDate: string;
}

export default function Main() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [periodRange, setPeriodRange] = useState<{
    start: Date;
    end: Date;
  } | null>(null);
  const [activeStartDate, setActiveStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );

  const formatDateForUrl = (date: Date | null): string => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [drugSchedules, setDrugSchedules] = useState<DrugSchedule[]>([]); // ⭐️ 스케줄 상태 추가

  useEffect(() => {
    // ⭐️ 컴포넌트 마운트 시 저장된 스케줄을 불러옵니다.
    const savedSchedulesString = localStorage.getItem("drugSchedules");
    if (savedSchedulesString) {
      try {
        const schedules: DrugSchedule[] = JSON.parse(savedSchedulesString);
        setDrugSchedules(schedules);
      } catch (e) {
        console.error("Failed to parse drugSchedules:", e);
        setDrugSchedules([]);
      }
    }
  }, []); // 마운트 시 한 번만 실행

  // ⭐️ 선택된 날짜의 약 복용 스케줄을 반환하는 함수
  const getTodayPills = (date: Date | null): TodayPillItem[] => {
    if (!date || drugSchedules.length === 0) return [];
    const todayDayInKorean = dayMapping[date.getDay()];

    const timeToMinutes = (timeString: string): number => {
      if (!timeString) return 0;
      const ampm = timeString.substring(0, 2);
      const hourMatch = timeString.match(/(\d+)시/);
      const minuteMatch = timeString.match(/(\d+)분/);
      let hour = hourMatch ? parseInt(hourMatch[1], 10) : 0;
      const minute = minuteMatch ? parseInt(minuteMatch[1], 10) : 0;

      if (ampm === "오후" && hour !== 12) hour += 12;
      if (ampm === "오전" && hour === 12) hour = 0;

      return hour * 60 + minute;
    };

    const format24HourTime = (timeString: string): string => {
      const ampm = timeString.substring(0, 2);
      const hourMatch = timeString.match(/(\d+)시/);
      const minuteMatch = timeString.match(/(\d+)분/);
      let hour = hourMatch ? parseInt(hourMatch[1], 10) : 0;
      const minute = minuteMatch ? parseInt(minuteMatch[1], 10) : 0;

      if (ampm === "오후" && hour !== 12) hour += 12;
      if (ampm === "오전" && hour === 12) hour = 0;

      return `${String(hour).padStart(2, "0")}:${String(minute).padStart(
        2,
        "0"
      )}`;
    };

    return drugSchedules
      .filter((schedule) => {
        if (
          schedule.registrationDate ===
          date.getFullYear() +
            "-" +
            String(date.getMonth() + 1) +
            "-" +
            String(date.getDate())
        ) {
          return true;
        } else {
          return false;
        }
      })
      .sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time))
      .map((schedule, index) => ({
        id: `${schedule.pillName}-${index}`,
        time: format24HourTime(schedule.time),
        pillName: schedule.pillName,
        dailyStatus: schedule.dailyStatus,
        completionStatus: schedule.completionStatus,
        memo: schedule.memo,
        count: schedule.count,
        registrationDate: schedule.registrationDate,
      }));
  };

  const formatMonth = (d: Date) =>
    `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}`;

  const handleGoToMyPage = () => navigate("/mypage");

  // ⭐️ 오늘의 약 목록을 업데이트된 함수로 가져옵니다.
  const todayPill = getTodayPills(selectedDate);

  // 임시 진행률 (로직은 따로 구현하지 않습니다)
  const sampleProgress = 20;

  return (
    <Container>
      <Nav />
      <Header>
        <Ht onClick={handleGoToMyPage}>마이페이지</Ht>
      </Header>
      <HeaderContainer>
        <Title>내 달력</Title>
        <AddSchedule
          onClick={() => {
            // ⭐️ 날짜를 쿼리 파라미터로 추가하여 이동
            const dateParam = formatDateForUrl(selectedDate);
            navigate(`/drug/register?date=${dateParam}`);
          }}
        >
          일정 추가하기 <Plus style={{ marginLeft: "3px" }} />
        </AddSchedule>
      </HeaderContainer>

      <CalendarView
        selectRange={false}
        value={selectedDate}
        onChange={(date) => {
          if (date instanceof Date) setSelectedDate(date);
        }}
        activeStartDate={activeStartDate}
        onActiveStartDateChange={setActiveStartDate}
      />

      {/* 오늘의 약 Box */}
      <TodayPill
        date={selectedDate}
        pills={todayPill}
        onDelete={() => {}}
        onModify={() => {}}
        onStatusChange={() => {}}
        onCompletionChange={() => {}}
      />

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
