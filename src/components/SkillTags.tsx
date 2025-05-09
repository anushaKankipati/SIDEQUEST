"use client"; 

import { useState } from "react";
import preDefinedTags from "../../public/data/cleaned_tags.json"


type SkillTagsProps = {
  tags: string[]; 
  setTags: (tags: string[]) => void;
};

export default function SkillTags({tags, setTags }: SkillTagsProps) {
  const predefinedSkills = preDefinedTags; 
  const [addedSkills, setAddedSkills] = useState<string[]>(tags)
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState<string>("");

  // Update the current input and filter suggestions
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    setCurrentInput(input);
    if (input) {
      const suggestions = Array.from(predefinedSkills.filter((skill) => skill.toLowerCase().startsWith(input.toLowerCase())).slice(0, 5)
      
      );
      setSuggestedSkills(suggestions);
    } else {
      setSuggestedSkills([]);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addSkill();
    }
  };

  // Clear the input and suggestions
  const clearInput = () => {
    setCurrentInput("");
    setSuggestedSkills([]);
  };

  // Add a skill to the list
  const addSkill = (skill = currentInput.trim()) => {
    if (skill && !addedSkills.includes(skill)) {
      const updatedSkills = [...addedSkills, skill];
      setAddedSkills(updatedSkills);
      setTags(updatedSkills); // Notify parent about the change
    }
    clearInput();
  };

  // Remove a skill from the list
  const removeSkill = (skillToRemove: string) => {
    const updatedSkills = addedSkills.filter((skill) => skill !== skillToRemove);
    setAddedSkills(updatedSkills);
    setTags(updatedSkills); // Notify parent about the change
  };

  return (
    <div className="skill-tags-container">
      <label htmlFor="skillInput">Quest Tags</label>
      <input
        id="skillInput"
        type="text"
        value={currentInput}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Add a relevant skill..."
      />

      {/* Render suggestions */}
      {suggestedSkills.length > 0 && (
        <div className="suggestions">
          {suggestedSkills.map((skill, index) => (
            <div
              key={index}
              className="suggestion"
              onClick={() => addSkill(skill)}
            >
              {skill}
            </div>
          ))}
        </div>
      )}

      {/* Render added skills */}
      <div className="tags mt-2">
        {addedSkills.map((skill, index) => (
          <span key={index} className="tag">
            {skill}
            <button
              type="button"
              className="remove-tag text-red-400 text-md font-medium"
              onClick={() => removeSkill(skill)}
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
