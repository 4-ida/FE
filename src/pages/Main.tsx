//
import Nav from "../components/nav";
import TodayPill from "./modal/TodayPill";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import CalendarView from "../components/Calendar";
import Plus from "../assets/AiOutlinePlus.svg?react";
import { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import Logo from "../assets/logo.svg?react";

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
  gap: 60px;
`;

const LogoWrapper = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
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
  drugId: number;
  dailyStatus: "SCHEDULED" | "CANCELED";
  completionStatus: "NONE" | "TAKEN" | "MISSED";
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
  completionStatus: "NONE" | "TAKEN" | "MISSED";
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

//복용률
interface ProgressData {
  userName: string;
  progressPercent: number;
}

export default function Main() {
  const navigate = useNavigate();
  const location = useLocation();
  const initDate = location.state?.selectedDate
    ? new Date(location.state.selectedDate)
    : new Date();

  const [selectedDate, setSelectedDate] = useState<Date | null>(initDate);

  const [activeStartDate, setActiveStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  // 월별 일정 (캘린더 Dot 표시용)
  const [monthSchedules, setMonthSchedules] = useState<SchedulesByDate>({});
  // 일별 상세 일정 (TodayPill List용)
  const [drugSchedules, setDrugSchedules] = useState<ScheduleDetail[]>([]);
  const [loadingTodayPills, setLoadingTodayPills] = useState(false);

  const [progressData, setProgressData] = useState<ProgressData>({
    userName: "홍길동", // 초기값은 '홍길동' 또는 빈 문자열
    progressPercent: 0,
  });

  const fetchProgress = async (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    try {
      const response = await axiosInstance.get(`/api/v1/dashboard/progress`, {
        params: { year, month },
      });

      const data = response.data;

      setProgressData({
        userName: data.userName || "사용자",
        progressPercent: data.progressPercent || 0,
      });
    } catch (error) {
      console.error("❌ 복용률 조회 실패:", error);
      // 실패 시 기본값 유지
    }
  };

  useEffect(() => {
    if (activeStartDate) {
      const year = activeStartDate.getFullYear();
      const month = activeStartDate.getMonth() + 1;
      fetchMonthSchedules(year, month);

      // ⭐️ 복용률 조회 추가
      fetchProgress(activeStartDate);
    }
  }, [activeStartDate]);

  const formatDateForUrl = (date: Date | null): string => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // status 전달
  // Main.js 파일 내부에 추가

  // 1. 복약 예정/취소 상태 변경 핸들러 (dailyStatus/plan 변경)
  const handleStatusChange = async (
    id: string,
    newDailyStatus: "SCHEDULED" | "CANCELED"
  ) => {
    const scheduleId = Number(id);
    if (isNaN(scheduleId)) return;

    // 현재 상태에서 해당 일정 찾기
    const scheduleToUpdate = drugSchedules.find(
      (s) => s.scheduleId === scheduleId
    );

    if (!scheduleToUpdate) {
      console.error("업데이트할 일정을 찾을 수 없습니다.");
      return;
    }

    try {
      await axiosInstance.put(`/api/v1/main/calendar/schedules/${scheduleId}`, {
        drugId: scheduleToUpdate.drugId,
        name: scheduleToUpdate.name,
        dose: scheduleToUpdate.dose,
        date: scheduleToUpdate.date,
        time: scheduleToUpdate.time,
        memo: scheduleToUpdate.memo,
        plan: newDailyStatus, // ⭐️ 변경된 값 (SCHEDULED -> CANCELED)
        status:
          newDailyStatus === "CANCELED" ? "NONE" : scheduleToUpdate.status, // 취소 시 status도 NONE으로 변경
        alarm: scheduleToUpdate.alarm,
      });

      // 상태 변경 후 목록 재조회 (UI 갱신)
      if (selectedDate) {
        fetchTodayPills(selectedDate);
      }
    } catch (error) {
      console.error("❌ DailyStatus 변경 실패:", error);
      alert("일정 상태 변경에 실패했습니다.");
    }
  };

  // 2. 복약 완료/미섭취 상태 변경 핸들러 (completionStatus/status 변경)
  const handleCompletionChange = async (
    id: string,
    newCompletionStatus: "TAKEN" | "MISSED" | "NONE"
  ) => {
    const scheduleId = Number(id);
    if (isNaN(scheduleId)) {
      console.error("❌ [복용 완료 상태 변경] 유효하지 않은 scheduleId:", id);
      alert("일정 ID가 유효하지 않습니다.");
      return;
    }

    console.log("🔄 [복용 완료 상태 변경] 시작");
    console.log("📤 전달받은 id:", id);
    console.log("📤 변환된 scheduleId:", scheduleId);
    console.log("📤 newCompletionStatus:", newCompletionStatus);

    try {
      // 1. 먼저 현재 일정 정보를 단일 조회 API로 조회 (항상 최신 정보 사용)
      console.log("📖 [복용 완료 상태 변경] 일정 단일 조회 API 호출 시작");
      console.log("📤 요청 URL: GET /api/v1/main/calendar/schedules/${scheduleId}");
      console.log("📤 scheduleId:", scheduleId);
      
      const detailRes = await axiosInstance.get(`/api/v1/main/calendar/schedules/${scheduleId}`);
      
      console.log("✅ [복용 완료 상태 변경] 일정 단일 조회 API 호출 성공");
      console.log("📥 응답 상태:", detailRes.status);
      console.log("📥 응답 데이터:", JSON.stringify(detailRes.data, null, 2));
      
      // 응답 데이터 구조 확인 (drugchange.tsx와 동일하게 처리: res.data.data)
      const scheduleDetail = detailRes.data?.data || detailRes.data;
      
      if (!scheduleDetail) {
        console.error("❌ [복용 완료 상태 변경] 일정 정보 조회 실패 - 응답 데이터가 없습니다.");
        console.error("📥 detailRes.data:", detailRes.data);
        throw new Error("일정 정보를 조회할 수 없습니다.");
      }
      
      console.log("📥 scheduleDetail:", JSON.stringify(scheduleDetail, null, 2));
      console.log("📥 scheduleDetail.drugId:", scheduleDetail.drugId);
      console.log("📥 scheduleDetail.name:", scheduleDetail.name);
      console.log("📥 scheduleDetail.dose:", scheduleDetail.dose);
      console.log("📥 scheduleDetail.date:", scheduleDetail.date);
      console.log("📥 scheduleDetail.time:", scheduleDetail.time);
      console.log("📥 scheduleDetail.memo:", scheduleDetail.memo);
      console.log("📥 scheduleDetail.plan:", scheduleDetail.plan);
      console.log("📥 scheduleDetail.status:", scheduleDetail.status);
      console.log("📥 scheduleDetail.alarm:", scheduleDetail.alarm);
      
      // 2. 조회한 정보로 상태 업데이트
      console.log("📤 [복용 완료 상태 변경] 상태 업데이트 API 호출 시작");
      console.log("📤 요청 URL: PUT /api/v1/main/calendar/schedules/${scheduleId}");
      
      const updateRequestBody = {
        drugId: scheduleDetail.drugId,
        name: scheduleDetail.name,
        dose: scheduleDetail.dose || "1정",
        date: scheduleDetail.date,
        time: scheduleDetail.time,
        memo: scheduleDetail.memo || "",
        plan: scheduleDetail.plan,
        status: newCompletionStatus, // ⭐️ 변경된 값 (TAKEN, MISSED, NONE)
        alarm: scheduleDetail.alarm || { enabled: false },
      };
      
      console.log("📤 요청 본문:", JSON.stringify(updateRequestBody, null, 2));
      
      await axiosInstance.put(`/api/v1/main/calendar/schedules/${scheduleId}`, updateRequestBody);

      console.log("✅ [복용 완료 상태 변경] 성공");

      // 3. 복용 완료(TAKEN) 상태로 변경된 경우 금지 타이머 페이지로 이동
      if (newCompletionStatus === "TAKEN") {
        console.log("📤 [복용 완료] 금지 타이머 페이지로 이동");
        console.log("📤 전달할 scheduleId:", scheduleId);
        console.log("📤 scheduleId 타입:", typeof scheduleId);
        console.log("📤 scheduleId 값:", scheduleId);
        console.log("📤 scheduleId를 Number로 변환:", Number(scheduleId));
        console.log("📤 scheduleId가 NaN인가?", isNaN(Number(scheduleId)));
        console.log("📤 이동할 URL:", `/timer/no?scheduleId=${scheduleId}`);
        console.log("📤 location.state로 전달할 객체:", { scheduleId: scheduleId });
        console.log("📤 URL 파라미터로 전달:", `scheduleId=${scheduleId}`);
        
        // scheduleId 유효성 검사
        if (!scheduleId || isNaN(Number(scheduleId))) {
          console.error("❌ [복용 완료] scheduleId가 유효하지 않습니다:", scheduleId);
          alert(`일정 ID가 유효하지 않습니다. (scheduleId: ${scheduleId})`);
          return;
        }
        
        // 상태 변경 후 목록 재조회는 백그라운드에서 실행 (navigate 후에도 실행 가능)
        if (selectedDate) {
          fetchTodayPills(selectedDate).catch((err) => {
            console.error("❌ 목록 재조회 실패 (백그라운드):", err);
          });
        }

        // 금지 타이머 페이지로 이동하면서 scheduleId 전달 (URL 파라미터와 state 둘 다 사용)
        // URL 파라미터를 사용하면 페이지 새로고침 시에도 유지됨
        const navigationUrl = `/timer/no?scheduleId=${scheduleId}`;
        const navigationState = { scheduleId: scheduleId };
        
        console.log("📤 최종 이동 URL:", navigationUrl);
        console.log("📤 최종 이동 state:", navigationState);
        console.log("📤 이동 직전 확인 - scheduleId:", scheduleId, "타입:", typeof scheduleId);
        
        // navigate를 바로 호출 (setTimeout 제거하여 즉시 이동)
        navigate(navigationUrl, {
          state: navigationState,
          replace: false,
        });
        
        console.log("✅ [복용 완료] navigate 호출 완료");
      } else {
        // TAKEN이 아닌 경우에만 목록 재조회
        if (selectedDate) {
          fetchTodayPills(selectedDate);
        }
      }
    } catch (error: any) {
      console.error("❌ [복용 완료 상태 변경] API 조회/업데이트 실패:", error);
      if (error.response) {
        console.error("📥 에러 상태 코드:", error.response.status);
        console.error("📥 에러 응답 데이터:", JSON.stringify(error.response.data, null, 2));
      } else if (error.request) {
        console.error("📥 요청은 전송되었지만 응답을 받지 못했습니다:", error.request);
      } else {
        console.error("📥 에러 메시지:", error.message);
      }
      
      // 에러가 발생해도 scheduleId는 유효하므로 금지 타이머 페이지로 이동 시도
      if (newCompletionStatus === "TAKEN") {
        console.warn("⚠️ API 호출 실패했지만, scheduleId로 금지 타이머 페이지로 이동합니다.");
        navigate(`/timer/no?scheduleId=${scheduleId}`, {
          replace: false,
        });
      } else {
        alert("복용 완료/미섭취 상태 변경에 실패했습니다.");
      }
    }
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

      if (responseData && responseData.schedulesByDate) {
        const schedulesField = responseData.schedulesByDate;

        // ⭐️ 핵심 수정: 응답이 문자열(JSON)인지 확인하고 파싱
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

  useEffect(() => {
    if (location.state?.scheduleUpdated && selectedDate) {
      // 1. 전체 일정 다시 로드
      fetchTodayPills(selectedDate);

      // 2. 캘린더 점을 위해 월별 일정도 다시 로드 (필요하다면)
      const year = activeStartDate.getFullYear();
      const month = activeStartDate.getMonth() + 1;
      fetchMonthSchedules(year, month);

      // 3. flag 초기화 (무한 호출 방지)
      navigate(location.pathname, {
        replace: true,
        state: { selectedDate: formatDateForUrl(selectedDate) },
      });
    }
  }, [location.state, selectedDate, navigate, activeStartDate]);

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
          ? "TAKEN"
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
  const handleGoToLogin = () => navigate("/login");

  // 로그인 상태 확인
  const isLoggedIn = !!localStorage.getItem("accessToken");

  return (
    <Container>
      <Nav />
      <Header>
        <LogoWrapper onClick={() => navigate("/")}>
          <Logo />
        </LogoWrapper>
        <Ht onClick={isLoggedIn ? handleGoToMyPage : handleGoToLogin}>
          {isLoggedIn ? "마이페이지" : "로그인"}
        </Ht>
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
          onStatusChange={handleStatusChange} // ⭐️ 함수 연결
          onCompletionChange={handleCompletionChange}
        />
      )}

      <Footer>
        {progressData.userName} 님의{" "}
        {formatMonth(activeStartDate).split(".")[1]}월 복용률 :{" "}
        {progressData.progressPercent}%
        <ProgressBarWrapper>
          <ProgressBar $progress={progressData.progressPercent} />
          <ProgressHandle $progress={progressData.progressPercent} />
        </ProgressBarWrapper>
      </Footer>
    </Container>
  );
}
