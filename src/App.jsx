import { useEffect, useState } from "react";

const KEY = "e35089e1";

const App = () => {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("avatar");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovie = async () => {
      if (!query) {
        setMovies([]); // reset movies if query is empty
        return;
      }

      try {
        setIsLoading(true);
        setError("");

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

    fetchMovie();
  }, [query]);

  return (
    <div className="py-8">
      <HeadTxt />
      <Search query={query} setQuery={setQuery} />
      {isLoading && <Loader />}
      {error && <p className="text-red-500 text-center mt-6">{error}</p>}
      {!isLoading && !error && <Movies movies={movies} />}
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
    <div className="flex justify-center">
      <p className="text-7xl font-bold text-slate-100">
        Find your favourite movie.
      </p>
    </div>
  );
}

function Search({ query, setQuery }) {
  return (
    <div className="flex justify-center my-6 mt-12">
      <input
        className="w-[50%] h-12 px-3 rounded"
        type="search"
        placeholder="Search movie..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
}

function Movies({ movies }) {
  return (
    <div className="px-16 my-12">
      <div className="grid grid-cols-4 gap-6">
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

export default App;
