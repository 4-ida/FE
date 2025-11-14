import styled from "styled-components";

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  pillName: string;
  time: string; // HH:MM 형식의 시간
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
  align-items: center;
  color: #333;
  background-color: rgba(168, 168, 168, 0.5);
  left: 50%;
  transform: translateX(-50%);
  box-sizing: border-box;
`;

// ✅ ModalContent: 모달 내용 박스
const ModalContent = styled.div`
  background-color: white;
  width: 300px; /* 약간 더 작게 */
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  font-family: "Pretendard", sans-serif;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  line-height: 1.4;
  flex-direction: column;
  gap: 4px;
`;

const ReminderText = styled.span`
  color: #a0c040;
  margin-right: 5px;
  font-size: 18px;
  font-weight: 600;
`;

const Footer = styled.div`
  width: 100%;
  justify-content: center;
  display: flex;
  align-items: center;
`;

const MainText = styled.div`
  display: flex;
`;

const FinishButton = styled.button`
  width: 100px;
  height: 40px;
  background: #b6f500;
  color: #000;
  border: none;
  border-radius: 5px;
  font-family: "Pretendard", sans-serif;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
`;

export default function PillReminderModal({
  isOpen,
  onClose,
  pillName,
  time,
}: ReminderModalProps) {
  if (!isOpen) return null;

  return (
    <Container onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ReminderText>{pillName}</ReminderText>
          <MainText>복용 10분 전입니다.</MainText>
        </ModalHeader>
        <Footer>
          <FinishButton type="button" onClick={onClose}>
            확인
          </FinishButton>
        </Footer>
      </ModalContent>
    </Container>
  );
}
