import React from 'react';
import PropTypes from 'prop-types';
import './Suggestion.scss';
import { Link } from 'react-router-dom';

export default function Suggestion({
  image,
  title,
  department,
  date,
  knownFor,
  genres,
  id,
  mediaType,
  handleLinkClick,
}) {
  return (
    <>
      <Link
        to={{
          pathname: `/${mediaType === 'person' ? 'person' : 'media'}/${id}`,
          mediaType,
        }}
        onClick={handleLinkClick}
        className="suggestion__item"
      >
        <div className="suggestion__image--container">
          <img className="suggestion__image" src={image} alt="movie poster" />
        </div>
        <div className="suggestion__text--container">
          <div className="suggestion__title--container">
            <p className="suggestion__title">{title}</p>
          </div>
          <div className="suggestion__misc--container">
            {knownFor && <p>{knownFor}</p>}
            {department && <p className="suggestions__knownfor">{`${department} Department`}</p>}
            <p className="suggestion__date">{date}</p>
            {genres && <p className="suggestion__genre">{genres}</p>}
          </div>
        </div>
      </Link>
    </>
  );
}

Suggestion.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  department: PropTypes.string,
  date: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
  genres: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  id: PropTypes.number.isRequired,
  knownFor: PropTypes.string.isRequired,
  mediaType: PropTypes.string.isRequired,
  handleLinkClick: PropTypes.func.isRequired,
};

Suggestion.defaultProps = {
  department: null,
  genres: null,
};
