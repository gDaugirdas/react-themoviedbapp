import React from 'react';
import './Logo.scss';
import { Link } from 'react-router-dom';

export default function Logo() {
  return (
    <div className="logo--container">
      <Link className="logo__link" to="/">
        <img className="logo__image" src="/images/logo.png" alt="site logo" />
      </Link>
    </div>
  );
}
