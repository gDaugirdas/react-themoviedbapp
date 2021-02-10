import React, { Component } from 'react';
import { Helmet } from 'react-helmet-async';
import { API_URL, API_KEY } from '../../config';
import Loader from '../../components/Loader/Loader';
import Watchlist from './Watchlist/Watchlist';
import HeroCarousel from './HeroCarousel/HeroCarousel';
import RecentlyViewed from '../../components/RecentlyViewed/RecentlyViewed';
import TopMovieList from './TopMovieList/TopMovieList';
import TopShowList from './TopShowList/TopShowList';
import TrendingPeopleList from './TrendingPeopleList/TrendingPeopleList';
import TrendingMovieList from './TrendingMovieList/TrendingMovieList';
import TrendingShowList from './TrendingShowList/TredingShowList';

export default class Home extends Component {
  constructor() {
    super();
    this.state = {
      topMovies: null,
      topShows: null,
      trendingMovies: null,
      trendingShows: null,
      trendingPeople: null,
      discoveredMovies: null,
      upcomingMovies: null,
      loading: false,
    };
  }

  componentDidMount() {
    // If page was visited
    if (sessionStorage.getItem(`homeState`)) {
      const state = JSON.parse(sessionStorage.getItem(`homeState`));
      this.setState({ ...state, loading: false });
    } else {
      // else fetch data
      this.setState({ loading: true });
      const topMoviesUrl = `${API_URL}discover/movie?api_key=${API_KEY}&language=en-US&sort_by=vote_average.desc&vote_count.gte=3000`;
      const topShowsUrl = `${API_URL}discover/tv?api_key=${API_KEY}&language=en-US&sort_by=vote_average.desc&vote_count.gte=2000`;
      const trendingMoviesUrl = `${API_URL}trending/movie/week?api_key=${API_KEY}`;
      const trendingShowsUrl = `${API_URL}trending/tv/week?api_key=${API_KEY}`;
      const trendingPeopleUrl = `${API_URL}trending/person/week?api_key=${API_KEY}`;
      const discoverMoviesUrl = `${API_URL}discover/movie?api_key=${API_KEY}&language=en-US&page=1`;
      const urls = [
        topMoviesUrl,
        topShowsUrl,
        trendingMoviesUrl,
        trendingShowsUrl,
        trendingPeopleUrl,
        discoverMoviesUrl,
      ];
      this.fetchUrls(urls);
    }
  }

  async fetchUrls(urls) {
    try {
      // Returning data when all url's are fetched
      const data = await Promise.all(
        urls.map((url) => fetch(url).then((response) => response.json())),
      );
      return this.setState(
        {
          topMovies: data[0].results,
          topShows: data[1].results,
          trendingMovies: data[2].results,
          trendingShows: data[3].results,
          trendingPeople: data[4].results,
          discoveredMovies: data[5].results,
        },
        () => {
          this.setState({
            loading: false,
          });
          sessionStorage.setItem(`homeState`, JSON.stringify(this.state));
        },
      );
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  render() {
    const {
      topMovies,
      topShows,
      trendingMovies,
      trendingShows,
      trendingPeople,
      discoveredMovies,
      loading,
    } = this.state;
    return (
      <>
        <Helmet>
          <title>TMDB Homepage</title>
          <meta name="description" content="Homepage" />
        </Helmet>
        <main className="main main--top">
          {loading ? (
            <Loader />
          ) : (
            <>
              <HeroCarousel list={discoveredMovies} />
              <div className="container">
                <Watchlist />
                <TrendingMovieList list={trendingMovies} />
                <TrendingShowList list={trendingShows} />
                <TrendingPeopleList list={trendingPeople} />
                <TopMovieList list={topMovies} />
                <TopShowList list={topShows} />
                <RecentlyViewed />
              </div>
            </>
          )}
        </main>
      </>
    );
  }
}
