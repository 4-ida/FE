import styled from "styled-components";
import RingTimer from "../components/timer";

const Container = styled.div`
  display: flex;
  width: 393px;
  min-height: 852px;
  background-color: #fff;
  flex-direction: column;
  align-items: center;
  color: #333;
  padding-bottom: 200px;
  box-sizing: border-box;
`;

const Header = styled.div`
  display: flex;
  width: 100%;
  height: 60px;
  align-items: center;
  padding: 0 15px;
  box-sizing: border-box;
  justify-content: flex-end;
`;

const Ht = styled.div`
  font-family: "Pretendard";
  font-weight: 500;
  font-size: 15px;
  cursor: pointer;
`;

const Title = styled.div`
  font-weight: 500;
  font-size: 20px;
`;

export default function NoTimer() {
  return (
    <Container>
      <Header>
        <Ht>마이페이지</Ht>
      </Header>
      <Title>금지 타이머</Title>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "100px",
        }}
      >
        <RingTimer totalSeconds={10} />
      </div>
    </Container>
  );
}
