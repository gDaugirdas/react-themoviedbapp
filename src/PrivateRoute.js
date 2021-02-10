/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

export default function PrivateRoute({ component: Component, movieGenres, seriesGenres, ...rest }) {
  const { currentUser } = useAuth();

  return (
    <Route
      {...rest}
      // If user is logged in render private route, else redirect to login
      render={(props) =>
        currentUser ? (
          <Component {...props} movieGenres={movieGenres} seriesGenres={seriesGenres} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
}

PrivateRoute.propTypes = {
  component: PropTypes.func,
  movieGenres: PropTypes.instanceOf(Object),
  seriesGenres: PropTypes.instanceOf(Object),
};

PrivateRoute.defaultProps = {
  component: () => {},
  movieGenres: null,
  seriesGenres: null,
};
