import React from 'react';
import Carousel from 'react-multi-carousel';
import PropTypes from 'prop-types';
import {
  mediaCarouselMqParams,
  removeArrowOnDeviceType,
} from '../../../components/CarouselParams/CarouselParams';
import Section from '../../../components/Section/Section';
import CarouselMediaItem from '../../../components/CarouselMediaItem/CarouselMediaItem';

export default function TrendingShowList({ list }) {
  return (
    <Section pathname="/browse" value="trending shows" sectionText="Trending Shows" isLink>
      {list && (
        <Carousel
          arrows
          showDots={false}
          swipeable
          containerClass="carousel-container"
          itemClass="carousel-item"
          responsive={mediaCarouselMqParams}
          partialVisible
          removeArrowOnDeviceType={removeArrowOnDeviceType}
        >
          {list.map((data) => (
            <CarouselMediaItem key={data.id} data={data} />
          ))}
        </Carousel>
      )}
    </Section>
  );
}

TrendingShowList.propTypes = {
  list: PropTypes.instanceOf(Array),
};

TrendingShowList.defaultProps = {
  list: [],
};
