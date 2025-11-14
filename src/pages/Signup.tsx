import styled from "styled-components";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import bb from "../assets/backbutton.svg";

export default function Signup() {
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };
  const handleGoToMyPage = () => {
    navigate("/mypage");
  };
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailcheck, SetEmailCheck] = useState("");
  const [password, setPassword] = useState("");
  const [passwordcheck, setPasswordCheck] = useState("");

  const [emailValid, setEmailValid] = useState<null | boolean>(null);
  const [passwordMatch, setPasswordMatch] = useState<null | boolean>(null);

  // 이메일 중복확인 연동
  useEffect(() => {
    const checkEmail = async () => {
      if (email && email === emailcheck) {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/v1/signup/check-email`,
            { params: { email } }
          );

          if (res.status === 200 && res.data.data.available === true) {
            console.log("사용가능한 이메일");
            setEmailValid(true);
          } else {
            setEmailValid(false);
          }
        } catch (err: any) {
          console.error("이메일 중복 확인 실패:", err);
          setEmailValid(false);
          const status = err.response?.status;

          if (status === 400) {
            console.error("잘못된 이메일 형식입니다", err.response?.data);
          } else if (status === 409) {
            console.error("중복된 이메일입니다.", err.response?.data);

            setEmailValid(false);
          } else {
            console.error(" 알 수 없는 오류:", err);
          }
        }
      } else {
        setEmailValid(null);
      }
    };

    checkEmail();
  }, [email, emailcheck]);

  // 회원가입 생성
  const handleSignup = async () => {
    if (!name || !email || !password || !passwordcheck) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    if (email !== emailcheck) {
      alert("이메일이 일치하지 않습니다.");
      return;
    }

    if (password !== passwordcheck) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    const payload = {
      name: name,
      email: email,
      password: password,
      passwordConfirm: passwordcheck,
      consent: {
        ternsOfService: true,
        privacyPolicy: true,
        dataUsage: true,
      },
    };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/signup`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.status === 201) {
        console.log(" 회원가입 성공:", res.data);

        alert("회원가입이 완료되었습니다!");
        localStorage.setItem("justSignedUp", "true");
        navigate("/login");
      }
    } catch (err: any) {
      console.error(" 회원가입 실패:", err);

      const status = err.response?.status;

      if (status === 400) {
        alert("입력값이 잘못되었습니다. (이메일 중복 또는 비밀번호 불일치 등)");
      } else {
        alert("회원가입 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      }
    }
  };

  useEffect(() => {
    if (password && passwordcheck) {
      setPasswordMatch(password === passwordcheck);
    } else {
      setPasswordMatch(null);
    }
  }, [password, passwordcheck]);

  return (
    <Screen>
      <Header>
        <Back src={bb} alt="뒤로 가기" onClick={handleGoBack} />
        <Ht onClick={handleGoToMyPage}>마이페이지</Ht>
      </Header>

      <ContentContainer>
        <NameBox>
          <Name>이름</Name>
          <Box
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </NameBox>

        <NameBox>
          <Name>이메일 (아이디)</Name>
          <Box
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </NameBox>

        <NameBox>
          <Name>이메일 (중복확인)</Name>
          <Box
            type="text"
            value={emailcheck}
            onChange={(e) => SetEmailCheck(e.target.value)}
          />
          {emailValid === false && (
            <ValidText color="red">이미 존재하는 이메일입니다.</ValidText>
          )}
          {emailValid === true && (
            <ValidText color="blue">사용 가능한 이메일입니다.</ValidText>
          )}
        </NameBox>

        <NameBox>
          <Name>비밀번호</Name>
          <Box
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </NameBox>

        <NameBox>
          <Name>비밀번호 확인</Name>
          <Box
            type="password"
            value={passwordcheck}
            onChange={(e) => setPasswordCheck(e.target.value)}
          />
          {passwordMatch === false && (
            <ValidText color="red">비밀번호가 일치하지 않습니다!</ValidText>
          )}
          {passwordMatch === true && (
            <ValidText color="blue">비밀번호가 일치합니다!</ValidText>
          )}
        </NameBox>
        <SignUpButton onClick={handleSignup}>가입하기</SignUpButton>
      </ContentContainer>
    </Screen>
  );
}

const Screen = styled.div`
  position: relative;
  width: 393px;
  min-height: 852px;
  background: #ffffff;
  display: flex;
  justify-content: center;
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

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  position: absolute;
  width: 363px;
  left: calc(50% - 363px / 2);
  top: 80px;
`;

const NameBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 363px;
`;

const Name = styled.div`
  font-family: "Pretendard";
  font-weight: 500;
  font-size: 18px;
  color: #333333;
`;

const Box = styled.input`
  width: 350px;
  height: 40px;
  background: #ffffff;
  border: 1.5px solid #ebebeb;
  border-radius: 5px;
  padding-left: 10px;
  font-family: "Pretendard";
  font-size: 16px;
`;

const ValidText = styled.p<{ color: string }>`
  margin: 2px 0 0;
  font-size: 13px;
  color: ${(props) => props.color};
`;

const SignUpButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 363px;
  height: 45px;
  background: #b6f500;
  border-radius: 5px;
  border: none;
  font-family: "Pretendard";
  font-weight: 500;
  font-size: 18px;
  color: #333333;
  cursor: pointer;
  padding: 0;
  text-align: center;
`;
