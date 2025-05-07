import { useState } from "react";

interface DropdownProps {
  title: string;
  items: string[];
}

export default function Dropdown({ items }: DropdownProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className="dropdown">
      <button onClick={toggle} className="btn">
        Dropdown
      </button>
      <p className="w-1/3 border p-1 border-gray-800">Select...</p>
      {isOpen && (
        <ul className="dropdown-menu">
          {items.map((item) => (
            <li className="p-1 border border-gray-800" key={item}>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
