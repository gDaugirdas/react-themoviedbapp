/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Carousel from 'react-multi-carousel';
import { IMAGE_POSTER_SIZE, IMAGE_URL } from '../../config';
import './RecentlyViewed.scss';
import { mediaCarouselMqParams, removeArrowOnDeviceType } from '../CarouselParams/CarouselParams';
import Section from '../Section/Section';

export default class RecentlyViewed extends Component {
  constructor() {
    super();
    this.state = {
      recentlyViewed: null,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.setState({ recentlyViewed: JSON.parse(localStorage.getItem('recentlyViewed')) });
  }

  handleClick() {
    localStorage.removeItem('recentlyViewed');
    this.setState({
      recentlyViewed: null,
    });
  }

  render() {
    const { recentlyViewed } = this.state;

    return (
      <Section sectionText="Recently Viewed" isLink={false}>
        {recentlyViewed ? (
          <>
            <Carousel
              arrows
              showDots={false}
              swipeable
              containerClass="carousel-container"
              itemClass="carousel-item"
              responsive={mediaCarouselMqParams}
              removeArrowOnDeviceType={removeArrowOnDeviceType}
            >
              {recentlyViewed.reverse().map((data) => (
                <div className="carousel__media-item" key={data.id}>
                  <Link
                    className="carousel__media-link"
                    to={{
                      pathname: `/${data.overview ? 'media' : 'person'}/${data.id}`,
                      mediaType:
                        (data.birthday && 'person') ||
                        (data.release_date && 'movie') ||
                        (data.first_air_date && 'tv'),
                    }}
                  >
                    <div className="image--container image__hover--shadow">
                      <img
                        className="image image--special-border-radius"
                        src={
                          (data.poster_path &&
                            `${IMAGE_URL}${IMAGE_POSTER_SIZE}${data.poster_path}`) ||
                          (data.profile_path &&
                            `${IMAGE_URL}${IMAGE_POSTER_SIZE}${data.profile_path}`) ||
                          '/images/no_image.jpg'
                        }
                        alt={(data.poster_path && 'media') || (data.profile_path && 'person')}
                      />
                      <div className="image__shadow image__shadow--base" />
                    </div>
                  </Link>
                </div>
              ))}
            </Carousel>
            <p className="carousel__clear" onClick={this.handleClick}>
              Clear all
            </p>
          </>
        ) : (
          <p className="carousel__empty">You have no recently viewed items</p>
        )}
      </Section>
    );
  }
}
