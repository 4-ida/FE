import styled from "styled-components";
import RingTimer from "../components/timer";
import C from "../assets/LiaExchangeAltSolid.svg?react";
import { useLocation, useNavigate } from "react-router-dom";
import Nav from "../components/nav";
import axiosInstance from "../axiosInstance";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
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

const Ht = styled.div`
  font-family: "Pretendard";
  font-weight: 500;
  font-size: 15px;
  cursor: pointer;
`;

const Title = styled.div`
  width: 100%;
  font-weight: 500;
  font-size: 20px;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 0 15px;
`;

const Change = styled(C)`
  cursor: pointer;
`;

const ErrorMessage = styled.div`
  color: #ff4d4f;
  margin-top: 50px;
  font-size: 16px;
  text-align: center;
  font-family: "Pretendard";
`;

const TimerText = styled.div`
  margin-top: 20px;
  font-size: 18px;
  font-weight: 600;
  color: #4a4a4a;
  font-family: "Pretendard";
`;

interface TimerResponse {
  type: "caffeine" | "alcohol";
  adjustmentFactor: number;
  remainingSec: number;
  expectedSafeTime: string;
}

// 초 -> 시분초 변황
const formatTimeExternal = (totalSeconds: number): string => {
  if (totalSeconds <= 0) return "0초";
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours}시간`);
  if (minutes > 0) parts.push(`${minutes}분`);
  if (seconds > 0 || (hours === 0 && minutes === 0)) parts.push(`${seconds}초`);

  return parts.join(" ");
};

export default function NoTimer() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = () => {
    navigate("/timer/left");
  };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ⭐️ 전달받은 scheduleId를 사용하거나, 없을 경우 임시 ID(101)를 사용
  const stateScheduleId = location.state?.scheduleId;
  const maxRemainingFromState = location.state?.maxRemainingSeconds || 0;

  const [maxRemainingSeconds, setMaxRemainingSeconds] = useState(
    maxRemainingFromState
  );
  const TEMP_SCHEDULE_ID = stateScheduleId;

  // fetchTimers는 TEMP_SCHEDULE_ID에 의존합니다.
  const fetchTimers = useCallback(async () => {
    setLoading(true);
    setError(null);
    let maxTime = 0;
    let timerActive = false;

    const fetchTimer = async (type: "caffeine" | "alcohol") => {
      try {
        const endpoint = `/api/v1/main/medication/timer/${type}`;
        const res = await axiosInstance.get<TimerResponse>(endpoint, {
          params: { scheduleId: TEMP_SCHEDULE_ID }, // ✅ 전달받은 ID 사용
        });

        //     const remainingSec = res.data?.remainingSec || 0;
        //     maxTime = Math.max(maxTime, remainingSec);
        //     if (remainingSec > 0) {
        //       timerActive = true;
        //     }
        //   } catch (err) {
        //     if (axios.isAxiosError(err) && err.response?.status === 204) {
        //       // 204 No Content: 복용 기록이 없는 정상 응답으로 처리
        //     } else {
        //       console.error(`💥 ${type} 타이머 조회 실패:`, err);
        //     }
        //   }
        // };
        const remainingSec = res.data?.remainingSec ?? 0;
        if (typeof remainingSec === "number") {
          maxTime = Math.max(maxTime, remainingSec);
          if (remainingSec > 0) timerActive = true;
        }
      } catch (err: any) {
        // 204: 정상 (데이터 없음)
        if (axios.isAxiosError(err) && err.response?.status === 204) {
          // noop
        } else {
          console.error(`💥 ${type} 타이머 조회 실패:`, err);
          // 네트워크/서버 에러일 땐 사용자에게 알림 가능
          setError(
            "타이머를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요."
          );
        }
      }
    };

    await fetchTimer("caffeine");
    await fetchTimer("alcohol");

    if (!timerActive && maxTime === 0) {
      setError(
        "현재 적용되는 금지 타이머가 없습니다. 약을 복용하면 활성화됩니다."
      );
    }

    setMaxRemainingSeconds(maxTime);
    setLoading(false);
  }, [TEMP_SCHEDULE_ID]); // ⭐️ 의존성 배열에 TEMP_SCHEDULE_ID 추가

  // useEffect(() => {
  //   // 타이머 페이지에 진입할 때 (혹은 ID가 변경될 때) 타이머 정보 새로고침
  //   fetchTimers();
  // }, [fetchTimers]);
  useEffect(() => {
    fetchTimers();
    const POLL_INTERVAL_MS = 15000; // 15초
    const pollId = window.setInterval(() => {
      fetchTimers();
    }, POLL_INTERVAL_MS);

    return () => {
      window.clearInterval(pollId);
    };
  }, [fetchTimers]);

  return (
    <Container>
      <Nav />
      <Header>
        <Logo />
        <Ht onClick={() => navigate("/mypage")}>마이페이지</Ht>
      </Header>
      {loading ? (
        <TimerText style={{ marginTop: "100px" }}>
          타이머 정보를 불러오는 중...
        </TimerText>
      ) : error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : (
        <>
          <Title>
            금지 타이머
            <Change onClick={handleChange} />
          </Title>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "100px",
            }}
          >
            <RingTimer totalSeconds={maxRemainingSeconds} />
          </div>
          <TimerText>
            {/* 남은 금지 시간: **{formatTimeExternal(maxRemainingSeconds)}** */}
            남은 금지 시간:{" "}
            <strong>{formatTimeExternal(maxRemainingSeconds)}</strong>
          </TimerText>
        </>
      )}
    </Container>
  );
}
