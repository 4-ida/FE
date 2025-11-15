import styled from "styled-components";
import { useState } from "react";
import ThreeDots from "../../assets/BsThreeDotsVertical.svg?react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosInstance";

const Box = styled.div`
  box-sizing: border-box;
  width: 363px;
  background: #ffffff;
  border: 1px solid #2b2b2b;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  padding: 15px;
  padding-right: 10px;
  display: flex;
  flex-direction: column;
  font-family: "Pretendard";
  margin-top: 16px;
`;

const Header = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 16px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 15px;
  font-weight: 400;
  gap: 16px;
`;

// 스케줄 항목 컨테이너 (한 줄)
const ScheduleItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
`;

const TimeAndPill = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  flex-grow: 1;
`;

const Time = styled.div`
  font-size: 15px;
  font-weight: 400;
  flex-shrink: 0;
`;

const PillName = styled.div`
  font-size: 14px;
  font-weight: 400;
  flex-grow: 1;
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

const BaseButton = styled.button`
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 13px;
  font-weight: 500;
  border: none;
  cursor: default;
  width: 55px;
  height: 27px;
`;

const StatusButton = styled(BaseButton)<{ $status: "SCHEDULED" | "CANCELED" }>`
  background-color: ${({ $status }) =>
    $status === "SCHEDULED"
      ? "#E1F5FE"
      : "#FEE8E8"}; /* 예정: 라이트 블루, 취소: 라이트 레드 */
  color: #333;
  min-width: 55px;
`;

const CompletionButton = styled(BaseButton)<{
  $completion: "TAKEN" | "MISSED";
}>`
  background-color: ${({ $completion }) =>
    $completion === "TAKEN"
      ? "#E9FFEB"
      : "#EDEDED"}; /* 완료: 라이트 그린, 미섭취: 라이트 그레이 */
  color: #333;
  min-width: 55px;
`;

const ActionMenuButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
`;

const ActionMenu = styled.div`
  position: absolute;
  top: 30px;
  right: 0px;
  background: #ffffff;
  border: 1.5px solid #ebebeb;
  border-radius: 5px;
  z-index: 10;
  width: 60px;
  padding: 4px;
  box-sizing: border-box;
`;

const MenuItem = styled.div`
  padding: 5px;
  font-size: 14px;
  cursor: pointer;
  text-align: center;
  font-weight: 400;
  color: #333;
  &:hover {
    background-color: #e8ffcc;
    border-radius: 5px;
  }
`;

interface TodayPillItem {
  id: string;
  time: string;
  pillName: string;
  dailyStatus: "SCHEDULED" | "CANCELED";
  completionStatus: "NONE" | "TAKEN" | "MISSED";
  registrationDate: string;
  count?: string; // 복용량
  memo?: string; // 메모
  drugId?: number; // 약물 ID
}

interface TodayPillProps {
  date: Date | null;
  pills: TodayPillItem[];
  // Main에서 전달받을 함수를 가정합니다.
  onDelete: (id: string) => void;
  onModify: (id: string) => void;
  onStatusChange: (
    id: string,
    newDailyStatus: "SCHEDULED" | "CANCELED"
  ) => void;
  onCompletionChange: (
    id: string,
    newCompletionStatus: "TAKEN" | "MISSED" | "NONE"
  ) => void;
}

export default function TodayPill({
  date,
  pills,
  onDelete,
  onStatusChange,
  onCompletionChange,
}: TodayPillProps) {
  // 어떤 항목의 액션 메뉴가 열려 있는지 추적하는 상태
  const [showMenuId, setShowMenuId] = useState<string | null>(null);
  const navigate = useNavigate();

  const toggleMenu = (id: string) => {
    setShowMenuId(showMenuId === id ? null : id);
  };

  const handleDelete = async (scheduleId: string) => {
    if (!window.confirm("정말로 이 약 복용 일정을 삭제하시겠습니까?")) return;

    try {
      // 실제 서버 DELETE 요청
      const response = await axiosInstance.delete(
        `/api/v1/main/calendar/schedules/${scheduleId}`
      );

      console.log("✅ [복약일정 삭제] 성공");
      console.log("📥 응답 상태:", response.status);
      console.log("📥 응답 데이터:", JSON.stringify(response.data, null, 2));
      alert("복약 일정이 삭제되었습니다.");

      // 부모 컴포넌트에서 상태를 갱신하도록 호출
      onDelete(scheduleId);
    } catch (error: any) {
      console.error("삭제 실패:", error);
      alert(
        error?.response?.data?.message ||
          "복약 일정 삭제 중 오류가 발생했습니다."
      );
    }
  };

  // 마침표 제거 로직 (이전 요청사항 반영)
  const dateString = date?.toLocaleDateString("ko-KR");
  const displayDate =
    dateString && dateString.endsWith(".")
      ? dateString.slice(0, -1)
      : dateString;

  return (
    <Box>
      <Header>{displayDate}</Header>
      <Content>
        {pills.length > 0 ? (
          pills.map((pill) => (
            <ScheduleItem key={pill.id}>
              <TimeAndPill>
                <Time>{pill.time}</Time>
                <PillName>{pill.pillName}</PillName>
              </TimeAndPill>

              <ButtonWrapper>
                {/* 1. 상태 버튼 (예정/취소) */}
                <StatusButton
                  $status={pill.dailyStatus}
                  onClick={() => {
                    const newStatus =
                      pill.dailyStatus === "SCHEDULED"
                        ? "CANCELED"
                        : "SCHEDULED";
                    onStatusChange(pill.id, newStatus);
                  }}
                >
                  {pill.dailyStatus === "SCHEDULED" ? "예정" : "취소"}
                </StatusButton>

                {/* 2. 완료/미섭취 버튼 (SCHEDULED 일 때만 활성화/표시) */}
                {pill.dailyStatus === "SCHEDULED" ? (
                  <>
                    {pill.completionStatus === "NONE" ? (
                      // 복용 완료 버튼 (기본값)
                      <BaseButton
                        style={{ backgroundColor: "#EDEDED", minWidth: "55px" }}
                        onClick={() => onCompletionChange(pill.id, "TAKEN")}
                      ></BaseButton>
                    ) : (
                      // 완료 또는 미섭취 상태 표시
                      <CompletionButton
                        $completion={pill.completionStatus}
                        onClick={() => {
                          // 상태 클릭 시 토글 (미섭취 <-> 완료, 또는 NONE으로 돌아갈 수도 있음)
                          const newCompletion =
                            pill.completionStatus === "TAKEN"
                              ? "MISSED"
                              : "TAKEN";
                          onCompletionChange(pill.id, newCompletion);
                        }}
                      >
                        {pill.completionStatus === "TAKEN" ? "완료" : "미섭취"}
                      </CompletionButton>
                    )}
                  </>
                ) : (
                  // CANCELED 상태일 때 오른쪽 버튼 영역을 비워둠
                  <div style={{ width: "63px" }} />
                )}

                {/* 3. 액션 메뉴 버튼 */}
                <ActionMenuButton onClick={() => toggleMenu(pill.id)}>
                  {/* FiMoreVertical 아이콘을 사용할 수 없다면, 대체 텍스트나 다른 아이콘을 사용하세요. */}
                  {/* 여기서는 FiMoreVertical이 import 되었다고 가정합니다. */}
                  <ThreeDots />
                </ActionMenuButton>

                {/* 4. 액션 메뉴 드롭다운 */}
                {showMenuId === pill.id && (
                  <ActionMenu>
                    <MenuItem
                      onClick={() => {
                        navigate(`/drug/change/${pill.id}`, {
                          state: { pill, from: "todaypill" },
                        });
                      }}
                    >
                      수정
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleDelete(pill.id);
                        setShowMenuId(null);
                      }}
                    >
                      삭제
                    </MenuItem>
                  </ActionMenu>
                )}
              </ButtonWrapper>
            </ScheduleItem>
          ))
        ) : (
          <ScheduleItem>
            <PillName>오늘 복용할 약이 없습니다.</PillName>
          </ScheduleItem>
        )}
      </Content>
    </Box>
  );
}
