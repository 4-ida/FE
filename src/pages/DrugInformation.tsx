import styled from "styled-components";
import bb from "../assets/backbutton.svg";
import { useNavigate } from "react-router-dom";
import Nav from "../components/nav";
import pill1 from "../assets/pill1.svg";

export default function DrugRegistration() {
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };
  const handleGoToMyPage = () => {
    navigate("/mypage");
  };
  return (
    <Screen>
      <Header>
        <Back src={bb} alt="뒤로 가기" onClick={handleGoBack} />
        <Ht onClick={handleGoToMyPage}>마이페이지</Ht>
      </Header>
      <Container>
        <UpContainer>
          <RightBox>
            <TitleBox>
              <Title>제품명</Title>
              <Box>타이레놀</Box>
            </TitleBox>
            <TitleBox>
              <Title>제형</Title>
              <Box>산제</Box>
            </TitleBox>
          </RightBox>
          <img
            src={pill1}
            alt="타이레놀 앞면 뒷면"
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",

              width: "150px",
              height: "150px",
              borderRadius: "10px",
            }}
          />
        </UpContainer>
        <DownContainer>
          <BigBox>
            <Title2>전문 / 일반</Title2>
            <LongBox>일반</LongBox>
          </BigBox>
          <BigBox>
            <Title2>성분 / 함량</Title2>
            <LongBox>
              Acetaminophen Granule 아세트아미노펜과립 555.556mg
              (아세트아미노펜(으)로서 500mg)
            </LongBox>
          </BigBox>
          <BigBox>
            <Title2>알코올 및 카페인과 상호작용</Title2>
            <LongBox>
              알코올 : 복용 전후 12시간 음주 금지
              <br /> 카페인 : 복용 전후 6시간 카페인 섭취 자제
            </LongBox>
          </BigBox>
          <BigBox>
            <Title2>복용 시 주의사항</Title2>
            <LongBox>
              <li>간 질환자 복용 전 의사 상담</li>
              <li>과량 복용 시 간 손상 위험</li>
            </LongBox>
          </BigBox>
        </DownContainer>
      </Container>
      <Nav></Nav>
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
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 20px;

  position: absolute;
  width: 363px;
  height: 626px;
  left: calc(50% - 363px / 2);
  top: 80px;
`;
const UpContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding: 0px;
  gap: 15px;

  width: 363px;
  height: 158px;

  /* Inside auto layout */
  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;
`;

const DownContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
`;
const RightBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 0px;
  gap: 20px;

  width: 198px;
  height: 158px;

  /* Inside auto layout */
  flex: none;
  order: 0;
  flex-grow: 0;
`;
const TitleBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 8px;

  width: 198px;
  height: 69px;

  /* Inside auto layout */
  flex: none;
  order: 0;
  flex-grow: 0;
`;
const Title = styled.div`
  width: 198px;
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
const Box = styled.div`
  display: flex;

  align-items: center;
  gap: 10px;
  padding-left: 10px;
  width: 188px;
  height: 40px;

  background: #ffffff;
  border: 1.5px solid #ebebeb;
  border-radius: 5px;

  /* Inside auto layout */
  flex: none;
  order: 1;
  align-self: stretch;
  flex-grow: 0;

  font-family: "Pretendard";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  /* identical to box height */

  color: #333333;
`;
const BigBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 8px;
  height: auto; /* fit-content 대신 auto로 자동 높이 계산 */
  width: auto;
`;
const Title2 = styled.div`
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
const LongBox = styled.ul`
  display: block; /* flex item으로 취급하지 않게 */
  align-self: flex-start; /* 부모 높이에 맞춰 늘어나지 않게 */
  align-items: initial; /* 내부 컨텐츠 높이 기준으로 계산 */
  height: auto; /* fit-content 대신 auto로 자동 높이 계산 */
  width: auto; /* 343px 고정 폭 제거 (필요 시 max-width만 유지) */
  max-width: 100%;
  background: #ffffff;
  border: 1.5px solid #ebebeb;
  border-radius: 5px;
  padding: 10px;
  /* Inside auto layout */
  flex: none;
  order: 1;
  align-self: stretch;
  flex-grow: 0;
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  list-style-type: disc;
  list-style-position: inside;
  color: #333333;
  margin: 0px;
`;
