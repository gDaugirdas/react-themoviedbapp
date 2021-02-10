/* eslint-disable react/jsx-props-no-spreading */
import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import SignupPage from './Pages/SignupPage/SignupPage';
import DashboardPage from './Pages/DashboardPage/DashboardPage';
import LoginPage from './Pages/LoginPage/LoginPage';
import PrivateRoute from './PrivateRoute';
import ForgotPasswordPage from './Pages/ForgotPasswordPage/ForgotPasswordPage';
import Header from './components/Header/Header';
import { API_URL, API_KEY } from './config';
import SearchResultsPage from './Pages/SearchResultsPage/SearchResultsPage';
import PersonPage from './Pages/PersonPage/PersonPage';
import ScrollToTop from './utils';
import WatchlistPage from './Pages/WatchlistPage/WatchlistPage';
import Footer from './components/Footer/Footer';
import HomePage from './Pages/HomePage/HomePage';
import MediaPage from './Pages/MediaPage/MediaPage';
import BrowsePage from './Pages/BrowsePage/BrowsePage';

class App extends Component {
  constructor() {
    super();
    this.state = {
      movieGenres: [],
      seriesGenres: [],
    };
  }

  componentDidMount() {
    let movieGenres = sessionStorage.getItem('movieGenres');
    let seriesGenres = sessionStorage.getItem('seriesGenres');

    // If we already have data in session storage parse it and set it to state
    if (movieGenres && seriesGenres) {
      movieGenres = JSON.parse(movieGenres);
      seriesGenres = JSON.parse(seriesGenres);
      this.setState({ movieGenres, seriesGenres });
    }
    // Else fetch data and put it into session storage
    else
      fetch(`${API_URL}genre/movie/list?api_key=${API_KEY}&language=en-US`)
        .then((response) => response.json())
        .then((json) => this.setState({ movieGenres: json.genres }));
    fetch(`${API_URL}genre/tv/list?api_key=${API_KEY}&language=en-US`)
      .then((response) => response.json())
      .then((json) => this.setState({ seriesGenres: json.genres }));
  }

  render() {
    const { movieGenres, seriesGenres } = this.state;
    return (
      <HelmetProvider>
        <Helmet>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>TMDB React</title>
          <meta name="description" content="App for browsing TMDB Database" />
          <meta name="keywords" content="TMDB, React, Movies, Series" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        </Helmet>
        <Router>
          <AuthProvider>
            <ScrollToTop>
              <Header movieGenres={movieGenres} seriesGenres={seriesGenres} />
              <Switch>
                <Route exact path="/" component={HomePage} />
                <PrivateRoute path="/dashboard" component={DashboardPage} />
                <Route path="/signup" component={SignupPage} />
                <Route path="/login" component={LoginPage} />
                <Route path="/forgot-password" component={ForgotPasswordPage} />
                <PrivateRoute
                  path="/watchlist"
                  component={WatchlistPage}
                  movieGenres={movieGenres}
                  seriesGenres={seriesGenres}
                />
                <Route
                  path="/browse"
                  render={(props) => (
                    <BrowsePage
                      {...props}
                      movieGenres={movieGenres}
                      seriesGenres={seriesGenres}
                      key={Math.random()}
                    />
                  )}
                />
                <Route
                  path="/search-results"
                  render={(props) => (
                    <SearchResultsPage
                      {...props}
                      movieGenres={movieGenres}
                      seriesGenres={seriesGenres}
                      key={Math.random()}
                    />
                  )}
                />
                <Route
                  path="/media/:mediaId"
                  render={(props) => (
                    <MediaPage
                      {...props}
                      movieGenres={movieGenres}
                      seriesGenres={seriesGenres}
                      key={Math.random()}
                    />
                  )}
                />
                <Route
                  path="/person/:personId"
                  render={(props) => (
                    <PersonPage
                      {...props}
                      movieGenres={movieGenres}
                      seriesGenres={seriesGenres}
                      key={Math.random()}
                    />
                  )}
                />
                <Route component={HomePage} />
              </Switch>
              <Footer />
            </ScrollToTop>
          </AuthProvider>
        </Router>
      </HelmetProvider>
    );
  }
}

export default App;
