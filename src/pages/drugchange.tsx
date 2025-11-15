import styled from "styled-components";
import bb from "../assets/backbutton.svg";
import { useNavigate, useLocation } from "react-router-dom"; // ✅ useLocation 추가
import Dropdown from "./DropDown"; // Dropdown 컴포넌트 (제공된 파일)
import { useEffect, useState } from "react";
import type { DrugSchedule } from "./Main";
import axiosInstance from "../axiosInstance";
import axios from "axios";
import Logo from "../assets/logo.svg?react";

// --- [스타일 컴포넌트 정의 시작] ---

const Container = styled.div`
  display: flex;
  width: 393px;
  height: 852px;
  background-color: #fff;
  flex-direction: column;
  align-items: center;
  color: #333;
`;

const Header = styled.div`
  display: flex;
  width: 100%;
  height: 60px;
  align-items: center;
  padding: 0 15px;
  box-sizing: border-box;
  justify-content: space-between;
`;

const Back = styled.img`
  color: #333;
  cursor: pointer;
`;

const Ht = styled.div`
  font-family: "Pretendard";
  font-weight: 500;
  font-size: 15px;
  cursor: pointer;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 15px;
  box-sizing: border-box;
  margin-top: 20px;
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  position: relative;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 363px;
`;

const Inputtext = styled.input<{ type: string; value: string }>`
  display: flex;
  width: 363px;
  height: 40px;
  border: 1.5px solid #ebebeb;
  border-radius: 5px;
  margin-top: 8px;
  align-items: center;
  box-sizing: border-box;
  margin-bottom: 20px;
  padding: 15px;
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 16px;

  &:focus {
    outline: none;
    border: 1.5px solid #b6f500;
  }

  &:active {
    outline: none;
  }
`;

const SuggestionBox = styled.ul`
  position: absolute;
  top: 55px;
  width: 100%;
  background: #fff;
  border: 1.5px solid #ebebeb;
  border-radius: 5px;
  list-style: none;
  padding: 5px;
  margin: 0;
  max-height: 150px;
  overflow-y: auto;
  z-index: 10;
  box-sizing: border-box;
`;

const SuggestionItem = styled.li`
  padding: 10px 15px;
  cursor: pointer;
  font-family: "Pretendard";
  font-weight: 400;
  font-size: 16px;
  &:hover {
    background-color: #e8ffcc;
  }
`;

const DropdownLabel = styled.div`
  font-family: "Pretendard";
  font-weight: 500;
  font-size: 18px;
  margin-bottom: 8px;
`;
// ⭐️ 커스텀 드롭다운 UI 스타일 끝

const DropdownWrapper = styled.div`
  display: flex;
  margin-bottom: 20px;
  gap: 8px;
  font-size: 16px;
`;

const ToggleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 40px;
`;

const ToggleLabel = styled.label`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 25.92px;
  box-sizing: border-box;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: #b6f500;
  }

  &:checked + span:before {
    transform: translateX(21px);
    background-color: #fff;
  }
`;

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  transition: 0.4s;
  border-radius: 28px;
  border: 1px solid #9dd300;
  box-sizing: border-box;

  &:before {
    position: absolute;
    content: "";
    height: 19.2px;
    width: 19.2px;
    left: 3px;
    bottom: 2.46px;
    background-color: #b6f500;
    transition: 0.4s;
    border-radius: 50%;
  }
`;

const Submit = styled.div`
  width: 363px;
  height: 45px;
  background: #b6f500;
  border-radius: 5px;
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const Button = styled.div<{ $status: string }>`
  display: flex;
  font-family: "Pretendard", sans-serif;
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  width: 170px;
  height: 40px;
  justify-content: center;
  align-items: center;
  background-color: aliceblue;
  border-radius: 5px;
  box-sizing: border-box;
  background-color: ${(props) =>
    props.$status === "SCHEDULED" ? "#C3EBFF" : "#FFCCC3"};
`;

const LoGoWrapper = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  position: absolute;
  top: 15px;
  left: 139px;
`;

const LoGo = styled(Logo)`
  position: absolute;
  top: 0;
  left: 0;
`;

const StatusDropdownWrapper = styled.div`
  display: flex;
  margin-top: 8px;
  margin-bottom: 20px;
  gap: 8px; /* 버튼과 드롭다운 사이 간격 */
  align-items: center;
  width: 100%; /* 전체 너비를 사용하도록 설정 */
  font-size: 16px;
`;

const AM_PM = ["오후", "오전"];
const HOURS = Array.from({ length: 12 }, (_, i) => `${i + 1}시`);
const MINUTES = Array.from(
  { length: 60 },

  (_, i) => `${String(i).padStart(2, "0")}분`
);

// HH:mm -> 오전/오후 시 분으로 파싱하는 유틸리티 유지
const parseTimeForEatModal = (timeStr: string) => {
  const defaultTimeStr = timeStr || "18:00";
  // timeStr이 HH:MM 형태라고 가정
  const [hours, minutes] = defaultTimeStr.split(":").map(Number);

  const ampm = hours >= 12 ? "오후" : "오전";
  const hour = `${hours % 12 === 0 ? 12 : hours % 12}시`;
  const minute = `${String(minutes).padStart(2, "0")}분`;

  return {
    selectedAmPm: ampm || "오후",
    selectedHour: hour || "6시",
    selectedMinute: minute || "00분",
  };
};

// 오전/오후 시 분 -> HH:mm으로 변환하는 유틸리티 유지
const convertTimeToApiFormat = (
  amPm: string,
  hourStr: string,
  minuteStr: string
) => {
  const hour = parseInt(hourStr.replace("시", ""), 10);
  const minute = parseInt(minuteStr.replace("분", ""), 10);
  let apiHour = hour;

  if (amPm === "오전") {
    if (hour === 12) apiHour = 0;
  } else {
    if (hour !== 12) apiHour = hour + 12;
  }

  return `${String(apiHour).padStart(2, "0")}:${String(minute).padStart(
    2,
    "0"
  )}`;
};

interface DrugSuggestion {
  id: number;
  name: string;
}

// ⭐️ 컴포넌트 시작
export default function DrugModification() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };
  const handleGoToMyPage = () => {
    navigate("/mypage");
  };

  // Main에서 TodayPillItem.id (string) 형태로 전달됨
  const scheduleId = location.state?.pill?.id;

  // 초기 상태는 API 데이터 로드 후 덮어쓰거나, 임시 초기값으로 사용
  const initialPillData: DrugSchedule | undefined = location.state?.pill;

  // ⭐️ API 데이터를 저장할 상태 (주로 GET 응답을 기반으로 초기화)
  const [currentDate, setCurrentDate] = useState(
    initialPillData?.registrationDate || new Date().toISOString().split("T")[0]
  );

  const [pillName, setpillName] = useState(initialPillData?.pillName || "");
  const [count, setCount] = useState(initialPillData?.count || "");
  const [memo, setMemo] = useState(initialPillData?.memo || "");
  const [suggestions, setSuggestions] = useState<DrugSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedDrugId, setSelectedDrugId] = useState<number | null>(
    initialPillData?.drugId || null
  );
  const [isAlarmEnabled, setIsAlarmEnabled] = useState(false);

  // 시간 상태 초기화 (초기값은 Main에서 전달받은 time을 파싱)
  const parsedTime = parseTimeForEatModal(initialPillData?.time || "18:00");
  const [selectedAmPm, setSelectedAmPm] = useState(parsedTime.selectedAmPm);
  const [selectedHour, setSelectedHour] = useState(parsedTime.selectedHour);
  const [selectedMinute, setSelectedMinute] = useState(
    parsedTime.selectedMinute
  );

  const [status, setStatus] = useState(
    initialPillData?.dailyStatus || "SCHEDULED"
  ); // plan
  const EATING_OPTIONS = ["복용 완료", "복용 전"];
  const [selectedEatingStatus, setSelectedEatingStatus] = useState<
    "복용 완료" | "복용 전"
  >("복용 완료"); // status

  // const handleClick = () => {
  //   setStatus((prev) => (prev === "SCHEDULED" ? "CANCELED" : "SCHEDULED"));
  // };

  //변경
  const handleClick = () => {
    setStatus((prev) => {
      const newStatus = prev === "SCHEDULED" ? "CANCELED" : "SCHEDULED";

      // ⭐️ plan이 CANCELED로 바뀌면 복용 상태를 '복용 전'으로 초기화
      if (newStatus === "CANCELED") {
        setSelectedEatingStatus("복용 전");
      }
      return newStatus;
    });
  };

  // --- [API 호출 및 useEffects] ---

  // ⭐️ 약품 검색 API (DrugRegistration.jsx 로직 유지)
  const fetchDrugs = async (query: string) => {
    // ... (fetchDrugs 로직 유지)
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await axiosInstance.get("/api/v1/drug/suggest", {
        params: { q: query, limit: 10 },
      });
      const drugList = response.data?.suggestions || [];
      const mapped = drugList.map((item: any) => ({
        id: item.value,
        name: item.label,
      }));
      setSuggestions(mapped);
    } catch (error) {
      console.error("💥 약 검색 실패:", error);
      setSuggestions([]);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (pillName.trim() !== "") {
        fetchDrugs(pillName);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [pillName]);

  // ⭐️ GET API 호출: 수정 페이지 진입 시 상세 정보 로드
  useEffect(() => {
    const idToUse = Number(scheduleId);
    if (isNaN(idToUse)) return;

    const fetchDetail = async () => {
      try {
        const res = await axiosInstance.get(
          `/api/v1/main/calendar/schedules/${idToUse}`
        );
        const d = res.data.data;

        // ⭐️ 상태 업데이트
        setpillName(d.name);
        setCount(d.dose);
        setMemo(d.memo);
        setStatus(d.plan); // plan -> dailyStatus
        setSelectedDrugId(d.drugId); // drugId 저장
        setCurrentDate(d.date); // date 저장

        const parsed = parseTimeForEatModal(d.time);
        setSelectedAmPm(parsed.selectedAmPm);
        setSelectedHour(parsed.selectedHour);
        setSelectedMinute(parsed.selectedMinute);

        // status -> completionStatus 매핑
        setSelectedEatingStatus(d.status === "TAKEN" ? "복용 완료" : "복용 전");

        setIsAlarmEnabled(d.alarm?.enabled || false); // 알람 상태
      } catch (e) {
        console.error("상세 조회 실패", e);
        // GET 실패 시, Main 페이지로 돌아가는 것을 고려
        // navigate('/main');
      }
    };

    fetchDetail();
  }, [scheduleId]); // scheduleId가 변경될 때마다 실행

  // --- [수정 완료 핸들러] ---

  const handleSubmitModification = async () => {
    const idToUse = Number(scheduleId);
    if (!scheduleId || isNaN(idToUse)) {
      alert("수정할 일정 ID를 찾을 수 없습니다.");
      return;
    }
    if (!pillName.trim() || !currentDate) {
      alert("약품명과 날짜를 확인해주세요.");
      return;
    }

    if (selectedDrugId === null || selectedDrugId <= 0) {
      // 이전에 백엔드에서 로드되었거나, 약품 검색을 통해 선택된 유효한 ID가 필요합니다.
      alert(
        "유효한 약품 ID가 설정되지 않았습니다. 약품을 검색하여 다시 선택해주세요."
      );
      // drugId가 0으로 넘어가는 것을 방지
      return;
    }

    // 1. UI 상태 -> API 형식 매핑
    const apiTime = convertTimeToApiFormat(
      selectedAmPm,
      selectedHour,
      selectedMinute
    );

    let apiStatus: "TAKEN" | "MISSED" | null;
    if (status === "CANCELED") {
      // ✅ plan이 CANCELED일 경우, status는 null이 됩니다.
      apiStatus = null;
    } else {
      // plan이 SCHEDULED일 경우, UI의 복용 상태에 따라 매핑
      apiStatus = selectedEatingStatus === "복용 완료" ? "TAKEN" : "MISSED";
    }

    // UI: "복용 완료" -> API: "TAKEN" / UI: "복용 전" -> API: "NONE" (또는 MISSED)
    // API 스펙에 따라, "복용 전"은 "NONE"으로 매핑하는 것이 일반적입니다.
    // const apiStatus = selectedEatingStatus === "복용 완료" ? "TAKEN" : "MISSED";

    // 2. 요청 본문 구성
    const requestBody = {
      drugId: selectedDrugId, // 초기 로딩 시 설정된 drugId 사용
      name: pillName,
      dose: count || "1정",
      date: currentDate, // GET으로 가져온 날짜 사용
      time: apiTime,
      memo: memo || "복용 정보 메모",
      plan: status, // SCHEDULED or CANCELED
      status: apiStatus,
      alarm: {
        enabled: isAlarmEnabled,
      },
    };

    console.log(
      `[PUT] /api/v1/main/calendar/schedules/${idToUse} 요청 본문:`,
      requestBody
    );

    // 3. PUT API 호출
    try {
      const response = await axiosInstance.put(
        `/api/v1/main/calendar/schedules/${idToUse}`,
        requestBody
      );

      // alert(`${pillName} 복용 일정이 수정되었습니다.`);

      // if (apiStatus === "TAKEN") {
      //   // 타이머 페이지로 이동하며 scheduleId 전달
      //   navigate("/timer", {
      //     replace: true,
      //     state: {
      //       scheduleId: idToUse,
      //       timerActivated: true,
      //     },
      //   });
      // } else {
      //   // 그 외 상태(MISSED, CANCELED)는 메인 페이지로 이동
      //   navigate("/main", {
      //     replace: true,
      //     state: {
      //       selectedDate: currentDate,
      //       scheduleUpdated: true,
      //     },
      //   });
      // }
      console.log("✅ [복약일정 수정] 성공");
      console.log("📥 응답 상태:", response.status);
      console.log("📥 응답 데이터:", JSON.stringify(response.data, null, 2));
      console.log("📤 [복약일정 수정] 성공 - apiStatus:", apiStatus);
      console.log("📤 [복약일정 수정] scheduleId:", idToUse);
      console.log("📤 [복약일정 수정] scheduleId 타입:", typeof idToUse);

      // status가 "TAKEN"일 경우 금지 타이머 페이지로 직접 이동
      if (apiStatus === "TAKEN") {
        console.log("📤 [복약일정 수정] 복용 완료 상태 - 금지 타이머 페이지로 이동");
        console.log("📤 전달할 scheduleId:", idToUse);
        console.log("📤 이동할 URL:", `/timer/no?scheduleId=${idToUse}`);
        console.log("📤 location.state로 전달할 객체:", { scheduleId: idToUse });
        
        // scheduleId 유효성 검사
        if (!idToUse || isNaN(idToUse)) {
          console.error("❌ [복약일정 수정] scheduleId가 유효하지 않습니다:", idToUse);
          alert(`일정 ID가 유효하지 않습니다. (scheduleId: ${idToUse})`);
          return;
        }
        
        // 금지 타이머 페이지로 이동하면서 scheduleId 전달 (URL 파라미터와 state 둘 다 사용)
        const navigationUrl = `/timer/no?scheduleId=${idToUse}`;
        const navigationState = { scheduleId: idToUse };
        
        console.log("📤 최종 이동 URL:", navigationUrl);
        console.log("📤 최종 이동 state:", navigationState);
        console.log("📤 이동 직전 확인 - scheduleId:", idToUse, "타입:", typeof idToUse);
        
        alert("⏰ 복용 완료 상태로 변경되었습니다. 금지 타이머가 시작됩니다.");
        
        // 금지 타이머 페이지로 직접 이동
        navigate(navigationUrl, {
          state: navigationState,
          replace: false,
        });
        
        console.log("✅ [복약일정 수정] 금지 타이머 페이지로 이동 완료");
      } else {
        // TAKEN이 아닌 경우 메인 페이지로 이동
        alert(`${pillName} 복용 일정이 수정되었습니다.`);
        navigate("/main", {
          replace: true,
          state: {
            selectedDate: currentDate,
            scheduleUpdated: true, // 메인 페이지 갱신 유도
          },
        });
      }
    } catch (error) {
      console.error("❌ 약물 수정 실패:", error);
      if (axios.isAxiosError(error) && error.response) {
        console.error("❌ 400 Error Details:", error.response.data);
        alert(
          "약물 수정 중 오류 발생: " +
            (error.response.data.message || "요청 데이터 오류 (400)")
        );
      } else {
        alert("약물 수정에 실패했습니다.");
      }
    }
  };

  return (
    <Container>
      <LoGoWrapper onClick={() => navigate("/")}>
        <LoGo />
      </LoGoWrapper>
      <Header>
        <Back src={bb} alt="뒤로 가기" onClick={handleGoBack} />
        <Ht onClick={handleGoToMyPage}>마이페이지</Ht>
      </Header>
      <Content>
        {/* ... (약품명 Input 유지) */}
        약품 명
        <InputWrapper>
          <Inputtext
            type="text"
            value={pillName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setpillName(e.target.value);
              setShowSuggestions(true);
              setSelectedDrugId(null);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          />
          {showSuggestions && suggestions.length > 0 && (
            <SuggestionBox>
              {suggestions.map((drug) => (
                <SuggestionItem
                  key={drug.id}
                  onClick={() => {
                    setpillName(drug.name);
                    setSelectedDrugId(drug.id);
                    setShowSuggestions(false);
                  }}
                >
                  {drug.name}
                </SuggestionItem>
              ))}
            </SuggestionBox>
          )}
        </InputWrapper>
        {/* ... (복용량, 메모 Input 유지) */}
        복용량
        <Inputtext
          type="number"
          value={count}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setCount(e.target.value)
          }
        ></Inputtext>
        메모
        <Inputtext
          type="text"
          value={memo}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setMemo(e.target.value)
          }
        ></Inputtext>
        {/* ... (시간 Dropdown 유지) */}
        <DropdownLabel>복용 일정</DropdownLabel>
        <DropdownWrapper>
          <Dropdown
            options={AM_PM}
            selected={selectedAmPm}
            onSelect={setSelectedAmPm}
            variant="default"
          />
          <Dropdown
            options={HOURS}
            selected={selectedHour}
            onSelect={setSelectedHour}
            variant="default"
          />
          <Dropdown
            options={MINUTES}
            selected={selectedMinute}
            onSelect={setSelectedMinute}
            variant="default"
          />
        </DropdownWrapper>
        {/* ... (복용 상태 Dropdown 유지) */}
        복용 상태
        <StatusDropdownWrapper>
          <Button onClick={handleClick} $status={status}>
            {status === "SCHEDULED" ? "예정" : "취소"}
          </Button>

          {status === "SCHEDULED" && (
            <Dropdown
              options={EATING_OPTIONS}
              selected={selectedEatingStatus}
              onSelect={(item) => {
                if (item === "복용 완료" || item === "복용 전") {
                  setSelectedEatingStatus(item);
                }
              }}
              variant="default"
            />
          )}
        </StatusDropdownWrapper>
        <ToggleWrapper>
          <div>알림 설정</div>
          <ToggleLabel>
            <ToggleInput
              type="checkbox"
              checked={isAlarmEnabled}
              onChange={() => setIsAlarmEnabled((prev) => !prev)}
            />
            <ToggleSlider />
          </ToggleLabel>
        </ToggleWrapper>
        <Submit onClick={handleSubmitModification}>수정 완료</Submit>
      </Content>
    </Container>
  );
}
