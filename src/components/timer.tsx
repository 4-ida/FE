import { useEffect, useState, useRef } from "react";

interface RingTimerProps {
  totalSeconds?: number;
  onComplete?: () => void;
}

// const RingTimer = ({ totalSeconds = 300 }) => {
//   const [remaining, setRemaining] = useState(totalSeconds);
const RingTimer = ({ totalSeconds = 300, onComplete }: RingTimerProps) => {
  const [remaining, setRemaining] = useState<number>(totalSeconds);
  // const intervalRef = useRef<number | null>(null);

  const containerSize = 333;
  const radius = 150;
  const stroke = 18;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  // useEffect(() => {
  //   setRemaining(totalSeconds);
  // }, [totalSeconds]);

  // useEffect(() => {
  //   if (remaining === 0) return;

  //   const timer = setInterval(() => {
  //     setRemaining((prev) => (prev > 0 ? prev - 1 : 0));
  //   }, 1000);

  //   return () => clearInterval(timer);
  // }, [remaining]);
  useEffect(() => {
    setRemaining(totalSeconds);
  }, [totalSeconds]);

  /** 1초마다 줄어드는 타이머 */
  useEffect(() => {
    if (remaining <= 0) {
      onComplete?.();
      return;
    }

    const intervalId = setInterval(() => {
      setRemaining((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [remaining, onComplete]);

  // interval이 아직 없으면 생성
  // if (intervalRef.current == null) {
  //   intervalRef.current = window.setInterval(() => {
  //     setRemaining((prev) => {
  //       if (prev <= 1) {
  //         // 마지막 업데이트 시 interval 정리
  //         if (intervalRef.current) {
  //           window.clearInterval(intervalRef.current);
  //           intervalRef.current = null;
  //         }
  //         return 0;
  //       }
  //       return prev - 1;
  //     });
  //   }, 1000);
  // }

  const progressRatio = remaining / totalSeconds;

  // const strokeDashoffset = circumference * progressRatio;
  const strokeDashoffset = circumference * (1 - progressRatio);

  const formatTime = (seconds: number) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  // 남은 시간에 따라 표시 단위를 계산하는 함수 (0초일 때 "Time's up!")
  // const getDisplayUnit = (seconds: number, initialSeconds: number) => {
  //   if (seconds <= 0) {
  //     return "Time's up!";
  //   }
  //   // 초기 설정 시간을 가장 적절한 단위(시간/분/초)로 표시
  //   const initialMinutes = initialSeconds / 60;
  //   const initialHours = initialSeconds / 3600;

  //   if (initialHours >= 1 && initialSeconds % 3600 === 0) {
  //     const h = Math.round(initialHours);
  //     return `${h} hour${h > 1 ? "s" : ""}`;
  //   }
  //   if (initialMinutes >= 1 && initialSeconds % 60 === 0) {
  //     const m = Math.round(initialMinutes);
  //     return `${m} minute${m > 1 ? "s" : ""}`;
  //   }
  //   return `${initialSeconds} seconds`;
  // };
  const getDisplayUnit = (initialSeconds: number) => {
    const minutes = initialSeconds / 60;
    const hours = initialSeconds / 3600;

    if (hours >= 1 && initialSeconds % 3600 === 0) {
      const h = Math.round(hours);
      return `${h} hour${h > 1 ? "s" : ""}`;
    }
    if (minutes >= 1 && initialSeconds % 60 === 0) {
      const m = Math.round(minutes);
      return `${m} minute${m > 1 ? "s" : ""}`;
    }
    return `${initialSeconds} seconds`;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        width: containerSize,
        height: containerSize,
      }}
    >
      {/* SVG 링 */}
      <svg height={radius * 2} width={radius * 2}>
        {/* 배경 원 (회색) */}
        <circle
          stroke="#e6e6e6"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* 진행 원 (형광색) */}
        <circle
          stroke="#B6F500"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          style={{
            transition: "stroke-dashoffset 1s linear",
            transform: "rotate(-90deg)", // 12시 방향에서 시작
            transformOrigin: "50% 50%",
          }}
        />
      </svg>

      {/* 중앙 텍스트 */}
      <div
        style={{
          position: "absolute",
          textAlign: "center",
          fontFamily: "Pretendard",
        }}
      >
        <div style={{ fontSize: "48px", fontWeight: "500" }}>
          {formatTime(remaining)}
        </div>
        <div style={{ fontSize: "24px", color: "#888" }}>
          {/* totalSeconds를 표시 */}
          {getDisplayUnit(totalSeconds)}
        </div>
      </div>
    </div>
  );
};

export default RingTimer;
