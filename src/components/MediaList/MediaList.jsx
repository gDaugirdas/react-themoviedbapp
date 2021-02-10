/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { setGenres } from '../../utils';
import sprite from '../../svg/sprite.svg';
import { IMAGE_POSTER_SIZE, IMAGE_URL } from '../../config';
import WatchlistButton from '../WatchlistButton/WatchlistButton';
import Loader from '../Loader/Loader';
import './MediaList.scss';

export default function MediaList({
  data,
  movieGenres,
  seriesGenres,
  loadingMore,
  browsePage,
  handleScroll,
  showButton,
}) {
  function handleClick() {
    window.scrollTo(0, 0);
  }

  return (
    <div onScroll={handleScroll} className="media__list--container">
      <ul className="media__list">
        {data &&
          (!browsePage
            ? data.sort((a, b) => new Date(b.additionDate) - new Date(a.additionDate))
            : data
          ).map((el, id) => (
            <li key={id} className="media__list-item">
              <div className="media__list-primary--container">
                <Link
                  to={{
                    pathname: `/media/${el.mediaId || el.id}`,
                    mediaType: el.title ? 'movie' : el.mediaType || 'tv',
                  }}
                  className="media__list-link"
                >
                  <div className="media__list-image--container">
                    <img
                      className="media__list-image"
                      src={
                        (el.poster_path && `${IMAGE_URL}${IMAGE_POSTER_SIZE}${el.poster_path}`) ||
                        (el.mediaPoster &&
                          el.mediaPoster !== '/images/no_image.jpg' &&
                          `${IMAGE_URL}${IMAGE_POSTER_SIZE}${el.mediaPoster}`) ||
                        '/images/no_image.jpg'
                      }
                      alt="media"
                    />
                  </div>
                </Link>
                <div className="media__list-button--container">
                  <WatchlistButton media={el} />
                </div>
              </div>
              <div className="media__list-secondary--container">
                <Link
                  to={{
                    pathname: `/media/${el.mediaId || el.id}`,
                    mediaType: el.title ? 'movie' : el.mediaType || 'tv',
                  }}
                  className="media__list-link"
                >
                  <h3 className="media__list-title">
                    {el.title ? el.title : el.name || el.mediaTitle || 'No title found'}
                  </h3>
                </Link>
                <div className="media__list-misc--container">
                  <p className="media__list-date">
                    {browsePage
                      ? (el.release_date && el.release_date.slice(0, 4)) ||
                        (el.first_air_date && el.first_air_date.slice(0, 4)) ||
                        'Unknown release date'
                      : (el.mediaDate &&
                          el.mediaDate !== 'Unkown release date' &&
                          el.mediaDate.slice(0, 4)) ||
                        el.mediaDate}
                  </p>
                  <span className="media__list-separator">|</span>

                  <p className="media__list-genre">
                    {browsePage
                      ? el.genre_ids && setGenres(el.genre_ids, seriesGenres, movieGenres)
                      : el.mediaGenres && setGenres(el.mediaGenres, seriesGenres, movieGenres)}
                  </p>
                </div>
                <div className="media__list-rating--container">
                  <svg
                    className="media__list-rating-icon"
                    width="24"
                    height="24"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <use href={`${sprite}#icon-star`} />
                  </svg>
                  <p className="media__list-rating">
                    {el.vote_average || el.mediaRating || 'Not rated'}
                  </p>
                </div>
                <p className="media__list-overview">
                  {el.overview || el.mediaOverview || 'No media overview found'}
                </p>
              </div>
            </li>
          ))}
      </ul>
      {browsePage && loadingMore && <Loader />}
      <div className="media__list-button-scroll--container">
        <button
          type="button"
          className={`media__list-button-scroll ${
            showButton ? 'media__list-button-scroll--visible' : 'media__list-button-scroll--hidden'
          }`}
          onClick={handleClick}
        >
          <svg
            width="24"
            height="24"
            xmlns="http://www.w3.org/2000/svg"
            className="media__list-button-scroll-icon"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <use href={`${sprite}#icon-section-arrow`} />
          </svg>
        </button>
      </div>
    </div>
  );
}

MediaList.propTypes = {
  data: PropTypes.instanceOf(Object).isRequired,
  movieGenres: PropTypes.instanceOf(Object).isRequired,
  seriesGenres: PropTypes.instanceOf(Object).isRequired,
  loadingMore: PropTypes.bool,
  browsePage: PropTypes.bool.isRequired,
  handleScroll: PropTypes.func,
  showButton: PropTypes.bool,
};

MediaList.defaultProps = {
  loadingMore: false,
  handleScroll: () => {},
  showButton: false,
};
