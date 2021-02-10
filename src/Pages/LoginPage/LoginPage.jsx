import React, { useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../contexts/AuthContext';

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const history = useHistory('');

  async function handleSubmit(event) {
    event.preventDefault();
    let loginError = '';
    try {
      setError('');
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        loginError = err.message;
        setError('Entered email address does not exist in the database');
      } else {
        loginError = err.message;
        setError(err.message);
      }
    }
    setLoading(false);
    if (!loginError) {
      history.push('/');
    }
    return null;
  }

  return (
    <>
      <Helmet>
        <title>TMDB Login</title>
        <meta name="description" content="Login page" />
      </Helmet>
      <main className="main main--center">
        <div className="container">
          <div className="form--container">
            <div className="form__logo--container">
              <img className="form__logo" src="./images/logo.png" alt="logo" />
            </div>
            {error && <p className="form__error">{error}</p>}
            <h2 className="form__heading">Login</h2>
            <form className="form" onSubmit={handleSubmit}>
              <label className="form__label" htmlFor="email">
                <input className="form__input" type="text" id="email" ref={emailRef} required />
                <p className="form__label-text">Email</p>
              </label>
              <label className="form__label" htmlFor="password">
                <input
                  className="form__input"
                  type="password"
                  id="password"
                  ref={passwordRef}
                  required
                />
                <p className="form__label-text">Password</p>
              </label>
              <button className="button--bold" disabled={loading} type="submit">
                Login
              </button>
            </form>
            <p className="form__paragraph">
              <Link
                className="link link__text link__text--color-yellow link__text--fontsize-small"
                to="/forgot-password"
              >
                Forgot password
              </Link>
            </p>
            <p className="form__secondary-text">
              Dont have an account?&nbsp;
              <Link
                className="link link__text link__text--color-yellow link__text--fontsize-small"
                to="/signup"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
