import React, { useState, useEffect } from "react";
import styled from "styled-components";
import bb from "../assets/backbutton.svg";
import { useNavigate } from "react-router-dom";
import Nav from "../components/nav";
import pill1 from "../assets/pill1.svg";
import { useParams } from "react-router-dom";

interface DrugDetail {
  id: number;
  name: string;
  form: string;
  type: string;
  manufacturer: string;
  dosage: string;
  effect: string;
  ingredient: string;
  interaction: {
    alcohol: string;
    caffeine: string;
  };
  caution: string;
  image: string;
}
export default function DrugInformation() {
  const { id } = useParams(); // URL에서 id 가져오기
  const numericId = Number(id); // string → number로 변환
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };
  const handleGoToMyPage = () => {
    navigate("/mypage");
  };
  const [drug, setDrug] = useState<DrugDetail | null>(null);
  const mockDrugList: DrugDetail[] = [
    {
      id: 1,
      name: "타이레놀 500mg",
      form: "산제",
      type: "일반",
      manufacturer: "일반",
      dosage: "만 12세 이상은 4~6시간 간격으로 1정 복용",
      effect: "발열 및 통증 완화에 사용됩니다.",
      ingredient:
        "Acetaminophen Granule 아세트아미노펜과립 555.556mg (아세트아미노펜으로서 500mg)",
      interaction: {
        alcohol: "복용 전후 12시간 음주 금지",
        caffeine: "복용 전후 6시간 카페인 섭취 자제",
      },
      caution: "간 질환자 복용 전 의사 상담, 과량 복용 시 간 손상 위험",
      image: "/Ty.svg",
    },
    {
      id: 2,
      name: "타이레놀 콜드 이소정",
      form: "정제",
      type: "일반",
      manufacturer: "한국얀센",
      dosage: "1회 1정, 1일 3회 식후 복용",
      effect: "감기 증상 완화 (기침, 콧물, 발열)",
      ingredient: "Acetaminophen, Pseudoephedrine, Dextromethorphan 복합제",
      interaction: {
        alcohol: "복용 전후 12시간 음주 금지",
        caffeine: "카페인 음료와 병용 금지",
      },
      caution: "고혈압 환자 주의, 과량 복용 금지",
      image: "/cold.svg",
    },
  ];
  useEffect(() => {
    const foundDrug = mockDrugList.find((d) => d.id === numericId);
    setDrug(foundDrug || null);
  }, [numericId]);

  if (!drug) return <div>Loading...</div>;
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

              <Box>{drug.name}</Box>
            </TitleBox>
            <TitleBox>
              <Title>제형</Title>

              <Box>{drug.form}</Box>
            </TitleBox>
          </RightBox>
          <img src={drug.image} alt={drug.name} />
        </UpContainer>
        <DownContainer>
          <BigBox>
            <Line>
              <SmallBox>
                <Title3>전문 / 일반</Title3>
                <ShortBox>{drug.type}</ShortBox>
              </SmallBox>
              <SmallBox>
                <Title3>제조사</Title3>
                <ShortBox>{drug.manufacturer}</ShortBox>
              </SmallBox>
            </Line>
          </BigBox>
          <BigBox>
            <Title2>용법 / 용량</Title2>
            <LongBox>{drug.dosage}</LongBox>
          </BigBox>
          <BigBox>
            <Title2>효능 / 효과</Title2>
            <LongBox>{drug.effect}</LongBox>
          </BigBox>
          <BigBox>
            <Title2>성분 / 함량</Title2>
            <LongBox>{drug.ingredient}</LongBox>
          </BigBox>
          <BigBox>
            <Title2>알코올 및 카페인과 상호작용</Title2>
            <LongBox>
              {" "}
              {drug.interaction.alcohol}
              <br />
              {drug.interaction.caffeine}
            </LongBox>
          </BigBox>
          <BigBox>
            <Title2>복용 시 주의사항</Title2>
            <LongBox>{drug.caution}</LongBox>
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
  padding-bottom: 64px;
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
  justify-content: flex-start;
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
const SmallBox = styled.div`
  display: flex;
  width: 174px;
  height: 69px;
  position: relative;
  /* Inside auto layout */
  flex: none;
  order: 0;
  flex-grow: 0;
`;
const Title3 = styled.div`
  /* 전문 / 일반 */

  position: absolute;
  width: 78px;
  height: 21px;
  left: 0px;
  top: 0px;

  font-family: "Pretendard";
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 21px;

  color: #333333;
`;
const ShortBox = styled.ul`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 9px;
  gap: 10px;
  isolation: isolate;
  margin: 0px;
  position: absolute;
  width: 156px;
  height: 22px;
  left: 0px;
  top: 29px;

  background: #ffffff;
  border: 1.5px solid #ebebeb;
  border-radius: 5px;
`;
const Line = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;
