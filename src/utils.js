/* eslint-disable no-console */
import axios from 'axios';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Component } from 'react';

const resources = {};

const makeRequestCreator = () => {
  let cancel;

  return async (query) => {
    if (cancel) {
      // Cancel the previous request before making a new request
      cancel.cancel();
    }
    // Create a new CancelToken
    cancel = axios.CancelToken.source();
    try {
      if (resources[query]) {
        // Return result if it exists
        return resources[query];
      }
      const res = await axios(query, { cancelToken: cancel.token });

      // Store first 10 results
      const result = res.data.results;

      return result;
    } catch (error) {
      if (axios.isCancel(error)) {
        // Handle if request was cancelled
        console.log('Request canceled', error.message);
      } else {
        // Handle usual errors
        console.error('Something went wrong: ', error.message);
      }
    }
    return null;
  };
};

export const search = makeRequestCreator();

// Mapping genre ids to it's correlating names
export const setGenres = (item, genreObj1, genreObj2) => {
  const result = item.map((id) => {
    if (genreObj1.find((o) => o.id === id)) {
      return genreObj1.find((o) => o.id === id).name;
    }
    return genreObj2.find((o) => o.id === id).name;
  });
  return result.join(', ');
};

// Scroll to top on page render
class ScrollToTop extends Component {
  componentDidUpdate(prevProps) {
    const { location } = this.props;
    if (location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    const { children } = this.props;
    return children;
  }
}

ScrollToTop.propTypes = {
  location: PropTypes.instanceOf(Object),
  children: PropTypes.instanceOf(Object).isRequired,
};

ScrollToTop.defaultProps = {
  location: {},
};

export default withRouter(ScrollToTop);

// Setting viewed media or person item to local storage to be rendered in RecentlyViewed component
export const setViewedItems = (item, location) => {
  let existingEntries = JSON.parse(localStorage.getItem(location));
  // Checking if we have viewed items, if not, setting variable to an empty array
  if (existingEntries == null) existingEntries = [];
  let found = false;
  // Checking for duplicates
  for (let i = 0; i < existingEntries.length; i += 1) {
    if (existingEntries[i].id === item.id) {
      found = true;
      break;
    }
  }
  // If no duplicates found, pushing item to an array and setting it to local storage
  if (!found) {
    existingEntries.push(item);
    localStorage.setItem(location, JSON.stringify(existingEntries));
  }
  // If array length exceeds 20 items, removing last item from the array
  if (existingEntries.length > 20) {
    existingEntries.shift();
    localStorage.setItem(location, JSON.stringify(existingEntries));
  }
};
