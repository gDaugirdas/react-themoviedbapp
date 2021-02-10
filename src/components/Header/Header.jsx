import React from 'react';
import PropTypes from 'prop-types';
import Logo from './Logo/Logo';
import Searchbar from './Searchbar/Searchbar';
import Navbar from './Navbar/Navbar';
import './Header.scss';

export default function Header({ movieGenres, seriesGenres }) {
  return (
    <header className="header">
      <div className="header__inner container">
        <Logo />
        <Searchbar movieGenres={movieGenres} seriesGenres={seriesGenres} />
        <Navbar />
      </div>
    </header>
  );
}

Header.propTypes = {
  movieGenres: PropTypes.instanceOf(Object).isRequired,
  seriesGenres: PropTypes.instanceOf(Object).isRequired,
};
