import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const FindPassword = lazy(() => import("./pages/FindPassword"));
const Camera = lazy(() => import("./pages/Camera"));
const CameraResult = lazy(() => import("./pages/CameraResult"));
const DrugRegistration = lazy(() => import("./pages/DrugRegistration"));
const DrugInformation = lazy(() => import("./pages/DrugInformation"));
const DrugList = lazy(() => import("./pages/DrugList"));
const Search = lazy(() => import("./pages/Search"));
const Bookmark = lazy(() => import("./pages/Bookmark"));
const RecentlySearch = lazy(() => import("./pages/RecentlySearch"));
const Friend = lazy(() => import("./pages/Friend"));
const Friendplus = lazy(() => import("./pages/Friendplus"));
const Mypage = lazy(() => import("./pages/Mypage"));
const CancelMembership = lazy(() => import("./pages/CancelMembership"));

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
          <Route path="/camera" element={<Camera />} />
          <Route path="/camera/result" element={<CameraResult />} />
          <Route path="/drug/register" element={<DrugRegistration />} />

          {/* 약 정보 페이지 */}
          <Route path="/drug/information" element={<DrugInformation />} />
          <Route path="/drug/list" element={<DrugList />} />
          <Route path="/drug/search" element={<Search />} />
          <Route path="/drug/bookmark" element={<Bookmark />} />
          <Route path="/drug/recent" element={<RecentlySearch />} />

          {/* 친구 페이지 */}
          <Route path="/friend" element={<Friend />} />
          <Route path="/friend/plus" element={<Friendplus />} />

          {/* 마이 페이지 */}
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/mypage/cancel" element={<CancelMembership />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
