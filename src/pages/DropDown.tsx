import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { AiOutlineDown } from "react-icons/ai";

interface DropdownProps {
  label?: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}

export default function Dropdown({
  label,
  options,
  selected,
  onSelect,
}: DropdownProps) {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setShow((prev) => !prev);

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
        <span>{selected || ""}</span>
        <ArrowIcon isOpen={show} />
      </SelectButton>

      {show && (
        <Menu>
          {options.map((opt) => (
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
  /* 카페인 민감도 */

  width: 363px;
  height: 21px;
  margin-bottom: 8px;

  font-family: "Pretendard";
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 21px;

  color: #333333;

  /* 내부 오토레이아웃 */
  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;
`;
const SelectButton = styled.button<{ isOpen: boolean }>`
  width: 363px;
  height: 42px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  border: 1.5px solid #ebebeb;
  border-radius: 5px;
  justify-content: space-between;

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
`;

const ArrowIcon = styled(AiOutlineDown)<{ isOpen: boolean }>`
  transition: transform 0.2s ease;
  transform: ${({ isOpen }) => (isOpen ? "rotate(180deg)" : "none")};
  /* react-icons/RiArrowDropDownLine */

  position: relative;
  width: 20px;
  height: 20px;
`;

const Menu = styled.ul`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;

  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0;
  margin: 0;

  list-style: none;
  z-index: 1000;
`;
const MenuItem = styled.li<{ selected: boolean }>`
  display: flex;
  width: 343px;
  height: 40px;
  align-items: center;
  padding: 0px 10px;

  background: #ffffff;

  /* 내부 오토레이아웃 */
  flex: none;
  order: 0;
  flex-grow: 0;
  cursor: pointer;
  background-color: ${({ selected }) => (selected ? "#E8FFCC" : "transparent")};
  border-radius: ${({ selected }) => (selected ? "5px" : "0px")};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #e8ffcc;
    border-radius: 5px;
  }
`;
