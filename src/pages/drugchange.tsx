import styled from "styled-components";
import bb from "../assets/backbutton.svg";
import { useNavigate, useLocation } from "react-router-dom"; // ✅ useLocation 추가
import Dropdown from "./DropDown"; // Dropdown 컴포넌트 (제공된 파일)
import { useEffect, useState } from "react";
import DateModal from "../pages/modal/Date"; // DateModal 컴포넌트
import EatModal from "../pages/modal/EatDate"; // EatModal 컴포넌트
import DropdownIcon from "../assets/dropdown.svg?react"; // DropdownIcon SVG 컴포넌트

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

// ⭐️ 프로필 없는 커스텀 드롭다운 UI 스타일 시작
const CustomDropdownUI = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 20px;
  position: relative;
`;

const DropdownLabel = styled.div`
  font-family: "Pretendard";
  font-weight: 500;
  font-size: 18px;
  margin-bottom: 8px;
`;

const CustomSelectButton = styled.button`
  width: 363px;
  height: 40px;
  border: 1.5px solid #ebebeb;
  border-radius: 5px;
  background-color: #fff;
  padding: 0 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  box-sizing: border-box;
  font-family: "Pretendard", sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #333;

  &:focus {
    outline: none;
    border: 1.5px solid #b6f500;
  }
`;

const RightArrowIcon = styled(DropdownIcon)`
  width: 12px;
  height: 12px;
  transform: rotate(-90deg); /* 오른쪽을 바라보도록 회전 */
  flex-shrink: 0;
  margin-right: -5px;
`;
// ⭐️ 커스텀 드롭다운 UI 스타일 끝

const DropdownWrapper = styled.div`
  display: flex;
  margin-bottom: 20px;
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
// --- [스타일 컴포넌트 정의 끝] ---

// --- [인터페이스 및 유틸리티 함수] ---

// DrugModification.jsx (수정된 전체 코드)

// ... (상단 import 및 스타일 컴포넌트 생략)

// --- [인터페이스 및 유틸리티 함수] ---

interface IncomingDrugSchedule {
  id: string;
  pillName: string;
  count: string;
  memo: string;
  days: string; // "화, 금"
  time: string; // "오후 6시 00분"
  start: string; // ISO String
  end: string; // ISO String
  dailyStatus?: string;
  completionStatus?: string;
}

// ✅ [수정] formatDate: 유효하지 않은 Date 객체를 체크하여 안전한 문자열 반환
const formatDate = (date: Date): string => {
  if (isNaN(date.getTime())) {
    return "날짜 미지정";
  }
  const yy = String(date.getFullYear()).slice(2);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yy}.${mm}.${dd}`;
};

// ✅ 시간 파싱 유틸리티: time이 없을 경우 초기값으로 "오후 6시 00분" 사용
const parseTimeForEatModal = (timeStr: string) => {
  // timeStr이 null/undefined이면 기본값으로 "오후 6시 00분" 사용
  const defaultTimeStr = "오후 6시 00분";
  const strToParse = timeStr || defaultTimeStr;

  // timeStr 예시: "오후 6시 00분"
  const [ampm, hour, minute] = strToParse.split(" ");
  return {
    selectedAmPm: ampm || "오후",
    selectedHour: hour || "6시",
    selectedMinute: minute || "00분",
  };
};

// --- [컴포넌트 정의] ---

export default function DrugModification() {
  const location = useLocation();
  const navigate = useNavigate();

  const initialPillData: IncomingDrugSchedule | undefined =
    location.state?.pill;

  // 2. 초기 안전값 설정 (days, start, end 오류 방지)
  const defaultPillData: IncomingDrugSchedule = {
    id: "",
    pillName: "",
    count: "",
    memo: "",
    days: "요일 미지정", // ⭐️ days가 없을 경우 "요일 미지정" 문자열로 초기화
    time: "오후 6시 00분",
    start: new Date().toISOString(),
    end: new Date().toISOString(),
  };
  const dataToUse = initialPillData || defaultPillData;

  // 3. Date 객체 및 초기 문자열 포맷팅
  const startDate = new Date(dataToUse.start);
  const endDate = new Date(dataToUse.end);

  // 복용 기간 표시: "25.11.05 ~ 25.11.20" 또는 "날짜 미지정 ~ 날짜 미지정"
  const periodString = `${formatDate(startDate)} ~ ${formatDate(endDate)}`;

  // 시간 파싱 (EatModal 초기값)
  const parsedTime = parseTimeForEatModal(dataToUse.time);

  // ⭐️ [수정] 복용 일정 표시 (요일 12시간제): "화, 금 오후 6시 00분"
  const initialScheduleString = `${dataToUse.days || "요일 미지정"} ${
    dataToUse.time || "시간 미지정"
  }`;

  // 4. 상태 초기화
  const [pillName, setpillName] = useState(dataToUse.pillName);
  const [count, setCount] = useState(dataToUse.count);
  const [memo, setMemo] = useState(dataToUse.memo);
  const [schedule, setSchedule] = useState<string>(initialScheduleString); // ⭐️ 12시간제 원본 포맷 사용
  const [period, setPeriod] = useState<string>(periodString); // ⭐️ 날짜 미지정 안전값 포함
  const [isAlarmSet, setIsAlarmSet] = useState<boolean>(false);

  const [modalType, setModalType] = useState<"schedule" | "period" | null>(
    null
  );
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(
    startDate
  );
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(endDate);

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // EatModal 초기값 설정 (모달이 닫히거나, 처음 열릴 때 사용)
  // ⭐️ [수정] dataToUse.days가 undefined일 경우 EatModal에 빈 문자열 대신 "화"를 전달해야 모달 내부 로직이 깨지지 않습니다.
  const [selectedDay, setSelectedDay] = useState(dataToUse.days || "화");
  const [selectedAmPm, setSelectedAmPm] = useState(parsedTime.selectedAmPm);
  const [selectedHour, setSelectedHour] = useState(parsedTime.selectedHour);
  const [selectedMinute, setSelectedMinute] = useState(
    parsedTime.selectedMinute
  );

  // 5. 이벤트 핸들러 및 모의 데이터 (생략)

  const handleGoBack = () => {
    navigate(-1);
  };
  const handleGoToMyPage = () => {
    navigate("/mypage");
  };

  const mockDrugs = [
    { id: "0", pillName: "타이레놀정500mg" },
    { id: "1", pillName: "타이레놀정160mg" },
    { id: "2", pillName: "게보린정" },
    { id: "3", pillName: "아스피린정100mg" },
    { id: "4", pillName: "판피린큐" },
    { id: "5", pillName: "이부프로펜정200mg" },
    { id: "6", pillName: "탁센정" },
    { id: "7", pillName: "부루펜시럽" },
    { id: "8", pillName: "써스펜" },
    { id: "9", pillName: "애드빌리퀴겔" },
    { id: "10", pillName: "신일해열정" },
    { id: "11", pillName: "나프록센정250mg" },
    { id: "12", pillName: "아모디핀정5mg" },
  ];

  useEffect(() => {
    if (pillName.trim() === "") {
      setSuggestions([]);
      return;
    }

    const filtered = mockDrugs
      .filter((drug) =>
        drug.pillName.toLowerCase().includes(pillName.toLowerCase())
      )
      .map((drug) => drug.pillName);

    setSuggestions(filtered);
  }, [pillName]);

  const handleScheduleClose = (selectedDay?: string, selectedTime?: string) => {
    setModalType(null);
    if (selectedDay && selectedTime) {
      const [ampm, hour, minute] = selectedTime.split(" ");

      setSelectedDay(selectedDay);
      setSelectedAmPm(ampm);
      setSelectedHour(hour);
      setSelectedMinute(minute);

      // ⭐️ Dropdown에 12시간제 원본 포맷으로 저장
      setSchedule(`${selectedDay} ${selectedTime}`);
    }
  };

  const handlePeriodClose = (start?: Date, end?: Date) => {
    setModalType(null);
    if (start && end) {
      setSelectedStartDate(start);
      setSelectedEndDate(end);

      setPeriod(`${formatDate(start)} ~ ${formatDate(end)}`);
    }
  };

  const handleSubmitModification = () => {
    if (
      !selectedDay ||
      !selectedAmPm ||
      !selectedHour ||
      !selectedMinute ||
      !selectedStartDate ||
      !selectedEndDate
    ) {
      alert("복용 일정과 복용 기간을 확인해 주세요.");
      return;
    }

    const timeForStorage = `${selectedAmPm} ${selectedHour} ${selectedMinute}`;

    const updatedSchedule = {
      id: dataToUse.id,
      pillName,
      count: count || "1정",
      memo,
      days: selectedDay,
      time: timeForStorage,
      start: selectedStartDate?.toISOString(),
      end: selectedEndDate?.toISOString(),
    };

    console.log("수정된 약 정보:", updatedSchedule);

    alert("약 수정이 완료되었습니다.");
    navigate(-1);
  };

  return (
    <Container>
      <Header>
        <Back src={bb} alt="뒤로 가기" onClick={handleGoBack} />
        <Ht onClick={handleGoToMyPage}>마이페이지</Ht>
      </Header>
      <Content>
        약품 명
        <InputWrapper>
          <Inputtext
            type="text"
            value={pillName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setpillName(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          />
          {showSuggestions && suggestions.length > 0 && (
            <SuggestionBox>
              {suggestions.map((name, i) => (
                <SuggestionItem
                  key={i}
                  onClick={() => {
                    setpillName(name);
                    setShowSuggestions(false);
                  }}
                >
                  {name}
                </SuggestionItem>
              ))}
            </SuggestionBox>
          )}
        </InputWrapper>
        복용량
        <Inputtext
          type="text"
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
        {/* 복용 일정: Dropdown 컴포넌트 */}
        <DropdownWrapper>
          <Dropdown
            label="복용 일정"
            options={[]}
            selected={schedule}
            onSelect={() => {}}
            disableDefaultUI={true}
            onClick={() => setModalType("schedule")}
            placeholder=""
          />
        </DropdownWrapper>
        {/* 복용 기간: Dropdown 컴포넌트 */}
        <DropdownWrapper>
          <Dropdown
            label="복용 기간"
            options={[]}
            selected={period}
            onSelect={() => {}}
            disableDefaultUI={true}
            onClick={() => setModalType("period")}
            placeholder=""
          />
        </DropdownWrapper>
        <ToggleWrapper>
          <div>알림 설정</div>
          <ToggleLabel>
            <ToggleInput
              type="checkbox"
              checked={isAlarmSet}
              onChange={(e) => setIsAlarmSet(e.target.checked)}
            />
            <ToggleSlider />
          </ToggleLabel>
        </ToggleWrapper>
        <Submit onClick={handleSubmitModification}>수정 완료</Submit>
      </Content>
      {modalType === "schedule" && (
        <EatModal
          isOpen={modalType === "schedule"}
          onClose={handleScheduleClose}
          // EatModal 초기값으로 기존 데이터 전달
          initialDay={selectedDay || "월"}
          initialAmPm={selectedAmPm}
          initialHour={selectedHour}
          initialMinute={selectedMinute}
        />
      )}
      {modalType === "period" && (
        <DateModal
          isOpen={modalType === "period"}
          onClose={handlePeriodClose}
          // DateModal 초기값으로 기존 데이터 전달
          initialStart={selectedStartDate}
          initialEnd={selectedEndDate}
        />
      )}
    </Container>
  );
}
