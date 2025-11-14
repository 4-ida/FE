//
import Nav from "../components/nav";
import TodayPill from "./modal/TodayPill";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import CalendarView from "../components/Calendar";
import Plus from "../assets/AiOutlinePlus.svg?react";
import { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";

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

// ⭐️ 타입 정의 (API 및 UI에서 사용)
export interface DrugSchedule {
  id: string;
  pillName: string;
  count: string;
  memo: string;
  time: string;
  registrationDate: string;
  dailyStatus: "SCHEDULED" | "CANCELED";
  completionStatus: "NONE" | "COMPLETED" | "MISSED";
}

export interface DrugScheduleBase {
  id: string;
  pillName: string;
  time: string;
}
export interface SchedulesByDate {
  [date: string]: DrugScheduleBase[]; // 예: "2025-11-01": [...]
}

export interface TodayPillItem {
  id: string;
  time: string;
  pillName: string;
  dailyStatus: "SCHEDULED" | "CANCELED";
  completionStatus: "NONE" | "COMPLETED" | "MISSED";
  registrationDate: string;
}

interface ScheduleDetail {
  scheduleId: number;
  drugId: number;
  name: string;
  dose: string;
  date: string;
  time: string;
  memo: string;
  plan: "SCHEDULED" | "CANCELED"; // dailyStatus
  status: "TAKEN" | "MISSED" | "NONE"; // completionStatus
  alarm: {
    enabled: boolean;
  };
}

export default function Main() {
  const navigate = useNavigate();

  const location = useLocation();
  const initDate = location.state?.selectedDate
    ? new Date(location.state.selectedDate)
    : new Date();

  const [selectedDate, setSelectedDate] = useState<Date | null>(initDate);

  // const [selectedDate, setSelectedDate] = useState<Date | null>(
  //   location.state?.pill
  //     ? new Date(location.state.pill.registrationDate)
  //     : new Date()
  // );
  const [activeStartDate, setActiveStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  // 월별 일정 (캘린더 Dot 표시용)
  const [monthSchedules, setMonthSchedules] = useState<SchedulesByDate>({});
  // 일별 상세 일정 (TodayPill List용)
  const [drugSchedules, setDrugSchedules] = useState<ScheduleDetail[]>([]);
  const [loadingTodayPills, setLoadingTodayPills] = useState(false);

  const formatDateForUrl = (date: Date | null): string => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 일정 상세 조회 (일별)
  const fetchTodayPills = async (date: Date) => {
    setLoadingTodayPills(true);
    const dateParam = formatDateForUrl(date);

    try {
      const response = await axiosInstance.get(
        `/api/v1/main/calendar/schedules`,
        {
          params: { date: dateParam }, // 쿼리 파라미터로 날짜 전달
        }
      );

      const schedules: ScheduleDetail[] = response.data?.data?.schedules || [];

      // time (HH:MM) 기준으로 정렬
      schedules.sort((a, b) => {
        return a.time.localeCompare(b.time);
      });

      setDrugSchedules(schedules);
    } catch (error) {
      console.error(`❌ ${dateParam} 상세 일정 조회 실패:`, error);
      setDrugSchedules([]);
    } finally {
      setLoadingTodayPills(false);
    }
  };

  // 월별 조회 (캘린더용)
  const fetchMonthSchedules = async (year: number, month: number) => {
    try {
      const response = await axiosInstance.get(
        `/api/v1/main/calendar/schedules/month`,
        {
          params: { year, month },
        }
      );

      const responseData = response.data?.data;
      let schedulesData: SchedulesByDate = {};

      if (responseData) {
        const schedulesField = responseData.schedulesByDate;

        if (typeof schedulesField === "string") {
          try {
            schedulesData = JSON.parse(schedulesField);
          } catch (e) {
            console.error(
              "❌ schedulesByDate 필드 파싱 실패 (JSON.parse 에러):",
              e
            );
          }
        } else if (
          typeof schedulesField === "object" &&
          schedulesField !== null
        ) {
          schedulesData = schedulesField;
        }
      }

      setMonthSchedules(schedulesData);
    } catch (error) {
      console.error("❌ 월별 일정 조회 실패:", error);
      setMonthSchedules({});
    }
  };

  // ⭐️ 수정/삭제 후 메인 돌아왔을 때 TodayPill 다시 불러오기
  // useEffect(() => {
  //   if (location.state?.scheduleUpdated && selectedDate) {
  //     fetchTodayPills(selectedDate);
  //     // 한번 실행되면 초기화 (뒤로가기 시 무한 호출 방지)
  //     navigate(".", { replace: true, state: {} });
  //   }
  // }, [location.state, selectedDate, navigate]);

  // // ⭐️ [useEffect] 일별 상세 일정 (selectedDate 변경 시)
  // useEffect(() => {
  //   if (selectedDate) {
  //     fetchTodayPills(selectedDate);
  //   }
  // }, [selectedDate]);

  // useEffect(() => {
  //   if (location.state?.scheduleUpdated) {
  //     const updated: ScheduleDetail = location.state.updatedSchedule;
  //     if (updated) {
  //       setDrugSchedules((prev) => {
  //         const filtered = prev.filter(
  //           (s) => s.scheduleId !== updated.scheduleId
  //         );
  //         return [...filtered, updated].sort((a, b) =>
  //           a.time.localeCompare(b.time)
  //         );
  //       });
  //     }
  //     // flag 초기화
  //     navigate(".", { replace: true, state: {} });
  //   }
  // }, [location.state, navigate]);

  useEffect(() => {
    if (location.state?.scheduleUpdated) {
      const updated: ScheduleDetail = location.state.updatedSchedule; // ⭐️ updatedSchedule은 어디에서 왔나요?
      if (updated) {
        setDrugSchedules((prev) => {
          const filtered = prev.filter(
            (s) => s.scheduleId !== updated.scheduleId
          );
          return [...filtered, updated].sort((a, b) =>
            a.time.localeCompare(b.time)
          );
        });
      }
      // flag 초기화
      navigate(".", { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  // ⭐️ [useEffect] 월별 캘린더 일정 (activeStartDate 변경 시)
  useEffect(() => {
    if (activeStartDate) {
      const year = activeStartDate.getFullYear();
      const month = activeStartDate.getMonth() + 1;
      fetchMonthSchedules(year, month);
    }
  }, [activeStartDate]);

  useEffect(() => {
    if (selectedDate) {
      fetchTodayPills(selectedDate);
    }
  }, [selectedDate]);

  // API 응답 데이터를 TodayPill Item 형식으로 변환
  const formatSchedulesForTodayPill = (
    schedules: ScheduleDetail[]
  ): TodayPillItem[] => {
    return schedules.map((schedule) => ({
      id: String(schedule.scheduleId),
      time: schedule.time.substring(0, 5), // HH:MM
      pillName: schedule.name,
      dailyStatus: schedule.plan, // 'SCHEDULED' | 'CANCELED'
      completionStatus:
        schedule.status === "TAKEN"
          ? "COMPLETED"
          : schedule.status === "MISSED"
          ? "MISSED"
          : "NONE",
      registrationDate: schedule.date,
      count: schedule.dose, // 추가
      memo: schedule.memo, // 추가
      drugId: schedule.drugId,
    }));
  };

  const todayPill = formatSchedulesForTodayPill(drugSchedules);

  const onDeletePill = (id: string) => {
    // 클라이언트 상태에서만 삭제 (API 연동 후에는 fetchTodayPills를 다시 호출하여 UI 업데이트)
    const schedules = drugSchedules.filter(
      (sched) => String(sched.scheduleId) !== id
    );
    setDrugSchedules(schedules);
  };

  const formatMonth = (d: Date) =>
    `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}`;

  const handleGoToMyPage = () => navigate("/mypage");

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
        monthSchedules={monthSchedules}
      />

      {/* ⭐️ 오늘의 약 Box (로딩 상태 처리) */}
      {loadingTodayPills ? (
        <p style={{ marginTop: "20px", color: "#666" }}>
          일정을 불러오는 중입니다...
        </p>
      ) : (
        <TodayPill
          date={selectedDate}
          pills={todayPill}
          onDelete={onDeletePill}
          onModify={() => {}} // ⚠️ API 연동 필요
          onStatusChange={() => {}} // ⚠️ API 연동 필요
          onCompletionChange={() => {}} // ⚠️ API 연동 필요
        />
      )}

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
