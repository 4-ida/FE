import styled from "styled-components";
import React, { useState } from "react";
import Nav from "../components/nav";
import bb from "../assets/backbutton.svg";
import { useNavigate } from "react-router-dom";
import Dropdown from "../pages/DropDown";
import axiosInstance from "../axiosInstance";

export default function DrinkAlcohol() {
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };
  const handleGoToMyPage = () => {
    navigate("/mypage");
  };
  const GotoWhatDrink = () => {
    navigate("/whatdrink");
  };

  const [showContain, setShowContain] = useState(false);
  const handleCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowContain(e.target.checked);
  };

  const [drink, setDrink] = useState("");
  const drinkOptions = [
    "맥주 (4.5%) (500ml)",
    "소주 (17%) (360ml)",
    "와인 (12%) (150ml)",
    "위스키 (40%) (45ml)",
  ];
  const [two, setTwo] = useState("");
  const [percent, setPercent] = useState("");
  const twoOptions = ["오전", "오후"];
  const [time, setTime] = useState("시");
  const timeOptions = [
    "1시",
    "2시",
    "3시",
    "4시",
    "5시",
    "6시",
    "7시",
    "8시",
    "9시",
    "10시",
    "11시",
    "12시",
  ];
  const [caffaine, setCaffaine] = useState("");
  const [minute, setMinute] = useState("");
  const [cup, setCup] = useState("");
  const first = {
    drink: "",
    caffaine: "",
    two: "",
    cup: "",
    time: "",
    minute: "",
    percent: "",
  };
  const handleReset = () => {
    setDrink(first.drink);
    setTime(first.time);
    setCaffaine(first.caffaine);
    setCup(first.cup);
    setMinute(first.minute);
    setTwo(first.two);
    setPercent(first.percent);
  };

  // 알코올 섭취 페이지 연동
  const handleAlcohol = async () => {
    // 필수 필드 검증
    if (!drink || !cup || !two || time === "시" || !minute) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    try {
      console.log("🍺 [알코올 섭취 등록] 요청 시작");
      console.log("📥 입력된 drink 값:", drink);
      console.log("📥 입력된 cup 값:", cup);
      console.log("📥 입력된 two 값:", two);
      console.log("📥 입력된 time 값:", time);
      console.log("📥 입력된 minute 값:", minute);
      
      // 알코올 종류에서 이름, 도수, 용량 추출
      // 예: "맥주 (4.5%) (500ml)" → alcoholType: "맥주", abv: 4.5, defaultVolume: 500
      // 정규식: 이름 (도수%) (용량ml)
      const drinkMatch = drink.match(/^(.+?)\s*\((\d+(?:\.\d+)?)%\)\s*\((\d+)ml\)$/);
      let alcoholType = drink;
      let abv = 0;
      let defaultVolumeMl = 0;

      console.log("📥 정규식 매칭 결과:", drinkMatch);

      if (drinkMatch && drinkMatch.length >= 4) {
        alcoholType = drinkMatch[1].trim();
        abv = parseFloat(drinkMatch[2]);
        defaultVolumeMl = parseFloat(drinkMatch[3]);
        console.log("📥 파싱된 alcoholType:", alcoholType);
        console.log("📥 파싱된 abv:", abv);
        console.log("📥 파싱된 defaultVolumeMl:", defaultVolumeMl);
      } else {
        // 정규식 매칭 실패 시 전체 문자열을 이름으로 사용하고 기본값 설정
        alcoholType = drink.trim();
        console.log("📥 정규식 매칭 실패, 전체 문자열 사용:", alcoholType);
        
        // 기본값 설정 (도수와 용량이 없는 경우)
        const defaultAbv: Record<string, number> = {
          "맥주": 4.5,
          "소주": 17,
          "와인": 12,
          "위스키": 40,
        };
        const defaultVolume: Record<string, number> = {
          "맥주": 500,
          "소주": 360,  // 변경: 50ml → 360ml
          "와인": 150,
          "위스키": 45,  // 변경: 30ml → 45ml
        };
        abv = defaultAbv[alcoholType] || 0;
        defaultVolumeMl = defaultVolume[alcoholType] || 100;
        console.log("📥 기본값으로 설정된 abv:", abv);
        console.log("📥 기본값으로 설정된 defaultVolumeMl:", defaultVolumeMl);
      }

      // alcoholType이 비어있거나 null인 경우 처리
      if (!alcoholType || alcoholType.trim() === "") {
        console.error("❌ alcoholType이 비어있습니다!");
        alert("알코올 종류를 선택해주세요.");
        return;
      }

      // 도수 변경이 있으면 사용
      if (showContain && caffaine) {
        abv = parseFloat(caffaine);
        console.log("📥 사용자 입력 도수 사용:", abv);
      }

      // 용량 계산
      // 파싱된 기본 용량 × 잔 수
      let volumeMl = defaultVolumeMl * parseFloat(cup || "1");
      console.log("📥 계산된 기본 용량 (기본용량 × 잔수):", volumeMl);
      
      // 용량 변경이 있으면 사용 (사용자가 직접 입력한 용량으로 덮어쓰기)
      if (showContain && percent) {
        volumeMl = parseFloat(percent);
        console.log("📥 사용자 입력 용량 사용:", volumeMl);
      }

      // 섭취 시간 변환
      const intakeAt = convertToISO(two, time, minute);
      console.log("📥 변환된 섭취 시간:", intakeAt);

      const requestData = {
        alcoholType: alcoholType,
        volumeMl: Math.round(volumeMl),
        abv: abv,
        intakeAt,
      };

      console.log("📤 요청 URL: POST /api/v1/intakespage/intakes/alcohol");
      console.log("📤 최종 요청 데이터:", requestData);
      console.log("📤 alcoholType 값 확인:", requestData.alcoholType);

      const res = await axiosInstance.post(
        `/api/v1/intakespage/intakes/alcohol`,
        requestData
      );

      console.log("✅ [알코올 섭취 등록] 성공");
      console.log("📥 응답 상태:", res.status);
      console.log("📥 응답 데이터:", res.data);

      if (res.status === 201) {
        alert("알코올 섭취가 등록되었습니다.");
        GotoWhatDrink();
      }
    } catch (err: any) {
      console.error("❌ [알코올 섭취 등록] 실패");
      
      if (err.response) {
        const status = err.response.status;
        console.error("📥 에러 상태 코드:", status);
        console.error("📥 에러 응답 데이터:", err.response.data);
        console.error("📥 에러 응답 헤더:", err.response.headers);
        
        if (status === 400) {
          console.error("🚨 [400 Bad Request] 잘못된 요청");
          alert("입력한 정보를 확인해주세요.");
        } else if (status === 502) {
          console.error("🚨 [502 Bad Gateway] 서버 게이트웨이 오류");
          alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        } else {
          alert("알코올 섭취 등록에 실패했습니다.");
        }
      } else if (err.request) {
        console.error("📥 요청은 전송되었지만 응답을 받지 못했습니다:", err.request);
        console.error("🚨 네트워크 오류 또는 서버 연결 실패");
        alert("네트워크 오류가 발생했습니다. 연결을 확인해주세요.");
      } else {
        console.error("📥 에러 메시지:", err.message);
        alert("알코올 섭취 등록에 실패했습니다.");
      }
      console.error("📥 전체 에러 객체:", err);
    }
  };

  // convertToISO(meridiem: string, hour: string, minute: string)
  function convertToISO(meridiem: string, hour: string, minute: string) {
    // hour: "1시" → 1 숫자로 변환
    const h = Number(hour.replace("시", ""));
    const m = Number(minute || "0");

    let convertedHour = h;

    if (meridiem === "오전") {
      if (h === 12) convertedHour = 0; // 오전 12시는 00시
    } else if (meridiem === "오후") {
      if (h !== 12) convertedHour = h + 12; // 오후 +12
    }

    // 오늘 날짜 기준
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    // ISO 8601 생성
    return `${year}-${month}-${day}T${String(convertedHour).padStart(
      2,
      "0"
    )}:${String(m).padStart(2, "0")}:00`;
  }

  return (
    <Screen>
      <Header>
        <Back src={bb} alt="뒤로 가기" onClick={handleGoBack} />
        <Ht onClick={handleGoToMyPage}>마이페이지</Ht>
      </Header>
      <Container>
        <Drop
          label="섭취 알코올 종류"
          selected={drink}
          options={drinkOptions}
          onSelect={setDrink}
        ></Drop>
        <LongBox>
          <CupText>마신 잔 수</CupText>
          <CupBox>
            <Cup
              type="number"
              value={cup}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCup(e.target.value)
              }
            ></Cup>
            <Count>잔</Count>
          </CupBox>
          <ChangeContainer>
            <Check checked={showContain} onChange={handleCheckChange} />
            <ChangeText>도수 및 용량 변경</ChangeText>
          </ChangeContainer>
        </LongBox>
        {showContain && (
          <ContainBox>
            <CaffaineBox>
              <CaffaineText>도수 변경</CaffaineText>
              <CaffaineWrapper>
                <Caffaine
                  type="number"
                  value={caffaine}
                  onChange={(e) => setCaffaine(e.target.value)}
                />
                <Text>%</Text>
              </CaffaineWrapper>
            </CaffaineBox>
            <CaffaineBox>
              <CaffaineText>용량 변경</CaffaineText>
              <CaffaineWrapper>
                <Caffaine
                  type="number"
                  value={percent}
                  onChange={(e) => setPercent(e.target.value)}
                />
                <Text>ml</Text>
              </CaffaineWrapper>
            </CaffaineBox>
          </ContainBox>
        )}
        <DrinkBox>
          <DrinkText>섭취 시간</DrinkText>
          <DropdownLine>
            <Dropdown
              variant="custom"
              selected={two}
              options={twoOptions}
              onSelect={setTwo}
            ></Dropdown>
            <Dropdown
              variant="custom"
              selected={time}
              options={timeOptions}
              onSelect={setTime}
            ></Dropdown>

            <div style={{ position: "relative", display: "inline-block" }}>
              <Time
                type="number"
                value={minute}
                onChange={(e) => setMinute(e.target.value)}
              />
              <UnitLabel>분</UnitLabel>
            </div>
          </DropdownLine>
        </DrinkBox>
      </Container>
      <ButtonLine>
        <CaffainePlus onClick={handleReset}>초기화</CaffainePlus>
        <AlcoholPlus
          onClick={() => {
            handleAlcohol(); // 1) API 연동 실행
            // 성공 시 GotoWhatDrink()가 handleAlcohol 내부에서 호출됨
          }}
        >
          완료
        </AlcoholPlus>
      </ButtonLine>
      <Nav />
    </Screen>
  );
}
const Screen = styled.div`
  position: relative;
  width: 393px;
  height: 852px;
  background: #ffffff;
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
const ButtonLine = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0px;
  gap: 6px;

  position: fixed;
  bottom: 99px;
  width: 363px;
  height: 42px;
  transform: translateX(4%);
`;
const CaffainePlus = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;

  width: 170px;
  height: 42px;

  background: #ebebeb;
  border-radius: 5px;

  /* Inside auto layout */
  flex: none;
  order: 0;
  flex-grow: 0;

  font-family: "Pretendard";
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 24px;
  /* identical to box height */
  text-align: center;

  color: #000000;
`;
const AlcoholPlus = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;

  width: 180px;
  height: 42px;

  background: #b6f500;
  border-radius: 5px;

  /* Inside auto layout */
  flex: none;
  order: 1;
  flex-grow: 0;
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 24px;
  /* identical to box height */
  text-align: center;
  color: #000000;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 30px;
  position: absolute;
  width: 363px;
  height: 452px;
  left: 15px;
  top: 85px;
`;

const Drop = styled(Dropdown)`
  display: flex;
  flex: none;
  flex-direction: column;
  gap: 8px;
`;

const CaffaineBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 8px;

  width: 174px;
  height: auto;

  /* 내부 오토레이아웃 */
  flex: none;
`;

const CaffaineText = styled.div`
  /* 카페인 함량 */

  width: 174px;
  height: 21px;

  font-family: "Pretendard";
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 21px;

  color: #333333;

  /* 내부 오토레이아웃 */
  flex: none;

  align-self: stretch;
  flex-grow: 0;
`;

const CaffaineWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const Caffaine = styled.input`
  position: relative;
  width: 134px;
  height: 40px;
  padding-right: 30px;
  border: 1.5px solid #ebebeb;
  border-radius: 5px;
  padding-left: 10px;
  /* 내부 오토레이아웃 */
  flex: none;

  align-self: stretch;
  flex-grow: 0;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const Text = styled.div`
  position: absolute;
  width: auto;
  height: 21px;
  right: 10px;
  padding-right: 10px;
  top: calc(50% - 21px / 2 - 0.5px);
  pointer-events: none;
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 21px;

  color: #333333;
`;

const ContainBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 15px;

  width: 363px;
  height: auto;

  /* 내부 오토레이아웃 */
  flex: none;

  flex-grow: 0;
`;

const DrinkBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 15px;

  width: 363px;
  height: auto;

  /* Inside auto layout */
  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;
`;

const DrinkText = styled.div`
  width: 363px;
  height: 21px;

  font-family: "Pretendard";
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 21px;

  color: #333333;

  /* Inside auto layout */
  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;
`;

const DropdownLine = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 8px;
  width: 363px;
  /* Inside auto layout */
`;

const Time = styled.input`
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  /* identical to box height */

  color: #333333;

  /* Inside auto layout */
  flex: none;
  order: 0;
  flex-grow: 0;

  width: 111px;
  height: 40px;

  background: #ffffff;
  border: 1.5px solid #ebebeb;
  border-radius: 5px;
  box-sizing: border-box;
  padding-left: 10px;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;
const UnitLabel = styled.span`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  color: #333;
  pointer-events: none;

  font-family: "Pretendard";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;

  color: #333333;
`;
const LongBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 8px;

  width: 363px;
  height: auto;

  /* 내부 오토레이아웃 */
  flex: none;
`;

const CupText = styled.div`
  width: 363px;
  height: 21px;

  font-family: "Pretendard";
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 21px;

  color: #333333;
`;

const CupBox = styled.div`
  position: relative;
  display: inline-block;
`;

const ChangeContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Check = styled.input.attrs({ type: "checkbox" })`
  width: 16px;
  height: 16px;
  accent-color: #b6f500; /* 체크 표시 색 */
  border: 2px solid #b6f500;
  border-radius: 6px;
  cursor: pointer;
`;

const ChangeText = styled.div`
  font-size: 15px;
  font-weight: 400;
`;

const Cup = styled.input`
  position: relative;
  width: 323px;
  height: 40px;
  padding-right: 30px;
  border: 1.5px solid #ebebeb;
  border-radius: 5px;
  padding-left: 10px;
  /* 내부 오토레이아웃 */
  flex: none;

  align-self: stretch;
  flex-grow: 0;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;
const Count = styled.div`
  position: absolute;
  width: auto;
  height: 21px;
  right: 10px;
  padding-right: 10px;
  top: calc(50% - 21px / 2 - 0.5px);
  pointer-events: none;
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 21px;

  color: #333333;
`;
