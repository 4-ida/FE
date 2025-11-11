import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import DropdownIcon from "../assets/dropdown.svg?react";

interface DropdownProps {
  label?: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  disableDefaultUI?: boolean;
  onClick?: () => void;
  variant?: "default" | "custom";
  className?: string;
  placeholder?: string;
}

export default function Dropdown({
  label,
  options,
  selected,
  onSelect,
  disableDefaultUI,
  onClick,
  className,
  variant = "default",
  placeholder = "선택해 주세요",
}: DropdownProps) {
  const [show, setShow] = useState(false);
  const [openUp, setOpenUp] = useState(false); // ✅ 추가
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null); // ✅ 버튼 위치 확인용

  const toggleDropdown = () => {
    if (disableDefaultUI) {
      onClick && onClick(); // ✅ 모달 실행
      return;
    }
    setShow((prev) => !prev);
  };

  // ✅ 메뉴 방향 결정 로직
  useEffect(() => {
    if (show && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      // 아래 공간이 200px보다 작고 위쪽이 더 넓으면 위로 열기
      setOpenUp(spaceBelow < 200 && spaceAbove > spaceBelow);
    }
  }, [show]);

  const handleSelect = (value: string) => {
    onSelect(value);
    setShow(false);
  };

  // ✅ 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShow(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Wrapper ref={ref} className={className} $variant={variant}>
      {label && <Label>{label}</Label>}

      <SelectButton
        ref={buttonRef}
        onClick={toggleDropdown}
        isOpen={show}
        $variant={variant}
      >
        <span style={{ color: selected ? "#333" : "#999" }}>
          {selected || placeholder}
        </span>
        <ArrowIcon isOpen={show} />
      </SelectButton>

      {!disableDefaultUI && show && (
        <Menu $openUp={openUp}>
          {options.map((opt: string) => (
            <MenuItem
              key={opt}
              selected={opt === selected}
              onClick={() => handleSelect(opt)}
            >
              {opt}
            </MenuItem>
          ))}
        </Menu>
      )}
    </Wrapper>
  );
}

// --- Styled Components ---

const Wrapper = styled.div<{ $variant: "default" | "custom" }>`
  position: relative;
  width: ${({ $variant }) => ($variant === "custom" ? "111px" : "363px")};
  gap: 20px;
  background: ${({ $variant }) =>
    $variant === "custom" ? "#ffffff" : "#ffffff"};
`;

const Label = styled.div`
  width: 363px;
  margin-bottom: 8px;
  font-family: "Pretendard";
  font-weight: 500;
  font-size: 18px;
  color: #333333;
`;

const SelectButton = styled.button<{
  isOpen: boolean;
  $variant: "default" | "custom";
}>`
  width: ${({ $variant }) => ($variant === "custom" ? "111px" : "363px")};
  height: 42px;
  padding: 0 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1.5px solid #ebebeb;
  border-radius: 5px;
  font-family: "Pretendard";
  font-size: 16px;
  color: #333;
  background: ${({ $variant }) => ($variant === "custom" ? "#fff" : "#fefefe")};
  cursor: pointer;

  &:focus,
  &:active,
  &:hover {
    border: 1.5px solid #b6f500;
  }
`;

const ArrowIcon = styled(DropdownIcon)<{ isOpen: boolean }>`
  transition: transform 0.2s ease;
  transform: ${({ isOpen }) => (isOpen ? "rotate(180deg)" : "none")};
  margin-right: -10px;
`;

const Menu = styled.ul<{ $openUp: boolean }>`
  position: absolute;
  ${({ $openUp }) =>
    $openUp ? "bottom: calc(100% + 4px);" : "top: calc(100% + 4px);"}
  left: 0;
  width: 100%;
  background: white;
  border: 1.5px solid #ebebeb;
  border-radius: 5px;
  padding: 5px;
  margin: 0;
  list-style: none;
  z-index: 1000;
  max-height: 240px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(181, 228, 123, 0.5);
    border-radius: 3px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

const MenuItem = styled.li<{ selected: boolean }>`
  height: 40px;
  padding: 0 5px;
  display: flex;
  align-items: center;
  background-color: ${({ selected }) => (selected ? "#E8FFCC" : "transparent")};
  border-radius: ${({ selected }) => (selected ? "5px" : "0")};
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #e8ffcc;
    border-radius: 5px;
  }
`;
