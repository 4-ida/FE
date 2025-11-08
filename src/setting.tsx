import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  padding: 2rem;
`;

const SettingBtn = styled.div`
  width: 15rem;
  height: 5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #333;
  border-radius: 1rem;

  font-size: 16px;
  color: #fff;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: background-color 0.2s;
`;

const Setting = () => {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <SettingBtn onClick={() => navigate("/main")}>메인(달력)</SettingBtn>
      <SettingBtn onClick={() => navigate("/login")}>로그인</SettingBtn>
      <SettingBtn onClick={() => navigate("/signup")}>회원가입</SettingBtn>
      <SettingBtn onClick={() => navigate("/drug/register")}>
        약 등록
      </SettingBtn>
      <SettingBtn onClick={() => navigate("/search")}>약 검색</SettingBtn>
      <SettingBtn onClick={() => navigate("/drug/information")}>
        약 상세정보
      </SettingBtn>
      <SettingBtn onClick={() => navigate("/drug/bookmark")}>북마크</SettingBtn>
      <SettingBtn onClick={() => navigate("/mypage")}>마이 페이지</SettingBtn>
      <SettingBtn onClick={() => navigate("/timer/no")}>금지 타이머</SettingBtn>
      <SettingBtn onClick={() => navigate("/timer/left")}>
        잔존 타이머
      </SettingBtn>
      <SettingBtn onClick={() => navigate("/whatdrink")}>섭취 입력</SettingBtn>
      <SettingBtn onClick={() => navigate("/nav")}>네브바</SettingBtn>
      <SettingBtn onClick={() => navigate("/drug/change")}>약 수정</SettingBtn>
      <SettingBtn onClick={() => navigate("/todo")}>오늘의 약</SettingBtn>
      <SettingBtn onClick={() => navigate("/date/select")}>
        날짜 선택
      </SettingBtn>
    </PageContainer>
  );
};

export default Setting;
