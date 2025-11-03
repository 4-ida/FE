import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import GlobalStyles from "./styles/GlobalStyles";

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
const Nav = lazy(() => import("./components/Nav"));
const Setting = lazy(() => import("./setting")); 


function App() {
  return (
    <Router>
      <GlobalStyles />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Setting />} /> 
          <Route path="/main" element={<Home />} /> 
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/drug/register" element={<DrugRegistration />} />
          <Route path="/drug/information" element={<DrugInformation />} />
          <Route path="/drug/search" element={<Search />} />
          <Route path="/drug/bookmark" element={<Bookmark />} />
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/timer/no" element={<NoTimer />} />
          <Route path="/timer/left" element={<LeftTimer />} />
          <Route path="/whatdrink" element={<WhatDrink />} />
          <Route path="/nav" element={<Nav />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;