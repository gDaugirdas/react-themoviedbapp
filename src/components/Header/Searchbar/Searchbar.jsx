import React, { Component } from 'react';
import './Searchbar.scss';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import disableScroll from 'disable-scroll';
import SuggestionList from '../SuggestionList/SuggestionList';
import { search } from '../../../utils';
import { API_URL, API_KEY } from '../../../config';
import sprite from '../../../svg/sprite.svg';

class Searchbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Media querry for class toggling
      mobileMq: window.matchMedia('(max-width: 767px)').matches,
      // Classes
      mobileInputClass: 'searchbar__input--hidden',
      suggestionListClass: 'suggestion__list--hidden',
      // Input handling states
      inputValue: '',
      fetcedResults: [],
      loading: false,
    };
    // Input ref handling on mobile
    this.mobileInput = React.createRef();
    // Input container class toggle handling on mobile
    this.handleMobileClick = this.handleMobileClick.bind(this);
    // Input handling on focus and blur
    this.handleInputFocus = this.handleInputFocus.bind(this);
    this.handleInputBlur = this.handleInputBlur.bind(this);
    // Input submit handling
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleClick = this.handleClick.bind(this);
    // Handling state on link click in searchbar
    this.handleLinkClick = this.handleLinkClick.bind(this);
  }

  componentDidMount() {
    // Mounting media querry handler
    const handler = (event) => this.setState({ mobileMq: event.matches });
    window.matchMedia('(max-width: 767px)').addListener(handler);
  }

  handleMobileClick(event) {
    const { mobileInputClass } = this.state;
    event.preventDefault();

    // Input container class toggling on mobile button click
    const css =
      mobileInputClass === 'searchbar__input--hidden'
        ? 'searchbar__input--visible'
        : 'searchbar__input--hidden';
    this.setState({
      mobileInputClass: css,
      fetcedResults: [],
      inputValue: '',
    });
    // Focusing on input on mobile button click
    this.mobileInput.current.focus();
    disableScroll.on();
  }

  handleInputFocus() {
    // On input focus toggling css classes
    this.setState({
      suggestionListClass: 'suggestion__list--visible',
      mobileInputClass: 'searchbar__input--visible',
    });
  }

  handleInputBlur() {
    // On input blur toggling css classes, setting timeout to let user click on link
    setTimeout(() => {
      this.setState({
        suggestionListClass: 'suggestion__list--hidden',
        mobileInputClass: 'searchbar__input--hidden',
      });
    }, 150);
    disableScroll.off();
  }

  handleLinkClick() {
    // Reseting input value and fetched results on searchbar link click
    this.setState({ fetcedResults: [], inputValue: '' });
  }

  handleKeyDown(event) {
    const { fetcedResults } = this.state;
    const { history } = this.props;
    // Input handling on keydown "Enter"
    if (event.key === 'Enter') {
      event.preventDefault();
      this.mobileInput.current.blur();

      this.setDataToSessionStorage();

      // Linking to results page
      history.push({
        pathname: '/search-results',
        fetcedResults,
      });
      this.removeDataFromSessionStorageAndResetState();
    }
  }

  handleClick(event) {
    const { fetcedResults } = this.state;
    const { history } = this.props;
    // Button click handling on desktop
    event.preventDefault();

    this.setDataToSessionStorage();

    history.push({
      pathname: '/search-results',
      fetcedResults,
    });

    this.removeDataFromSessionStorageAndResetState();
  }

  setDataToSessionStorage() {
    const { fetcedResults, inputValue } = this.state;
    if (fetcedResults) {
      // If we have fetced data, pass it session storage
      sessionStorage.setItem('fetcedResults', JSON.stringify(fetcedResults));
    }
    sessionStorage.setItem('inputValue', JSON.stringify(inputValue));
  }

  handleOnInputChange = async (event) => {
    // Input handling on change
    // If input has value, perform fetch
    if (event.target.value) {
      this.fetchSearchResults(event.target.value);
      // If input has no value, set fetcedResults to null
    } else {
      this.setState({ fetcedResults: [] });
    }

    // Pass input value to the state
    this.setState({ inputValue: event.target.value });
  };

  fetchSearchResults = async (value) => {
    // Fething search results from input value
    this.setState({
      loading: true,
    });
    const searchUrl = `${API_URL}search/multi?api_key=${API_KEY}&language=en-US&query=${value}&page=1&include_adult=false`;
    const res = await search(searchUrl);
    const fetcedResults = await res;

    this.setState({ fetcedResults }, () => {
      // after fetching search results dipslay loading icon
      if (fetcedResults)
        setTimeout(() => {
          this.setState({
            loading: false,
          });
        }, 200);
    });
  };

  removeDataFromSessionStorageAndResetState() {
    // reseting input value and fetched results on input submit
    const { inputValue } = this.state;
    if (!inputValue) {
      sessionStorage.removeItem('fetcedResults');
    }
    this.setState({
      fetcedResults: [],
      inputValue: '',
    });
  }

  render() {
    const {
      mobileInputClass,
      suggestionListClass,
      mobileMq,
      inputValue,
      fetcedResults,
      loading,
    } = this.state;

    const { movieGenres, seriesGenres } = this.props;
    return (
      <div className="searchbar--container">
        <form className="searchbar">
          <div
            className={
              mobileMq
                ? `searchbar__input--container ${mobileInputClass}`
                : 'searchbar__input--container'
            }
          >
            <input
              className="searchbar__input"
              value={inputValue}
              onFocus={this.handleInputFocus}
              onBlur={this.handleInputBlur}
              onChange={this.handleOnInputChange}
              onKeyDown={this.handleKeyDown}
              ref={this.mobileInput}
              type="text"
              placeholder="Search TMDB"
            />
            {mobileMq && (
              <button onClick={disableScroll.off()} className="searchbar__button" type="button">
                <svg
                  className="searchbar__icon searchbar__icon--white"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 22.9 22.9"
                >
                  <use href={`${sprite}#icon-magnifying-glass`} />
                </svg>
              </button>
            )}
          </div>
          <button
            onClick={mobileMq ? this.handleMobileClick : this.handleClick}
            className="searchbar__button"
            type="submit"
          >
            <svg
              className="searchbar__icon"
              version="1.1"
              viewBox="-1 0 136 136.22"
              xmlns="http://www.w3.org/2000/svg"
            >
              <use href={`${sprite}#icon-cross`} />
            </svg>
          </button>
          {inputValue && (
            <SuggestionList
              handleLinkClick={this.handleLinkClick}
              suggestionListClass={suggestionListClass}
              fetcedResults={fetcedResults}
              movieGenres={movieGenres}
              seriesGenres={seriesGenres}
              loading={loading}
            />
          )}
        </form>
      </div>
    );
  }
}

Searchbar.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  movieGenres: PropTypes.instanceOf(Object).isRequired,
  seriesGenres: PropTypes.instanceOf(Object).isRequired,
};

export default withRouter(Searchbar);
