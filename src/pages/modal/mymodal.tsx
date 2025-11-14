import styled from "styled-components";
import { useState } from "react";

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
  align-items: center;
  color: #333;
  background-color: rgba(168, 168, 168, 0.5);
  left: 50%;
  transform: translateX(-50%);
  box-sizing: border-box;
`;

// ✅ ModalContent: 모달 내용 박스
const ModalContent = styled.div<{ $closing: boolean }>`
  background-color: white;
  width: 333px;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  justify-content: center;
`;

const ModalHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 8px;
  font-family: "Pretendard", sans-serif;
  font-size: 16px;
  font-weight: 500;
`;

const Footer = styled.div`
  width: 100%;
  box-sizing: border-box;
  margin-top: 8px;
  justify-content: center;
  display: flex;
  align-items: center;
`;

const FinishButton = styled.button`
  width: 70px;
  height: 35px;
  background: #b6f500;
  color: #333;
  border: none;
  border-radius: 5px;
  font-family: "Pretendard", sans-serif;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default function DateModal({
  onClose,
  initialStart = null,
  initialEnd = null,
}: DateModalProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [range, setRange] = useState<[Date, Date] | null>(
    initialStart && initialEnd ? [initialStart, initialEnd] : null
  );

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

  const handleFinish = () => {
    handleClose(true);
  };

  return (
    // ✅ 1. Container (어두운 배경) 클릭 시 모달 닫기
    <Container onClick={() => handleClose()}>
      {/* ✅ 2. ModalContent 내부 클릭 이벤트가 Container로 전파되는 것을 막아 
           모달 내용 클릭 시 닫히지 않도록 방지
      */}
      <ModalContent $closing={isClosing} onClick={(e) => e.stopPropagation()}>
        <ModalHeader>카페인 민감도와 음주 패턴을 선택해 주세요!</ModalHeader>
        <Footer>
          <FinishButton type="button" onClick={handleFinish}>
            닫기
          </FinishButton>
        </Footer>
      </ModalContent>
    </Container>
  );
}
