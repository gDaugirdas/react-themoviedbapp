import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import sprite from '../../svg/sprite.svg';
import WatchlistButtonLoader from './WatchlistButtonLoader/WatchlistButtonLoader';
import './WatchlistButton.scss';

export default function WatchlistButton({ media }) {
  const { currentUser } = useAuth();
  const history = useHistory('');
  const [loading, setLoading] = useState(false);
  const [addedToWatchlist, setAddedToWatchlist] = useState();

  function handleClick() {
    // If user is not logged in redirect to /login
    if (!currentUser) {
      history.push('/login');
    } else {
      setLoading(true);
      db.collection(currentUser.uid)
        // Identify if user already has this media item stored in watchlist
        .where('mediaId', '==', media.id || media.mediaId)
        .get()
        // If it's already stored, remove media item from users watchlist
        .then((snapshot) => {
          if (snapshot.docs.length) {
            snapshot.forEach((doc) => {
              doc.ref.delete();
              setAddedToWatchlist(false);
              setLoading(false);
            });
          } else {
            // Else add media item to users watchlist
            db.collection(currentUser.uid).add({
              mediaId: media.id || media.mediaId || 'null',
              mediaTitle: media.title || media.name || media.mediaTitle || 'No title found',
              mediaPoster: media.poster_path || media.mediaPoster || '/images/no_image.jpg',
              mediaRating: media.vote_average || media.mediaRating || 'Not rated',
              mediaType: media.title ? 'movie' : media.mediaType || 'tv',
              mediaDate:
                media.release_date ||
                media.first_air_date ||
                media.mediaDate ||
                'Unkown release date',
              mediaGenres: media.genre_ids || media.mediaGenres || media.genres.map((el) => el.id),
              mediaOverview: media.overview || media.mediaOverview,
              additionDate: Date.now(),
            });
            setAddedToWatchlist(true);
            setLoading(false);
          }
        })
        .catch((err) => {
          alert(err.message);
        });
    }
  }

  useEffect(() => {
    let isMounted = true;
    // On component mount checks
    function checkMediaCondition() {
      // Check if there's a user logged in
      if (currentUser)
        db.collection(currentUser.uid)
          // Check whether user has media item in watchlist
          .where('mediaId', '==', media.id || media.mediaId)
          .get()
          .then((snapshot) => {
            // If he does, and component is mounted
            if (snapshot.docs.length && isMounted) {
              setAddedToWatchlist(true);
              // else
            } else if (isMounted) setAddedToWatchlist(false);
          })
          .catch((err) => alert(err));
    }
    checkMediaCondition();
    if (!currentUser && isMounted) setAddedToWatchlist(false);
    return () => {
      isMounted = false;
    };
  }, [currentUser, media]);

  return (
    <>
      <button
        className={`button__watchlist ${!addedToWatchlist ? 'button__watchlist--color-ash' : ''}`}
        onClick={handleClick}
        type="button"
      >
        <div className="button__watchlist-text--container">
          {loading ? (
            <WatchlistButtonLoader />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="button__watchlist-icon"
              viewBox="0 0 24 24"
              fill="currentColor"
              role="presentation"
            >
              <use
                href={`${sprite}${
                  addedToWatchlist ? '#icon-checkmark-watchlist' : '#icon-cross-watchlist'
                }`}
              />
            </svg>
          )}
          <p className="button__watchlist-text">Watchlist</p>
        </div>
      </button>
    </>
  );
}

WatchlistButton.propTypes = {
  media: PropTypes.instanceOf(Object),
};

WatchlistButton.defaultProps = {
  media: {},
};
