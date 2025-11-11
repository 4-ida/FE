import styled, { keyframes } from "styled-components";
import Calendar from "../../components/Calendar"; // 이 경로는 프로젝트 구조에 맞게 유지됩니다.
import { useState, useRef, useEffect } from "react";
import Reset from "../../assets/reset.svg?react"; // 이 경로는 프로젝트 구조에 맞게 유지됩니다.

const slideIn = keyframes`
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
`;

const slideOut = keyframes`
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(100%);
  }
`;

interface DateModalProps {
  isOpen: boolean;
  onClose: (startDate?: Date, endDate?: Date) => void;
  initialStart?: Date | null;
  initialEnd?: Date | null;
}

// ✅ Container: 어두운 배경 전체 영역
const Container = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  width: 100%;
  max-width: 393px;
  height: 100%;
  justify-content: center;
  align-items: flex-end;
  color: #333;
  background-color: rgba(168, 168, 168, 0.5);
  left: 50%;
  transform: translateX(-50%);
  box-sizing: border-box;
`;

// ✅ ModalContent: 모달 내용 박스
const ModalContent = styled.div<{ $closing: boolean }>`
  background-color: white;
  width: 393px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  padding: 20px 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${({ $closing }) => ($closing ? slideOut : slideIn)} 0.3s ease-out
    forwards;
  box-sizing: border-box;
`;

const ModalHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 8px;
  font-family: "Pretendard", sans-serif;
  font-size: 18px;
  font-weight: 500;
`;

const Footer = styled.div`
  width: 100%;
  box-sizing: border-box;
  margin-top: 16px;
  justify-content: space-between;
  display: flex;
  align-items: center;
`;

const FinishButton = styled.button`
  width: 312px;
  height: 45px;
  background: #b6f500;
  color: #333;
  border: none;
  border-radius: 5px;
  font-family: "Pretendard", sans-serif;
  font-size: 18px;
  font-weight: 500;
  margin-top: 0px;
  cursor: pointer;

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

export default function DateModal({
  isOpen,
  onClose,
  initialStart = null,
  initialEnd = null,
}: DateModalProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [range, setRange] = useState<[Date, Date] | null>(
    initialStart && initialEnd ? [initialStart, initialEnd] : null
  );

  // ⭐️ 모달이 열릴 때 부모에서 전달한 초기값으로 동기화
  useEffect(() => {
    if (isOpen && initialStart && initialEnd) {
      setRange([initialStart, initialEnd]);
    }
  }, [isOpen, initialStart, initialEnd]);

  if (!isOpen && !isClosing) return null;

  const handleClose = (sendData = false) => {
    setIsClosing(true);

    setTimeout(() => {
      // 부모에게 모달 닫힘 신호 전달
      onClose(
        sendData ? range?.[0] : undefined,
        sendData ? range?.[1] : undefined
      );

      // 내부 상태 초기화
      setIsClosing(false);
      setRange(null);
    }, 300);
  };

  // 기존 useEffect (외부 클릭 감지) 로직은 Container의 onClick으로 대체되어 제거했습니다.

  const handleFinish = () => {
    if (range) handleClose(true);
  };

  const handleDateSelect = (
    value: Date | null | [Date | null, Date | null]
  ) => {
    if (!value) return;

    if (Array.isArray(value)) {
      // 범위 선택일 경우
      if (value[0] && value[1]) setRange([value[0], value[1]]);
      return;
    }

    // 단일 날짜 선택
    if (!range) {
      setRange([value, value]);
      return;
    }

    const [start, end] = range;
    if (value < start) setRange([value, end]);
    else if (value > end) setRange([start, value]);
    else setRange([value, value]); // 범위 내 날짜 선택 시 단일 선택 재설정
  };

  return (
    // ✅ 1. Container (어두운 배경) 클릭 시 모달 닫기
    <Container onClick={() => handleClose()}>
      {/* ✅ 2. ModalContent 내부 클릭 이벤트가 Container로 전파되는 것을 막아 
           모달 내용 클릭 시 닫히지 않도록 방지
      */}
      <ModalContent $closing={isClosing} onClick={(e) => e.stopPropagation()}>
        <ModalHeader>복용 기간 선택</ModalHeader>

        <Calendar
          selectRange={false}
          value={range ?? undefined}
          onChange={handleDateSelect}
          isForModal
        />

        <Footer>
          <Reset onClick={() => setRange(null)} />
          <FinishButton type="button" disabled={!range} onClick={handleFinish}>
            선택 완료
          </FinishButton>
        </Footer>
      </ModalContent>
    </Container>
  );
}
