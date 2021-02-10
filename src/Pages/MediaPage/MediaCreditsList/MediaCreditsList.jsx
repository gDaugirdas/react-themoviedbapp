/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './MediaCreditsList.scss';
import { IMAGE_POSTER_SIZE, IMAGE_URL } from '../../../config';

export default function MediaCreditsList({ mediaCreditListClass, actors }) {
  return (
    <div className="media__credits-list--container">
      <ul className={`media__credits-list ${mediaCreditListClass}`}>
        {actors?.length !== 0 && (
          <>
            {actors?.map((data, id) => (
              <li key={id} className="media__credits-list-item">
                <div className="media__credits-image--container">
                  <img
                    className="image"
                    src={
                      data.profile_path
                        ? `${IMAGE_URL}${IMAGE_POSTER_SIZE}${data.profile_path}`
                        : '/images/no_image.jpg'
                    }
                    alt="person"
                  />
                </div>
                <Link
                  to={{ pathname: `/person/${data.id}` }}
                  className="link link__text link__text--color-blue media__credits-list-link"
                >
                  {data.name}
                </Link>
                {data.character && (
                  <p className="media__credits-list-as">{`as ${data.character}`}</p>
                )}
              </li>
            ))}
          </>
        )}
      </ul>
    </div>
  );
}
MediaCreditsList.propTypes = {
  actors: PropTypes.instanceOf(Object).isRequired,
  mediaCreditListClass: PropTypes.string.isRequired,
};
