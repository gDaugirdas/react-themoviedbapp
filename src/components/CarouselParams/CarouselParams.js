// Media querry params for carousel components
export const mediaCarouselMqParams = {
  large: {
    breakpoint: { max: 10000, min: 1200 },
    items: 6,
    slidesToSlide: 3,
  },
  medium: {
    breakpoint: { max: 1200, min: 767 },
    items: 4,
    slidesToSlide: 2,
  },
  small: {
    breakpoint: { max: 767, min: 0 },
    items: 2,
    slidesToSlide: 2,
  },
};

export const personCarouselMqParams = {
  large: {
    breakpoint: { max: 10000, min: 1200 },
    items: 2,
    slidesToSlide: 1,
  },
  medium: {
    breakpoint: { max: 1200, min: 767 },
    items: 4,
    slidesToSlide: 2,
  },
  small: {
    breakpoint: { max: 767, min: 0 },
    items: 2,
    slidesToSlide: 2,
  },
};

export const personImagesCarouselMqParams = {
  large: {
    breakpoint: { max: 10000, min: 1200 },
    items: 6,
    slidesToSlide: 3,
  },
  medium: {
    breakpoint: { max: 1200, min: 767 },
    items: 4,
    slidesToSlide: 2,
    partialVisibilityGutter: 20,
  },
  small: {
    breakpoint: { max: 767, min: 0 },
    items: 2,
    slidesToSlide: 2,
    partialVisibilityGutter: 8,
  },
};

export const removeArrowOnDeviceType = ['small'];
