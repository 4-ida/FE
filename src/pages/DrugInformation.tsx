import React, { useState, useEffect } from "react";
import styled from "styled-components";
import bb from "../assets/backbutton.svg";
import { useNavigate } from "react-router-dom";
import Nav from "../components/nav";
import pill1 from "../assets/pill1.svg";
import { useParams } from "react-router-dom";
import axios from "axios";

interface DrugDetail {
  id: number;
  name: string;
  entpName: string;
  rxType: string;
  strength: string;
  dosage: string;
  ingredients: string;
  efficacy: string;
  cautionsSummary: {
    alcohol: string;
    caffeine: string;
  };
  cautions: string;
  images: string;
}
export default function DrugInformation() {
  const { drugId } = useParams<{ drugId: string }>(); // URL에서 id 가져오기
  const numericId = Number(drugId); // string → number로 변환
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };
  const handleGoToMyPage = () => {
    navigate("/mypage");
  };
  const [drug, setDrug] = useState<DrugDetail | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const Details = async (drugId: string) => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/drug/details/${drugId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // ✅ 이거 빠졌을 가능성 큼
            },
          }
        );
        if (res.status === 200) {
          console.log("약품상세조회 성공");
          console.log(res.data);
          setDrug(res.data);
        }
      } catch (err: any) {
        console.error("조회 실패", err);
      }
    };
    if (drugId) Details(drugId);
  }, []);

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
              <Title>함량</Title>

              <Box>{drug.strength}</Box>
            </TitleBox>
          </RightBox>
          <img
            src={drug.images}
            alt={drug.name}
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",

              width: "150px",
              height: "150px",

              borderRadius: "10px",
            }}
          />
        </UpContainer>
        <DownContainer>
          <BigBox>
            <Line>
              <SmallBox>
                <Title3>전문 / 일반</Title3>
                <ShortBox>{drug.rxType}</ShortBox>
              </SmallBox>
              <SmallBox>
                <Title3>제조사</Title3>
                <ShortBox>{drug.entpName}</ShortBox>
              </SmallBox>
            </Line>
          </BigBox>
          <BigBox>
            <Title2>용법 / 용량</Title2>
            <LongBox>{drug.dosage}</LongBox>
          </BigBox>
          <BigBox>
            <Title2>효능 / 효과</Title2>
            <LongBox>{drug.efficacy}</LongBox>
          </BigBox>
          <BigBox>
            <Title2>주요성분 목록</Title2>
            <LongBox>{drug.ingredients}</LongBox>
          </BigBox>
          <BigBox>
            <Title2>알코올 및 카페인과 상호작용</Title2>
            <LongBox>
              {" "}
              {drug.cautionsSummary.alcohol}
              <br />
              {drug.cautionsSummary.caffeine}
            </LongBox>
          </BigBox>
          <BigBox>
            <Title2>복용 시 주의사항</Title2>
            <LongBox>{drug.cautions}</LongBox>
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
