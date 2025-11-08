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
}

export default function Dropdown({
  label,
  options,
  selected,
  onSelect,
  disableDefaultUI,
  onClick,
}: DropdownProps) {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    if (disableDefaultUI) {
      onClick && onClick(); // ✅ 모달 실행
      return;
    }
    setShow((prev) => !prev);
  };

  const handleSelect = (value: string) => {
    onSelect(value);
    setShow(false);
  };

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
    <Wrapper ref={ref}>
      {label && <Label>{label}</Label>}
      <SelectButton onClick={toggleDropdown} isOpen={show}>
        <ArrowIcon isOpen={show} />
      </SelectButton>
      {!disableDefaultUI && show && (
        <Menu>
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

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  gap: 20px;
`;

const Label = styled.div`
  width: 363px;
  margin-bottom: 8px;
  font-family: "Pretendard";
  font-weight: 500;
  font-size: 18px;
  color: #333333;
`;

const SelectButton = styled.button<{ isOpen: boolean }>`
  width: 363px;
  height: 40px;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border: 1.5px solid #ebebeb;
  border-radius: 5px;
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;

  color: #333333;

  /* 내부 오토레이아웃 */
  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;
  background: #ffffff;
  cursor: pointer;
`;

const ArrowIcon = styled(DropdownIcon)<{ isOpen: boolean }>`
  transition: transform 0.2s ease;
  transform: ${({ isOpen }) => (isOpen ? "rotate(180deg)" : "none")};
  margin-right: -10px;
`;

const Menu = styled.ul`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  background: white;
  border: 1.5px solid #ebebeb;
  border-radius: 5px;
  padding: 5px;
  margin: 0;
  box-sizing: border-box;
  list-style: none;
  z-index: 1000;
`;

const MenuItem = styled.li<{ selected: boolean }>`
  height: 40px;
  padding: 0px 5px;
  display: flex;
  align-items: center;
  background-color: ${({ selected }) => (selected ? "#E8FFCC" : "transparent")};
  border-radius: ${({ selected }) => (selected ? "5px" : "0")};
  transition: background-color 0.2s ease;
  cursor: pointer;

  &:hover {
    background-color: #e8ffcc;
    border-radius: 5px;
  }
`;
