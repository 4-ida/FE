// import styled from "styled-components";
// import bb from "../assets/backbutton.svg";
// import { useNavigate, useLocation } from "react-router-dom";
// import Dropdown from "./DropDown"; // Dropdown 컴포넌트 (제공된 파일)
// import { useEffect, useState } from "react";

// const Container = styled.div`
//   display: flex;
//   width: 393px;
//   height: 852px;
//   background-color: #fff;
//   flex-direction: column;
//   align-items: center;
//   color: #333;
// `;

// const Header = styled.div`
//   display: flex;
//   width: 100%;
//   height: 60px;
//   align-items: center;
//   padding: 0 15px;
//   box-sizing: border-box;
//   justify-content: space-between;
// `;

// const Back = styled.img`
//   color: #333;
//   cursor: pointer;
// `;

// const Ht = styled.div`
//   font-family: "Pretendard";
//   font-weight: 500;
//   font-size: 15px;
//   cursor: pointer;
// `;

// const Today = styled.div`
//   display: flex;
//   justify-content: center;
//   font-weight: 600;
//   font-size: 20px;
//   margin-bottom: 12px;
// `;

// const Content = styled.div`
//   display: flex;
//   flex-direction: column;
//   width: 100%;
//   padding: 0 15px;
//   box-sizing: border-box;
//   margin-top: 18px;
//   font-family: "Pretendard";
//   font-style: normal;
//   font-weight: 500;
//   font-size: 18px;
//   position: relative;
// `;

// const InputWrapper = styled.div`
//   position: relative;
//   width: 363px;
// `;

// const Inputtext = styled.input<{ type: string; value: string }>`
//   display: flex;
//   width: 363px;
//   height: 40px;
//   border: 1.5px solid #ebebeb;
//   border-radius: 5px;
//   margin-top: 8px;
//   align-items: center;
//   box-sizing: border-box;
//   margin-bottom: 20px;
//   padding: 15px;
//   font-family: "Pretendard", sans-serif;
//   font-weight: 400;
//   font-size: 16px;

//   &:focus {
//     outline: none;
//     border: 1.5px solid #b6f500;
//   }

//   &:active {
//     outline: none;
//   }
// `;

// const SuggestionBox = styled.ul`
//   position: absolute;
//   top: 55px;
//   width: 100%;
//   background: #fff;
//   border: 1.5px solid #ebebeb;
//   border-radius: 5px;
//   list-style: none;
//   padding: 5px;
//   margin: 0;
//   max-height: 150px;
//   overflow-y: auto;
//   z-index: 10;
//   box-sizing: border-box;
// `;

// const SuggestionItem = styled.li`
//   padding: 10px 15px;
//   cursor: pointer;
//   font-family: "Pretendard";
//   font-weight: 400;
//   font-size: 16px;
//   &:hover {
//     background-color: #e8ffcc;
//   }
// `;

// const DropdownLabel = styled.div`
//   font-family: "Pretendard";
//   font-weight: 500;
//   font-size: 18px;
//   margin-bottom: 8px;
// `;

// const DropdownWrapper = styled.div`
//   display: flex;
//   margin-bottom: 20px;
//   gap: 8px;
//   box-sizing: border-box;
//   font-family: "Pretendard";
//   font-size: 16px;
//   font-weight: 400;
// `;

// const ToggleWrapper = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   width: 100%;
//   margin-bottom: 40px;
// `;

// const ToggleLabel = styled.label`
//   position: relative;
//   display: inline-block;
//   width: 48px;
//   height: 25.92px;
//   box-sizing: border-box;
// `;

// const ToggleInput = styled.input`
//   opacity: 0;
//   width: 0;
//   height: 0;

//   &:checked + span {
//     background-color: #b6f500;
//   }

//   &:checked + span:before {
//     transform: translateX(21px);
//     background-color: #fff;
//   }
// `;

// const ToggleSlider = styled.span`
//   position: absolute;
//   cursor: pointer;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   background-color: #fff;
//   transition: 0.4s;
//   border-radius: 28px;
//   border: 1px solid #9dd300;
//   box-sizing: border-box;

//   &:before {
//     position: absolute;
//     content: "";
//     height: 19.2px;
//     width: 19.2px;
//     left: 3px;
//     bottom: 2.46px;
//     background-color: #b6f500;
//     transition: 0.4s;
//     border-radius: 50%;
//   }
// `;

// const Submit = styled.div`
//   width: 363px;
//   height: 45px;
//   background: #b6f500;
//   border-radius: 5px;
//   font-family: "Pretendard";
//   font-style: normal;
//   font-weight: 500;
//   font-size: 18px;
//   box-sizing: border-box;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   cursor: pointer;
// `;

// const Button = styled.div<{ status: string }>`
//   display: flex;
//   font-family: "Pretendard", sans-serif;
//   font-size: 16px;
//   font-weight: 400;
//   cursor: pointer;
//   width: 170px;
//   height: 40px;
//   justify-content: center;
//   align-items: center;
//   background-color: aliceblue;
//   border-radius: 5px;
//   box-sizing: border-box;
//   background-color: ${(props) =>
//     props.status === "scheduled" ? "#C3EBFF" : "#FFCCC3"};
// `;

// const StatusDropdownWrapper = styled.div`
//   display: flex;
//   margin-top: 8px;
//   margin-bottom: 20px;
//   gap: 8px; /* 버튼과 드롭다운 사이 간격 */
//   align-items: center;
//   width: 100%; /* 전체 너비를 사용하도록 설정 */
//   font-size: 16px;
// `;

// const AM_PM = ["오후", "오전"];
// // 1시부터 12시까지 (12개)
// const HOURS = Array.from({ length: 12 }, (_, i) => `${i + 1}시`);
// const MINUTES = ["00분", "10분", "20분", "30분", "40분", "50분"];

// export default function DrugChange() {
//   const [pillName, setpillName] = useState("");
//   const [count, setCount] = useState("");
//   const [memo, setMemo] = useState("");
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [displayDate, setDisplayDate] = useState("오늘");
//   // ⭐️ 등록될 날짜 (YYYY-MM-DD 형식) 상태 추가
//   const [selectedRegistrationDate, setSelectedRegistrationDate] =
//     useState<string>("");

//   const handleGoBack = () => {
//     navigate(-1);
//   };
//   const handleGoToMyPage = () => {
//     navigate("/mypage");
//   };

//   const [suggestions, setSuggestions] = useState<string[]>([]);
//   const [showSuggestions, setShowSuggestions] = useState(false);

//   const [selectedAmPm, setSelectedAmPm] = useState("오후");
//   const [selectedHour, setSelectedHour] = useState("6시");
//   const [selectedMinute, setSelectedMinute] = useState("00분");
//   const [currentScheduleTime, setCurrentScheduleTime] =
//     useState("오후 6시 00분");

//   const [status, setStatus] = useState("scheduled");
//   const handleClick = () => {
//     setStatus((prev) => (prev === "scheduled" ? "canceled" : "scheduled"));
//   };
//   const EATING_OPTIONS = ["복용 완료", "복용 전"];
//   const [selectedEatingStatus, setSelectedEatingStatus] = useState("식후");

//   useEffect(() => {
//     const query = new URLSearchParams(location.search);
//     const dateParam = query.get("date"); // 'YYYY-MM-DD' 형식의 날짜 문자열

//     if (dateParam) {
//       // ... (날짜 포맷 로직 유지)
//       const date = new Date(dateParam);
//       setSelectedRegistrationDate(dateParam);

//       if (!isNaN(date.getTime())) {
//         const month = date.getMonth() + 1;
//         const day = date.getDate();
//         setDisplayDate(`${month}월 ${day}일`);
//       }
//     }
//   }, [location.search]);

//   const mockDrugs = [
//     { id: "0", pillName: "타이레놀정500mg" },
//     { id: "1", pillName: "타이레놀정160mg" },
//     { id: "2", pillName: "게보린정" },
//     { id: "3", pillName: "아스피린정100mg" },
//     { id: "4", pillName: "판피린큐" },
//     { id: "5", pillName: "이부프로펜정200mg" },
//     { id: "6", pillName: "탁센정" },
//     { id: "7", pillName: "부루펜시럽" },
//     { id: "8", pillName: "써스펜" },
//     { id: "9", pillName: "애드빌리퀴겔" },
//     { id: "10", pillName: "신일해열정" },
//     { id: "11", pillName: "나프록센정250mg" },
//     { id: "12", pillName: "아모디핀정5mg" },
//   ];

//   useEffect(() => {
//     // 인라인 드롭다운 값이 변경될 때마다 currentScheduleTime 업데이트
//     setCurrentScheduleTime(`${selectedAmPm} ${selectedHour} ${selectedMinute}`);
//   }, [selectedAmPm, selectedHour, selectedMinute]);

//   useEffect(() => {
//     if (pillName.trim() === "") {
//       setSuggestions([]);
//       return;
//     }

//     const filtered = mockDrugs
//       .filter((drug) =>
//         drug.pillName.toLowerCase().includes(pillName.toLowerCase())
//       )
//       .map((drug) => drug.pillName); // pillName만 추출

//     setSuggestions(filtered);
//   }, [pillName]);

//   const handleSubmit = () => {
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
//       pillName: pillName, // ⭐️ 약품명 추가
//       count: count || "1정", // ⭐️ 복용량 추가
//       memo: memo || "", // ⭐️ 메모 추가
//       time: currentScheduleTime, // ⭐️ 시간 문자열 ("오후 6시 00분")
//       // ⭐️ 등록 날짜 정보 추가 (캘린더 점 표시용)
//       registrationDate: selectedRegistrationDate,
//     };

//     const updatedSchedules = [...existingSchedules, newSchedule];

//     // 3. 업데이트된 스케줄 저장
//     localStorage.setItem("drugSchedules", JSON.stringify(updatedSchedules));

//     // Main 페이지로 이동
//     navigate("/main");
//   };

//   return (
//     <Container>
//       <Header>
//         <Back src={bb} alt="뒤로 가기" onClick={handleGoBack} />
//         <Ht onClick={handleGoToMyPage}>마이페이지</Ht>
//       </Header>
//       <Content>
//         <Today>{displayDate}</Today>
//         약품 명
//         <InputWrapper>
//           <Inputtext
//             type="text"
//             value={pillName}
//             onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//               setpillName(e.target.value);
//               setShowSuggestions(true);
//             }}
//             onFocus={() => setShowSuggestions(true)}
//             onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
//           />
//           {showSuggestions && suggestions.length > 0 && (
//             <SuggestionBox>
//               {suggestions.map((name, i) => (
//                 <SuggestionItem
//                   key={i}
//                   onClick={() => {
//                     setpillName(name);
//                     setShowSuggestions(false);
//                   }}
//                 >
//                   {name}
//                 </SuggestionItem>
//               ))}
//             </SuggestionBox>
//           )}
//         </InputWrapper>
//         복용량
//         <Inputtext
//           type="number"
//           value={count}
//           onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//             setCount(e.target.value)
//           }
//         ></Inputtext>
//         메모
//         <Inputtext
//           type="text"
//           value={memo}
//           onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//             setMemo(e.target.value)
//           }
//         ></Inputtext>
//         <DropdownLabel>복용 일정</DropdownLabel>
//         <DropdownWrapper>
//           <Dropdown
//             options={AM_PM}
//             selected={selectedAmPm}
//             onSelect={setSelectedAmPm}
//             variant="default" // Dropdown 컴포넌트의 기본 UI 사용
//           />
//           <Dropdown
//             options={HOURS}
//             selected={selectedHour}
//             onSelect={setSelectedHour}
//             variant="default" // Dropdown 컴포넌트의 기본 UI 사용
//           />
//           <Dropdown
//             options={MINUTES}
//             selected={selectedMinute}
//             onSelect={setSelectedMinute}
//             variant="default" // Dropdown 컴포넌트의 기본 UI 사용
//           />
//         </DropdownWrapper>
//         복용 상태
//         <StatusDropdownWrapper>
//           <Button onClick={handleClick} status={status}>
//             {status === "scheduled" ? "예정" : "취소"}
//           </Button>

//           {/* ⭐️ 예정 상태일 때만 드롭다운 렌더링 */}
//           {status === "scheduled" && (
//             <Dropdown
//               options={EATING_OPTIONS}
//               selected={selectedEatingStatus}
//               onSelect={setSelectedEatingStatus}
//               variant="default"
//             />
//           )}
//         </StatusDropdownWrapper>
//         <ToggleWrapper>
//           <div>알림 설정</div>
//           <ToggleLabel>
//             <ToggleInput type="checkbox" />
//             <ToggleSlider />
//           </ToggleLabel>
//         </ToggleWrapper>
//         <Submit onClick={handleSubmit}>등록하기</Submit>
//       </Content>
//     </Container>
//   );
// }

import styled from "styled-components";
import bb from "../assets/backbutton.svg";
import { useNavigate, useLocation } from "react-router-dom"; // ✅ useLocation 추가
import Dropdown from "./DropDown"; // Dropdown 컴포넌트 (제공된 파일)
import { useEffect, useState } from "react";
import DateModal from "../pages/modal/Date"; // DateModal 컴포넌트
import EatModal from "../pages/modal/EatDate"; // EatModal 컴포넌트
import DropdownIcon from "../assets/dropdown.svg?react"; // DropdownIcon SVG 컴포넌트
import type { DrugSchedule } from "./Main";

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

const Button = styled.div<{ status: string }>`
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
    props.status === "scheduled" ? "#C3EBFF" : "#FFCCC3"};
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

// --- [스타일 컴포넌트 정의 끝] ---

// --- [인터페이스 및 유틸리티 함수] ---

// DrugModification.jsx (수정된 전체 코드)

// ... (상단 import 및 스타일 컴포넌트 생략)

// --- [인터페이스 및 유틸리티 함수] ---

const AM_PM = ["오후", "오전"];
// 1시부터 12시까지 (12개)
const HOURS = Array.from({ length: 12 }, (_, i) => `${i + 1}시`);
const MINUTES = ["00분", "10분", "20분", "30분", "40분", "50분"];
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
  const defaultTimeStr = timeStr || "18:00";
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

// --- [컴포넌트 정의] ---

export default function DrugModification() {
  const location = useLocation();
  const navigate = useNavigate();

  const initialPillData: DrugSchedule | undefined = location.state?.pill;

  // 2. 초기 안전값 설정 (days, start, end 오류 방지)
  const defaultPillData: DrugSchedule = {
    id: "",
    pillName: "",
    count: "",
    memo: "",
    time: "18:00",
    registrationDate: "",
    dailyStatus: "SCHEDULED",
    completionStatus: "NONE",
  };
  const dataToUse = initialPillData || defaultPillData;

  // 시간 파싱 (EatModal 초기값)
  const parsedTime = parseTimeForEatModal(dataToUse.time);

  // 4. 상태 초기화
  const [pillName, setpillName] = useState(dataToUse.pillName);
  const [count, setCount] = useState(dataToUse.count);
  const [memo, setMemo] = useState(dataToUse.memo);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [selectedAmPm, setSelectedAmPm] = useState(parsedTime.selectedAmPm);
  const [selectedHour, setSelectedHour] = useState(parsedTime.selectedHour);
  const [selectedMinute, setSelectedMinute] = useState(
    parsedTime.selectedMinute
  );

  const [status, setStatus] = useState(dataToUse.dailyStatus);
  const handleClick = () => {
    setStatus((prev) => (prev === "SCHEDULED" ? "CANCELED" : "SCHEDULED"));
  };
  const EATING_OPTIONS = ["복용 완료", "복용 전"];
  const [selectedEatingStatus, setSelectedEatingStatus] = useState<
    "복용 완료" | "복용 전"
  >("복용 완료");

  useEffect(() => {
    setSelectedEatingStatus(
      dataToUse.completionStatus === "COMPLETED" ? "복용 완료" : "복용 전"
    );
    console.log(dataToUse.completionStatus);
  }, []);

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

  const handleSubmitModification = () => {
    if (!selectedAmPm || !selectedHour || !selectedMinute) {
      alert("복용 일정과 복용 기간을 확인해 주세요.");
      return;
    }

    const timeForStorage = `${selectedAmPm} ${parseInt(
      selectedHour
    )}시 ${parseInt(selectedMinute)}분`;

    const drugs: any[] = JSON.parse(
      localStorage.getItem("drugSchedules") || "[]"
    );

    for (const drug of drugs) {
      if (
        drug.registrationDate === dataToUse.registrationDate &&
        drug.pillName === dataToUse.pillName
      ) {
        drug.count = count || "1정";
        drug.memo = memo;
        drug.pillName = pillName;
        drug.time = timeForStorage;
        drug.dailyStatus = status === "SCHEDULED" ? "SCHEDULED" : "CANCELED";
        drug.completionStatus =
          selectedEatingStatus === "복용 완료" ? "COMPLETED" : "NONE";

        localStorage.setItem("drugSchedules", JSON.stringify(drugs));
        break;
      }
    }

    console.log(drugs);
    localStorage.setItem("drugSchedules", JSON.stringify(drugs));

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
        복용 상태
        <StatusDropdownWrapper>
          <Button onClick={handleClick} status={status}>
            {status === "SCHEDULED" ? "예정" : "취소"}
          </Button>

          {/* ⭐️ 예정 상태일 때만 드롭다운 렌더링 */}
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
            <ToggleInput type="checkbox" />
            <ToggleSlider />
          </ToggleLabel>
        </ToggleWrapper>
        <Submit onClick={handleSubmitModification}>수정 완료</Submit>
      </Content>
    </Container>
  );
}
