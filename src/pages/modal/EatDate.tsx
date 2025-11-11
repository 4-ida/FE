import styled, { keyframes } from "styled-components";
import { useState, useEffect } from "react";
import PlusCircle from "../../assets/pluscircle.svg?react";
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

// --- Day Selection Styles ---
const DayContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
`;

const DayCircle = styled.button<{ $selected: boolean }>`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: 1px solid ${({ $selected }) => ($selected ? "#b6f500" : "#ddd")};
  background-color: ${({ $selected }) => ($selected ? "#b6f50033" : "white")};
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Pretendard", sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #333;
  cursor: pointer;
  box-shadow: ${({ $selected }) => ($selected ? "0 0 0 3px #b6f500" : "none")};
  transition: all 0.2s ease;
`;

// --- Time Selection Styles ---
const TimeContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TimeDropdown = styled.select`
  flex-grow: 1;
  height: 45px;
  padding: 0 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-family: "Pretendard", sans-serif;
  font-size: 16px;
  font-weight: 400;
  appearance: none;
  background: white
    url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="%23333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>')
    no-repeat right 10px center;
  background-size: 12px;
`;

const MinuteDropdown = styled(TimeDropdown)`
  flex-grow: 0;
  width: 80px;
`;

const AmPmDropdown = styled(TimeDropdown)`
  flex-grow: 0;
  width: 80px;
`;

const AddTimeButton = styled(PlusCircle)`
  background-color: #fff;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  flex-shrink: 0;
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

const DAYS = ["월", "화", "수", "목", "금", "토", "일"];
const AM_PM = ["오후", "오전"];
const HOURS = Array.from({ length: 12 }, (_, i) => `${i + 1}시`);
const MINUTES = ["00분", "10분", "20분", "30분", "40분", "50분"];

export default function TimeSelectionModal({
  isOpen,
  onClose,
  initialDay = "화",
  initialAmPm = "오후",
  initialHour = "6시",
  initialMinute = "00분",
}: TimeSelectionModalProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([initialDay]);
  const [times, setTimes] = useState<
    { amPm: string; hour: string; minute: string }[]
  >([{ amPm: initialAmPm, hour: initialHour, minute: initialMinute }]);

  useEffect(() => {
    if (isOpen) {
      setSelectedDays([initialDay]);
      setTimes([
        { amPm: initialAmPm, hour: initialHour, minute: initialMinute },
      ]);
    }
  }, [isOpen, initialDay, initialAmPm, initialHour, initialMinute]);

  if (!isOpen && !isClosing) return null;

  const handleClose = (sendData = false) => {
    setIsClosing(true);
    setTimeout(() => {
      onClose(
        sendData ? selectedDays.join(", ") : undefined, // ✅ 배열을 콤마 구분 문자열로 변경
        sendData
          ? times.map((t) => `${t.amPm} ${t.hour} ${t.minute}`).join(", ")
          : undefined
      );
      setIsClosing(false);
    }, 300);
  };

  const handleDayClick = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleTimeChange = (
    index: number,
    field: "amPm" | "hour" | "minute",
    value: string
  ) => {
    const newTimes = [...times];
    newTimes[index][field] = value;
    setTimes(newTimes);
  };

  const handleAddTime = () => {
    setTimes([...times, { amPm: "오후", hour: "6시", minute: "00분" }]);
  };

  const handleFinish = () => handleClose(true);

  return (
    <Container onClick={() => !isClosing && handleClose()}>
      <ModalContent $closing={isClosing} onClick={(e) => e.stopPropagation()}>
        <SectionTitle>요일을 선택해 주세요.</SectionTitle>
        <DayContainer>
          {DAYS.map((day) => (
            <DayCircle
              key={day}
              $selected={selectedDays.includes(day)}
              onClick={() => handleDayClick(day)}
            >
              {day}
            </DayCircle>
          ))}
        </DayContainer>

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
            {index === times.length - 1 && (
              <AddTimeButton type="button" onClick={handleAddTime} />
            )}
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
