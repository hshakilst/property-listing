"use client";
import { useRouter } from "next/navigation";
import { useState, ChangeEvent } from "react";

type SearchBarProps = {
  defaultValue: string | null;
};

const SearchBar: React.FC<SearchBarProps> = ({ defaultValue }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(defaultValue);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") return handleSearch();
  };

  const handleSearch = () => {
    if (searchQuery)
      return router.push(`?q=${encodeURIComponent(searchQuery)}`);
    if (!searchQuery) return router.push(`/`);
  };

  return (
    <div className="input-group flex flex-row gap-4">
      <input
        type="text"
        placeholder="Search…"
        className="input input-bordered w-full "
        value={searchQuery ?? ""}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <button className="btn btn-primary" onClick={handleSearch}>
        Search
      </button>
    </div>
  );
};

export default SearchBar;
