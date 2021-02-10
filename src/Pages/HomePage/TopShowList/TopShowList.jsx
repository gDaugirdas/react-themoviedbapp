import React from 'react';
import Carousel from 'react-multi-carousel';
import PropTypes from 'prop-types';
import {
  mediaCarouselMqParams,
  removeArrowOnDeviceType,
} from '../../../components/CarouselParams/CarouselParams';
import Section from '../../../components/Section/Section';
import CarouselMediaItem from '../../../components/CarouselMediaItem/CarouselMediaItem';

export default function TopShowList({ list }) {
  return (
    <Section pathname="/browse" value="top shows" sectionText="Top Shows" isLink>
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

TopShowList.propTypes = {
  list: PropTypes.instanceOf(Array),
};

TopShowList.defaultProps = {
  list: [],
};
