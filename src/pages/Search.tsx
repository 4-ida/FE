import styled from "styled-components";
import React, { useState } from "react";
import { AiOutlineSearch, AiOutlineStar, AiFillStar } from "react-icons/ai";
import SearchFooterIcon from "../assets/searchFooterIcon.svg";
import TimerIcon from "../assets/TimerIcon.svg";
export default function Search() {
  const [find, setFind] = useState("");

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
      <Footer></Footer>
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
const Footer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;

  position: absolute;
  width: 363px;
  height: 64px;
  left: calc(50% - 363px / 2);
  bottom: 15px;

  filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.1));
  border-radius: 10px;
`;
const SearchFooter = styled.div`
  /* Frame 4 */

  width: 121px;
  height: 64px;

  background: #ffffff;

  /* 내부 오토레이아웃 */
  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 1;
  /* Rectangle 18 */

  position: absolute;
  width: 90px;
  height: 50px;
  left: calc(50% - 90px / 2 + 0.5px);
  top: calc(50% - 50px / 2);

  background: rgba(182, 245, 0, 0.15);
  border-radius: 10px;
`;
const TimerFooter = styled.div`
  width: 121px;
  height: 64px;

  background: #ffffff;

  /* 내부 오토레이아웃 */
  flex: none;
  order: 1;
  align-self: stretch;
  flex-grow: 1;
`;
