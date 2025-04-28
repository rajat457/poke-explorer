import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [filteredPokemons, setFilteredPokemons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPokemons = async () => {
    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=150');
      const data = await response.json();

      const detailedData = await Promise.all(
        data.results.map(async (pokemon) => {
          const res = await fetch(pokemon.url);
          return await res.json();
        })
      );

      setPokemons(detailedData);
      setFilteredPokemons(detailedData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching Pokémon:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemons();
  }, []);

  useEffect(() => {
    filterPokemons();
  }, [searchTerm, selectedType]);

  const filterPokemons = () => {
    let filtered = pokemons;

    if (searchTerm) {
      filtered = filtered.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedType) {
      filtered = filtered.filter((pokemon) =>
        pokemon.types.some((type) => type.type.name === selectedType)
      );
    }

    setFilteredPokemons(filtered);
  };

  const uniqueTypes = [
    ...new Set(pokemons.flatMap((pokemon) => pokemon.types.map((t) => t.type.name))),
  ];

  return (
    <div className="App">
      <header className="App-header">
        <h1>Poke Explorer</h1>
      </header>

      <div className="controls">
        <input
          type="text"
          placeholder="Search Pokémon by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select className='dropdown' value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
          <option value="">All Types</option>
          {uniqueTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading Pokémon...</p>
      ) : filteredPokemons.length === 0 ? (
        <p>No Pokémon found.</p>
      ) : (
        <div className="pokemon-list">
          {filteredPokemons.map((pokemon) => (
            <div key={pokemon.id} className="pokemon-card">
              <h2>{pokemon.name}</h2>
              <img src={pokemon.sprites.front_default} alt={pokemon.name} />
              <p>ID: {pokemon.id}</p>
              <div>
                {pokemon.types.map((typeSlot) => (
                  <span key={typeSlot.type.name} className="type">
                    {typeSlot.type.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
