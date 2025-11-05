import styled from "styled-components";

const Container = styled.div`
  display: flex;
  width: 393px;
  height: 852px;
  background-color: #fff;
  flex-direction: column;
  align-items: center;
  color: #333;
`;

const Content = styled.div`
  box-sizing: border-box;
  position: absolute;
  width: 363px;
  height: 308px;
  left: calc(50% - 363px / 2 + 4px);
  top: 390px;
  background: #ffffff;
  border: 1px solid #2b2b2b;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
`;

export default function DrugRegistration() {
  return (
    <Container>
      <Content></Content>
    </Container>
  );
}
