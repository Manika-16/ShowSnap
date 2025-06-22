import axios from "axios"
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";

// Configure axios with better timeout and retry settings
const tmdbApi = axios.create({
    timeout: 10000, // 10 second timeout
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

// Retry function for API calls
const retryApiCall = async (apiCall, maxRetries = 3) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await apiCall();
        } catch (error) {
            console.log(`API call attempt ${attempt} failed:`, error.message);
            
            if (attempt === maxRetries) {
                throw error;
            }
            
            // Wait before retrying (exponential backoff)
            const delay = Math.pow(2, attempt) * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
};

// API to get now playing movies from TMDB API
export const getNowPlayingMovies = async (req, res)=>{
    try {
        const apiCall = () => tmdbApi.get('https://api.themoviedb.org/3/movie/now_playing', {
            headers: {Authorization : `Bearer ${process.env.TMDB_API_KEY}`}
        });

        const { data } = await retryApiCall(apiCall);
        const movies = data.results;
        res.json({success: true, movies: movies})
    } catch (error) {
        console.error('Error fetching now playing movies:', error.message);
        res.status(500).json({
            success: false, 
            message: 'Failed to fetch movies from TMDB API',
            error: error.message
        })
    }
}

// API to add a new show to the database
export const addShow = async (req, res) =>{
    try {
        const {movieId, showsInput, showPrice} = req.body

        let movie = await Movie.findById(movieId)

        if(!movie) {
            console.log(`Movie ${movieId} not found in database, fetching from TMDB...`);
            
            // Fetch movie details and credits from TMDB API with retry logic
            const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
                retryApiCall(() => tmdbApi.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
                    headers: {Authorization : `Bearer ${process.env.TMDB_API_KEY}`}
                })),
                retryApiCall(() => tmdbApi.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
                    headers: {Authorization : `Bearer ${process.env.TMDB_API_KEY}`}
                }))
            ]);

            const movieApiData = movieDetailsResponse.data;
            const movieCreditsData = movieCreditsResponse.data;

             const movieDetails = {
                _id: movieId,
                title: movieApiData.title,
                overview: movieApiData.overview,
                poster_path: movieApiData.poster_path,
                backdrop_path: movieApiData.backdrop_path,
                genres: movieApiData.genres,
                casts: movieCreditsData.cast,
                release_date: movieApiData.release_date,
                original_language: movieApiData.original_language,
                tagline: movieApiData.tagline || "",
                vote_average: movieApiData.vote_average,
                runtime: movieApiData.runtime,
             }

             // Add movie to the database
             movie = await Movie.create(movieDetails);
             console.log(`Movie "${movie.title}" added to database`);
        }

        const showsToCreate = [];
        showsInput.forEach(show => {
            const showDate = show.date;
            show.time.forEach((time)=>{
                const dateTimeString = `${showDate}T${time}`;
                showsToCreate.push({
                    movie: movieId,
                    showDateTime: new Date(dateTimeString),
                    showPrice,
                    occupiedSeats: {}
                })
            })
        });

        if(showsToCreate.length > 0){
            await Show.insertMany(showsToCreate);
            console.log(`${showsToCreate.length} shows created for movie "${movie.title}"`);
        }

        res.json({success: true, message: 'Show Added successfully.'})
    } catch (error) {
        console.error('Error adding show:', error.message);
        res.status(500).json({
            success: false, 
            message: 'Failed to add show',
            error: error.message
        })
    }
}

// API to get all shows from the database
export const getShows = async (req, res) =>{
    try {
        const shows = await Show.find({showDateTime: {$gte: new Date()}}).populate('movie').sort({ showDateTime: 1 });

        // filter unique shows
        const uniqueShows = new Set(shows.map(show => show.movie))

        res.json({success: true, shows: Array.from(uniqueShows)})
    } catch (error) {
        console.error('Error fetching shows:', error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch shows',
            error: error.message 
        });
    }
}

// API to get a single show from the database
export const getShow = async (req, res) =>{
    try {
        const {movieId} = req.params;
        // get all upcoming shows for the movie
        const shows = await Show.find({movie: movieId, showDateTime: { $gte: new Date() }})

        const movie = await Movie.findById(movieId);
        const dateTime = {};

        shows.forEach((show) => {
            const date = show.showDateTime.toISOString().split("T")[0];
            if(!dateTime[date]){
                dateTime[date] = []
            }
            dateTime[date].push({ time: show.showDateTime, showId: show._id })
        })

        res.json({success: true, movie, dateTime})
    } catch (error) {
        console.error('Error fetching show details:', error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch show details',
            error: error.message 
        });
    }
}