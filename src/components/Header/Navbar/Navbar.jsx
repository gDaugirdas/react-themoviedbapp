/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './Navbar.scss';
import { useAuth } from '../../../contexts/AuthContext';
import sprite from '../../../svg/sprite.svg';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const [error, setError] = useState();
  const history = useHistory();
  const [toggle, setToggle] = useState(false);

  async function handleLogout() {
    try {
      await logout();
    } catch {
      setError('Failed to logout');
      alert(error);
    }
    history.push({
      pathname: '/',
    });
  }

  return (
    <nav className="nav" onMouseLeave={() => setToggle(false)}>
      <Link className="nav__link nav__link-watchlist" to="/watchlist">
        <svg className="nav__icon nav__icon-watchlist" viewBox="0 0 24 24">
          <use href={`${sprite}#icon-watchlist`} />
        </svg>
        Watchlist
      </Link>
      {currentUser ? (
        <div className="nav__link nav__link--user" onClick={() => setToggle(!toggle)}>
          <svg className="nav__icon nav__icon-user" viewBox="0 0 478.02 478.02">
            <use href={`${sprite}#icon-user`} />
          </svg>
          <p className="nav__text">{currentUser.email.split('@')[0]}</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 42 42"
            className={
              toggle === true
                ? 'nav__icon nav__icon-arrow nav__icon-arrow--rotate'
                : 'nav__icon nav__icon-arrow'
            }
          >
            <use href={`${sprite}#icon-arrow`} />
          </svg>
          <div className="nav__menu" aria-expanded={toggle === true ? 'true' : 'false'}>
            <ul className="nav__menu-list">
              <li className="nav__menu-item--user">
                <p className="nav__menu-link nav__menu-link--user">
                  {currentUser.email.split('@')[0]}
                </p>
              </li>
              <li>
                <Link className="nav__link nav__menu-link" to="/">
                  Home
                </Link>
              </li>
              <li>
                <Link className="nav__link nav__menu-link" to="/browse">
                  Browse
                </Link>
              </li>
              <li>
                <Link className="nav__link nav__menu-link nav__menu-link-watchlist" to="/watchlist">
                  Watchlist
                </Link>
              </li>
              <li>
                <Link className="nav__link nav__menu-link" to="/dashboard">
                  Dashboard
                </Link>
              </li>
              <li onClick={handleLogout}>
                <p className="nav__link nav__menu-link">Logout</p>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <Link className="nav__link" to="/login">
          Login
        </Link>
      )}
    </nav>
  );
}
