import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { IMAGE_POSTER_SIZE, IMAGE_URL } from '../../config';
import { setGenres } from '../../utils';
import './SearchResultsPage.scss';
import sprite from '../../svg/sprite.svg';

export default class SearchResults extends Component {
  constructor() {
    super();
    this.state = {
      fetcedResults: [],
      inputValue: null,
    };
  }

  componentDidMount() {
    const { location } = this.props;
    const inputValue = JSON.parse(sessionStorage.getItem('inputValue'));
    if (sessionStorage.getItem(`fetcedResults`)) {
      const fetcedResults = JSON.parse(sessionStorage.getItem(`fetcedResults`));
      this.setState({
        fetcedResults,
        inputValue,
      });
    } else {
      this.setState({
        fetcedResults: location.fetcedResults,
        inputValue,
      });
    }
  }

  render() {
    const { fetcedResults, inputValue } = this.state;
    const { movieGenres, seriesGenres } = this.props;

    if (!fetcedResults || !fetcedResults.length) {
      return (
        <>
          <Helmet>
            <title>TMDB Search results</title>
            <meta name="description" content="Search results not found page" />
          </Helmet>
          <main className="main main--center">
            <div className="container">
              <div className="searchresults__heading--container searchresults__null">
                <h2 className="searchresults__heading searchresults__heading-null">
                  Invalid search querry or no results found
                </h2>
                <svg
                  className="searchresults__null-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 20"
                >
                  <use href={`${sprite}#icon-no-searchresults`} />
                </svg>
              </div>
            </div>
          </main>
        </>
      );
    }
    return (
      <>
        <Helmet>
          <title>TMDB Search results</title>
          <meta name="description" content="Search results page" />
        </Helmet>
        <main className="main main--top">
          <div className="container">
            <div className="searchresults__heading--container">
              <h2 className="searchresults__heading">
                Search results for
                <strong className="searchresults__heading-inputValue">{` "${inputValue}"`}</strong>
              </h2>
            </div>
            <ul className="searchresults__list">
              {fetcedResults.map((data) => {
                const knownFor = [];
                if (data.media_type === 'person') {
                  data.known_for.map((el) => el.title && knownFor.push(el.title));
                }
                return (
                  <li className="searchresults__list-item" key={data.id}>
                    <Link
                      to={{
                        pathname: `/${data.media_type === 'person' ? 'person' : 'media'}/${
                          data.id
                        }`,
                        mediaType: data.media_type,
                      }}
                      className="searchresults__list-link"
                    >
                      <div className="searchresults__image--container">
                        <img
                          className="image"
                          src={
                            (data.poster_path &&
                              `${IMAGE_URL}${IMAGE_POSTER_SIZE}${data.poster_path}`) ||
                            (data.profile_path &&
                              `${IMAGE_URL}${IMAGE_POSTER_SIZE}${data.profile_path}`) ||
                            './images/no_image.jpg'
                          }
                          alt={(data.poster_path && 'media') || (data.profile_path && 'person')}
                        />
                      </div>
                      <div className="searchresults__text--container">
                        <div className="searchresults__title--container">
                          <p className="searchresults__title">
                            {data.title || data.name || 'Unkown'}
                          </p>
                          {data.known_for_department && (
                            <p className="searchresults__department">
                              {`${data.known_for_department} Department`}
                            </p>
                          )}
                          {data.media_type !== 'person' && (
                            <p className="searchresults__date">
                              {(data.release_date && data.release_date.slice(0, 4)) ||
                                (data.first_air_date && data.first_air_date.slice(0, 4)) ||
                                'Unkown release date'}
                            </p>
                          )}
                        </div>
                        {knownFor && (
                          <p className="searchresults__knownfor">{knownFor.join(', ')}</p>
                        )}
                        {data.genre_ids && (
                          <p className="searchresults__genre">
                            {setGenres(data.genre_ids, movieGenres, seriesGenres)}
                          </p>
                        )}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </main>
      </>
    );
  }
}

SearchResults.propTypes = {
  location: PropTypes.instanceOf(Object),
  movieGenres: PropTypes.instanceOf(Object).isRequired,
  seriesGenres: PropTypes.instanceOf(Object).isRequired,
};

SearchResults.defaultProps = {
  location: {},
};
