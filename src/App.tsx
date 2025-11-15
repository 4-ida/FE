import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import GlobalStyles from "./styles/GlobalStyles";
import styled from "styled-components";
import TimeAlarm from "./pages/modal/eatalarm";
import { useState, useEffect } from "react";
import axiosInstance from "./axiosInstance";
import { useCallback, useRef } from "react";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const AppWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  position: relative;
  min-height: 100vh; /* 뷰포트 높이만큼 최소 높이 설정 */
  overflow: hidden;
`;

interface ScheduleTime {
  scheduleId: number;
  name: string;
  time: string;
  alarmEnabled: boolean;
}

const GlobalReminderManager: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // 알림이 뜰 스케줄 목록 (오늘 기준)
  const [todaySchedules, setTodaySchedules] = useState<ScheduleTime[]>([]);
  // 현재 띄울 모달의 정보
  const [currentReminder, setCurrentReminder] = useState<{
    pillName: string;
    time: string;
  } | null>(null);

  const todaySchedulesRef = useRef<ScheduleTime[]>([]);
  const notifiedIdsRef = useRef<Set<number>>(new Set());

  // 1. API: 오늘의 복약 일정 시간만 가져오기
  const fetchTodaySchedules = useCallback(async () => {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    try {
      // Main.js에서 사용한 API를 재사용하여 오늘 일정을 가져옵니다.
      const response = await axiosInstance.get(
        "/api/v1/main/calendar/schedules",
        {
          params: { date: today },
        }
      );

      const schedules: ScheduleTime[] =
        response.data?.data?.schedules
          .filter((s: any) => s.alarm?.enabled)
          .map((s: any) => ({
            scheduleId: s.scheduleId,
            name: s.name,
            time: s.time.substring(0, 5),
            alarmEnabled: s.alarm?.enabled,
          })) || [];

      setTodaySchedules(schedules);
    } catch (error) {
      console.error("오늘 일정 가져오기 실패:", error);
      setTodaySchedules([]);
    }
  }, []);

  // useEffect(() => {
  //   // 테스트용: 페이지 로드 후 1초 뒤 모달 띄우기
  //   const timer = setTimeout(() => {
  //     setCurrentReminder({
  //       pillName: "타이레놀정500mg",
  //       time: "08:30",
  //     });
  //   }, 1000);

  //   return () => clearTimeout(timer);
  // }, []);

  useEffect(() => {
    todaySchedulesRef.current = todaySchedules;
  }, [todaySchedules]);

  useEffect(() => {
    const fetchSchedules = async () => {
      await fetchTodaySchedules();
    };
    fetchSchedules();

    const interval = setInterval(() => {
      const now = new Date();
      const nowMinutes = now.getHours() * 60 + now.getMinutes();

      todaySchedulesRef.current.forEach((schedule) => {
        const [h, m] = schedule.time.split(":").map(Number);
        const scheduleMinutes = h * 60 + m;
        // 시간
        const reminderTimeMinutes = scheduleMinutes + 1;

        if (
          schedule.alarmEnabled &&
          !notifiedIdsRef.current.has(schedule.scheduleId) &&
          nowMinutes === reminderTimeMinutes
        ) {
          setCurrentReminder({ pillName: schedule.name, time: schedule.time });
          notifiedIdsRef.current.add(schedule.scheduleId);
        }
      });

      // 매 시간 새로고침
      if (now.getMinutes() === 0) fetchTodaySchedules();
    }, 60000);

    return () => clearInterval(interval);
  }, [fetchTodaySchedules]);

  useEffect(() => {
    todaySchedulesRef.current = todaySchedules;
  }, [todaySchedules]);

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setCurrentReminder(null);
  };

  return (
    <>
      {children}

      {/* ⭐️ 알림 모달 */}
      {currentReminder && (
        <TimeAlarm
          isOpen={!!currentReminder}
          onClose={handleCloseModal}
          pillName={currentReminder.pillName}
          time={currentReminder.time}
        />
      )}
    </>
  );
};

const Home = lazy(() => import("./pages/Main"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const DrugRegistration = lazy(() => import("./pages/DrugRegistration"));
const DrugInformation = lazy(() => import("./pages/DrugInformation"));
const Search = lazy(() => import("./pages/Search"));
const Bookmark = lazy(() => import("./pages/Bookmark"));
const Mypage = lazy(() => import("./pages/Mypage"));
const NoTimer = lazy(() => import("./pages/NoTimer"));
const LeftTimer = lazy(() => import("./pages/LeftTimer"));
const WhatDrink = lazy(() => import("./pages/WhatDrink"));
const DrinkCaffaine = lazy(() => import("./pages/DrinkCaffaine"));
const DrinkAlcohol = lazy(() => import("./pages/DrinkAlcohol"));
const Nav = lazy(() => import("./components/nav"));
const DrugChange = lazy(() => import("./pages/drugchange"));
const Setting = lazy(() => import("./setting"));
const OAuth2Callback = lazy(() => import("./pages/OAuth2Callback"));

function App() {
  return (
    <Container>
      <AppWrapper>
        <GlobalReminderManager>
          <Router>
            <GlobalStyles />
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/main" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/oauth2/callback" element={<OAuth2Callback />} />
                <Route path="/setting" element={<Setting />} />
                <Route path="/drug/register" element={<DrugRegistration />} />
                <Route
                  path="/drug/information/:drugId"
                  element={<DrugInformation />}
                />
                <Route path="/search" element={<Search />} />
                <Route path="/drug/bookmark" element={<Bookmark />} />
                <Route path="/mypage" element={<Mypage />} />
                <Route path="/timer/no" element={<NoTimer />} />
                <Route path="/timer/left" element={<LeftTimer />} />
                <Route path="/whatdrink" element={<WhatDrink />} />
                <Route path="/drink/caffaine" element={<DrinkCaffaine />} />
                <Route path="/drink/alcohol" element={<DrinkAlcohol />} />
                <Route path="/nav" element={<Nav />} />
                <Route path="/drug/change" element={<DrugChange />} />
                <Route path="/drug/change/:id" element={<DrugChange />} />
              </Routes>
            </Suspense>
          </Router>
        </GlobalReminderManager>
      </AppWrapper>
    </Container>
  );
}

export default App;
