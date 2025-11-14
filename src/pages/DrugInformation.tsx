import { useState, useEffect } from "react";
import styled from "styled-components";
import bb from "../assets/backbutton.svg";
import { useNavigate } from "react-router-dom";
import Nav from "../components/nav";
import { useParams } from "react-router-dom";
import axios from "axios";
import Logo from "../assets/logo.svg?react";
import axiosInstance from "../axiosInstance";


interface DrugDetail {
  drugId: string;
  name: string;
  entpName: string;
  rxType: string;
  strength: string;
  dosage: string;
  ingredients: string[];
  efficacy: string;
  cautionsSummary: {
    alcohol: string;
    caffeine: string;
  };
  cautions: string;
  images: string[];
  retrievedAt?: string;
}
export default function DrugInformation() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { drugId } = useParams<{ drugId: string }>(); // URL에서 id 가져오기
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };
  const handleGoToMyPage = () => {
    navigate("/mypage");
  };
  const [drug, setDrug] = useState<DrugDetail | null>(null);

  // 약품 상세조회 연동
  useEffect(() => {
    const Details = async (drugId: string) => {
      try {
        const res = await axiosInstance.get(
          `/api/v1/drug/details/${drugId}`
        );
        if (res.status === 200) {
          console.log("약품상세조회 성공", res.data);
          setDrug(res.data);
        }
      } catch (err: any) {
        console.error("조회 실패", err);
      }
    };
    if (drugId) Details(drugId);
  }, [drugId]);

  if (!drug) return <div>Loading...</div>;
  return (
    <Screen>
      <LoGo />
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
          {drug.images && drug.images.length > 0 && drug.images[0] && (
            <img
              src={drug.images[0]}
              alt={drug.name}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const parent = target.parentElement;
                if (parent) {
                  const placeholder = parent.querySelector(".default-image") as HTMLElement;
                  if (placeholder) placeholder.style.display = "flex";
                }
              }}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                width: "150px",
                height: "150px",
                borderRadius: "10px",
                flexShrink: 0,
              }}
            />
          )}
          <DefaultImage
            className="default-image"
            style={{
              display: drug.images && drug.images.length > 0 && drug.images[0] ? "none" : "flex",
            }}
          >
            정보 없음
          </DefaultImage>
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
            <LongBox expanded={isExpanded}>{drug.dosage}</LongBox>
          </BigBox>
          <BigBox>
            <Title2>효능 / 효과</Title2>
            <LongBox expanded={isExpanded}>{drug.efficacy}</LongBox>
          </BigBox>
          <BigBox>
            <Title2>주요성분 목록</Title2>
            <LongBox expanded={isExpanded}>
              {Array.isArray(drug.ingredients)
                ? drug.ingredients.join(", ")
                : drug.ingredients}
            </LongBox>
          </BigBox>
          <BigBox>
            <Title2>알코올 및 카페인과 상호작용</Title2>
            <LongBox expanded={isExpanded}>
              {" "}
              {drug.cautionsSummary.alcohol}
              <br />
              {drug.cautionsSummary.caffeine}
            </LongBox>
          </BigBox>
          <BigBox>
            <Title2>복용 시 주의사항</Title2>
            <LongBox expanded={isExpanded}>{drug.cautions}</LongBox>
            <ToggleBtn onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? "접기 " : "더보기 "}
            </ToggleBtn>
          </BigBox>
        </DownContainer>
      </Container>
      <Nav></Nav>
    </Screen>
  );
}
const LoGo = styled(Logo)`
  position: absolute;
  top: 15px;
  left: 139px;
`;

const Screen = styled.div`
  position: relative;
  width: 393px;
  min-height: 100vh; // 화면 전체 높이를 기본값으로
  background: #ffffff;
  padding-bottom: 64px;
  overflow-y: auto; // 스크롤 활성화
  padding-bottom: 150px;
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
  height: auto;
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
  width: 363px;
  position: relative;
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

const LaterBox = styled.ul`
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
  width: 363px;
  box-sizing: border-box;
  justify-content: space-between;
`;

const LongBox = styled.div<{ expanded: boolean }>`
  width: 100%;
  font-family: "Pretendard";
  font-size: 16px;
  line-height: 20px;
  color: #333333;
  background: #ffffff;
  border: 1.5px solid #ebebeb;
  border-radius: 5px;
  padding: 10px;
  box-sizing: border-box;

  /* 기본 상태: 3줄만 보여주기 */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  /* -webkit-line-clamp: ${({ expanded }) => (expanded ? "none" : 3)};
  max-height: ${({ expanded }) =>
    expanded ? "none" : `calc(20px * 3 + 20px)`}; */
  /* line-height*3 + padding 보정 (10px 위 + 10px 아래) */

  /* 펼치기 상태 */
  ${({ expanded }) =>
    expanded
      ? `
    display: block;
    overflow: visible;
    -webkit-line-clamp: unset;
    max-height: none;
    padding-bottom: 10px; /* 펼쳤을 때는 일반 패딩으로 복구 */
  `
      : `
    -webkit-line-clamp: 3;
    /* 3줄 (20px*3=60px) + 상단 패딩 (10px)까지만 허용하여 잘린 텍스트를 숨김 */
    max-height: 70px; 
  `}
`;

const DefaultImage = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 10px;
  background: #ebebeb;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: #999999;
`;

const ToggleBtn = styled.div`
  font-size: 14px;
  color: #7fab00;
  cursor: pointer;
  margin-top: 5px;
  user-select: none;
  align-self: flex-end;
`;
