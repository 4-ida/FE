import axios from "axios";

// ✅ 환경변수에서 기본 URL 읽기
const baseURL = import.meta.env.VITE_API_URL;

// ✅ Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ 요청(request) 인터셉터 → 모든 요청에 토큰 자동 추가
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ 응답(response) 인터셉터 → 공통 에러 처리
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // 서버에서 응답을 받았지만 에러 상태일 때
      const status = error.response.status;
      console.error(
        "❌ API Error:",
        status,
        error.response.data
      );

      if (status === 401) {
        console.warn("🔒 인증 만료 — 로그인 페이지로 이동 필요");
        // 필요하다면 자동 로그아웃 처리 가능
        // localStorage.removeItem("accessToken");
        // window.location.href = "/login";
      } else if (status === 502) {
        console.error("🚨 [502 Bad Gateway] 서버 게이트웨이 오류");
        console.error("📥 서버가 일시적으로 응답할 수 없습니다.");
      } else if (status === 503) {
        console.error("🚨 [503 Service Unavailable] 서비스 일시 중단");
        console.error("📥 서버가 일시적으로 사용할 수 없습니다.");
      } else if (status === 504) {
        console.error("🚨 [504 Gateway Timeout] 게이트웨이 타임아웃");
        console.error("📥 서버 응답 시간이 초과되었습니다.");
      }
    } else if (error.request) {
      // 서버 응답 자체가 없을 때 (네트워크 문제)
      console.error("🌐 네트워크 오류 — 서버에 연결할 수 없습니다");
      console.error("📥 요청 객체:", error.request);
    } else {
      console.error("⚠️ 요청 설정 에러:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
