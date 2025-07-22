import { useEffect,useState } from "react"
import Search from "./components/Search"
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";


const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

function App() {
 const [searchTerm, setSearchTerm] = useState('');
 const [errorMessage, setErrorMessage] = useState('')
 const [movielist, setMovielist] = useState([])
 const [isloading, setIsLoading] = useState(false);
 const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

 const fetchMovies = async (query = '') => {

      setIsLoading(true);
      setErrorMessage('');
      
      try{
        const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&sort_by=popularity.desc`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
        
        const response = await fetch(endpoint, API_OPTIONS);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch movies`);
        }

        const data = await response.json();

        if (data.response === 'False') {
          setErrorMessage(data.Error || 'Failed to fetch movies');
          setMovielist([]);
          return;
        }

        setMovielist(data.results || []);

      } catch (error) {
        console.log(`Error fetching movies: ${error}`);
        setErrorMessage('Failed to fetch movies. Please try again later.');
      } finally {
        setIsLoading(false);
      }
 }

 useEffect(() => {
    fetchMovies(searchTerm);
    setErrorMessage('');
 }, [debouncedSearchTerm])

  return (
    <main>
      <div className='pattern' />

      <div className="wrapper">
          <header>
            <img src="/hero.png" alt="" />
            <h1>
              Find <span className="text-gradient">Movies</span> You'll Enjoy Without The Hassle
            </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
          </header>
          <section className="all-movies">
            <h2 className="mt-[40px]">All Movies</h2>

            {isloading ? (
              <p className="text-white"><Spinner/></p>
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : (
              <ul>
                {movielist.map((movie) => (
                  <MovieCard key={movie.id} movie={movie}/>
                ))}
              </ul>
            )}
          </section>
      </div>
    </main>
  )
}

export default App
