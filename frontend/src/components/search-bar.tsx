const SearchBar = () => {
  return (
    <div className="input-group flex flex-row gap-4">
      <input
        type="text"
        placeholder="Search…"
        className="input input-bordered w-full "
      />
      <button className="btn btn-primary">Search</button>
    </div>
  );
};

export default SearchBar;
