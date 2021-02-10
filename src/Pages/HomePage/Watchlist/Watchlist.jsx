import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { useAuth } from '../../../contexts/AuthContext';
import { db } from '../../../firebase';
import sprite from '../../../svg/sprite.svg';
import {
  mediaCarouselMqParams,
  removeArrowOnDeviceType,
} from '../../../components/CarouselParams/CarouselParams';
import Section from '../../../components/Section/Section';
import CarouselMediaItem from '../../../components/CarouselMediaItem/CarouselMediaItem';

export default function Watchlist() {
  const { currentUser } = useAuth();
  const [watchList, setWatchList] = useState([]);
  const history = useHistory();

  function snapshotFunction(snapshot, data) {
    snapshot.docs.forEach((doc) => {
      const media = doc.data();
      media.dbId = doc.id;
      data.push(media);
    });
    setWatchList(data);
  }

  useEffect(() => {
    let isMounted = true;
    function fetchMoviesCollection() {
      if (currentUser) {
        const data = [];
        db.collection(currentUser.uid)
          .get()
          .then(
            (snapshot) => {
              if (isMounted) snapshotFunction(snapshot, data);
            },
            (err) => alert(err.message),
          );
      }
    }
    fetchMoviesCollection();
    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  return (
    <Section pathname="/watchlist" sectionText="From Your Watchlist" isLink>
      {currentUser ? (
        (watchList.length > 0 && (
          <Carousel
            arrows
            showDots={false}
            swipeable
            containerClass="carousel-container"
            itemClass="carousel-item"
            responsive={mediaCarouselMqParams}
            partialVisible
            removeArrowOnDeviceType={removeArrowOnDeviceType}
          >
            {watchList
              .sort((a, b) => new Date(b.additionDate) - new Date(a.additionDate))
              .map((data) => (
                <CarouselMediaItem key={data} data={data} />
              ))}
          </Carousel>
        )) || (
          <div className="watchlist--empty">
            <svg className="watchlist__icon" viewBox="0 0 24 24">
              <use href={`${sprite}#icon-watchlist`} />
            </svg>
            <div className="watchlist__paragraph--container">
              <p className="watchlist__paragraph">Your watchlist is empty</p>
              <p className="watchlist__paragraph watchlist__paragraph-secondary">
                Add shows and movies to keep track of what you want to watch
              </p>
            </div>
            <div className="media__button--container">
              <button
                className="media__button-cast button--bold"
                type="button"
                onClick={() => {
                  history.push('/browse');
                }}
              >
                Browse TMDB
              </button>
            </div>
          </div>
        )
      ) : (
        <div className="watchlist--empty">
          <svg className="watchlist__icon" viewBox="0 0 24 24">
            <use href={`${sprite}#icon-watchlist`} />
          </svg>
          <div className="watchlist__paragraph--container">
            <p className="watchlist__paragraph">Sign in to access your watchlist</p>
            <p className="watchlist__paragraph watchlist__paragraph-secondary">
              Save shows and movies to keep track of what you want to watch
            </p>
          </div>
          <div className="media__button--container">
            <button
              className="media__button-cast button--bold"
              type="button"
              onClick={() => {
                history.push('/login');
              }}
            >
              Sign in to TMDB
            </button>
          </div>
        </div>
      )}
    </Section>
  );
}
