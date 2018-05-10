import React from 'react';
import axios from 'axios';
import _ from 'lodash';

import Modal from './Modal.jsx';
import LightBox from './LightBox.jsx';
import Share from './Share.jsx';

import styles from '../styles/image-service-style.css';
import heart from '../icons/heart.jsx';
import share from '../icons/share.jsx';
import spinner from '../icons/spinner.jsx';

class ImageService extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      openModal: false,
      allImagesLoaded: false,
      imageCount: 0,
      curImageIndex: 0,
      images: [],
      modalChild: ''
    }
    this.fetchNewImages = this.fetchNewImages.bind(this);
    this.onImageLoad = this.onImageLoad.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.changeIndex = this.changeIndex.bind(this);
    this.determineModalContent = this.determineModalContent.bind(this);
  }

  componentDidMount() {
    this.fetchNewImages(this.props.locationId);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.locationId !== this.props.locationId) {
      this.fetchNewImages(this.props.locationId);
    }
  }

  onImageLoad() {
    let {imageCount, allImagesLoaded, images} = this.state;
    if (imageCount === images.length) {
      return;
    }
    imageCount++;
    allImagesLoaded = imageCount === images.length;

    this.setState({
      imageCount: imageCount,
      allImagesLoaded: allImagesLoaded
    })
  }

  fetchNewImages(locationId) {
    let url = '';
    if (process.env.NODE_ENV === 'production') {
      url = 'http://ec2-34-203-243-252.compute-1.amazonaws.com';
    } else if (process.env.NODE_ENV === 'development') {
      url = 'http://127.0.0.1:3000';
    } else {
      url = 'http://192.168.99.100:3000'; // Because Docker for windows is stupid and won't expose port to localhost :(
    }

    return axios.get(`${url}/images/${locationId}`)
      .then((result) => {
        let { locationName, images } = result.data;
        let allImagesLoaded = images.length === 0; //If no images are returned, then there is no point in waiting for images to load
        console.log(result);
        this.setState({
          locationName: 'placeholder',  // formerly locationName
          images: images[0].src,        // formerly images
          didFetch: true,
          allImagesLoaded: allImagesLoaded
        })
      })
      .catch((err) => {
        console.error(err);
      });
  }

  openModal(e) {
    document.body.style.overflow = "hidden";
    let modalChild = 'LightBox';
  
    if (this.save.contains(e.target)) {
      modalChild = 'Save';
    } else if (this.share.contains(e.target)) {
      modalChild = 'Share';
    }
    this.setState({
      openModal: true,
      modalChild: modalChild
    })
  }

  closeModal() {
    document.body.style.overflow = "initial";

    this.setState({
      openModal: false
    })
  }

  changeIndex(index) {
    if (index < 0) {
      index = this.state.images.length-1;
    } else if (index >= this.state.images.length) {
      index = 0;
    }
    this.setState({
      curImageIndex: index
    })
  }

  determineModalContent() {
    let {images, curImageIndex, modalChild, locationName} = this.state;
    switch (modalChild) {
      case 'LightBox':
        return (
          <LightBox 
            key="LightBox"
            images={images} 
            curImageIndex={curImageIndex} 
            closeModal={this.closeModal}
            changeIndex={this.changeIndex}
          />
        );
      case 'Save':
        return (
          <div>
            SAVE
          </div>
        );
      case 'Share':
        return (
          <Share
            key="Share"
            closeModal={this.closeModal}
            locationName={locationName}
          />
        );
    }
  }

  render() {
    let {images, imageCount, allImagesLoaded, openModal, curImageIndex, modalChild} = this.state;
    // let imgUrl = images.length > 0 ? images[0].src : null;
    let imgUrl = images.length > 0 ? images[0] : null;
    
    return (
      <div className={styles['main-image']}>
        <div>
          {!allImagesLoaded 
          ? <div className={styles['background']} style={{textAlign: 'center'}}>
              <div style={{
                position: 'relative',
                display: 'inline-block',
                transform: 'translateY(250%)'
              }}>
                {spinner}
              </div>
            </div>
          : images.length === 0 
              ? <div id="no-images" className={styles['background']}>
                  <h1>The owner has not posted any pictures of this place yet!</h1>
                  <div className={styles['buttons-top']}>
                    <span style={{marginRight: '15px'}}>
                      <button ref={shareButton => (this.share = shareButton)} 
                        id="share-button" 
                        className={styles['button']} 
                        onClick={(e) => this.openModal(e)}
                      >
                        <div className={styles['icon-span']}>{share}</div>
                        Share
                      </button>
                    </span>
                    <span>
                      <button ref={saveButton => (this.save = saveButton)} 
                        id="save-button" 
                        className={styles['button']} 
                        onClick={(e) => this.openModal(e)}
                      >
                        <div className={styles['icon-span']}>{heart}</div>
                        Save
                      </button>
                    </span>
                  </div>
                </div>
              : <div id="background" ref={background => (this.background = background)} 
                  className={styles['background']} 
                  style={{backgroundImage: `url("${imgUrl}")`, cursor: 'pointer'}} 
                  onClick={(e) => this.openModal(e)}>
                  <div className={styles['buttons-top']}>
                    <span style={{marginRight: '15px'}}>
                      <button ref={shareButton => (this.share = shareButton)} 
                        id="share-button" 
                        className={styles['button']} 
                        onClick={(e) => this.openModal(e)}
                      >
                        <div className={styles['icon-span']}>{share}</div>
                        Share
                      </button>
                    </span>
                    <span>
                      <button ref={saveButton => (this.save = saveButton)} 
                        id="save-button" 
                        className={styles['button']} 
                        onClick={(e) => this.openModal(e)}
                      >
                        <div className={styles['icon-span']}>{heart}</div>
                        Save
                      </button>
                    </span>
                  </div>
                  <div className={styles['view-photos']}>
                    <button ref={photosButton => (this.photosButton = photosButton)} 
                      id="photos-button" 
                      className={styles['button']} 
                      onClick={(e) => this.openModal(e)}
                    >
                      View Photos
                    </button>
                  </div>
                </div>
          }
        </div>
        <Modal isOpen={openModal} 
          color={modalChild === 'Share' ? 
            'rgba(255,255,255,0.8)' 
            : 'rgba(0,0,0,0.8)'}>
          {this.determineModalContent()}
        </Modal>
        <div style={{display: 'none'}}>
          {images.map((image, key) => 
            <img key={`image-${key}`} src={image} onLoad={this.onImageLoad}/> // I want to show the images component to the screen only after all images loaded
          )}
        </div>
      </div>
    )
  }
}

export default ImageService;