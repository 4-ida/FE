import styled from "styled-components";
import React, { useState, useEffect } from "react";
import { AiOutlineSearch, AiOutlineStar, AiFillStar } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import Nav from "../components/nav";
import arrow1_ from "../assets/arrow1.svg";
import arrow2 from "../assets/arrow2.svg";

interface Drug {
  id: number;
  name: string;
  image: string;
  bookmarked: boolean;
}

export default function Search() {
  const [find, setFind] = useState("");
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const mockData: Drug[] = [
    { id: 1, name: "타이레놀 500mg", image: "/Ty.svg", bookmarked: false },
    {
      id: 2,
      name: "타이레놀 콜드 이소정",
      image: "/cold.svg",
      bookmarked: false,
    },
    { id: 3, name: "게보린", image: "/gebo.svg", bookmarked: false },
    { id: 4, name: "판피린", image: "/pan.svg", bookmarked: false },
    { id: 5, name: "부루펜", image: "/bru.svg", bookmarked: false },
    { id: 6, name: "이지엔6", image: "/ez6.svg", bookmarked: false },
    { id: 7, name: "펜잘큐", image: "/pen.svg", bookmarked: false },
    { id: 8, name: "애드빌", image: "/advil.svg", bookmarked: false },
    { id: 9, name: "베아제", image: "/bea.svg", bookmarked: false },
  ];
  const Navigate = useNavigate();
  const gotoInformation = (id: number) => {
    Navigate(`/drug/information/${id}`);
  };
  const toggleBookmark = (id: number) => {
    setDrugs((prev) =>
      prev.map((drug) =>
        drug.id === id ? { ...drug, bookmarked: !drug.bookmarked } : drug
      )
    );
  };
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  // 북마크만 보기
  const bookmarked = drugs.filter((d) => d.bookmarked);

  const filteredDrugs = drugs.filter((drug) => drug.name.includes(find.trim()));

  // ⭐ 북마크 보기 필터 적용
  const displayedDrugs = showBookmarksOnly
    ? filteredDrugs.filter((drug) => drug.bookmarked)
    : filteredDrugs;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;
  useEffect(() => {
    // 지금은 목데이터 기반으로 검색 및 페이지네이션
    const filtered = mockData.filter((drug) =>
      drug.name.toLowerCase().includes(find.toLowerCase())
    );
    setTotalPages(Math.ceil(filtered.length / limit));

    const startIndex = (currentPage - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);
    setDrugs(paginated);
  }, [find, currentPage]);
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };
  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Screen>
      <SearchContainer>
        <SearchBox>
          <SearchText
            type="text"
            value={find}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFind(e.target.value)
            }
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

      {find.trim() !== "" && (
        <ProductList>
          {displayedDrugs.length > 0 ? (
            displayedDrugs.map((drug) => (
              <ProductBox
                key={drug.id}
                onClick={() => gotoInformation(drug.id)}
              >
                <Group>
                  <img
                    src={drug.image}
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
                        toggleBookmark(drug.id);
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
      {find.trim() !== "" && displayedDrugs.length > 1 && (
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
