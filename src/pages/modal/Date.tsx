import styled, { keyframes } from "styled-components";
import Calendar from "../../components/Calendar";
import { useState } from "react";
import Reset from "../../assets/reset.svg?react";

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
}

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
`;

export default function DateModal({ isOpen, onClose }: DateModalProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [range, setRange] = useState<[Date, Date] | null>(null);

  if (!isOpen && !isClosing) return null;

  const handleClose = (sendData = false) => {
    setIsClosing(true);
    setTimeout(() => {
      onClose(
        sendData && range ? range[0] : undefined,
        sendData && range ? range[1] : undefined
      );
      setIsClosing(false);
      setRange(null);
    }, 300);
  };

  const handleFinish = () => {
    if (range) handleClose(true);
  };

  return (
    <Container onClick={() => !isClosing && handleClose()}>
      <ModalContent $closing={isClosing} onClick={(e) => e.stopPropagation()}>
        <ModalHeader>복용 기간 선택</ModalHeader>

        <Calendar
          selectRange
          value={range ?? undefined}
          onChange={(value) => {
            if (Array.isArray(value) && value[0] && value[1]) {
              setRange([value[0], value[1]]);
            } else {
              setRange(null);
            }
          }}
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
