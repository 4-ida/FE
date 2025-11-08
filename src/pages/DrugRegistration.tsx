import styled from "styled-components";
import bb from "../assets/backbutton.svg";
import { useNavigate } from "react-router-dom";
import Dropdown from "./DropDown";
import { useEffect, useState } from "react";
import DateModal from "../pages/modal/Date";

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

const DropdownWrapper = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const ToggleWrapper = styled.div`
  display: flex;
  justify-content: space-between; /* 텍스트와 스위치를 양쪽 끝으로 */
  align-items: center; /* 세로 중앙 정렬 */
  width: 100%; /* Content 내부에서 가득 채우도록 */
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
    background-color: #b6f500; /* 활성화 시 배경색 */
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
    height: 19.2px; /* 동그라미 높이 */
    width: 19.2px; /* 동그라미 너비 */
    left: 3px;
    bottom: 2.46px;
    background-color: #b6f500; /* 동그라미 색상 */
    transition: 0.4s;
    border-radius: 50%; /* 완전한 동그라미 */
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

  const [schedule, setSchedule] = useState<string>("");
  const [period, setPeriod] = useState<string>("");
  const [modalType, setModalType] = useState<"schedule" | "period" | null>(
    null
  );

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const mockDrugs = [
    "타이레놀정500mg",
    "타이레놀정160mg",
    "게보린정",
    "아스피린정100mg",
    "판피린큐",
    "이부프로펜정200mg",
    "탁센정",
    "부루펜시럽",
    "써스펜",
    "애드빌리퀴겔",
    "신일해열정",
    "나프록센정250mg",
    "아모디핀정5mg",
  ];

  useEffect(() => {
    if (pillName.trim() === "") {
      setSuggestions([]);
      return;
    }
    const filtered = mockDrugs.filter((drug) =>
      drug.toLowerCase().includes(pillName.toLowerCase())
    );
    setSuggestions(filtered);
  }, [pillName]);

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
        <DropdownWrapper>
          <Dropdown
            label="복용 일정"
            selected={schedule}
            onSelect={setSchedule}
            disableDefaultUI={true}
            options={[]}
            onClick={() => setModalType("schedule")}
          />
        </DropdownWrapper>
        <DropdownWrapper>
          <Dropdown
            label="복용 기간"
            selected={period}
            onSelect={setPeriod}
            disableDefaultUI={true}
            options={[]}
            onClick={() => setModalType("period")}
          />
        </DropdownWrapper>
        <ToggleWrapper>
          <div>알림 설정</div>
          <ToggleLabel>
            <ToggleInput type="checkbox" />
            <ToggleSlider />
          </ToggleLabel>
        </ToggleWrapper>
        <Submit>등록하기</Submit>
      </Content>
      {modalType === "schedule" && (
        <DateModal
          isOpen={modalType === "schedule"}
          onClose={() => setModalType(null)}
        />
      )}
      {modalType === "period" && (
        <DateModal
          isOpen={modalType === "period"}
          onClose={() => setModalType(null)}
        />
      )}
    </Container>
  );
}
