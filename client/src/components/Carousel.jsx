import React from 'react';
import Slider from 'react-slick';

import styles from '../styles/carousel-style.css';

const CSS = styles._getCss();

class Carousel extends React.Component {
  componentDidUpdate() {
    this.goToIndex(this.props.curImageIndex, this.props.images);
  }
  
  goToIndex(curImageIndex, images) {
    if (curImageIndex <= 3) {
      this.slider.slickGoTo(0);
    } else if (curImageIndex > images.length-4) {
      this.slider.slickGoTo(images.length-7);
    } else {
      this.slider.slickGoTo(curImageIndex-3);
    }
  }

  render() {
    let { images, changeIndex, curImageIndex } = this.props;
    let settings = {
      slidesToShow: 7, 
      slidesToScroll: 5,
      arrows: false,
      infinite: true,
      dots: false, 
      centerMode: false,
      className: styles['slider']
    };

    let slideOffSet = -2.5;
    if (images.length < 7) {
      slideOffSet = 54.5 * (7 - images.length);
    }
    return (
      <div>
        <style>{CSS}</style>
      
        <div id="slider-container" className={styles['slider-container']} 
          style={{transform: `translate(${slideOffSet}px)`}}>
          <Slider ref={slider => (this.slider = slider)} {...settings}>
            {images.map((image, index) => 
            <div key={index} className={styles['slide']}>
              <div className={styles['thumbnail-frame']}>
                <img 
                  id={`Image ${index}`}
                  className={styles['thumbnail']} 
                  src={image} 
                  style={{filter: index === curImageIndex ? 'brightness(100%)' : null}}
                  onClick={() => changeIndex(index)}
                />
              </div>
            </div>
            )}
          </Slider>
        </div>
      </div>
    );
  }
}

export default Carousel;