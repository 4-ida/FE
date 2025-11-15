import styled from "styled-components";
import RingTimer from "../components/timer";
import C from "../assets/LiaExchangeAltSolid.svg?react";
import { useLocation, useNavigate } from "react-router-dom";
import Nav from "../components/nav";
import axiosInstance from "../axiosInstance";
import { useEffect, useState, useCallback } from "react";

// 금지 타이머 응답 인터페이스 (약 먹는 동안 카페인/알코올 금지 시간)
interface ForbiddenTimerResponse {
  type: "caffeine" | "alcohol";
  adjustmentFactor: number;
  remainingSec: number;
  expectedSafeTime: string;
}

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

export default function NoTimer() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = () => {
    navigate("/timer/left");
  };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const maxRemainingFromState = location.state?.maxRemainingSeconds || 0;

  const [maxRemainingSeconds, setMaxRemainingSeconds] = useState<number>(
    maxRemainingFromState && !isNaN(maxRemainingFromState) && maxRemainingFromState >= 0 ? maxRemainingFromState : 0
  );

  // 금지 타이머 조회 (약 먹는 동안 카페인/알코올 금지 시간)
  const fetchTimers = useCallback(async () => {
    setLoading(true);
    setError(null);
    let maxTime = 0;
    let timerActive = false;
    let caffeineForbidden = 0;
    let alcoholForbidden = 0;

    try {
      console.log("🔄 [금지 타이머 조회] 시작 - 약 복용 중 카페인/알코올 금지 시간");
      console.log("📥 scheduleId 체크 없이 API 호출 (전체 조회)");

      // 1. 카페인 금지 타이머 조회 (scheduleId 파라미터 없이 호출)
      console.log("📖 [1단계] 카페인 금지 타이머 조회 시작");
      const caffeineRequestUrl = `/api/v1/main/medication/timer/caffeine`;
      console.log("📤 요청 URL:", caffeineRequestUrl);
      console.log("📤 요청 파라미터: 없음 (전체 조회)");

      try {
        const caffeineRes = await axiosInstance.get<ForbiddenTimerResponse>(
          caffeineRequestUrl
        );

        if (caffeineRes.status === 200) {
          const timerData = caffeineRes.data;
          caffeineForbidden = timerData.remainingSec || 0;
          console.log("✅ [1단계] 카페인 금지 타이머 조회 성공");
          console.log("📥 응답 상태:", caffeineRes.status);
          console.log("📥 응답 데이터:", JSON.stringify(timerData, null, 2));
          console.log("📥 금지 시간:", caffeineForbidden, "초", `(${formatTimeExternal(caffeineForbidden)})`);
          console.log("📥 복약 가능 예상 시각:", timerData.expectedSafeTime);
          console.log("📥 조정 계수:", timerData.adjustmentFactor);

          if (caffeineForbidden > 0) {
            maxTime = Math.max(maxTime, caffeineForbidden);
            timerActive = true;
          }
        }
      } catch (err: any) {
        // 204 No Content는 정상 (타이머 없음)
        if (err.response?.status === 204) {
          console.log("⏭️ [1단계] 카페인 금지 타이머 없음 (204 No Content)");
          console.log("📥 타이머를 0초로 설정");
          // 204는 정상이므로 계속 진행
        } else if (err.response?.status === 500) {
          // 500 에러 상세 로깅
          console.error("🚨 [1단계] 카페인 금지 타이머 조회 실패 - 500 Internal Server Error");
          console.error("📥 에러 상태 코드: 500");
          console.error("📥 에러 응답 헤더:", JSON.stringify(err.response.headers, null, 2));
          console.error("📥 에러 응답 데이터:", JSON.stringify(err.response.data, null, 2));
          console.error("📥 요청 URL:", caffeineRequestUrl);
          console.error("📥 전체 에러 객체:", err);
          
          // 500 에러는 서버 내부 오류이므로, 알코올 타이머는 계속 조회하도록 함
          console.warn("⚠️ 카페인 금지 타이머 조회 실패했지만, 알코올 타이머는 계속 조회합니다.");
        } else {
          console.error("❌ [1단계] 카페인 금지 타이머 조회 실패");
          if (err.response) {
            const status = err.response.status;
            console.error("📥 에러 상태 코드:", status);
            console.error("📥 에러 응답 헤더:", JSON.stringify(err.response.headers, null, 2));
            console.error("📥 에러 응답 데이터:", JSON.stringify(err.response.data, null, 2));
            console.error("📥 요청 URL:", caffeineRequestUrl);
          } else if (err.request) {
            console.error("📥 요청은 전송되었지만 응답을 받지 못했습니다:", err.request);
          } else {
            console.error("📥 에러 메시지:", err.message);
          }
          console.error("📥 전체 에러 객체:", err);
        }
      }

      // 2. 알코올 금지 타이머 조회 (scheduleId 파라미터 없이 호출)
      console.log("📖 [2단계] 알코올 금지 타이머 조회 시작");
      const alcoholRequestUrl = `/api/v1/main/medication/timer/alcohol`;
      console.log("📤 요청 URL:", alcoholRequestUrl);
      console.log("📤 요청 파라미터: 없음 (전체 조회)");

      try {
        const alcoholRes = await axiosInstance.get<ForbiddenTimerResponse>(
          alcoholRequestUrl
        );

        if (alcoholRes.status === 200) {
          const timerData = alcoholRes.data;
          alcoholForbidden = timerData.remainingSec || 0;
          console.log("✅ [2단계] 알코올 금지 타이머 조회 성공");
          console.log("📥 응답 상태:", alcoholRes.status);
          console.log("📥 응답 데이터:", JSON.stringify(timerData, null, 2));
          console.log("📥 금지 시간:", alcoholForbidden, "초", `(${formatTimeExternal(alcoholForbidden)})`);
          console.log("📥 복약 가능 예상 시각:", timerData.expectedSafeTime);
          console.log("📥 조정 계수:", timerData.adjustmentFactor);

          if (alcoholForbidden > 0) {
            maxTime = Math.max(maxTime, alcoholForbidden);
            timerActive = true;
          }
        }
      } catch (err: any) {
        // 204 No Content는 정상 (타이머 없음)
        if (err.response?.status === 204) {
          console.log("⏭️ [2단계] 알코올 금지 타이머 없음 (204 No Content)");
          console.log("📥 타이머를 0초로 설정");
          // 204는 정상이므로 계속 진행
        } else if (err.response?.status === 500) {
          // 500 에러 상세 로깅
          console.error("🚨 [2단계] 알코올 금지 타이머 조회 실패 - 500 Internal Server Error");
          console.error("📥 에러 상태 코드: 500");
          console.error("📥 에러 응답 헤더:", JSON.stringify(err.response.headers, null, 2));
          console.error("📥 에러 응답 데이터:", JSON.stringify(err.response.data, null, 2));
          console.error("📥 요청 URL:", alcoholRequestUrl);
          console.error("📥 전체 에러 객체:", err);
          
          // 500 에러는 서버 내부 오류이므로, 카페인 타이머가 성공했으면 계속 진행
          console.warn("⚠️ 알코올 금지 타이머 조회 실패했지만, 카페인 타이머 결과는 유지합니다.");
        } else {
          console.error("❌ [2단계] 알코올 금지 타이머 조회 실패");
          if (err.response) {
            const status = err.response.status;
            console.error("📥 에러 상태 코드:", status);
            console.error("📥 에러 응답 헤더:", JSON.stringify(err.response.headers, null, 2));
            console.error("📥 에러 응답 데이터:", JSON.stringify(err.response.data, null, 2));
            console.error("📥 요청 URL:", alcoholRequestUrl);
          } else if (err.request) {
            console.error("📥 요청은 전송되었지만 응답을 받지 못했습니다:", err.request);
          } else {
            console.error("📥 에러 메시지:", err.message);
          }
          console.error("📥 전체 에러 객체:", err);
        }
      }

      // 3. 최종 결과
      console.log("📊 [최종 결과]");
      console.log("📥 카페인 금지 시간:", caffeineForbidden > 0 ? `${caffeineForbidden}초 (${formatTimeExternal(caffeineForbidden)})` : "없음 (0초)");
      console.log("📥 알코올 금지 시간:", alcoholForbidden > 0 ? `${alcoholForbidden}초 (${formatTimeExternal(alcoholForbidden)})` : "없음 (0초)");
      console.log("📥 최대 금지 시간:", maxTime > 0 ? `${maxTime}초 (${formatTimeExternal(maxTime)})` : "0초");
      console.log("📥 타이머 활성화:", timerActive ? "✅ 활성화됨" : "❌ 비활성화 (타이머 없음)");

      // 타이머가 없으면 (둘 다 204 또는 둘 다 실패) 에러 메시지 표시
      if (!timerActive && maxTime === 0) {
        console.log("📥 타이머가 없음 - 0초로 설정");
        setError(null); // 에러 메시지 없이 0초로 표시
      } else {
        // 타이머가 있으면 에러 메시지 제거
        setError(null);
      }

      console.log("📥 설정할 최대 금지 시간:", maxTime, "초");
      setMaxRemainingSeconds(maxTime);
    } catch (err: any) {
      // 예상치 못한 에러 (네트워크 에러 등)
      console.error("❌ [금지 타이머 조회] 전체 실패 - 예상치 못한 에러");
      if (err.response) {
        const status = err.response.status;
        console.error("📥 에러 상태 코드:", status);
        console.error("📥 에러 응답 헤더:", JSON.stringify(err.response.headers, null, 2));
        console.error("📥 에러 응답 데이터:", JSON.stringify(err.response.data, null, 2));
      } else if (err.request) {
        console.error("📥 요청은 전송되었지만 응답을 받지 못했습니다:", err.request);
      } else {
        console.error("📥 에러 메시지:", err.message);
      }
      console.error("📥 전체 에러 객체:", err);
      
      // 네트워크 에러 등 예상치 못한 에러인 경우에만 에러 메시지 표시
      if (!err.response || err.response.status >= 500) {
        setError(
          "타이머를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요."
        );
      }
    } finally {
      setLoading(false);
    }
  }, []); // scheduleId 체크 없이 항상 API 호출

  useEffect(() => {
    console.log("🔄 [NoTimer] useEffect 실행 - scheduleId 체크 없이 전체 조회");
    
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
  }, [fetchTimers]); // fetchTimers만 의존성으로 사용

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
