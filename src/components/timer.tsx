import { useEffect, useState } from "react";

// totalSeconds prop을 사용하고 기본값을 300초(5분)로 설정
const RingTimer = ({ totalSeconds = 300 }) => {
  const [remaining, setRemaining] = useState(totalSeconds);

  // === 크기 조정 (333x333) ===
  const containerSize = 333;
  const radius = 150;
  const stroke = 18;

  // SVG 뷰포트 내에서 스트로크 두께를 고려한 실제 원의 반지름
  const normalizedRadius = radius - stroke / 2;
  // 원의 둘레: 진행률 계산에 사용
  const circumference = normalizedRadius * 2 * Math.PI;

  useEffect(() => {
    if (remaining === 0) return;

    const timer = setInterval(() => {
      setRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [remaining]);

  // 진행률 (0에서 1 사이): 남은 시간 / 전체 시간
  const progressRatio = remaining / totalSeconds;

  // strokeDashoffset은 둘레(circumference) * '남은 시간 비율'로 계산합니다.
  const strokeDashoffset = circumference * progressRatio;

  const formatTime = (seconds: number) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  // 남은 시간에 따라 표시 단위를 계산하는 함수 (0초일 때 "Time's up!")
  const getDisplayUnit = (seconds: number, initialSeconds: number) => {
    if (seconds <= 0) {
      return "Time's up!";
    }
    // 초기 설정 시간을 가장 적절한 단위(시간/분/초)로 표시
    const initialMinutes = initialSeconds / 60;
    const initialHours = initialSeconds / 3600;

    if (initialHours >= 1 && initialSeconds % 3600 === 0) {
      const h = Math.round(initialHours);
      return `${h} hour${h > 1 ? "s" : ""}`;
    }
    if (initialMinutes >= 1 && initialSeconds % 60 === 0) {
      const m = Math.round(initialMinutes);
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
          fontFamily: "monospace",
        }}
      >
        <div style={{ fontSize: "48px", fontWeight: "500" }}>
          {formatTime(remaining)}
        </div>
        <div style={{ fontSize: "24px", color: "#888" }}>
          {/* totalSeconds를 표시 */}
          {getDisplayUnit(remaining, totalSeconds)}
        </div>
      </div>
    </div>
  );
};

export default RingTimer;
