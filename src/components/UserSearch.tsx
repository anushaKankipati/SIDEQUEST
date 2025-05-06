"use client";

import { useState } from "react";
import UserCard from "@/src/components/UserCard";
import type { User } from "@prisma/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCode } from "@fortawesome/free-solid-svg-icons";

interface UserSearchProps {
  initialUsers: User[];
}

type SearchMode = "name" | "skills";

export default function UserSearch({ initialUsers }: UserSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMode, setSearchMode] = useState<SearchMode>("name");

  // Filter users based on search query and mode
  const filteredUsers = initialUsers.filter((user) => {
    if (searchMode === "name") {
      const searchTerms = searchQuery.toLowerCase().split(/\s+/).filter(term => term.length > 0);
      if (searchTerms.length === 0) return true;
      
      return searchTerms.some(term => 
        user.name?.toLowerCase().includes(term)
      );
    } else {
      // In skills mode, split by comma and trim whitespace
      const searchTerms = searchQuery.toLowerCase()
        .split(',')
        .map(term => term.trim())
        .filter(term => term.length > 0);
      
      if (searchTerms.length === 0) return true;
      
      return searchTerms.every(term =>
        user.skills?.some(skill => skill.toLowerCase().includes(term))
      );
    }
  });

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-7xl px-4 mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Discover Questers</h1>
          
          {/* Search input with mode buttons */}
          <div className="w-full max-w-lg">
            <div className="relative flex">
              <input
                type="text"
                placeholder={searchMode === "name" 
                  ? "Search by name..." 
                  : "Search by skills (e.g. java, basketball)..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-theme-green focus:border-transparent"
              />
              <div className="flex">
                <button
                  onClick={() => setSearchMode("name")}
                  className={`px-4 py-2 border-t border-b border-l border-gray-300 transition-colors ${
                    searchMode === "name"
                      ? "bg-theme-green text-white border-theme-green"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                  title="Search by name"
                >
                  <FontAwesomeIcon icon={faUser} className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSearchMode("skills")}
                  className={`px-4 py-2 border border-gray-300 rounded-r-lg transition-colors ${
                    searchMode === "skills"
                      ? "bg-theme-green text-white border-theme-green"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                  title="Search by skills"
                >
                  <FontAwesomeIcon icon={faCode} className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl px-4">
        {filteredUsers.map((user) => (
          <div key={user.id} className="w-full">
            <UserCard user={user} />
          </div>
        ))}
      </div>
    </div>
  );
} 