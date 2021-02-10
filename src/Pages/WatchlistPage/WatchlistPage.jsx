import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import Loader from '../../components/Loader/Loader';
import sprite from '../../svg/sprite.svg';
import MediaList from '../../components/MediaList/MediaList';

export default function WatchlistPage({ movieGenres, seriesGenres }) {
  const { currentUser } = useAuth();
  const [watchList, setWatchList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showButton, setShowButton] = useState(false);

  // Setting user's watchlsit to state
  function snapshotFunction(snapshot, data) {
    snapshot.docs.forEach((doc) => {
      const media = doc.data();
      media.dbId = doc.id;
      data.push(media);
    });
    setWatchList(data);
    setLoading(false);
  }

  // Handling scroll
  const handleScroll = () => {
    const notTop = Math.ceil(window.scrollY) > 1000;

    if (notTop) setShowButton(true);
    else setShowButton(false);
  };

  useEffect(() => {
    // Fetching users watchlist
    function fetchMoviesCollection() {
      if (currentUser) {
        const data = [];
        db.collection(currentUser.uid)
          .get()
          .then(
            (snapshot) => {
              snapshotFunction(snapshot, data);
            },
            (err) => alert(err.message),
          );
      }
    }

    fetchMoviesCollection();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentUser]);
  return (
    <>
      <Helmet>
        <title>TMDB Watchlist</title>
        <meta name="description" content="Watchlist page" />
      </Helmet>
      <main className={`main ${watchList.length > 0 ? 'main--top' : 'main--center'}`}>
        {loading ? (
          <Loader />
        ) : (
          <div className="container">
            {watchList.length > 0 ? (
              <div className="content">
                <MediaList
                  data={watchList}
                  movieGenres={movieGenres}
                  seriesGenres={seriesGenres}
                  showButton={showButton}
                  handleScroll={handleScroll}
                  browsePage={false}
                />
              </div>
            ) : (
              <div className="watchlist--empty">
                <svg className="watchlist__icon" viewBox="0 0 24 24">
                  <use href={`${sprite}#icon-watchlist`} />
                </svg>
                <div className="watchlist__paragraph--container">
                  <p className="watchlist__paragraph">Your watchlist is empty</p>
                  <p className="watchlist__paragraph watchlist__paragraph-secondary">
                    Add shows and movies to keep track of what you want to watch
                  </p>
                </div>
                <Link
                  to="/browse"
                  className="link link__text--color-yellow link__text--fontsize-big link__text--bold"
                >
                  Browse Popular Shows and Movies
                </Link>
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}

WatchlistPage.propTypes = {
  movieGenres: PropTypes.instanceOf(Object).isRequired,
  seriesGenres: PropTypes.instanceOf(Object).isRequired,
};
