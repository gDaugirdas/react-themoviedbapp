import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './MediaCredits.scss';

export default function MediaCredits({
  directors,
  actors,
  writers,
  media,
  isToggled,
  handleToggle,
  mediaLink,
}) {
  return (
    <div className="media__credits">
      <div className="media__credits--container">
        {directors?.length > 0 && (
          <p className="media__credits-item">
            Directors:
            {directors?.map((director) => (
              <Fragment key={director.id}>
                <Link className="media__credits-link" to={{ pathname: `/person/${director.id}` }}>
                  {director.name}
                </Link>
                <span className="media__credits-comma">, </span>
              </Fragment>
            ))}
          </p>
        )}
        {media.created_by?.length > 0 && (
          <p className="media__credits-item">
            Creators:
            {media.created_by?.map((creator) => (
              <Fragment key={creator.id}>
                <Link className="media__credits-link" to={{ pathname: `/person/${creator.id}` }}>
                  {creator.name}
                </Link>
                <span className="media__credits-comma">, </span>
              </Fragment>
            ))}
          </p>
        )}
        {writers?.length > 0 && (
          <p className="media__credits-item">
            Writers:
            {writers?.map((writer) => (
              <Fragment key={writer.id}>
                <Link className="media__credits-link" to={{ pathname: `/person/${writer.id}` }}>
                  {writer.name}
                </Link>
                <span className="media__credits-comma">, </span>
              </Fragment>
            ))}
          </p>
        )}
        {actors?.length > 0 && (
          <p className="media__credits-item">
            Starring:
            {actors.slice(0, 3).map((actor) => (
              <Fragment key={actor.id}>
                <Link className="media__credits-link" to={{ pathname: `/person/${actor.id}` }}>
                  {actor.name}
                </Link>
                <span className="media__credits-comma">, </span>
              </Fragment>
            ))}
          </p>
        )}
      </div>
      {actors?.length > 0 && (
        <div className="media__button--container">
          {mediaLink && (
            <a
              href={mediaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="button--bold media__link-watchonline"
            >
              Watch Online
            </a>
          )}
          <button className="media__button-cast button--bold" type="button" onClick={handleToggle}>
            {!isToggled ? `Show  full cast` : `Hide full cast`}
          </button>
        </div>
      )}
    </div>
  );
}
MediaCredits.propTypes = {
  media: PropTypes.instanceOf(Object).isRequired,
  directors: PropTypes.instanceOf(Object),
  writers: PropTypes.instanceOf(Object),
  actors: PropTypes.instanceOf(Object),
  handleToggle: PropTypes.func.isRequired,
  mediaLink: PropTypes.string,
  isToggled: PropTypes.bool.isRequired,
};

MediaCredits.defaultProps = {
  directors: {},
  writers: {},
  actors: {},
  mediaLink: '',
};
