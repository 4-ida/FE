import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  @import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css");

  * {
    font-family: "Pretendard", sans-serif;
  }

  body {
    margin: 0;
    background-color: #fff;
  }
`;
export default GlobalStyles;