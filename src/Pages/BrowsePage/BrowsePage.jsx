import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { API_URL, API_KEY } from '../../config';
import Loader from '../../components/Loader/Loader';
import './BrowsePage.scss';
import TMDBLogo from '../../components/TMDBLogo/TMDBLogo';
import MediaList from '../../components/MediaList/MediaList';

export default class Browse extends Component {
  constructor() {
    super();
    this.state = {
      fetchedData: [],
      value: 'trending movies',
      valueGenre: null,
      currentPage: 1,
      showButton: false,
      loading: false,
      loadingMore: false,
      browseByShowGenres: false,
      browseByMovieGenres: false,
      genreId: null,
      stopFetch: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeGenre = this.handleChangeGenre.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    const { value } = this.state;
    const { location } = this.props;
    // Adding scroll event listenter
    window.addEventListener('scroll', this.handleScroll);
    this.setState({
      loading: true,
    });
    // if page is linked to from link with value, set that value to the state and fetch value's data
    if (location.value) {
      this.setState({
        value: location.value,
      });
      this.fetchData(location.value);
      // if we have already visited this page, return the last state from session storage rather than fetching data and storing state
    } else if (sessionStorage.getItem(`browseState`)) {
      const state = JSON.parse(sessionStorage.getItem(`browseState`));
      this.setState({ ...state, loading: false });
      // else fetch data from default value
    } else {
      this.fetchData(value);
    }
    // reseting state after component mount
    this.setState({
      showButton: false,
      stopFetch: false,
    });
  }

  componentWillUnmount() {
    // Removing scroll event listenter
    window.removeEventListener('scroll', this.handleScroll);
  }

  // Handling UI changes depending on user's scroll behaviour
  handleScroll() {
    const bottom =
      Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight;
    if (bottom) this.loadMore();

    const notTop = Math.ceil(window.scrollY) > 1000;
    // If user scrolls more than 1000px from the top showing scroll-to-top-button
    if (notTop)
      this.setState({
        showButton: true,
      });
    else
      this.setState({
        showButton: false,
      });
  }

  // Handling media selection logic
  handleChange(event) {
    const { movieGenres, seriesGenres } = this.props;
    if (event.target.value === 'movies by genre') {
      this.setState({
        browseByMovieGenres: true,
        valueGenre: movieGenres[0].name,
        genreId: movieGenres[0].id,
        browseByShowGenres: false,
      });
    } else if (event.target.value === 'shows by genre') {
      this.setState({
        browseByShowGenres: true,
        valueGenre: seriesGenres[0].name,
        genreId: seriesGenres[0].id,
        browseByMovieGenres: false,
      });
    }
    // cleaning up after browse by genres
    else
      this.setState({
        browseByShowGenres: false,
        browseByMovieGenres: false,
        stopFetch: false,
      });

    this.setState(
      {
        value: event.target.value,
        currentPage: 1,
        fetchedData: [],
        loading: true,
        stopFetch: false,
      },
      () => {
        const { value } = this.state;
        this.fetchData(value);
      },
    );
  }

  // Handling media genre selection logic
  handleChangeGenre(event) {
    this.setState(
      {
        valueGenre: event.target.value,
        genreId: event.target.value,
        currentPage: 1,
        fetchedData: [],
        loading: true,
        stopFetch: false,
      },
      () => {
        const { value } = this.state;
        this.fetchData(value);
      },
    );
  }

  // Handling 'infinite' scroll behaviour
  loadMore() {
    const { value, stopFetch } = this.state;
    if (!stopFetch) {
      this.setState(
        (prevState) => ({
          currentPage: prevState.currentPage + 1,
          loadingMore: true,
        }),
        () => {
          this.fetchData(value);
        },
      );
    }
  }

  // Handling data fetching
  fetchData(value) {
    const { currentPage, fetchedData, genreId } = this.state;
    // Selection value-url array
    const selectedData = [
      {
        value: 'trending movies',
        url: `${API_URL}trending/movie/week?api_key=${API_KEY}&page=${currentPage}`,
      },
      {
        value: 'trending shows',
        url: `${API_URL}trending/tv/week?api_key=${API_KEY}&page=${currentPage}`,
      },
      {
        value: 'top movies',
        url: `${API_URL}discover/movie?api_key=${API_KEY}&language=en-US&sort_by=vote_average.desc&vote_count.gte=3000&page=${currentPage}`,
      },
      {
        value: 'top shows',
        url: `${API_URL}discover/tv?api_key=${API_KEY}&language=en-US&sort_by=vote_average.desc&vote_count.gte=1500&page=${currentPage}`,
      },
      {
        value: 'movies by genre',
        url: `${API_URL}discover/movie?api_key=${API_KEY}&language=en-US&sort_by=release_date.desc&include_adult=false&include_video=false&page=${currentPage}&vote_count.gte=200&with_genres=${genreId}`,
      },
      {
        value: 'shows by genre',
        url: `${API_URL}discover/tv?api_key=${API_KEY}&language=en-US&sort_by=release_date.desc&include_adult=false&include_video=false&page=${currentPage}&vote_count.gte=200&with_genres=${genreId}`,
      },
    ];

    // Filtering selection value URL
    const url = selectedData.filter((item) => item.value === value);

    // Fetching from selected URL
    fetch(url[0].url)
      .then((response) => response.json())
      .then((response) => {
        if (!response.results.length) this.setState({ stopFetch: true });
        return response;
      })
      .then((data) =>
        this.setState(
          {
            fetchedData: [...fetchedData, ...data.results],
            loading: false,
            loadingMore: false,
          },
          () => {
            sessionStorage.setItem(`browseState`, JSON.stringify(this.state));
          },
        ),
      )
      .catch((error) => {
        alert('Error:', error);
      });
  }

  render() {
    const {
      value,
      valueGenre,
      fetchedData,
      showButton,
      loading,
      loadingMore,
      browseByMovieGenres,
      browseByShowGenres,
    } = this.state;
    const { movieGenres, seriesGenres } = this.props;

    return (
      <>
        <Helmet>
          <title>TMDB Browse</title>
          <meta name="description" content="Browse page" />
        </Helmet>
        <main className="main main--top">
          {loading ? (
            <Loader />
          ) : (
            <div className="container">
              <div className="browse__header--container">
                <h2 className="browse__header-heading">Browse popular shows and movies on</h2>
                <TMDBLogo />
                <p className="browse__header-paragraph">
                  Pick a category from the dropdown list below
                </p>
                <select
                  className="browse__header-select"
                  value={value}
                  onChange={this.handleChange}
                >
                  <option value="trending movies">Trending Movies</option>
                  <option value="trending shows">Trending Shows</option>
                  <option value="top movies">Top Movies</option>
                  <option value="top shows">Top Shows</option>
                  <option value="movies by genre">Movies by genre</option>
                  <option value="shows by genre">Shows by genre</option>
                </select>
                {/* If browse by genres is selected */}
                {(browseByMovieGenres || browseByShowGenres) && (
                  <>
                    <p className="browse__header-paragraph">Select genre</p>
                    <select
                      className="browse__header-select"
                      value={valueGenre || ''}
                      onChange={this.handleChangeGenre}
                    >
                      {/* Mapping genre arrays to select options */}
                      {browseByMovieGenres
                        ? movieGenres.map((data) => (
                            <option key={data.id} value={data.id}>
                              {data.name}
                            </option>
                          ))
                        : seriesGenres.map((data) => (
                            <option key={data.id} value={data.id}>
                              {data.name}
                            </option>
                          ))}
                    </select>
                  </>
                )}
              </div>
              <div className="content">
                <MediaList
                  data={fetchedData}
                  movieGenres={movieGenres}
                  seriesGenres={seriesGenres}
                  loadingMore={loadingMore}
                  handleScroll={this.handleScroll}
                  showButton={showButton}
                  browsePage
                />
              </div>
            </div>
          )}
        </main>
      </>
    );
  }
}

Browse.propTypes = {
  location: PropTypes.instanceOf(Object),
  value: PropTypes.string,
  movieGenres: PropTypes.instanceOf(Object).isRequired,
  seriesGenres: PropTypes.instanceOf(Object).isRequired,
};

Browse.defaultProps = {
  location: {},
  value: 'trending movies',
};
