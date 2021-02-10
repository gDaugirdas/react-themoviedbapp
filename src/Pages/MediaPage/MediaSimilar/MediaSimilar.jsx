/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { setGenres } from '../../../utils';
import sprite from '../../../svg/sprite.svg';
import WatchlistButton from '../../../components/WatchlistButton/WatchlistButton';
import { IMAGE_POSTER_SIZE, IMAGE_URL } from '../../../config';
import './MediaSimilar.scss';

export default class MediaSimilar extends Component {
  constructor(props) {
    super(props);
    const { data } = this.props;
    this.state = {
      selectedItem: data[0],
      mobileMq: window.matchMedia('(max-width: 767px)').matches,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    const handler = (event) => this.setState({ mobileMq: event.matches });
    window.matchMedia('(max-width: 767px)').addListener(handler);
    // Start interval on component mount
    this.handleStartSimilarMediaInterval();
  }

  componentWillUnmount() {
    // Cleanup
    clearInterval(this.interval);
    clearTimeout(this.hoverTimer);
  }

  handleClick(selectedItem) {
    this.setState({
      selectedItem,
    });
  }

  handleMouseEnter(selectedItem) {
    this.hoverTimer = window.setTimeout(() => {
      this.setState({
        selectedItem,
      });
    }, 700);
  }

  handleStartSimilarMediaInterval() {
    const { data } = this.props;
    let index = 0;
    this.interval = setInterval(() => {
      this.setState({
        selectedItem: data[(index += 1) % data.length],
      });
    }, 4000);
  }

  handleClearSimilarMediaInterval() {
    clearInterval(this.interval);
  }

  handleMouseOut() {
    clearTimeout(this.hoverTimer);
  }

  render() {
    const { selectedItem, mobileMq } = this.state;
    const { movieGenres, seriesGenres, mediaType, data } = this.props;

    return (
      data?.length !== 0 && (
        <>
          <h3 className="media__similar-heading">{`Similar ${mediaType}`}</h3>
          <div className="media__similar--container">
            <ul className="media__similar-list">
              {data.map((el) => (
                <li
                  className="media__similar-list-item"
                  key={el.id}
                  onClick={() => {
                    this.handleClick(el);
                  }}
                  onMouseEnter={() => {
                    this.handleMouseEnter(el);
                    this.handleClearSimilarMediaInterval();
                  }}
                  onMouseOut={() => {
                    this.handleMouseOut();
                  }}
                >
                  <div className="image--container image__hover--shadow">
                    <img
                      className="image image--base-border-radius"
                      src={
                        el.poster_path
                          ? `${IMAGE_URL}${IMAGE_POSTER_SIZE}${el.poster_path}`
                          : '/images/no_image.jpg'
                      }
                      alt="media"
                    />

                    <div className={selectedItem === el ? 'image__selected' : null} />
                  </div>
                </li>
              ))}
            </ul>
            {selectedItem ? (
              <div className="media__selected--container">
                <div className="media__selected-main--container">
                  <Link
                    className="media__selected-link"
                    to={{
                      pathname: `/media/${selectedItem.id}`,
                      mediaType: selectedItem.first_air_date ? 'tv' : 'movie',
                    }}
                  >
                    <div
                      className="image--container"
                      onMouseEnter={() => {
                        this.handleClearSimilarMediaInterval();
                      }}
                    >
                      <img
                        className="image image--base-border-radius"
                        src={
                          selectedItem.poster_path
                            ? `${IMAGE_URL}${IMAGE_POSTER_SIZE}${selectedItem.poster_path}`
                            : '/images/no_image.jpg'
                        }
                        alt="media"
                      />
                    </div>
                  </Link>
                  <div className="media__selected-button--container media__selected-button--desktop">
                    <WatchlistButton media={selectedItem} />
                  </div>
                </div>
                <div className="media__selected-text--container">
                  <p
                    className="media__selected-title"
                    onMouseEnter={() => {
                      this.handleClearSimilarMediaInterval();
                    }}
                  >
                    <Link
                      className="media__selected-text-link"
                      to={{
                        pathname: `/media/${selectedItem.id}`,
                        mediaType: selectedItem.first_air_date ? 'tv' : 'movie',
                      }}
                    >
                      {selectedItem.title || selectedItem.name || 'Unknown title'}
                    </Link>
                    <span className="media__selected-date">
                      {`(${
                        (selectedItem.release_date && selectedItem.release_date.slice(0, 4)) ||
                        (selectedItem.first_air_date && selectedItem.first_air_date.slice(0, 4)) ||
                        'Unkown release date'
                      })`}
                    </span>
                  </p>
                  {selectedItem.genre_ids && (
                    <p className="media__selected-genre">
                      {setGenres(selectedItem.genre_ids, movieGenres, seriesGenres)}
                    </p>
                  )}

                  <div className="media__selected-rating--container">
                    <p className="media__selected-rating">
                      {selectedItem.vote_average ? (
                        <>
                          {selectedItem.vote_average}
                          <span className="media__selected-rating-reference">/10</span>
                        </>
                      ) : (
                        'Not rated'
                      )}
                    </p>
                    {selectedItem.vote_average !== 0 && (
                      <svg
                        className="media__selected-rating-icon"
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
                  <p className="media__selected-overview">
                    {mobileMq && `${selectedItem.overview.substring(0, 120)}...`}
                    {!mobileMq &&
                      selectedItem.overview.length > 500 &&
                      `${selectedItem.overview.substring(0, 500)}...`}
                    {!mobileMq && selectedItem.overview.length < 500 && selectedItem.overview}
                  </p>
                  <div className="media__selected-button--container media__selected-button--mobile">
                    <WatchlistButton media={selectedItem} />
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </>
      )
    );
  }
}

MediaSimilar.propTypes = {
  data: PropTypes.instanceOf(Object),
  movieGenres: PropTypes.instanceOf(Object).isRequired,
  seriesGenres: PropTypes.instanceOf(Object).isRequired,
  mediaType: PropTypes.string.isRequired,
};

MediaSimilar.defaultProps = {
  data: {},
};
