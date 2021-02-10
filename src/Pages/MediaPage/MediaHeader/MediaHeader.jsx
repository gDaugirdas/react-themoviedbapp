import React from 'react';
import PropTypes from 'prop-types';
import sprite from '../../../svg/sprite.svg';
import './MediaHeader.scss';

export default function MediaHeader({ media }) {
  return (
    <div className="media__header">
      <div className="media__primary--container">
        <h2 className="media__title">
          {media.title ? media.title : media.name || 'Title not found'}
        </h2>
        {media.genres.length !== 0 && (
          <p className="media__genres">{media.genres.map((genre) => genre.name).join(', ')}</p>
        )}
        <div className="media__misc--container">
          {media.release_date || media.first_air_date ? (
            <p className="media__misc-date">
              {media.release_date ? media.release_date.slice(0, 4) : null}
              {media.first_air_date
                ? (media.status === 'Returning Series' && media.first_air_date.slice(0, 4)) ||
                  `${media.first_air_date.slice(0, 4)} - ${media.last_air_date.slice(0, 4)}`
                : null}
              <span className="media__misc-separator">|</span>
            </p>
          ) : null}
          <p className="media__misc-type">
            {media.name ? 'Series' : 'Movie'}
            <span className="media__misc-separator">|</span>
          </p>
          <p className="media__misc-status">{media.status}</p>
        </div>
        {media.runtime ? (
          <p className="media__runtime">{`Runtime: ${media.runtime} min.`}</p>
        ) : null}
      </div>
      <div className="media__rating--container">
        <p className="media__rating">
          {media.vote_average ? (
            <>
              {media.vote_average}
              <span className="media__rating-reference">/10</span>
            </>
          ) : (
            'Not rated'
          )}
        </p>
        {media.vote_average !== 0 && (
          <svg
            className="media__rating-icon"
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
  );
}

MediaHeader.propTypes = {
  media: PropTypes.instanceOf(Object).isRequired,
};
