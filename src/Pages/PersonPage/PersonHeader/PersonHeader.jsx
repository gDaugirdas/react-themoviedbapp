import React from 'react';
import PropTypes from 'prop-types';
import './PersonHeader.scss';

export default function PersonHeader({ person }) {
  return (
    <div className="person__name--container">
      <h2 className="person__name">{person.name ? person.name : 'No name found'}</h2>
      <p className="person__department">
        {person.known_for_department
          ? `${person.known_for_department} Department`
          : 'No department found'}
      </p>
    </div>
  );
}

PersonHeader.propTypes = {
  person: PropTypes.instanceOf(Object).isRequired,
};
