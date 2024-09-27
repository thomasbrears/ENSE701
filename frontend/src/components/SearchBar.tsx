import React, { useState } from "react";
import styles from "../styles/SearchBar.module.scss";

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim() !== '') {
      onSearch(searchTerm.trim());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value.trim());
  }

  return (
    <div className={styles.searchBarContainer}>
      <form onSubmit={handleSubmit} className={styles.inputWrapper}>
        <input
          className={styles.inputField}
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Type to search..."
          required
        />
        {/* <button className={styles.searchButton} type="submit">Search</button> */}
      </form>
    </div>
  );
};

export default SearchBar;
