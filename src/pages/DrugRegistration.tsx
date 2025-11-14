import styled from "styled-components";
import bb from "../assets/backbutton.svg";
import { useNavigate, useLocation } from "react-router-dom";
import Dropdown from "./DropDown"; // Dropdown 컴포넌트 (제공된 파일)
import { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";

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

const Today = styled.div`
  display: flex;
  justify-content: center;
  font-weight: 600;
  font-size: 20px;
  margin-bottom: 12px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 15px;
  box-sizing: border-box;
  margin-top: 18px;
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

const DropdownWrapper = styled.div`
  display: flex;
  margin-bottom: 20px;
  gap: 8px;
  box-sizing: border-box;
  font-family: "Pretendard";
  font-size: 16px;
  font-weight: 400;
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

const AM_PM = ["오후", "오전"];
// 1시부터 12시까지 (12개)
const HOURS = Array.from({ length: 12 }, (_, i) => `${i + 1}시`);
const MINUTES = ["00분", "10분", "20분", "30분", "40분", "50분"];

export default function DrugRegistration() {
  const [pillName, setpillName] = useState("");
  const [count, setCount] = useState("");
  const [memo, setMemo] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const [displayDate, setDisplayDate] = useState("오늘");
  const [selectedRegistrationDate, setSelectedRegistrationDate] =
    useState<string>("");

  const handleGoBack = () => {
    navigate(-1);
  };
  const handleGoToMyPage = () => {
    navigate("/mypage");
  };

  interface DrugSuggestion {
    id: number;
    name: string;
  }
  const [suggestions, setSuggestions] = useState<DrugSuggestion[]>([]);

  const [showSuggestions, setShowSuggestions] = useState(false);

  const [selectedAmPm, setSelectedAmPm] = useState("오후");
  const [selectedHour, setSelectedHour] = useState("6시");
  const [selectedMinute, setSelectedMinute] = useState("00분");
  const [selectedDrugId, setSelectedDrugId] = useState<number | null>(null);

  const [isAlarmEnabled, setIsAlarmEnabled] = useState(false);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const dateParam = query.get("date"); // 'YYYY-MM-DD' 형식의 날짜 문자열

    if (dateParam) {
      // ... (날짜 포맷 로직 유지)
      const date = new Date(dateParam);
      setSelectedRegistrationDate(dateParam);

      if (!isNaN(date.getTime())) {
        const month = date.getMonth() + 1;
        const day = date.getDate();
        setDisplayDate(`${month}월 ${day}일`);
      }
    } else {
      // 쿼리 파라미터가 없으면 오늘 날짜로 설정 (API 형식에 맞게)
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      const todayString = `${year}-${month}-${day}`;
      setSelectedRegistrationDate(todayString);
    }
  }, [location.search]);

  const fetchDrugs = async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axiosInstance.get("/api/v1/drug/suggest", {
        params: { q: query, limit: 10 },
      });
      console.log(response.data);

      // API 응답: { data: [{ id, name }, ...] }
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

  // useEffect(() => {
  //   // 인라인 드롭다운 값이 변경될 때마다 currentScheduleTime 업데이트
  //   setCurrentScheduleTime(`${selectedAmPm} ${selectedHour} ${selectedMinute}`);
  // }, [selectedAmPm, selectedHour, selectedMinute]);

  // useEffect(() => {
  //   if (pillName.trim() === "") {
  //     setSuggestions([]);
  //     return;
  //   }

  //   const filtered = mockDrugs
  //     .filter((drug) =>
  //       drug.pillName.toLowerCase().includes(pillName.toLowerCase())
  //     )
  //     .map((drug) => drug.pillName); // pillName만 추출

  //   setSuggestions(filtered);
  // }, [pillName]);

  // ✅ 시간 문자열을 API 요구 형식 (HH:MM)으로 변환하는 헬퍼 함수
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (pillName.trim() !== "") {
        fetchDrugs(pillName);
      }
    }, 300); // 🔹 0.3초 지연 (디바운스)
    return () => clearTimeout(delayDebounce);
  }, [pillName]);

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

  useEffect(() => {
    const pill = location.state?.pill;
    if (pill) {
      setpillName(pill.pillName || "");
      setCount(pill.count || "");
      setMemo(pill.memo || "");
      setSelectedDrugId(pill.drugId || null);

      // 시간 파싱 (HH:MM → AM/PM + 시 + 분)
      if (pill.time) {
        const [hourStr, minuteStr] = pill.time.split(":");
        let hour = parseInt(hourStr, 10);
        let amPm = "오전";
        if (hour >= 12) {
          amPm = "오후";
          if (hour > 12) hour -= 12;
        } else if (hour === 0) {
          hour = 12;
        }
        setSelectedAmPm(amPm);
        setSelectedHour(`${hour}시`);
        setSelectedMinute(`${minuteStr}분`);
      }

      if (pill.registrationDate) {
        setSelectedRegistrationDate(pill.registrationDate);
        const date = new Date(pill.registrationDate);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        setDisplayDate(`${month}월 ${day}일`);
      }
    }
  }, [location.state]);

  const handleSubmit = async () => {
    if (!pillName.trim() || !selectedRegistrationDate) {
      alert("약품명과 날짜를 확인해주세요.");
      return;
    }

    // ⭐️ API 요청 본문 구조화
    const apiTime = convertTimeToApiFormat(
      selectedAmPm,
      selectedHour,
      selectedMinute
    );

    // const drugInfo = mockDrugs.find((drug) => drug.pillName === pillName);
    // // 찾은 ID를 사용하거나, 찾지 못했다면 임시 ID 999를 사용합니다.
    // const drugId = drugInfo ? parseInt(drugInfo.id, 10) : 999;

    const requestBody = {
      drugId: selectedDrugId ?? 0,
      name: pillName,
      dose: count || "1정",
      date: selectedRegistrationDate,
      time: apiTime,
      memo: memo || "복용 정보 메모",
      alarm: {
        enabled: isAlarmEnabled,
      },
    };

    console.log("API 요청 본문:", requestBody);

    try {
      const response = await axiosInstance.post(
        "/api/v1/main/calendar/schedules",
        requestBody
      );

      console.log("✅ 약물 등록 성공:", response.data);
      alert(`${pillName} 복용 일정이 등록되었습니다.`);
      navigate("/main", {
        state: {
          scheduleRegistered: true,
          registrationDate: selectedRegistrationDate,
        },
      });
    } catch (error) {
      console.error("❌ 약물 등록 실패:", error);
      alert("약물 등록에 실패했습니다. 서버 상태를 확인해주세요.");
    }
  };

  return (
    <Container>
      <Header>
        <Back src={bb} alt="뒤로 가기" onClick={handleGoBack} />
        <Ht onClick={handleGoToMyPage}>마이페이지</Ht>
      </Header>
      <Content>
        <Today>{displayDate}</Today>
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
              {suggestions.map((drug: any) => (
                <SuggestionItem
                  key={drug.id}
                  onClick={() => {
                    setpillName(drug.name);
                    setSelectedDrugId(drug.id); // ✅ ID 저장
                    setShowSuggestions(false);
                  }}
                >
                  {drug.name}
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
        <DropdownLabel>복용 일정</DropdownLabel>
        <DropdownWrapper>
          <Dropdown
            options={AM_PM}
            selected={selectedAmPm}
            onSelect={setSelectedAmPm}
            variant="default" // Dropdown 컴포넌트의 기본 UI 사용
          />
          <Dropdown
            options={HOURS}
            selected={selectedHour}
            onSelect={setSelectedHour}
            variant="default" // Dropdown 컴포넌트의 기본 UI 사용
          />
          <Dropdown
            options={MINUTES}
            selected={selectedMinute}
            onSelect={setSelectedMinute}
            variant="default" // Dropdown 컴포넌트의 기본 UI 사용
          />
        </DropdownWrapper>
        <ToggleWrapper>
          <div>알림 설정</div>
          <ToggleLabel>
            <ToggleInput
              type="checkbox"
              // ✅ 알림 설정 상태 및 핸들러 연결
              checked={isAlarmEnabled}
              onChange={(e) => setIsAlarmEnabled(e.target.checked)}
            />
            <ToggleSlider />
          </ToggleLabel>
        </ToggleWrapper>
        <Submit onClick={handleSubmit}>등록하기</Submit>
      </Content>
    </Container>
  );
}
