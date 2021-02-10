import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Section.scss';
import sprite from '../../svg/sprite.svg';

export default function Section({ pathname, value, sectionText, children, isLink }) {
  return (
    <div className="section--container">
      <h2 className={`section__heading ${!isLink && 'section__heading--nonlink'}`}>
        {isLink ? (
          <>
            <Link className="section__link" to={{ pathname, value }}>
              {sectionText}
            </Link>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="section__icon-arrow"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <use href={`${sprite}#icon-section-arrow`} />
            </svg>
          </>
        ) : (
          sectionText
        )}
      </h2>
      {children}
    </div>
  );
}

Section.propTypes = {
  pathname: PropTypes.string,
  value: PropTypes.string,
  sectionText: PropTypes.string.isRequired,
  children: PropTypes.instanceOf(Object),
  isLink: PropTypes.bool.isRequired,
};

Section.defaultProps = {
  children: {},
  pathname: null,
  value: null,
};
