import React, { useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../contexts/AuthContext';

export default function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const history = useHistory('');

  async function handleSubmit(event) {
    event.preventDefault();
    let signUpError = '';
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError('Password confirmation does not match password');
    }
    try {
      setError('');
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value);
    } catch (err) {
      signUpError = err.message;
      setError(err.message);
    }
    setLoading(false);
    if (!signUpError) {
      history.push('/');
    }

    return null;
  }

  return (
    <>
      <Helmet>
        <title>TMDB Sign up</title>
        <meta name="description" content="Sign up page" />
      </Helmet>
      <main className="main main--center">
        <div className="container">
          <div className="form--container">
            <div className="form__logo--container">
              <img className="form__logo" src="./images/logo.png" alt="logo" />
            </div>
            {error && <p className="form__error">{error}</p>}
            <h2 className="form__heading">Sign up</h2>
            <form className="form" onSubmit={handleSubmit}>
              <label className="form__label" htmlFor="email">
                <input className="form__input" type="email" id="email" ref={emailRef} required />
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
              <label className="form__label" htmlFor="passwordConfirm">
                <input
                  className="form__input"
                  type="password"
                  id="passwordConfirm"
                  ref={passwordConfirmRef}
                  required
                />
                <p className="form__label-text">Confirm Password</p>
              </label>
              <button className="button--bold" disabled={loading} type="submit">
                Sign Up
              </button>
            </form>
            <p className="form__secondary-text">
              Already have an account?&nbsp;
              <Link
                className="link link__text link__text--color-yellow link__text--fontsize-small"
                to="/login"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
