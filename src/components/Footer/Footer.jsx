import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.scss';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer--container container">
        <p className="footer__text">
          Produced by
          <Link
            className="footer__link"
            to={{ pathname: 'https://github.com/gDaugirdas/' }}
            target="_blank"
          >
            {` gDaugirdas(github)`}
          </Link>
        </p>
        <p className="footer__text">React TMDB, 2021</p>
      </div>
    </footer>
  );
}
