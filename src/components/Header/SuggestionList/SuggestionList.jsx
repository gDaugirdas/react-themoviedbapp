import React from 'react';
import PropTypes from 'prop-types';
import Suggestion from '../Suggestion/Suggestion';
import { IMAGE_POSTER_SIZE, IMAGE_URL } from '../../../config';
import { setGenres } from '../../../utils';
import './SuggestionList.scss';
import SearchbarLoader from '../SearchbarLoader/SearchbarLoader';

export default function SuggestionList({
  suggestionListClass,
  fetcedResults,
  loading,
  movieGenres,
  seriesGenres,
  handleLinkClick,
}) {
  return (
    <div className={`suggestion__list--container ${suggestionListClass}`}>
      <ul className="suggestion__list">
        {loading ? (
          <SearchbarLoader />
        ) : (
          // Showing first 6 results in suggestions
          fetcedResults?.slice(0, 6).map((data) => {
            const knownFor = [];
            if (data.media_type === 'person') {
              data.known_for.map((el) => el.title && knownFor.push(el.title));
            }
            return (
              <Suggestion
                handleLinkClick={handleLinkClick}
                key={data.id}
                title={data.title || data.name}
                image={
                  (data.poster_path && `${IMAGE_URL}${IMAGE_POSTER_SIZE}${data.poster_path}`) ||
                  (data.profile_path && `${IMAGE_URL}${IMAGE_POSTER_SIZE}${data.profile_path}`) ||
                  '/images/no_image.jpg'
                }
                department={data.known_for_department}
                knownFor={knownFor.join(', ')}
                date={
                  data.release_date?.slice(0, 4) ||
                  data.first_air_date?.slice(0, 4) ||
                  (data.media_type !== 'person' && 'Unknown release date')
                }
                genres={data.genre_ids && setGenres(data.genre_ids, movieGenres, seriesGenres)}
                id={data.id}
                overview={data.overview}
                mediaType={data.media_type}
              />
            );
          })
        )}
        {/* If no search results are found display message in the suggestion field */}
        {!loading && fetcedResults && fetcedResults.length === 0 && (
          <div className="suggestion__list-notfound">No search results found</div>
        )}
      </ul>
    </div>
  );
}

SuggestionList.propTypes = {
  suggestionListClass: PropTypes.string.isRequired,
  fetcedResults: PropTypes.instanceOf(Array),
  loading: PropTypes.bool.isRequired,
  movieGenres: PropTypes.instanceOf(Array).isRequired,
  seriesGenres: PropTypes.instanceOf(Array).isRequired,
  handleLinkClick: PropTypes.func.isRequired,
};

SuggestionList.defaultProps = {
  fetcedResults: [],
};
