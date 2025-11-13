import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import GlobalStyles from "./styles/GlobalStyles";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const AppWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  position: relative;
  min-height: 100vh; /* 뷰포트 높이만큼 최소 높이 설정 */
  overflow: hidden;
`;

const Home = lazy(() => import("./pages/Main"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const DrugRegistration = lazy(() => import("./pages/DrugRegistration"));
const DrugInformation = lazy(() => import("./pages/DrugInformation"));
const Search = lazy(() => import("./pages/Search"));
const Bookmark = lazy(() => import("./pages/Bookmark"));
const Mypage = lazy(() => import("./pages/Mypage"));
const NoTimer = lazy(() => import("./pages/NoTimer"));
const LeftTimer = lazy(() => import("./pages/LeftTimer"));
const WhatDrink = lazy(() => import("./pages/WhatDrink"));
const DrinkCaffaine = lazy(() => import("./pages/DrinkCaffaine"));
const DrinkAlcohol = lazy(() => import("./pages/DrinkAlcohol"));
const Nav = lazy(() => import("./components/nav"));
const DrugChange = lazy(() => import("./pages/drugchange"));
const Todo = lazy(() => import("./pages/modal/TodayPill"));
const DateSelect = lazy(() => import("./pages/modal/Date"));
const Setting = lazy(() => import("./setting"));

function App() {
  return (
    <Container>
      <AppWrapper>
        <Router>
          <GlobalStyles />
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Setting />} />
              <Route path="/main" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/drug/register" element={<DrugRegistration />} />
              <Route
                path="/drug/information/:drugId"
                element={<DrugInformation />}
              />
              <Route path="/search" element={<Search />} />
              <Route path="/drug/bookmark" element={<Bookmark />} />
              <Route path="/mypage" element={<Mypage />} />
              <Route path="/timer/no" element={<NoTimer />} />
              <Route path="/timer/left" element={<LeftTimer />} />
              <Route path="/whatdrink" element={<WhatDrink />} />
              <Route path="/drink/caffaine" element={<DrinkCaffaine />} />
              <Route path="/drink/alcohol" element={<DrinkAlcohol />} />
              <Route path="/nav" element={<Nav />} />
              <Route path="/drug/change" element={<DrugChange />} />
              <Route path="/drug/change/:id" element={<DrugChange />} />
              <Route
                path="/date/select"
                element={
                  <DateSelect
                    isOpen={true}
                    onClose={() => console.log("닫힘")}
                  />
                }
              />
            </Routes>
          </Suspense>
        </Router>
      </AppWrapper>
    </Container>
  );
}

export default App;
