import React from 'react';
import PropTypes from 'prop-types';
import { IMAGE_POSTER_SIZE, IMAGE_URL } from '../../../config';
import './MediaHero.scss';
import WatchlistButton from '../../../components/WatchlistButton/WatchlistButton';
import sprite from '../../../svg/sprite.svg';

export default function MediaMain({ media, mediaVideo }) {
  return (
    <>
      <div className="media__hero--container">
        <div className="media__image--container">
          <img
            className="media__image"
            src={
              media.poster_path
                ? `${IMAGE_URL}${IMAGE_POSTER_SIZE}${media.poster_path}`
                : '/images/no_image.jpg'
            }
            alt="media"
          />

          <div className="media__hero-rating--container">
            <p className="media__hero-rating">
              {media.vote_average ? media.vote_average : 'Not rated'}
            </p>
            {media.vote_average !== 0 && (
              <svg
                className="media__hero-rating-icon"
                width="24"
                height="24"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <use href={`${sprite}#icon-star`} />
              </svg>
            )}
          </div>
        </div>
        <div className="media__video--container">
          {mediaVideo && Object.keys(mediaVideo).length !== 0 ? (
            <iframe
              className="media__video"
              title="Trailer"
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${mediaVideo.key}`}
              frameBorder="0"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            />
          ) : (
            <div className="media__video--notfound">Trailer not found</div>
          )}
        </div>
      </div>
      <div className="media__overview--container">
        <div className="media__button-watchlist--container">
          <WatchlistButton media={media} />
        </div>
        {media.overview ? <p className="media__overview">{media.overview}</p> : null}
      </div>
    </>
  );
}

MediaMain.propTypes = {
  media: PropTypes.instanceOf(Object).isRequired,
  mediaVideo: PropTypes.instanceOf(Object),
};

MediaMain.defaultProps = {
  mediaVideo: {},
};
