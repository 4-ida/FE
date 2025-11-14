import styled from "styled-components";
import React, { useState, useEffect } from "react";
import { AiOutlineSearch, AiOutlineStar, AiFillStar } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import Nav from "../components/nav";
import arrow1_ from "../assets/arrow1.svg";
import arrow2 from "../assets/arrow2.svg";
import axios from "axios";
import axiosInstance from "../axiosInstance";

interface Drug {
  drugId: string;
  name: string;
  thumbnailUrl: string;
  bookmarked: boolean;
}

export default function Search() {
  const [query, setQuery] = useState("");
  const token = localStorage.getItem("accessToken");
  const [searchedDrugs, setSearchedDrugs] = useState<Drug[]>([]);
  const [bookmarkDrugs, setBookmarkDrugs] = useState<Drug[]>([]);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [pagedDrugs, setPagedDrugs] = useState<Drug[]>([]);
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

  // 페이지네이션
  useEffect(() => {
    if (showBookmarksOnly) {
      setCurrentPage(1); // 🔥 북마크 모드 켜질 때 페이지 1로
    }
    const filtered = searchedDrugs.filter((d) =>
      d.name.toLowerCase().includes(query.toLowerCase())
    );

    setTotalPages(Math.ceil(filtered.length / limit));

    const startIndex = (currentPage - 1) * limit;
    setPagedDrugs(filtered.slice(startIndex, startIndex + limit));
  }, [searchedDrugs, query, currentPage, showBookmarksOnly]);

  // 검색창 API 연동
  useEffect(() => {
    if (showBookmarksOnly) return;
    const SearchDrug = async (query: string) => {
      try {
        const res = await axiosInstance.get(`/api/v1/drug/search`, {
          params: { q: query, page: 0, size: 5 },
          headers: {
            Authorization: `Bearer ${token}`, // ✅ 인증 토큰 추가
          },
        });

        console.log("약 명 검색 성공:", res.data);
        if (Array.isArray(res.data.items)) {
          setSearchedDrugs(res.data.items); // 이제 타입 에러 안 남!
        }
      } catch (err: any) {
        console.error("검색 실패", err);
      }
    };
    if (query.trim() !== "") SearchDrug(query);
  }, [query, showBookmarksOnly]);

  // 자동완성 API 연동
  const auto = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/drug/suggest`,
        {
          params: {
            q: query,
            limit: 10,
          },
          headers: {
            Authorization: `Bearer ${token}`, // ✅ 인증 토큰 추가
          },
        }
      );

      if (res.status === 200) {
        console.log("약 명 자동완성 성공 ");
        console.log(res.data);
      }
    } catch (err: any) {
      console.error("자동완성 실패 ", err);
    }
  };

  // 북마크 추가
  const handleBookmark = async (drugId: string) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/drug/bookmarks/${drugId}`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        console.log("약물 북마크 추가 성공");

        const added = searchedDrugs.find((d) => d.drugId === drugId);

        if (added) {
          setBookmarkDrugs((prev) => [...prev, { ...added, bookmarked: true }]);
        }

        updateBookmarkUI(drugId, true);
      }
    } catch (err) {
      console.error("북마크 추가 실패", err);
    }
  };

  // 북마크 제거
  const DeleteBookmark = async (drugId: string) => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/v1/drug/bookmarks/${drugId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        console.log("약물 북마크 취소 성공");

        setBookmarkDrugs((prev) => prev.filter((d) => d.drugId !== drugId));

        updateBookmarkUI(drugId, false);
      }
    } catch (err) {
      console.error("북마크 취소 실패", err);
    }
  };

  // 북마크 목록 조회

  const getBookmarkList = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/drug/bookmarks`,
        {
          params: {
            page: 0,
            size: 100,
            sort: "recent",
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(" 북마크 목록 조회 성공", res.data);

      if (Array.isArray(res.data.items)) {
        setBookmarkDrugs(res.data.items); // 🔧 북마크 데이터를 별도의 상태에 저장
      }
    } catch (err) {
      console.error("북마크 목록 조회 실패", err);
    }
  };

  getBookmarkList();

  const updateBookmarkUI = (drugId: string, value: boolean) => {
    // 검색 리스트 UI 업데이트
    setSearchedDrugs((prev) =>
      prev.map((d) => (d.drugId === drugId ? { ...d, bookmarked: value } : d))
    );

    // 북마크 목록 UI도 즉시 업데이트
    if (value) {
      // 북마크 추가
      const added = searchedDrugs.find((d) => d.drugId === drugId);
      if (added && !bookmarkDrugs.some((d) => d.drugId === drugId)) {
        setBookmarkDrugs((prev) => [...prev, { ...added, bookmarked: true }]);
      }
    } else {
      // 북마크 제거
      setBookmarkDrugs((prev) => prev.filter((d) => d.drugId !== drugId));
    }
  };

  const displayedDrugs = showBookmarksOnly ? bookmarkDrugs : pagedDrugs;
  return (
    <Screen>
      <SearchContainer>
        <SearchBox>
          <SearchText
            type="text"
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value;
              setQuery(value);
              auto();
            }}
          />
          <SearchIcon></SearchIcon>
        </SearchBox>
        <BookmarkIcon onClick={() => setShowBookmarksOnly((prev) => !prev)}>
          {" "}
          {showBookmarksOnly ? (
            <AiFillStar size={28} />
          ) : (
            <AiOutlineStar size={28} />
          )}
        </BookmarkIcon>
      </SearchContainer>

      {query.trim() !== "" && (
        <ProductList>
          {displayedDrugs.length > 0 ? (
            displayedDrugs.map((drug) => (
              <ProductBox
                key={drug.drugId}
                onClick={() => {
                  if (drug.drugId === undefined) {
                    console.error("❗ drug.id가 undefined입니다.", drug);
                  } else {
                    gotoInformation(drug.drugId);
                  }
                }}
              >
                <Group>
                  <img
                    src={drug.thumbnailUrl}
                    alt={drug.name}
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "10px",
                    }}
                  />
                  <TextLine>
                    <Name>{drug.name}</Name>
                    <BookmarkIcon
                      onClick={(e) => {
                        e.stopPropagation(); // 부모 클릭(페이지 이동) 방지

                        if (drug.bookmarked) {
                          // 이미 북마크된 경우 → 북마크 해제
                          DeleteBookmark(drug.drugId);
                        } else {
                          // 아직 북마크 안 된 경우 → 북마크 추가
                          handleBookmark(drug.drugId);
                        }

                        // UI 상태 즉시 반영 (색상 토글)
                      }}
                    >
                      {drug.bookmarked ? (
                        <AiFillStar size={28} />
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
          )}
        </ProductList>
      )}

      {query.trim() !== "" && displayedDrugs.length > 1 && (
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
  top: 729px;
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
