/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState, useCallback } from 'react';
import moment from 'moment';
import ImageViewer from 'react-simple-image-viewer';
import disableScroll from 'disable-scroll';
import PropTypes from 'prop-types';
import { IMAGE_POSTER_SIZE, IMAGE_URL } from '../../../config';
import './PersonHero.scss';

export default function PersonMain({ person }) {
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const birthDate = moment(person.birthday).format('LL');
  const deathDate = person.deathday && moment(person.deathday).format('LL');
  const currentDate = moment(Date.now()).format('LL');

  const openImageViewer = useCallback(() => {
    if (person.profile_path) setIsViewerOpen(true);
  }, [person.profile_path]);

  const closeImageViewer = () => {
    setIsViewerOpen(false);
  };
  return (
    <>
      <div className="person__hero--container">
        <div className="person__image--container">
          <img
            className={`person__image ${!person.profile_path && 'image--cursor-default'}`}
            src={
              person.profile_path
                ? `${IMAGE_URL}${IMAGE_POSTER_SIZE}${person.profile_path}`
                : '/images/no_image.jpg'
            }
            alt="person"
            onClick={() => {
              openImageViewer();
              disableScroll.on();
            }}
          />
        </div>
        <div className="person__biography--container">
          <p className="person__biography">
            {person.biography ? person.biography : 'No biography found'}
          </p>

          <div className="person__details--container">
            {person.birthday && !person.deathday && (
              <p className="person__details">
                Age:
                <span className="person__details-date">
                  {` ${birthDate && moment(currentDate).diff(birthDate, 'years')}`}
                </span>
              </p>
            )}
            {person.birthday && (
              <p className="person__details">
                Born:
                <span className="person__details-date">
                  {` ${birthDate}, ${person.place_of_birth}`}
                </span>
              </p>
            )}
            {person.deathday && (
              <p className="person__details">
                Died:
                <span className="person__details-date">
                  {` ${deathDate}, aged ${moment(deathDate).diff(birthDate, 'years')}`}
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
      {isViewerOpen && (
        <ImageViewer
          src={[person.profile_path].map((el) => `${IMAGE_URL}${IMAGE_POSTER_SIZE}${el}`)}
          onClose={() => {
            closeImageViewer();
            disableScroll.off();
          }}
          backgroundStyle={{
            backgroundColor: 'rgba(0,0,0,0.9)',
            zIndex: 1001,
          }}
        />
      )}
    </>
  );
}

PersonMain.propTypes = {
  person: PropTypes.instanceOf(Object).isRequired,
};
