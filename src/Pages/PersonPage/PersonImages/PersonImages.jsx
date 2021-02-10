/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState, useCallback } from 'react';
import ImageViewer from 'react-simple-image-viewer';
import disableScroll from 'disable-scroll';
import Carousel from 'react-multi-carousel';
import PropTypes from 'prop-types';
import { IMAGE_POSTER_SIZE, IMAGE_URL } from '../../../config';
import {
  personImagesCarouselMqParams,
  removeArrowOnDeviceType,
} from '../../../components/CarouselParams/CarouselParams';
import './PersonImages.scss';

export default function PersonImages({ images }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const openImageViewer = useCallback((i) => {
    setCurrentImage(i);
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };
  return (
    <>
      {images && images.length > 1 && (
        <div className="person__images--container">
          <Carousel
            arrows
            showDots={false}
            swipeable
            containerClass="carousel-container"
            itemClass="carousel-item"
            responsive={personImagesCarouselMqParams}
            removeArrowOnDeviceType={removeArrowOnDeviceType}
            partialVisible
          >
            {/* Slicing first image before mapping though array, first image is a dupliacate of main person image */}
            {images.slice(1).map((el, i) => (
              <div className="person__images-list-item" key={i}>
                <img
                  className="image"
                  src={`${IMAGE_URL}${IMAGE_POSTER_SIZE}${el}`}
                  alt="Person"
                  onClick={() => {
                    openImageViewer(i);
                    disableScroll.on();
                  }}
                />
              </div>
            ))}
          </Carousel>
        </div>
      )}
      {isViewerOpen && (
        <ImageViewer
          src={images.slice(1).map((el) => `${IMAGE_URL}${IMAGE_POSTER_SIZE}${el}`)}
          currentIndex={currentImage}
          onClose={() => {
            closeImageViewer();
            disableScroll.off();
          }}
          backgroundStyle={{
            backgroundColor: 'rgba(0,0,0,0.9)',
            zIndex: 1001,
          }}
        />
      )}
    </>
  );
}

PersonImages.propTypes = {
  images: PropTypes.instanceOf(Object).isRequired,
};
