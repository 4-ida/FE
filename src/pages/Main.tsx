import Nav from "../components/nav";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  display: flex;
  width: 393px;
  height: 852px;
  background-color: #fff;
  flex-direction: column;
  align-items: center;
  color: #333;
`

const Header = styled.div`
  display: flex;
  width: 100%;
  height: 60px;
  align-items: center;
  padding: 0 15px;
  box-sizing: border-box;
  justify-content: flex-end;
`

const Ht = styled.div`
  font-family: "Pretendard";
  font-weight: 500;
  font-size: 15px;
  cursor: pointer;
`

const Title = styled.div`
  font-family: "Pretendard";
  font-weight: 400;
  font-size: 20px;
  margin-top: 30px;
`

export default function Home() {
  const navigate = useNavigate();
  const handleGoToMyPage = () => {
    navigate('/mypage'); 
  };
  return (
    <Container>
    <Nav />
    <Header><Ht onClick={handleGoToMyPage}>마이페이지</Ht></Header>
    <Title>홍길동 님, 안녕하세요!</Title>
    </Container>
  )
}
