import React from 'react';
import Carousel from 'react-multi-carousel';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { IMAGE_POSTER_SIZE, IMAGE_URL } from '../../../config';
import {
  personCarouselMqParams,
  removeArrowOnDeviceType,
} from '../../../components/CarouselParams/CarouselParams';
import Section from '../../../components/Section/Section';

export default function TrendingPeopleList({ list }) {
  return (
    <Section sectionText="Trending People" isLink={false}>
      {list && (
        <Carousel
          arrows
          showDots={false}
          swipeable
          containerClass="carousel-container"
          itemClass="carousel-item"
          responsive={personCarouselMqParams}
          removeArrowOnDeviceType={removeArrowOnDeviceType}
          partialVisible
          autoPlay
          autoPlaySpeed="7000"
          infinite
        >
          {list.map((data) => (
            <div className="carousel__person-item" key={data.id}>
              <Link
                className="link"
                to={{ pathname: `/${data.media_type}/${data.id}`, mediaType: data.media_type }}
              >
                <div className="image--container carousel__person-image--container image__hover--shadow">
                  <img
                    className="image image--special-border-radius"
                    src={
                      data.profile_path
                        ? `${IMAGE_URL}${IMAGE_POSTER_SIZE}${data.profile_path}`
                        : '/images/no_image.jpg'
                    }
                    alt="person"
                  />
                  <div className="image__shadow image__shadow--base" />
                </div>
              </Link>
              <div className="carousel__person-details--container">
                <p className="carousel__person-details-department">
                  {`${data.known_for_department ? data.known_for_department : 'Unknown'} Deparment`}
                </p>
                <Link
                  className="link link__text link__text--color-white link__text--bold link__text--fontsize-big"
                  to={{ pathname: `/${data.media_type}/${data.id}`, mediaType: data.media_type }}
                >
                  <p>{data.name}</p>
                </Link>
                <ul className="carousel__person-details-list">
                  <p className="carousel__person-details-credit">Known for:</p>
                  {data.known_for.length !== 0 &&
                    data.known_for.map((knownForData) => (
                      <li className="carousel__person-details-item" key={knownForData.id}>
                        <Link
                          className="link link__text link__text--color-yellow link__text--fontsize-big"
                          to={{
                            pathname: `/media/${knownForData.id}`,
                            mediaType: knownForData.media_type,
                          }}
                        >
                          <p className="carousel__person-details-title">
                            {knownForData.title || knownForData.name}
                          </p>
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          ))}
        </Carousel>
      )}
    </Section>
  );
}

TrendingPeopleList.propTypes = {
  list: PropTypes.instanceOf(Array),
};

TrendingPeopleList.defaultProps = {
  list: [],
};
