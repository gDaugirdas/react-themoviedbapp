import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { API_URL, API_KEY } from '../../config';
import Loader from '../../components/Loader/Loader';
import { setViewedItems } from '../../utils';
import MediaHeader from './MediaHeader/MediaHeader';
import MediaHero from './MediaHero/MediaHero';
import MediaCredits from './MediaCredits/MediaCredits';
import MediaCreditsList from './MediaCreditsList/MediaCreditsList';
import RecentlyViewed from '../../components/RecentlyViewed/RecentlyViewed';
import MediaSimilar from './MediaSimilar/MediaSimilar';
import movieList from '../../scrapedData.json';

export default class Media extends Component {
  constructor(props) {
    super(props);
    this.state = {
      media: null,
      actors: [],
      directors: [],
      writers: [],
      loading: false,
      mediaCreditListClass: 'media__credits-list--hidden',
      isToggled: false,
      similarMedia: null,
      mediaVideo: null,
      mediaLink: null,
    };
    this.handleToggle = this.handleToggle.bind(this);
  }

  componentDidMount() {
    const {
      match: { params },
    } = this.props;

    const { location } = this.props;

    // If page was visited
    if (sessionStorage.getItem(`${params.mediaId}`)) {
      this.setState({
        loading: true,
      });
      const state = JSON.parse(sessionStorage.getItem(`${params.mediaId}`));
      this.setState({ ...state, loading: false }, () => {
        const { media } = this.state;
        setViewedItems(media, 'recentlyViewed');
      });
    } else {
      this.setState({ loading: true });
      const mediaUrl = `${API_URL}${location.mediaType}/${params.mediaId}?api_key=${API_KEY}&language=en-US`;
      const creditsUrl = `${API_URL}${location.mediaType}/${params.mediaId}/credits?api_key=${API_KEY}&language=en-US`;
      const similarMediaUrl = `${API_URL}${location.mediaType}/${params.mediaId}/similar?api_key=${API_KEY}&language=en-US`;
      const mediaVideosUrl = `${API_URL}${location.mediaType}/${params.mediaId}/videos?api_key=${API_KEY}&language=en-US`;

      const urls = [mediaUrl, creditsUrl, similarMediaUrl, mediaVideosUrl];
      this.fetchUrls(urls);
    }
  }

  handleToggle() {
    // Handling show/hide all media credits toggle
    const { mediaCreditListClass, isToggled } = this.state;
    const css =
      mediaCreditListClass === 'media__credits-list--hidden'
        ? 'media__credits-list--visible'
        : 'media__credits-list--hidden';
    this.setState({
      mediaCreditListClass: css,
      isToggled: !isToggled,
    });
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
          media: data[0],
          actors: data[1].cast,
          directors: data[1].crew.filter((member) => member.job === 'Director'),
          writers: data[1].crew.filter((member) => member.job === 'Writer'),
          similarMedia: data[2].results.slice(0, 6),
          mediaVideo: data[3].results
            .filter((item) => (item.site = 'Youtube'))
            .filter((item) => (item.type = 'Trailer'))[0],

          loading: false,
        },
        () => {
          sessionStorage.setItem(`${params.mediaId}`, JSON.stringify(this.state));
          const { media } = this.state;
          // Setting viewed media item to local storage
          setViewedItems(media, 'recentlyViewed');
        },
      );
    } catch (error) {
      alert('Error:', error.message);
    }
    return null;
  }

  render() {
    const {
      directors,
      writers,
      actors,
      loading,
      mediaCreditListClass,
      media,
      similarMedia,
      mediaVideo,
      isToggled,
    } = this.state;

    const { movieGenres, seriesGenres } = this.props;

    // Matching movie title to movie link in scraped db data
    let mediaLink = null;

    if (media && media.title && media.release_date) {
      movieList.filter((el) => {
        if (
          el.name.toLowerCase().includes(media.title.toLowerCase().replace(/ *\([^)]*\) */g, '')) &&
          el.name.includes(media.release_date.slice(0, 4))
        )
          mediaLink = el['src-src'];
        return null;
      });
    }

    return (
      <main className="main main--top">
        <Helmet>
          <title>{media?.title || media?.name}</title>
          <meta name="description" content={`${media?.title || media?.name} media page`} />
        </Helmet>
        {loading ? (
          <Loader />
        ) : (
          <div className="container">
            {media && (
              <>
                <div className="content">
                  <MediaHeader media={media} />
                  <MediaHero media={media} mediaVideo={mediaVideo} />
                  <MediaCredits
                    media={media}
                    directors={directors}
                    actors={actors}
                    writers={writers}
                    isToggled={isToggled}
                    handleToggle={this.handleToggle}
                    mediaLink={mediaLink}
                  />
                  <MediaCreditsList mediaCreditListClass={mediaCreditListClass} actors={actors} />
                  <MediaSimilar
                    data={similarMedia}
                    movieGenres={movieGenres}
                    seriesGenres={seriesGenres}
                    mediaType={media.title ? 'Movies' : 'Series'}
                  />
                </div>
                <RecentlyViewed />
              </>
            )}
          </div>
        )}
      </main>
    );
  }
}

Media.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      mediaId: PropTypes.string,
    }),
  }).isRequired,
  location: PropTypes.instanceOf(Object),
  movieGenres: PropTypes.instanceOf(Object).isRequired,
  seriesGenres: PropTypes.instanceOf(Object).isRequired,
};

Media.defaultProps = {
  location: {},
};
