import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const FindPassword = lazy(() => import("./pages/FindPassword"));
const DrugRegistration = lazy(() => import("./pages/DrugRegistration"));
const DrugInformation = lazy(() => import("./pages/DrugInformation"));
const DrugList = lazy(() => import("./pages/DrugList"));
const Search = lazy(() => import("./pages/Search"));
const Bookmark = lazy(() => import("./pages/Bookmark"));
const Mypage = lazy(() => import("./pages/Mypage"));
const CancelMembership = lazy(() => import("./pages/CancelMembership"));
const NoTimer = lazy(() => import("./pages/NoTimer"));
const LeftTimer = lazy(() => import("./pages/LeftTimer"));
const WhatDrink = lazy(() => import("./pages/WhatDrink"));

function App() {
  return (
    <Router>
      {/* Suspense는 lazy 컴포넌트 로딩 중 표시 */}
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* 기본 라우트 */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/findpassword" element={<FindPassword />} />

          {/* 약 등록 */}
          <Route path="/drug/register" element={<DrugRegistration />} />

          {/* 약 정보 페이지 */}
          <Route path="/drug/information" element={<DrugInformation />} />
          <Route path="/drug/list" element={<DrugList />} />
          <Route path="/drug/search" element={<Search />} />
          <Route path="/drug/bookmark" element={<Bookmark />} />

          {/* 마이 페이지 */}
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/mypage/cancel" element={<CancelMembership />} />

          {/* 타이머 */}
          <Route path="/timer/no" element={<NoTimer />} />
          <Route path="/timer/left" element={<LeftTimer />} />

          {/* 섭취 입력 페이지 */}
          <Route path="/WhatDrink" element={<WhatDrink />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
