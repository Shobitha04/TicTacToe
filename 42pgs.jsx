import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles.css";

function RicknMorty() {
  const [characters, setCharacters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 42; // Based on the API, there are 42 pages with 20 characters per page

  // Fetch characters based on the current page
  useEffect(() => {
    axios
      .get(`https://rickandmortyapi.com/api/character?page=${currentPage}`)
      .then((response) => setCharacters(response.data.results))
      .catch((error) => console.error("Error fetching data:", error));
  }, [currentPage]);


  
  const handlePrevClick = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div className="app">
      <h1>
        <strong>Rick and Morty</strong>
      </h1>
      <div className="grid">
        {characters.map((character) => (
          <div className="character-card" key={character.id}>
            <img src={character.image} alt={character.name} />
            <div className="character-info">
              <h2>{character.name}</h2>
              <p className={character.status.toLowerCase()}>
                {character.status} - {character.species}
              </p>
              <p>
                <strong>Last known location:</strong> {character.location.name}
              </p>
              <p>
                <strong>First seen in:</strong> {character.origin.name}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button
          onClick={handlePrevClick}
          disabled={currentPage === 1}
          className="prev-btn"
        >
          Previous
        </button>
        <button
          onClick={handleNextClick}
          disabled={currentPage === totalPages}
          className="next-btn"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default RicknMorty;
