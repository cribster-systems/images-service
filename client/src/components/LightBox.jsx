import React from 'react';

import Carousel from './Carousel.jsx';

import styles from '../styles/lightbox-style.css';
import arrowRight from '../icons/arrow-right.jsx';
import arrowLeft from '../icons/arrow-left.jsx';
import popupArrow from '../icons/popup-arrow.png';
import close from '../icons/close.jsx';

// const CSS = styles._getCss();

class LightBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listOpen: true
    }
    this.togglePhotoList = this.togglePhotoList.bind(this);
  }

  togglePhotoList(keepOpen) {
    this.setState({
      listOpen: keepOpen || !this.state.listOpen
    })
  }

  render() {

      let { images, curImageIndex, closeModal, changeIndex } = this.props;
      let curImage = images[curImageIndex];
      return (
        <div id="lightbox-container" className={styles['lightbox-container']}>
          <button id="close-lightbox" className={styles['close-lightbox']} onClick={closeModal}>
            {close}
          </button>
          <button id="prev" className={styles['nav-left']} onClick={() => changeIndex(--curImageIndex)}>
            <div className={styles['nav-icon']} style={{left: 0}}>
              {arrowLeft}
            </div>
          </button>
          <img 
            id="display-image"
            key={curImageIndex} 
            src={curImage} 
            className={styles['display-image']} 
            align="middle" 
            onClick={() => changeIndex(++curImageIndex)}
          />
          <button id="next" className={styles['nav-right']} onClick={() => changeIndex(++curImageIndex)}>
            <div className={styles['nav-icon']} style={{right: 0}}>
              {arrowRight}
            </div>
          </button>
          <div id="lightbox-bottom" className={styles['lightbox-bottom']} onMouseEnter={() => this.togglePhotoList(true)}>
            <div className={styles[`photo-list-${this.state.listOpen ? 'up' : 'down'}`]}>
              <div id="photo-list-header" className={styles['photo-list-header']}>
                <span id="caption">{`${curImageIndex+1}/${images.length}: ${curImage.caption}`}</span>
                <span style={{float: 'right'}}>
                  <button id="photo-list-button" className={styles['photo-list-button']} onClick={() => this.togglePhotoList()}>
                    <span>{`${this.state.listOpen ? 'Hide' : 'Show'} photo list`}</span>
                    <span style={{marginLeft: '1px', height: '10px', width: '10px'}}>
                      <div className={styles['popup-arrow']}>
                        <img 
                          className={styles[`popup-icon-${this.state.listOpen ? 'down' : 'up'}`]} 
                          height="10px" width="10px" src={popupArrow}/>
                      </div>
                    </span>
                  </button>
                </span>
              </div>
              <Carousel 
                images={images} 
                changeIndex={changeIndex} 
                curImageIndex={curImageIndex} 
              />
            </div>
          </div>
        </div>
    );
  }
}

export default LightBox;