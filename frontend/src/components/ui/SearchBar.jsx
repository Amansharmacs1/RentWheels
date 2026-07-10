import React from 'react';

const SearchBar = ({ onSearch, initialValue = '' }) => {
  const [searchTerm, setSearchTerm] = React.useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
      <input
        type="text"
        className="form-input"
        placeholder="Search by brand, model, or city..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ flexGrow: 1 }}
      />
      <button type="submit" className="btn btn-primary">Search</button>
    </form>
  );
};

export default SearchBar;
