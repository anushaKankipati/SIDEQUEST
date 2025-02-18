'use client';

import { useState } from 'react';

type Props = {
  onSearch: (formData: FormData) => void;
};

export default function SearchBar({ onSearch }: Props) {
  const [phrase, setPhrase] = useState('');
  const [category, setCategory] = useState('Tags');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('phrase', phrase);
    formData.append('category', category);

    onSearch(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center border border-gray-300 rounded-full overflow-hidden w-full max-w-lg h-10 focus-within:border-black transition"
    >
      <input
        name="phrase"
        type="text"
        value={phrase}
        onChange={(e) => setPhrase(e.target.value)}
        placeholder="Search SIDEQUE$T..."
        className="flex-initial w-4/5 px-4 py-2 outline-none bg-white text-gray-700 focus:ring-0"
      />

      <div className="w-px h-10 bg-gray-300"></div>

      <select
        name="category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="flex-initial w-1/5 grow bg-theme-green text-white px-3 py-2 outline-none h-full text-sm hover:bg-theme-green-dark"
      >
        <option value="Title">Title</option>
        <option value="Tags">Tags</option>
        <option value="Name">Name</option>
        <option value="Additional"><option value="Tags">Tags</option>ery very long category name</option>
      </select>
    </form>
  );
}
