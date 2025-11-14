import styled, { keyframes } from "styled-components";
import { useState, useEffect } from "react";
import Dropdown from "../DropDown";

// --- Keyframes (Copied from original) ---
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

// --- Styled Components (Adapted from original) ---
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
  font-family: "Pretendard", sans-serif;
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

const SectionTitle = styled.div`
  width: 100%;
  text-align: left;
  margin-bottom: 12px;
  font-family: "Pretendard", sans-serif;
  font-size: 18px;
  font-weight: 500;
`;

// --- Time Selection Styles ---
const TimeContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
`;

// --- Footer and Finish Button ---
const Footer = styled.div`
  width: 100%;
  box-sizing: border-box;
  margin-top: 30px;
  justify-content: center;
  display: flex;
  align-items: center;
`;

const FinishButton = styled.button`
  width: 100%;
  max-width: 363px;
  height: 50px;
  background: #b6f500;
  color: #333;
  border: none;
  border-radius: 5px;
  font-family: "Pretendard", sans-serif;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
`;

// --- Component Logic ---
interface TimeSelectionModalProps {
  isOpen: boolean;
  onClose: (selectedDay?: string, selectedTime?: string) => void;
  initialDay?: string;
  initialAmPm?: string;
  initialHour?: string;
  initialMinute?: string;
}

const AM_PM = ["오후", "오전"];
const HOURS = Array.from({ length: 12 }, (_, i) => `${i + 1}시`);
const MINUTES = ["00분", "10분", "20분", "30분", "40분", "50분"];

export default function TimeSelectionModal({
  isOpen,
  onClose,
  initialAmPm = "오후",
  initialHour = "6시",
  initialMinute = "00분",
}: TimeSelectionModalProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [times, setTimes] = useState<
    { amPm: string; hour: string; minute: string }[]
  >([{ amPm: initialAmPm, hour: initialHour, minute: initialMinute }]);

  useEffect(() => {
    if (isOpen) {
      setTimes([
        { amPm: initialAmPm, hour: initialHour, minute: initialMinute },
      ]);
    }
  }, [isOpen, initialAmPm, initialHour, initialMinute]);

  if (!isOpen && !isClosing) return null;

  const handleClose = (sendData = false) => {
    setIsClosing(true);
    setTimeout(() => {
      onClose(
        // 첫 번째 인자인 selectedDay는 사용하지 않으므로 undefined나 빈 문자열을 전달
        undefined,
        // sendData가 true일 때만 시간을 포맷하여 전달
        sendData
          ? times.map((t) => `${t.amPm} ${t.hour} ${t.minute}`).join(", ")
          : undefined // sendData가 false일 때도 두 번째 인자는 명시적으로 undefined를 전달
      );
      setIsClosing(false);
    }, 300);
  };

  const handleFinish = () => handleClose(true);

  const handleTimeChange = (
    index: number,
    field: "amPm" | "hour" | "minute",
    value: string
  ) => {
    const newTimes = [...times];
    newTimes[index][field] = value;
    setTimes(newTimes);
  };

  return (
    <Container onClick={() => !isClosing && handleClose()}>
      <ModalContent $closing={isClosing} onClick={(e) => e.stopPropagation()}>
        <SectionTitle>시간을 선택해 주세요.</SectionTitle>
        {times.map((time, index) => (
          <TimeContainer key={index}>
            <Dropdown
              options={AM_PM}
              selected={time.amPm}
              onSelect={(val) => handleTimeChange(index, "amPm", val)}
              variant="custom"
            />
            <Dropdown
              options={HOURS}
              selected={time.hour}
              onSelect={(val) => handleTimeChange(index, "hour", val)}
              variant="custom"
            />
            <Dropdown
              options={MINUTES}
              selected={time.minute}
              onSelect={(val) => handleTimeChange(index, "minute", val)}
              variant="custom"
            />
            {/* {index === times.length - 1 && (
              <AddTimeButton type="button" onClick={handleAddTime} />
            )} */}
          </TimeContainer>
        ))}

        <Footer>
          <FinishButton type="button" onClick={handleFinish}>
            선택 완료
          </FinishButton>
        </Footer>
      </ModalContent>
    </Container>
  );
}
