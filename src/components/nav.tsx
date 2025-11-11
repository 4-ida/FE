import styled from "styled-components";
import Search from "../assets/search.svg?react";
import Timer from "../assets/timer.svg?react";
import Calendar from "../assets/calendar.svg?react";
import Drink from "../assets/drink.svg?react";
import { Link, useLocation } from "react-router-dom";

interface ItemProps {
  $active?: boolean;
  $type?: "search" | "timer" | "calendar" | "drink";
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  position: fixed; /* ✅ 항상 하단 고정 */
  bottom: 15px; /* ✅ 화면 아래에서 20px 위 */
  left: 0;
  z-index: 999;
`;

const Container = styled.nav`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 363px;
  height: 64px;
  background-color: #fff;
  filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.1));
  border-radius: 10px;
  padding: 8px 0;
  box-sizing: border-box;
`;

interface ItemProps {
  $active?: boolean;
}

const Item = styled(Link)<ItemProps>`
  width: 80px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  cursor: pointer;
  box-sizing: border-box;
  border-radius: 10px;
  transition: 0.2s;

  ${({ $active }) =>
    $active &&
    `
      background-color: #F4FED9;
    `}
`;

const IconStyle = styled.div<ItemProps>`
  svg {
    width: 30px;
    height: 30px;
  }

  path {
    fill: ${({ $active }) => ($active ? "#B6F500" : "#333")};
    transition: 0.2s;

    ${({ $type, $active }) =>
      $type === "drink" &&
      `
        stroke: ${$active ? "#B6F500" : "#333"};
      `}
  }
`;
export default function Nav() {
  const location = useLocation();

  return (
    <Wrapper>
      <Container>
        <Item to="/search" $active={location.pathname === "/search"}>
          <IconStyle $active={location.pathname === "/search"} $type="search">
            <Search />
          </IconStyle>
        </Item>

        <Item to="/timer/no" $active={location.pathname === "/timer/no"}>
          <IconStyle $active={location.pathname === "/timer/no"} $type="timer">
            <Timer />
          </IconStyle>
        </Item>

        <Item to="/main" $active={location.pathname === "/main"}>
          <IconStyle $active={location.pathname === "/main"} $type="calendar">
            <Calendar />
          </IconStyle>
        </Item>

        <Item to="/whatdrink" $active={location.pathname === "/whatdrink"}>
          <IconStyle $active={location.pathname === "/whatdrink"} $type="drink">
            <Drink />
          </IconStyle>
        </Item>
      </Container>
    </Wrapper>
  );
}
