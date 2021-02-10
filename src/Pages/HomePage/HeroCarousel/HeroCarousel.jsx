import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Carousel from 'react-multi-carousel';
import { IMAGE_URL, IMAGE_BACKGROUND_SIZE } from '../../../config';
import './HeroCarousel.scss';

export default function HeroCarousel({ list }) {
  return (
    list && (
      <Carousel
        showDots
        swipeable
        containerClass="carousel-container"
        responsive={{
          main: {
            breakpoint: { max: 10000, min: 0 },
            items: 1,
            slidesToSlide: 1,
          },
        }}
        removeArrowOnDeviceType={['main']}
        autoPlay
        autoPlaySpeed="10000"
        infinite
      >
        {list.slice(0, 8).map((data) => (
          <div
            key={data.id}
            className="hero"
            style={{
              backgroundImage: `url('${IMAGE_URL}${IMAGE_BACKGROUND_SIZE}${data.backdrop_path}')`,
            }}
          >
            <div className="hero__text--container container">
              <div className="hero__link--container">
                <Link to="/browse" className="link__text--color-yellow link__text--bold hero__link">
                  Browse Popular Shows and Movies
                </Link>
              </div>

              <h1 className="hero__heading">{data.title}</h1>
              <p className="hero__paragraph">
                {data.overview.length > 220
                  ? `${data.overview.substring(0, 220)}...`
                  : data.overview}
              </p>
            </div>
          </div>
        ))}
      </Carousel>
    )
  );
}

HeroCarousel.propTypes = {
  list: PropTypes.instanceOf(Array),
};

HeroCarousel.defaultProps = {
  list: [],
};
