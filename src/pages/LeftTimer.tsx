import styled from "styled-components";
import RingTimer from "../components/timer";
import C from "../assets/LiaExchangeAltSolid.svg?react";
import { useNavigate } from "react-router-dom";
import Nav from "../components/nav";
import axiosInstance from "../axiosInstance";
import { useEffect, useState, useCallback } from "react";

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

// 초 -> 시분초 변환
const formatTimeExternal = (totalSeconds: number): string => {
  if (totalSeconds <= 0) return "00초";
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours}시간`);
  if (minutes > 0) parts.push(`${minutes}분`);
  if (seconds > 0 || (hours === 0 && minutes === 0)) parts.push(`${seconds}초`);

  return parts.join(" ");
};

// 잔존 타이머 응답 인터페이스
interface ResidualTimerResponse {
  intakeType: "CAFFEINE" | "ALCOHOL";
  currentAmount: number;
  threshold: number;
  halfLifeOrRate: number;
  hoursPassed: number;
  adjustmentFactor: number;
  expectedSafeTime: string;
  remainingSec: number;
  isSafe: boolean;
  assumptions?: Record<string, any>;
}

interface ActiveTimerItem {
  intakeId: number;
  intakeType: "CAFFEINE" | "ALCOHOL";
  name: string;
  amount: number;
  abv?: number;
  intakeAt: string;
  currentAmount?: number;
  remainingSec?: number;
  expectedSafeTime?: string;
  isSafe?: boolean;
}

interface ActiveTimerListResponse {
  caffeineTimer: ActiveTimerItem | null;
  alcoholTimer: ActiveTimerItem | null;
}

export default function LeftTimer() {
  const navigate = useNavigate();
  const handleChange = () => {
    navigate("/timer/no");
  };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [maxRemainingSeconds, setMaxRemainingSeconds] = useState(0);

  // 잔존 타이머 조회 (카페인/알코올을 마신 경우 몇 시간 동안 약을 먹으면 안되는지)
  const fetchTimers = useCallback(async () => {
    setLoading(true);
    setError(null);
    let maxTime = 0;
    let timerActive = false;
    let caffeineRemaining = 0;
    let alcoholRemaining = 0;

    try {
      console.log("🔄 [잔존 타이머 조회] 시작 - 카페인/알코올 섭취 후 약 복용 금지 시간");

      // 1. 활성 타이머 리스트 조회
      console.log("📖 [1단계] 활성 타이머 리스트 조회");
      const activeRes = await axiosInstance.get<ActiveTimerListResponse>(
        `/api/v1/intakespage/intakes/active-timers`
      );

      if (activeRes.status === 200) {
        console.log("✅ [1단계] 활성 타이머 리스트 조회 성공");
        const activeTimers = activeRes.data;
        console.log("📥 카페인 타이머:", activeTimers.caffeineTimer ? `있음 (ID: ${activeTimers.caffeineTimer.intakeId})` : "없음");
        console.log("📥 알코올 타이머:", activeTimers.alcoholTimer ? `있음 (ID: ${activeTimers.alcoholTimer.intakeId})` : "없음");

        // 활성 타이머 리스트에 이미 remainingSec가 있는지 확인
        if (activeTimers.caffeineTimer?.remainingSec) {
          caffeineRemaining = activeTimers.caffeineTimer.remainingSec;
          console.log("📥 [활성 타이머에서] 카페인 잔존 시간:", caffeineRemaining, "초", `(${formatTimeExternal(caffeineRemaining)})`);
          if (caffeineRemaining > 0) {
            maxTime = Math.max(maxTime, caffeineRemaining);
            timerActive = true;
          }
        } else if (activeTimers.caffeineTimer) {
          // 2. 카페인 잔존 타이머 조회
          try {
            const intakeId = activeTimers.caffeineTimer.intakeId;
            console.log("📖 [2단계] 카페인 잔존 타이머 조회");
            console.log("📤 intakeId:", intakeId);

            const caffeineRes = await axiosInstance.get<ResidualTimerResponse>(
              `/api/v1/intakespage/intakes/caffeine/${intakeId}/timer`
            );

            if (caffeineRes.status === 200) {
              const timerData = caffeineRes.data;
              caffeineRemaining = timerData.remainingSec || 0;
              console.log("✅ [2단계] 카페인 잔존 타이머 조회 성공");
              console.log("📥 응답 데이터:", JSON.stringify(timerData, null, 2));
              console.log("📥 잔존 시간:", caffeineRemaining, "초", `(${formatTimeExternal(caffeineRemaining)})`);
              console.log("📥 복약 가능 여부:", timerData.isSafe ? "✅ 가능" : "❌ 불가능");
              console.log("📥 복약 가능 예상 시각:", timerData.expectedSafeTime);
              console.log("📥 현재 잔존량:", timerData.currentAmount, "mg");

              if (caffeineRemaining > 0) {
                maxTime = Math.max(maxTime, caffeineRemaining);
                timerActive = true;
              }
            }
          } catch (err: any) {
            console.error("❌ [2단계] 카페인 잔존 타이머 조회 실패");
            if (err.response) {
              const status = err.response.status;
              console.error("📥 에러 상태 코드:", status);
              console.error("📥 에러 응답:", JSON.stringify(err.response.data, null, 2));
            } else {
              console.error("📥 에러 메시지:", err.message);
            }
          }
        } else {
          console.log("⏭️ [2단계] 카페인 타이머 없음 - 건너뜀");
        }

        // 활성 타이머 리스트에 이미 remainingSec가 있는지 확인
        if (activeTimers.alcoholTimer?.remainingSec) {
          alcoholRemaining = activeTimers.alcoholTimer.remainingSec;
          console.log("📥 [활성 타이머에서] 알코올 잔존 시간:", alcoholRemaining, "초", `(${formatTimeExternal(alcoholRemaining)})`);
          if (alcoholRemaining > 0) {
            maxTime = Math.max(maxTime, alcoholRemaining);
            timerActive = true;
          }
        } else if (activeTimers.alcoholTimer) {
          // 3. 알코올 잔존 타이머 조회
          try {
            const intakeId = activeTimers.alcoholTimer.intakeId;
            console.log("📖 [3단계] 알코올 잔존 타이머 조회");
            console.log("📤 intakeId:", intakeId);

            const alcoholRes = await axiosInstance.get<ResidualTimerResponse>(
              `/api/v1/intakespage/intakes/alcohol/${intakeId}/timer`
            );

            if (alcoholRes.status === 200) {
              const timerData = alcoholRes.data;
              alcoholRemaining = timerData.remainingSec || 0;
              console.log("✅ [3단계] 알코올 잔존 타이머 조회 성공");
              console.log("📥 응답 데이터:", JSON.stringify(timerData, null, 2));
              console.log("📥 잔존 시간:", alcoholRemaining, "초", `(${formatTimeExternal(alcoholRemaining)})`);
              console.log("📥 복약 가능 여부:", timerData.isSafe ? "✅ 가능" : "❌ 불가능");
              console.log("📥 복약 가능 예상 시각:", timerData.expectedSafeTime);
              console.log("📥 현재 잔존량:", timerData.currentAmount, "%BAC");

              if (alcoholRemaining > 0) {
                maxTime = Math.max(maxTime, alcoholRemaining);
                timerActive = true;
              }
            }
          } catch (err: any) {
            console.error("❌ [3단계] 알코올 잔존 타이머 조회 실패");
            if (err.response) {
              const status = err.response.status;
              console.error("📥 에러 상태 코드:", status);
              console.error("📥 에러 응답:", JSON.stringify(err.response.data, null, 2));
            } else {
              console.error("📥 에러 메시지:", err.message);
            }
          }
        } else {
          console.log("⏭️ [3단계] 알코올 타이머 없음 - 건너뜀");
        }

        // 4. 최종 결과
        console.log("📊 [최종 결과]");
        console.log("📥 카페인 잔존 시간:", caffeineRemaining > 0 ? `${caffeineRemaining}초 (${formatTimeExternal(caffeineRemaining)})` : "없음");
        console.log("📥 알코올 잔존 시간:", alcoholRemaining > 0 ? `${alcoholRemaining}초 (${formatTimeExternal(alcoholRemaining)})` : "없음");
        console.log("📥 최대 잔존 시간:", maxTime > 0 ? `${maxTime}초 (${formatTimeExternal(maxTime)})` : "없음");
        console.log("📥 타이머 활성화:", timerActive ? "✅ 활성화됨" : "❌ 비활성화");

        if (!timerActive && maxTime === 0) {
          setError(
            "현재 적용되는 잔존 타이머가 없습니다. 카페인 또는 알코올을 섭취하면 활성화됩니다."
          );
        } else {
          setError(null);
        }

        console.log("📥 설정할 최대 잔존 시간:", maxTime, "초");
        setMaxRemainingSeconds(maxTime);
      } else {
        console.error("❌ [1단계] 활성 타이머 리스트 조회 실패");
        console.error("📥 응답 상태:", activeRes.status);
        setError("타이머를 불러오는 중 문제가 발생했습니다.");
      }
    } catch (err: any) {
      console.error("❌ [잔존 타이머 조회] 전체 실패");
      if (err.response) {
        const status = err.response.status;
        console.error("📥 에러 상태 코드:", status);
        console.error("📥 에러 응답:", JSON.stringify(err.response.data, null, 2));
      } else {
        console.error("📥 에러 메시지:", err.message);
      }
      setError(
        "타이머를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // 초기 로드
    fetchTimers();
    
    // 주기적으로 갱신 (60초마다 - 재렌더링 방지)
    const POLL_INTERVAL_MS = 60000; // 60초
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
            잔존 타이머
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
            남은 잔존 시간:{" "}
            <strong>{formatTimeExternal(maxRemainingSeconds)}</strong>
          </TimerText>
        </>
      )}
    </Container>
  );
}
