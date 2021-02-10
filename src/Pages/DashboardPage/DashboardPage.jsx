import React, { useState, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../contexts/AuthContext';

export default function Dashboard() {
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { updatePassword, currentUser } = useAuth();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const history = useHistory('');

  async function handleSubmit(event) {
    event.preventDefault();
    let dashboardError = '';
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError('Password confirmation does not match password');
    }
    try {
      setError('');
      setLoading(true);
      await updatePassword(passwordRef.current.value);
    } catch (err) {
      dashboardError = err.message;
      setError(err.message);
    }
    setLoading(false);
    if (!dashboardError) {
      history.push('/');
    }
    return null;
  }

  return (
    <>
      <Helmet>
        <title>TMDB Dashboard</title>
        <meta name="description" content="Dashboard page" />
      </Helmet>
      <main className="main main--center">
        <div className="container">
          <div className="form--container">
            <div className="form__logo--container">
              <img className="form__logo" src="./images/logo.png" alt="logo" />
            </div>
            {error && <p className="form__error">{error}</p>}
            <h2 className="form__heading">Dashboard</h2>
            <form className="form" onSubmit={handleSubmit}>
              <div className="form__dashboard-action--container">
                <p className="form__dashboard-action-text">{currentUser.email}</p>
                <p className="form__dashboard-action-text">Update Password</p>
              </div>
              <label
                className="form__label"
                htmlFor="password"
                placeholder="Leave blank to keep the same"
              >
                <input
                  className="form__input"
                  type="password"
                  id="password"
                  ref={passwordRef}
                  required
                />
                <p className="form__label-text">New Password</p>
              </label>
              <label
                className="form__label"
                htmlFor="passwordConfirm"
                placeholder="Leave blank to keep the same"
              >
                <input
                  className="form__input"
                  type="password"
                  id="passwordConfirm"
                  ref={passwordConfirmRef}
                  required
                />
                <p className="form__label-text">Confirm New Password</p>
              </label>
              <button className="button--bold" disabled={loading} type="submit">
                Update
              </button>
            </form>
            <p className="form__secondary-text">
              <Link
                className="link link__text link__text--color-yellow link__text--fontsize-small"
                to="/"
              >
                Cancel
              </Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
