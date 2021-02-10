/* eslint-disable react/no-array-index-key */
/* eslint-disable no-param-reassign */
/* eslint-disable no-prototype-builtins */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import moment from 'moment';
import './PersonCredits.scss';

export default function PersonCredits({ credits }) {
  // Sorting person credits by release date
  const sortedCredits = credits?.cast
    .concat(credits.crew)
    .map((credit) => {
      if (credit.hasOwnProperty('release_date') || credit.hasOwnProperty('first_air_date')) {
        credit.release = credit.release_date || credit.first_air_date;
        delete credit.release_date;
        delete credit.first_air_date;
      }
      return credit;
    })
    .filter((credit) => credit.vote_count !== 0)
    .sort((a, b) => moment(b.release).format('YYYY') - moment(a.release).format('YYYY'));

  return (
    <div className="person__credits--container">
      <div className="person__credits-heading--container">
        <h2 className="person__credits-heading">Filmography</h2>
      </div>
      <ul className="person__credits-list">
        {sortedCredits.map((data, i) => (
          <li className="person__credits-item" key={i}>
            <div className="person__credits-name--container">
              <Link
                className="person__credits-link"
                to={{ pathname: `/media/${data.id}`, mediaType: data.media_type }}
              >
                <p className="person__credits-name">{data.title || data.name}</p>
              </Link>
              <p className="person__credits-role">
                {(data.character && `as ${data.character}`) ||
                  (data.department && `${data.department} Department`) ||
                  'Crew'}
              </p>
            </div>
            <p className="person__credits-date">
              {data.release ? moment(data.release).format('YYYY') : 'No date'}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

PersonCredits.propTypes = {
  credits: PropTypes.instanceOf(Object).isRequired,
};
