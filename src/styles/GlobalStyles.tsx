import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  @import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css");

  body {
    margin: 0;
    font-family: "Pretendard", sans-serif;
    background-color: #d9d9d9;
  }
`;

export default GlobalStyles;
