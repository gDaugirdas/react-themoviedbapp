const API_URL = 'https://api.themoviedb.org/3/';
const API_KEY = process.env.REACT_APP_API_KEY;
const IMAGE_URL = 'https://image.tmdb.org/t/p/';
// Image sizes for background: w300, w780, w1280, original
const IMAGE_BACKGROUND_SIZE = 'w1280';
// Image sizes for poster: w92, w154, w185, w342, w500, w780, original
const IMAGE_POSTER_SIZE = 'w500';

export { API_URL, API_KEY, IMAGE_URL, IMAGE_BACKGROUND_SIZE, IMAGE_POSTER_SIZE };
