import styled from "styled-components";
import React, { useState, useEffect } from "react";
import { AiOutlineSearch, AiOutlineStar, AiFillStar } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import Nav from "../components/nav";
import arrow1_ from "../assets/arrow1.svg";
import arrow2 from "../assets/arrow2.svg";
import axiosInstance from "../axiosInstance";

interface Drug {
  drugId: string;
  name: string;
  thumbnailUrl: string;
  bookmarked: boolean;
}

export default function Search() {
  const [query, setQuery] = useState("");
  const [searchedDrugs, setSearchedDrugs] = useState<Drug[]>([]);
  const [bookmarkDrugs, setBookmarkDrugs] = useState<Drug[]>([]);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const Navigate = useNavigate();
  const gotoInformation = (drugId: string) => {
    Navigate(`/drug/information/${drugId}`);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  // 북마크 목록 조회
  const fetchBookmarks = async () => {
    const requestParams = {
      page: 0,
      size: 100,
      sort: "recent",
    };

    console.log("📖 [북마크 목록 조회] 요청 시작");
    console.log("📤 요청 파라미터:", requestParams);
    console.log("📤 요청 URL: GET /api/v1/drug/bookmarks");

    try {
      const res = await axiosInstance.get(`/api/v1/drug/bookmarks`, {
        params: requestParams,
      });

      console.log("✅ [북마크 목록 조회] 성공");
      console.log("📥 응답 상태:", res.status);
      console.log("📥 응답 데이터:", res.data);
      console.log("📥 응답 데이터 타입:", typeof res.data);
      console.log("📥 items 존재 여부:", !!res.data?.items);
      console.log("📥 items 타입:", Array.isArray(res.data?.items) ? "배열" : typeof res.data?.items);
      
      if (Array.isArray(res.data.items)) {
        console.log("📥 북마크 개수:", res.data.items.length);
        console.log("📥 북마크 목록:", res.data.items);
        setBookmarkDrugs(res.data.items);
      } else {
        console.warn("⚠️ [북마크 목록 조회] items가 배열이 아닙니다:", res.data);
        setBookmarkDrugs([]);
      }
    } catch (err: any) {
      console.error("❌ [북마크 목록 조회] 실패");
      console.error("📤 요청 파라미터:", requestParams);
      
      if (err.response) {
        const status = err.response.status;
        console.error("📥 에러 상태 코드:", status);
        console.error("📥 에러 응답 데이터:", err.response.data);
        console.error("📥 에러 응답 헤더:", err.response.headers);
        
        if (status === 502) {
          console.error("🚨 [502 Bad Gateway] 서버 게이트웨이 오류");
          console.error("📥 서버가 일시적으로 응답할 수 없습니다. 잠시 후 다시 시도해주세요.");
        } else if (status === 503) {
          console.error("🚨 [503 Service Unavailable] 서비스 일시 중단");
          console.error("📥 서버가 일시적으로 사용할 수 없습니다.");
        } else if (status === 504) {
          console.error("🚨 [504 Gateway Timeout] 게이트웨이 타임아웃");
          console.error("📥 서버 응답 시간이 초과되었습니다.");
        }
      } else if (err.request) {
        console.error("📥 요청은 전송되었지만 응답을 받지 못했습니다:", err.request);
        console.error("🚨 네트워크 오류 또는 서버 연결 실패");
      } else {
        console.error("📥 에러 메시지:", err.message);
      }
      console.error("📥 전체 에러 객체:", err);
      setBookmarkDrugs([]);
    }
  };

  // 초기 로드 시 북마크 목록 조회
  useEffect(() => {
    fetchBookmarks();
  }, []);

  // 검색 결과와 북마크 목록 동기화
  useEffect(() => {
    if (bookmarkDrugs.length > 0 && searchedDrugs.length > 0) {
      const bookmarkIds = new Set(bookmarkDrugs.map((b) => b.drugId));
      setSearchedDrugs((prev) =>
        prev.map((drug) => ({
          ...drug,
          bookmarked: bookmarkIds.has(drug.drugId),
        }))
      );
    }
  }, [bookmarkDrugs]);

  // 페이지네이션 계산
  const filteredDrugs = showBookmarksOnly
    ? bookmarkDrugs.filter((d) =>
        d.name.toLowerCase().includes(query.toLowerCase())
      )
    : searchedDrugs.filter((d) =>
        d.name.toLowerCase().includes(query.toLowerCase())
      );

  useEffect(() => {
    if (showBookmarksOnly) {
      setCurrentPage(1);
    }
    setTotalPages(Math.ceil(filteredDrugs.length / limit));
  }, [filteredDrugs.length, showBookmarksOnly]);

  const pagedDrugs = filteredDrugs.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );

  // 검색창 API 연동
  useEffect(() => {
    if (showBookmarksOnly) {
      setSearchedDrugs([]);
      return;
    }

    const SearchDrug = async (searchQuery: string) => {
      // 빈 쿼리나 공백만 있는 경우 검색하지 않음
      const trimmedQuery = searchQuery.trim();
      if (!trimmedQuery || trimmedQuery.length < 1) {
        console.log("⏭️ [약물 검색] 빈 쿼리로 인해 검색 건너뜀");
        setSearchedDrugs([]);
        return;
      }

      const requestParams = { 
        q: trimmedQuery, 
        page: 0, 
        size: 20
      };

      console.log("🔍 [약물 검색] 요청 시작");
      console.log("📤 검색어:", trimmedQuery);
      console.log("📤 요청 파라미터:", requestParams);
      console.log("📤 요청 URL: GET /api/v1/drug/search");

      try {
        const res = await axiosInstance.get(`/api/v1/drug/search`, {
          params: requestParams,
        });

        console.log("✅ [약물 검색] 성공");
        console.log("📥 응답 상태:", res.status);
        console.log("📥 응답 데이터:", res.data);
        console.log("📥 응답 데이터 타입:", typeof res.data);
        console.log("📥 items 존재 여부:", !!res.data?.items);
        console.log("📥 items 타입:", Array.isArray(res.data?.items) ? "배열" : typeof res.data?.items);

        // API 응답 구조 확인
        if (res.data && Array.isArray(res.data.items)) {
          console.log("📥 검색 결과 개수:", res.data.items.length);
          console.log("📥 검색 결과 목록:", res.data.items);
          
          // 북마크 목록과 비교하여 bookmarked 상태 설정
          const bookmarkIds = new Set(bookmarkDrugs.map((b) => b.drugId));
          console.log("📥 현재 북마크된 약물 ID 목록:", Array.from(bookmarkIds));
          
          const drugsWithBookmark = res.data.items.map((drug: Drug) => ({
            ...drug,
            bookmarked: bookmarkIds.has(drug.drugId),
          }));
          
          console.log("📥 북마크 상태 적용된 검색 결과:", drugsWithBookmark);
          setSearchedDrugs(drugsWithBookmark);
        } else {
          console.warn("⚠️ [약물 검색] 예상하지 못한 응답 형식");
          console.warn("📥 응답 데이터:", res.data);
          console.warn("📥 items가 배열인가?", Array.isArray(res.data?.items));
          setSearchedDrugs([]);
        }
      } catch (err: any) {
        console.error("❌ [약물 검색] 실패");
        console.error("📤 검색어:", trimmedQuery);
        console.error("📤 요청 파라미터:", requestParams);
        
        if (err.response) {
          const status = err.response.status;
          console.error("📥 에러 상태 코드:", status);
          console.error("📥 에러 응답 데이터:", err.response.data);
          console.error("📥 에러 응답 헤더:", err.response.headers);
          
          if (status === 400) {
            console.error("🚨 [400 Bad Request] 잘못된 요청");
            console.error("📥 400 에러 상세:", JSON.stringify(err.response.data, null, 2));
            console.error("📥 요청 URL:", err.config?.url);
            console.error("📥 요청 파라미터:", err.config?.params);
          } else if (status === 502) {
            console.error("🚨 [502 Bad Gateway] 서버 게이트웨이 오류");
            console.error("📥 서버가 일시적으로 응답할 수 없습니다. 잠시 후 다시 시도해주세요.");
          } else if (status === 503) {
            console.error("🚨 [503 Service Unavailable] 서비스 일시 중단");
            console.error("📥 서버가 일시적으로 사용할 수 없습니다.");
          } else if (status === 504) {
            console.error("🚨 [504 Gateway Timeout] 게이트웨이 타임아웃");
            console.error("📥 서버 응답 시간이 초과되었습니다.");
          }
        } else if (err.request) {
          console.error("📥 요청은 전송되었지만 응답을 받지 못했습니다");
          console.error("📥 요청 객체:", err.request);
          console.error("🚨 네트워크 오류 또는 서버 연결 실패");
        } else {
          console.error("📥 에러 메시지:", err.message);
        }
        console.error("📥 전체 에러 객체:", err);
        setSearchedDrugs([]);
      }
    };

    // 최소 2글자 이상 입력 시에만 검색
    if (query.trim().length >= 1) {
      const debounceTimer = setTimeout(() => {
        SearchDrug(query);
      }, 300);

      return () => clearTimeout(debounceTimer);
    } else {
      setSearchedDrugs([]);
    }
  }, [query, showBookmarksOnly, bookmarkDrugs]);


  // 북마크 추가
  const handleBookmark = async (drugId: string) => {
    console.log("⭐ [북마크 추가] 요청 시작");
    console.log("📤 약물 ID:", drugId);
    console.log("📤 요청 URL: POST /api/v1/drug/bookmarks/" + drugId);
    
    const drugToAdd = searchedDrugs.find((d) => d.drugId === drugId);
    console.log("📤 추가할 약물 정보:", drugToAdd);

    try {
      const res = await axiosInstance.post(
        `/api/v1/drug/bookmarks/${drugId}`,
        null
      );

      console.log("✅ [북마크 추가] 성공");
      console.log("📥 응답 상태:", res.status);
      console.log("📥 응답 데이터:", res.data);

      if (res.status === 200) {
        // 검색 결과 업데이트
        setSearchedDrugs((prev) =>
          prev.map((d) =>
            d.drugId === drugId ? { ...d, bookmarked: true } : d
          )
        );

        // 북마크 목록에 추가 (중복 체크)
        if (drugToAdd && !bookmarkDrugs.some((d) => d.drugId === drugId)) {
          setBookmarkDrugs((prev) => [
            ...prev,
            { ...drugToAdd, bookmarked: true },
          ]);
          console.log("📥 로컬 북마크 목록에 추가됨");
        } else {
          console.log("📥 이미 북마크 목록에 존재하거나 약물 정보를 찾을 수 없음");
        }

        // 북마크 목록 다시 조회하여 최신 상태 유지
        await fetchBookmarks();
      }
    } catch (err: any) {
      console.error("❌ [북마크 추가] 실패");
      console.error("📤 약물 ID:", drugId);
      console.error("📤 추가하려던 약물 정보:", drugToAdd);
      
      if (err.response) {
        const status = err.response.status;
        console.error("📥 에러 상태 코드:", status);
        console.error("📥 에러 응답 데이터:", err.response.data);
        console.error("📥 에러 응답 헤더:", err.response.headers);
        
        if (status === 502) {
          console.error("🚨 [502 Bad Gateway] 서버 게이트웨이 오류");
          alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        } else if (status === 503) {
          console.error("🚨 [503 Service Unavailable] 서비스 일시 중단");
          alert("서비스가 일시적으로 사용할 수 없습니다.");
        } else if (status === 504) {
          console.error("🚨 [504 Gateway Timeout] 게이트웨이 타임아웃");
          alert("요청 시간이 초과되었습니다. 다시 시도해주세요.");
        } else {
          alert("북마크 추가에 실패했습니다.");
        }
      } else if (err.request) {
        console.error("📥 요청은 전송되었지만 응답을 받지 못했습니다:", err.request);
        console.error("🚨 네트워크 오류 또는 서버 연결 실패");
        alert("네트워크 오류가 발생했습니다. 연결을 확인해주세요.");
      } else {
        console.error("📥 에러 메시지:", err.message);
        alert("북마크 추가에 실패했습니다.");
      }
      console.error("📥 전체 에러 객체:", err);
    }
  };

  // 북마크 제거
  const DeleteBookmark = async (drugId: string) => {
    console.log("🗑️ [북마크 제거] 요청 시작");
    console.log("📤 약물 ID:", drugId);
    console.log("📤 요청 URL: DELETE /api/v1/drug/bookmarks/" + drugId);
    
    const drugToRemove = bookmarkDrugs.find((d) => d.drugId === drugId);
    console.log("📤 제거할 약물 정보:", drugToRemove);

    try {
      const res = await axiosInstance.delete(
        `/api/v1/drug/bookmarks/${drugId}`
      );

      console.log("✅ [북마크 제거] 성공");
      console.log("📥 응답 상태:", res.status);
      console.log("📥 응답 데이터:", res.data);

      if (res.status === 200) {
        // 검색 결과 업데이트
        setSearchedDrugs((prev) =>
          prev.map((d) =>
            d.drugId === drugId ? { ...d, bookmarked: false } : d
          )
        );
        console.log("📥 검색 결과에서 북마크 상태 제거됨");

        // 북마크 목록에서 제거
        setBookmarkDrugs((prev) => prev.filter((d) => d.drugId !== drugId));
        console.log("📥 로컬 북마크 목록에서 제거됨");

        // 북마크 목록 다시 조회하여 최신 상태 유지
        await fetchBookmarks();
      }
    } catch (err: any) {
      console.error("❌ [북마크 제거] 실패");
      console.error("📤 약물 ID:", drugId);
      console.error("📤 제거하려던 약물 정보:", drugToRemove);
      
      if (err.response) {
        const status = err.response.status;
        console.error("📥 에러 상태 코드:", status);
        console.error("📥 에러 응답 데이터:", err.response.data);
        console.error("📥 에러 응답 헤더:", err.response.headers);
        
        if (status === 502) {
          console.error("🚨 [502 Bad Gateway] 서버 게이트웨이 오류");
          alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        } else if (status === 503) {
          console.error("🚨 [503 Service Unavailable] 서비스 일시 중단");
          alert("서비스가 일시적으로 사용할 수 없습니다.");
        } else if (status === 504) {
          console.error("🚨 [504 Gateway Timeout] 게이트웨이 타임아웃");
          alert("요청 시간이 초과되었습니다. 다시 시도해주세요.");
        } else {
          alert("북마크 취소에 실패했습니다.");
        }
      } else if (err.request) {
        console.error("📥 요청은 전송되었지만 응답을 받지 못했습니다:", err.request);
        console.error("🚨 네트워크 오류 또는 서버 연결 실패");
        alert("네트워크 오류가 발생했습니다. 연결을 확인해주세요.");
      } else {
        console.error("📥 에러 메시지:", err.message);
        alert("북마크 취소에 실패했습니다.");
      }
      console.error("📥 전체 에러 객체:", err);
    }
  };

  return (
    <Screen>
      <SearchContainer>
        <SearchBox>
          <SearchText
            type="text"
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setQuery(e.target.value);
            }}
            placeholder="약물명을 검색하세요"
          />
          <SearchIcon></SearchIcon>
        </SearchBox>
        <BookmarkIcon onClick={() => setShowBookmarksOnly((prev) => !prev)}>
          {showBookmarksOnly ? (
            <AiFillStar size={28} color="#7fab00" />
          ) : (
            <AiOutlineStar size={28} />
          )}
        </BookmarkIcon>
      </SearchContainer>

      <ProductList>
        {showBookmarksOnly ? (
          // 북마크 모드
          pagedDrugs.length > 0 ? (
            pagedDrugs.map((drug) => (
              <ProductBox
                key={drug.drugId}
                onClick={() => {
                  if (drug.drugId === undefined) {
                    console.error("❗ drug.drugId가 undefined입니다.", drug);
                  } else {
                    gotoInformation(drug.drugId);
                  }
                }}
              >
                <Group>
                  {drug.thumbnailUrl && (
                    <img
                      src={drug.thumbnailUrl}
                      alt={drug.name}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const parent = target.parentElement;
                        if (parent) {
                          const placeholder = parent.querySelector(".default-image") as HTMLElement;
                          if (placeholder) placeholder.style.display = "flex";
                        }
                      }}
                      style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "10px",
                        flexShrink: 0,
                        display: "block",
                      }}
                    />
                  )}
                  <DefaultImage
                    className="default-image"
                    style={{
                      display: drug.thumbnailUrl ? "none" : "flex",
                    }}
                  >
                    정보 없음
                  </DefaultImage>
                  <TextLine>
                    <Name>{drug.name}</Name>
                    <BookmarkIcon
                      onClick={(e) => {
                        e.stopPropagation();
                        DeleteBookmark(drug.drugId);
                      }}
                    >
                      <AiFillStar size={28} color="#7fab00" />
                    </BookmarkIcon>
                  </TextLine>
                </Group>
              </ProductBox>
            ))
          ) : (
            <No>
              {query.trim() !== ""
                ? "북마크에서 검색 결과가 없습니다"
                : "북마크된 약물이 없습니다"}
            </No>
          )
        ) : (
          // 검색 모드
          query.trim() !== "" ? (
            pagedDrugs.length > 0 ? (
              pagedDrugs.map((drug) => (
                <ProductBox
                  key={drug.drugId}
                  onClick={() => {
                    if (drug.drugId === undefined) {
                      console.error("❗ drug.drugId가 undefined입니다.", drug);
                    } else {
                      gotoInformation(drug.drugId);
                    }
                  }}
                >
                  <Group>
                    {drug.thumbnailUrl && (
                      <img
                        src={drug.thumbnailUrl}
                        alt={drug.name}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const parent = target.parentElement;
                          if (parent) {
                            const placeholder = parent.querySelector(".default-image") as HTMLElement;
                            if (placeholder) placeholder.style.display = "flex";
                          }
                        }}
                        style={{
                          width: "100px",
                          height: "100px",
                          borderRadius: "10px",
                          flexShrink: 0,
                          display: "block",
                        }}
                      />
                    )}
                    <DefaultImage
                      className="default-image"
                      style={{
                        display: drug.thumbnailUrl ? "none" : "flex",
                      }}
                    >
                      정보 없음
                    </DefaultImage>
                    <TextLine>
                      <Name>{drug.name}</Name>
                      <BookmarkIcon
                        onClick={(e) => {
                          e.stopPropagation();
                          if (drug.bookmarked) {
                            DeleteBookmark(drug.drugId);
                          } else {
                            handleBookmark(drug.drugId);
                          }
                        }}
                      >
                        {drug.bookmarked ? (
                          <AiFillStar size={28} color="#7fab00" />
                        ) : (
                          <AiOutlineStar size={28} />
                        )}
                      </BookmarkIcon>
                    </TextLine>
                  </Group>
                </ProductBox>
              ))
            ) : (
              <No>검색 결과가 없습니다</No>
            )
          ) : (
            <No>약물명을 입력하여 검색하세요</No>
          )
        )}
      </ProductList>

      {((showBookmarksOnly && bookmarkDrugs.length > limit) ||
        (!showBookmarksOnly && query.trim() !== "" && filteredDrugs.length > limit)) && (
        <PageNumberBox>
          <NumberLine>
            <ArrowButton src={arrow1_} alt="이전" onClick={handlePrev} />
            <OnlyNumber>
              {[...Array(totalPages)].map((_, i) => (
                <Number
                  key={i}
                  onClick={() => handlePageClick(i + 1)}
                  style={{
                    fontWeight: currentPage === i + 1 ? "bold" : "normal",
                    background:
                      currentPage === i + 1
                        ? "rgba(182, 245, 0, 0.35)"
                        : "rgba(182, 245, 0, 0.15)",
                  }}
                >
                  {i + 1}
                </Number>
              ))}
            </OnlyNumber>
            <ArrowButton src={arrow2} alt="다음" onClick={handleNext} />
          </NumberLine>
        </PageNumberBox>
      )}
      <Nav></Nav>
    </Screen>
  );
}

const Screen = styled.div`
  position: relative;
  width: 393px;
  height: 852px;
  background: #ffffff;
`;

const SearchContainer = styled.div`
  position: absolute;
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 10px; /* 돋보기 박스와 별 사이 간격 */
`;

const SearchBox = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 323px;
  height: 38px;
`;

const SearchText = styled.input`
  width: 100%;
  height: 100%;
  background: #f2f3ee;
  border: none;
  border-radius: 5px;
  padding: 0 38px 0 15px; /* 오른쪽 여백 확보 (돋보기 들어갈 자리) */
  font-size: 15px;
  color: #333;

  &:focus {
    outline: none;
  }
`;

const SearchIcon = styled(AiOutlineSearch)`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #444;
  font-size: 20px;
  background-color: transparent;
  cursor: pointer;
`;

const PageNumberBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 4px;

  position: absolute;
  width: 174px;
  height: 22px;
  left: calc(50% - 174px / 2 - 0.5px);
  top: 761px;
`;
const NumberLine = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  position: absolute;
  width: 122px;
  height: 22px;
  gap: 10px;
  border-radius: 5px;
`;
const Number = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  width: 22px;
  height: 22px;

  background: rgba(182, 245, 0, 0.15);
  border-radius: 5px;

  /* Inside auto layout */
  flex: none;
  order: 0;
  flex-grow: 0;
  cursor: pointer;
`;
const OnlyNumber = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  width: 122px;
  height: 22px;

  background: rgba(182, 245, 0, 0.15);
  border-radius: 5px;
`;
const ProductList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 12px;

  position: absolute;
  width: 363px;
  height: 668px;
  left: calc(50% - 363px / 2);
  top: 73px;
  overflow-y: auto;
`;
const ProductBox = styled.div`
  box-sizing: border-box;

  width: 363px;
  height: 124px;

  background: #ffffff;
  border: 1px solid #ebebeb;
  box-shadow: 0px 2px 5px rgba(182, 245, 0, 0.2);
  border-radius: 5px;

  /* Inside auto layout */
  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;
  cursor: pointer;
`;
const Group = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 0px;
  margin: 12px 14px;
  width: 335px;
  height: 100px;
  left: 20px;
  top: 12px;
  gap: 19px;
`;
const TextLine = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding: 0px;

  width: 216px;
  height: 25px;

  /* Inside auto layout */
  flex: none;
  order: 1;
  flex-grow: 0;
`;
const Name = styled.div`
  margin: 0 auto;
  width: auto;
  height: 22px;

  font-family: "Inter";
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 22px;
  /* identical to box height */

  color: #333333;
`;
const BookmarkIcon = styled.div`
  width: 30px;
  height: 30px;
  color: #7fab00;
  cursor: pointer;
`;
const ArrowButton = styled.img`
  width: 22px;
  height: 22px;
  background: rgba(182, 245, 0, 0.15);
  border-radius: 5px;
  cursor: pointer;
`;
const No = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  font-family: "Pretendard";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  color: #333333;
`;
const DefaultImage = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 10px;
  background: #ebebeb;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: #999999;
  flex-shrink: 0;
`;
