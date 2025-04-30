import { useEffect, useState } from "react";

export default function useScrollSpy(ids: string[], offset = 0) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + offset + 1;

      const currentSection = ids
        .map((id) => {
          const element = document.getElementById(id);
          if (!element) return null;
          return { id, offsetTop: element.offsetTop };
        })
        .filter(Boolean)
        .sort((a, b) => (b!.offsetTop - a!.offsetTop))
        .find((section) => scrollPosition >= section!.offsetTop);

      if (currentSection) {
        setActiveId(currentSection.id);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Call initially
    return () => window.removeEventListener("scroll", handleScroll);
  }, [ids, offset]);

  return activeId;
}
