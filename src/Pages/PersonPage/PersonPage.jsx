/* eslint-disable no-alert */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { API_URL, API_KEY } from '../../config';
import Loader from '../../components/Loader/Loader';
import { setViewedItems } from '../../utils';
import PersonHero from './PersonHero/PersonHero';
import PersonImages from './PersonImages/PersonImages';
import PersonCredits from './PersonCredits/PersonCredits';
import RecentlyViewed from '../../components/RecentlyViewed/RecentlyViewed';
import PersonHeader from './PersonHeader/PersonHeader';

export default class Person extends Component {
  constructor(props) {
    super(props);
    this.state = {
      person: null,
      personImages: [],
      personCredits: [],
      loading: false,
    };
  }

  componentDidMount() {
    const {
      match: { params },
    } = this.props;

    // If page was viewed
    if (sessionStorage.getItem(`${params.personId}`)) {
      this.setState({
        loading: true,
      });
      const state = JSON.parse(sessionStorage.getItem(`${params.personId}`));
      this.setState({ ...state, loading: false }, () => {
        const { person } = this.state;
        setViewedItems(person, 'recentlyViewed');
      });
    } else {
      this.setState({ loading: true });
      const personUrl = `${API_URL}person/${params.personId}?api_key=${API_KEY}&language=en-US`;
      const personImagesUrl = `${API_URL}person/${params.personId}/images?api_key=${API_KEY}&language=en-US`;
      const personCreditsUrl = `${API_URL}person/${params.personId}/combined_credits?api_key=${API_KEY}&language=en-US`;
      const urls = [personUrl, personImagesUrl, personCreditsUrl];
      this.fetchUrls(urls);
    }
  }

  async fetchUrls(urls) {
    const {
      match: { params },
    } = this.props;

    try {
      const data = await Promise.all(
        // Returning data when all url's are fetched
        urls.map((url) => fetch(url).then((response) => response.json())),
      );
      return this.setState(
        {
          person: data[0],
          personImages: data[1].profiles.map((image) => image.file_path),
          personCredits: data[2],
          loading: false,
        },
        () => {
          sessionStorage.setItem(`${params.personId}`, JSON.stringify(this.state));
          const { person } = this.state;
          // Setting viewed person item to local storage
          setViewedItems(person, 'recentlyViewed');
        },
      );
    } catch (error) {
      alert('Error:', error);
    }
    return null;
  }

  render() {
    const { person, personImages, personCredits, loading } = this.state;

    return (
      <>
        <Helmet>
          <title>{person?.name}</title>
          <meta name="description" content={`${person?.name} person page`} />
        </Helmet>
        <main className="main main--top">
          {loading ? (
            <Loader />
          ) : (
            <div className="container">
              {person ? (
                <div className="content">
                  <PersonHeader person={person} />
                  <PersonHero person={person} />
                  <PersonImages images={personImages} />
                  <PersonCredits credits={personCredits} />
                </div>
              ) : (
                <div className="content">Item not found</div>
              )}
              <RecentlyViewed />
            </div>
          )}
        </main>
      </>
    );
  }
}

Person.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      personId: PropTypes.string,
    }),
  }).isRequired,
};
