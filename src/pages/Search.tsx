import styled from "styled-components";
import React, { useState } from "react";
import { AiOutlineSearch, AiOutlineStar } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import Nav from "../components/nav";
import arrow1_ from "../assets/arrow1.svg";
import arrow2 from "../assets/arrow2.svg";
import Ty from "../assets/Ty.svg";
import cold from "../assets/cold.svg";

export default function Search() {
  const [find, setFind] = useState("");
  const Navigate = useNavigate();
  const gotoInformation = () => {
    Navigate("/drug/information");
  };
  return (
    <Screen>
      <SearchContainer>
        <SearchBox>
          <SearchText
            type="text"
            value={find}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFind(e.target.value)
            }
          />
          <SearchIcon />
        </SearchBox>
        <BookmarkIcon />
      </SearchContainer>
      <ProductList>
        <ProductBox onClick={gotoInformation}>
          <Group>
            <img
              src={Ty}
              alt="타이레놀 500"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "10px",
              }}
            />
            <TextLine>
              <Name>타이레놀 500mg</Name>
              <BookmarkIcon />
            </TextLine>
          </Group>
        </ProductBox>
        <ProductBox onClick={gotoInformation}>
          <Group>
            <img
              src={cold}
              alt="타이레놀 콜드 에스정"
              style={{
                width: "100px",
                height: "100px",

                borderRadius: "10px",
              }}
            />
            <TextLine>
              <Name>타이레놀 콜드 에스정</Name>
              <BookmarkIcon />
            </TextLine>
          </Group>
        </ProductBox>
      </ProductList>
      <PageNumberBox>
        <NumberLine>
          <img
            src={arrow1_}
            alt="뒤록 가는 화살표"
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",

              gap: "10px",

              width: "22px",
              height: "22px",

              background: "rgba(182, 245, 0, 0.15)",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          />
          <OnlyNumber>
            <Number>1</Number>
            <Number>2</Number>
            <Number>3</Number>
            <Number>4</Number>
            <Number>5</Number>
          </OnlyNumber>

          <img
            src={arrow2}
            alt="다음으로 가는 화살표"
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",

              gap: "10px",

              width: "22px",
              height: "22px",

              background: "rgba(182, 245, 0, 0.15)",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          />
        </NumberLine>
      </PageNumberBox>

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

const SearchContainer = styled.div`
  position: absolute;
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 10px; /* 돋보기 박스와 별 사이 간격 */
`;

const SearchBox = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 323px;
  height: 38px;
`;

const SearchText = styled.input`
  width: 100%;
  height: 100%;
  background: #f2f3ee;
  border: none;
  border-radius: 5px;
  padding: 0 38px 0 15px; /* 오른쪽 여백 확보 (돋보기 들어갈 자리) */
  font-size: 15px;
  color: #333;

  &:focus {
    outline: none;
  }
`;

const SearchIcon = styled(AiOutlineSearch)`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #444;
  font-size: 20px;
  background-color: transparent;
  cursor: pointer;
`;

const BookmarkIcon = styled(AiOutlineStar)`
  width: 30px;
  height: 30px;
  color: #7fab00;
  cursor: pointer;
`;
const PageNumberBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 4px;

  position: absolute;
  width: 174px;
  height: 22px;
  left: calc(50% - 174px / 2 - 0.5px);
  top: 729px;
`;
const NumberLine = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  position: absolute;
  width: 122px;
  height: 22px;
  gap: 10px;
  border-radius: 5px;
`;
const Number = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  width: 22px;
  height: 22px;

  background: rgba(182, 245, 0, 0.15);
  border-radius: 5px;

  /* Inside auto layout */
  flex: none;
  order: 0;
  flex-grow: 0;
  cursor: pointer;
`;
const OnlyNumber = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  width: 122px;
  height: 22px;

  background: rgba(182, 245, 0, 0.15);
  border-radius: 5px;
`;
const ProductList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 12px;

  position: absolute;
  width: 363px;
  height: 668px;
  left: calc(50% - 363px / 2);
  top: 73px;
`;
const ProductBox = styled.div`
  box-sizing: border-box;

  width: 363px;
  height: 124px;

  background: #ffffff;
  border: 1px solid #ebebeb;
  box-shadow: 0px 2px 5px rgba(182, 245, 0, 0.2);
  border-radius: 5px;

  /* Inside auto layout */
  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;
  cursor: pointer;
`;
const Group = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 0px;
  margin: 12px 14px;
  width: 335px;
  height: 100px;
  left: 20px;
  top: 12px;
  gap: 19px;
`;
const TextLine = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding: 0px;

  width: 216px;
  height: 25px;

  /* Inside auto layout */
  flex: none;
  order: 1;
  flex-grow: 0;
`;
const Name = styled.div`
  margin: 0 auto;
  width: auto;
  height: 22px;

  font-family: "Inter";
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 22px;
  /* identical to box height */

  color: #333333;
`;
