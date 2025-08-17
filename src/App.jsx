import { useState } from "react";

const KEY = "e35089e1";

const App = () => {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("avatar");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false); // ✅ new state

  const fetchMovie = async () => {
    if (!query) {
      setMovies([]);
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setHasSearched(true); // ✅ user clicked search

      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`
      );
      const data = await res.json();

      if (data.Response === "True") {
        setMovies(data.Search);
      } else {
        setMovies([]);
        setError(data.Error || "No movies found.");
      }
    } catch (err) {
      setError("Failed to fetch movies.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-8">
      <HeadTxt />
      <Search query={query} setQuery={setQuery} fetchMovie={fetchMovie} />
      {isLoading && <Loader />}
      {error && <p className="text-red-500 text-center mt-6">{error}</p>}

      {/* ✅ Show placeholder only if user has not searched yet */}
      {!hasSearched && !isLoading && !error && <Placeholder />}

      {/* ✅ Show movies only after search */}
      {hasSearched && !isLoading && !error && <Movies movies={movies} />}
    </div>
  );
};

function Loader() {
  return (
    <div className="flex justify-center items-center">
      <p className="text-slate-100 text-2xl mt-10">Loading...</p>
    </div>
  );
}

function HeadTxt() {
  return (
    <div className="flex justify-center text-center px-4">
      <p className="md:text-7xl text-3xl font-bold text-slate-100 tracking-wide movie-font">
        Find your favourite movie.
      </p>
    </div>
  );
}

function Search({ query, setQuery, fetchMovie }) {
  return (
    <div className="flex justify-center my-6 mt-12 gap-2">
      <input
        className="md:w-[50%] w-[70%] h-12 px-3 rounded"
        type="search"
        placeholder="Search movie..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        onClick={fetchMovie}
        className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
      >
        Search
      </button>
    </div>
  );
}

function Movies({ movies }) {
  return (
    <div className="md:px-16 px-5 my-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {movies?.map((movie) => (
          <Movie key={movie.imdbID} movie={movie} />
        ))}
      </div>
    </div>
  );
}

function Movie({ movie }) {
  return (
    <div className="bg-slate-100 rounded-md">
      <div className="h-[50vh]">
        <img
          className="w-full h-full object-cover object-top rounded-t-md"
          src={
            movie.Poster !== "N/A"
              ? movie.Poster
              : "https://via.placeholder.com/300x450?text=No+Image"
          }
          alt={movie.Title}
        />
      </div>
      <div className="p-3">
        <p>
          Movie Name:{" "}
          <span className="text-slate-900 font-medium">{movie.Title}</span>
        </p>
        <p>
          Release Year:{" "}
          <span className="text-slate-900 font-medium">{movie.Year}</span>
        </p>
      </div>
    </div>
  );
}

function Placeholder() {
  return (
    <div className="flex flex-col justify-center items-center mt-20">
      <img
        src="https://cdn-icons-png.flaticon.com/512/4072/4072115.png"
        alt="Movie placeholder"
        className="w-40 mb-6 opacity-80"
      />
      <p className="text-slate-300 text-2xl">
        Search for your favourite movies 🎬
      </p>
    </div>
  );
}

export default App;
