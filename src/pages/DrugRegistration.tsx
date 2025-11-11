import styled from "styled-components";
import bb from "../assets/backbutton.svg";
import { useNavigate } from "react-router-dom";
import Dropdown from "./DropDown"; // Dropdown 컴포넌트 (제공된 파일)
import { useEffect, useState } from "react";
import DateModal from "../pages/modal/Date"; // DateModal 컴포넌트
import EatModal from "../pages/modal/EatDate"; // EatModal 컴포넌트
import DropdownIcon from "../assets/dropdown.svg?react"; // DropdownIcon SVG 컴포넌트

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

export default function DrugRegistration() {
  const [pillName, setpillName] = useState("");
  const [count, setCount] = useState("");
  const [memo, setMemo] = useState("");
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };
  const handleGoToMyPage = () => {
    navigate("/mypage");
  };

  // 이미지와 같은 초기값 설정
  const [schedule, setSchedule] = useState<string>("");
  const [period, setPeriod] = useState<string>("");
  const [modalType, setModalType] = useState<"schedule" | "period" | null>(
    null
  );
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [selectedDay, setSelectedDay] = useState("화");
  const [selectedAmPm, setSelectedAmPm] = useState("오후");
  const [selectedHour, setSelectedHour] = useState("6시");
  const [selectedMinute, setSelectedMinute] = useState("00분");

  const [currentScheduleDays, setCurrentScheduleDays] = useState<string>("");
  const [currentScheduleTime, setCurrentScheduleTime] = useState<string>("");
  const [currentScheduleStart, setCurrentScheduleStart] = useState<Date | null>(
    null
  );
  const [currentScheduleEnd, setCurrentScheduleEnd] = useState<Date | null>(
    null
  );

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
      .map((drug) => drug.pillName); // pillName만 추출

    setSuggestions(filtered);
  }, [pillName]);

  // const handleScheduleClose = (selectedDay?: string, selectedTime?: string) => {
  //   setModalType(null);
  //   if (selectedDay && selectedTime) {
  //     // 시간 문자열 분리
  //    const [ampm, hour, minute] = selectedTime.split(" ");

  //     setSelectedDay(selectedDay);
  //     setSelectedAmPm(ampm);
  //     setSelectedHour(hour);
  //     setSelectedMinute(minute);

  //     // 24시간 포맷으로 변환
  //     let hourNum = parseInt(hour.replace("시", ""));
  //     if (ampm === "오후" && hourNum !== 12) hourNum += 12;
  //     if (ampm === "오전" && hourNum === 12) hourNum = 0;
  //     const formattedHour = String(hourNum).padStart(2, "0");
  //     const formattedSchedule = `${selectedDay} ${formattedHour}:${minute.replace(
  //       "분",
  //       ""
  //     )}`;
  //     setSchedule(`${selectedDay} ${selectedTime}`);
  //     setCurrentScheduleDays(selectedDay);
  //   }
  // };

  const handleScheduleClose = (selectedDay?: string, selectedTime?: string) => {
    setModalType(null);
    if (selectedDay && selectedTime) {
      // selectedTime은 "오후 6시 00분" 형태
      setSchedule(`${selectedDay} ${selectedTime}`);
      setCurrentScheduleDays(selectedDay); // "월,화,수" 형태
      setCurrentScheduleTime(selectedTime); // ⭐️ 시간 저장
    }
  };

  // const handlePeriodClose = (start?: Date, end?: Date) => {
  //   setModalType(null);
  //   if (start && end) {
  //     setSelectedStartDate(start);
  //     setSelectedEndDate(end);

  //     const formatDate = (date: Date) => {
  //       const yy = String(date.getFullYear()).slice(2);
  //       const mm = String(date.getMonth() + 1).padStart(2, "0");
  //       const dd = String(date.getDate()).padStart(2, "0");
  //       return `${yy}.${mm}.${dd}`;
  //     };
  //     const periodString = `${formatDate(start)} ~ ${formatDate(end)}`;
  //     setPeriod(periodString);
  //     setCurrentScheduleStart(start);
  //     setCurrentScheduleEnd(end);
  //   }
  // };

  const handlePeriodClose = (start?: Date, end?: Date) => {
    setModalType(null);
    if (start && end) {
      setSelectedStartDate(start);
      setSelectedEndDate(end);

      const formatDate = (date: Date) => {
        const yy = String(date.getFullYear()).slice(2);
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        return `${yy}.${mm}.${dd}`;
      };
      const periodString = `${formatDate(start)} ~ ${formatDate(end)}`;
      setPeriod(periodString);
      setCurrentScheduleStart(start);
      setCurrentScheduleEnd(end);
    }
  };

  // const handleSubmit = () => {
  //   // ✅ 등록 버튼 클릭 시 통합 로직 실행
  //   if (currentScheduleDays && currentScheduleStart && currentScheduleEnd) {
  //     // 1. 기존 스케줄 불러오기
  //     const existingSchedulesString = localStorage.getItem("drugSchedules");
  //     let existingSchedules = [];
  //     try {
  //       if (existingSchedulesString) {
  //         existingSchedules = JSON.parse(existingSchedulesString);
  //       }
  //     } catch (e) {
  //       console.error("Failed to parse drugSchedules from localStorage:", e);
  //     }

  //     // 2. 새로운 스케줄 객체 생성 및 추가 (Date 객체를 JSON 직렬화를 위해 string으로 저장)
  //     const newSchedule = {
  //       days: currentScheduleDays, // 콤마로 구분된 요일 문자열 ("월, 화, 수")
  //       start: currentScheduleStart.toISOString(),
  //       end: currentScheduleEnd.toISOString(),
  //     };

  //     const updatedSchedules = [...existingSchedules, newSchedule];

  //     // 3. 업데이트된 스케줄 저장
  //     localStorage.setItem("drugSchedules", JSON.stringify(updatedSchedules));

  //     // 편의상 기존 단일 약물 저장 방식도 유지 (달력 컴포넌트에서 drugSchedules를 사용하도록 변경할 예정)
  //     // localStorage.setItem("drugPeriod", JSON.stringify({ start: currentScheduleStart, end: currentScheduleEnd }));
  //   }

  //   // ✅ Main 페이지로 이동
  //   navigate("/main");
  // };

  const handleSubmit = () => {
    if (
      !pillName ||
      !currentScheduleDays ||
      !currentScheduleTime ||
      !currentScheduleStart ||
      !currentScheduleEnd
    ) {
      alert("약품명, 복용 일정, 복용 기간을 모두 입력해 주세요.");
      return;
    }

    // 1. 기존 스케줄 불러오기
    const existingSchedulesString = localStorage.getItem("drugSchedules");
    let existingSchedules = [];
    try {
      if (existingSchedulesString) {
        existingSchedules = JSON.parse(existingSchedulesString);
      }
    } catch (e) {
      console.error("Failed to parse drugSchedules from localStorage:", e);
    }

    // 2. 새로운 스케줄 객체 생성 및 추가 (Date 객체를 JSON 직렬화를 위해 string으로 저장)
    const newSchedule = {
      pillName: pillName, // ⭐️ 약품명 추가
      count: count || "1정", // ⭐️ 복용량 추가
      memo: memo || "", // ⭐️ 메모 추가
      days: currentScheduleDays, // 콤마로 구분된 요일 문자열 ("월,화,수")
      time: currentScheduleTime, // ⭐️ 시간 문자열 ("오후 6시 00분")
      start: currentScheduleStart.toISOString(),
      end: currentScheduleEnd.toISOString(),
    };

    const updatedSchedules = [...existingSchedules, newSchedule];

    // 3. 업데이트된 스케줄 저장
    localStorage.setItem("drugSchedules", JSON.stringify(updatedSchedules));

    // Main 페이지로 이동
    navigate("/main");
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
        {/* ⭐️ Dropdown 컴포넌트로 대체: 복용 일정 */}
        <DropdownWrapper>
          <Dropdown
            label="복용 일정"
            options={[]} // 모달 사용 시 옵션은 필요 없으므로 빈 배열 전달
            selected={schedule}
            onSelect={() => {}}
            disableDefaultUI={true} // 드롭다운 메뉴 대신 모달 사용
            onClick={() => setModalType("schedule")} // 클릭 시 모달 열기
            placeholder=""
          />
        </DropdownWrapper>
        {/* ⭐️ Dropdown 컴포넌트로 대체: 복용 기간 */}
        <DropdownWrapper>
          <Dropdown
            label="복용 기간"
            options={[]} // 모달 사용 시 옵션은 필요 없으므로 빈 배열 전달
            selected={period}
            onSelect={() => {}}
            disableDefaultUI={true} // 드롭다운 메뉴 대신 모달 사용
            onClick={() => setModalType("period")} // 클릭 시 모달 열기
            placeholder=""
          />
        </DropdownWrapper>
        <ToggleWrapper>
          <div>알림 설정</div>
          <ToggleLabel>
            <ToggleInput type="checkbox" />
            <ToggleSlider />
          </ToggleLabel>
        </ToggleWrapper>
        <Submit onClick={handleSubmit}>등록하기</Submit>
      </Content>
      {modalType === "schedule" && (
        <EatModal
          isOpen={modalType === "schedule"}
          onClose={handleScheduleClose}
          initialDay={selectedDay}
          initialAmPm={selectedAmPm}
          initialHour={selectedHour}
          initialMinute={selectedMinute}
        />
      )}
      {modalType === "period" && (
        <DateModal
          isOpen={modalType === "period"}
          onClose={handlePeriodClose}
          initialStart={selectedStartDate}
          initialEnd={selectedEndDate}
        />
      )}
    </Container>
  );
}
