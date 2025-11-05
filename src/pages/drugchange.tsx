import styled from "styled-components";
import bb from "../assets/backbutton.svg";
import { useNavigate } from "react-router-dom";
import dd from "../assets/dropdown.svg";

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

const Inputtext = styled.div`
  display: flex;
  width: 363px;
  height: 40px;
  border: 1.5px solid #ebebeb;
  border-radius: 5px;
  margin-top: 8px;
  align-items: center;
  margin-bottom: 20px;
  box-sizing: border-box;
`;

const Input = styled.div`
  display: flex;
  width: 363px;
  height: 40px;
  border: 1.5px solid #ebebeb;
  border-radius: 5px;
  margin-top: 8px;
  align-items: center;
  justify-content: flex-end;
  padding-right: 5px;
  margin-bottom: 20px;
  box-sizing: border-box;
`;

const Dd = styled.img`
  color: #333;
  cursor: pointer;
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
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };
  const handleGoToMyPage = () => {
    navigate("/mypage");
  };

  return (
    <Container>
      <Header>
        <Back src={bb} alt="뒤로 가기" onClick={handleGoBack} />
        <Ht onClick={handleGoToMyPage}>마이페이지</Ht>
      </Header>
      <Content>
        약품 명<Inputtext></Inputtext>
        메모
        <Inputtext></Inputtext>
        복용 일정
        <Input>
          <Dd src={dd} />
        </Input>
        복용 기간
        <Input>
          <Dd src={dd} />
        </Input>
        <ToggleWrapper>
          <div>알림 설정</div>
          <ToggleLabel>
            <ToggleInput type="checkbox" />
            <ToggleSlider />
          </ToggleLabel>
        </ToggleWrapper>
        <Submit>등록하기</Submit>
      </Content>
    </Container>
  );
}
