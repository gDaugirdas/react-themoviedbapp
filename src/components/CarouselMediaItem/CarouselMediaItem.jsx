import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { IMAGE_POSTER_SIZE, IMAGE_URL } from '../../config';
import sprite from '../../svg/sprite.svg';

export default function CarouselMediaItem({ data }) {
  return (
    <div className="carousel__media-item">
      <Link
        className="carousel__media-link"
        to={{
          pathname: `/media/${data.mediaId || data.id}`,
          mediaType: data.title ? 'movie' : data.mediaType || 'tv',
        }}
      >
        <div className="image--container image__hover--shadow image__hover--scale">
          <img
            className="image"
            src={
              (data.poster_path && `${IMAGE_URL}${IMAGE_POSTER_SIZE}${data.poster_path}`) ||
              (data.mediaPoster &&
                data.mediaPoster !== '/images/no_image.jpg' &&
                `${IMAGE_URL}${IMAGE_POSTER_SIZE}${data.mediaPoster}`) ||
              '/images/no_image.jpg'
            }
            alt="media"
          />
          <div className="image__shadow image__shadow--special" />
        </div>
        <div className="carousel__media-title--container">
          <div className="carousel__media-rating--container">
            <svg
              className="carousel__media-rating-icon"
              width="24"
              height="24"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <use href={`${sprite}#icon-star`} />
            </svg>
            <p className="carousel__media-rating">{data.vote_average || data.mediaRating}</p>
          </div>
          <p className="carousel__media-title">{data.title || data.name || data.mediaTitle}</p>
        </div>
      </Link>
    </div>
  );
}

CarouselMediaItem.propTypes = {
  data: PropTypes.instanceOf(Object),
};

CarouselMediaItem.defaultProps = {
  data: {},
};
