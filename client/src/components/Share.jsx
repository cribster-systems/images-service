import React from 'react';

import styles from '../styles/share-style.css';
import facebookIcon from '../icons/facebook-icon.jsx';
import twitterIcon from '../icons/twitter-icon.jsx';
import emailIcon from '../icons/email-icon.jsx';
import messengerIcon from '../icons/messenger-icon.jsx';
import copyIcon from '../icons/copy-icon.jsx';
import embedIcon from '../icons/embed-icon.jsx';

// const CSS = styles._getCss();

class Share extends React.Component {
  closeModal(e) {
    if (e.target !== this.container && e.target !== this.close) {
      return;
    }
    this.props.closeModal();
  }

  render() {
    return (
        <div id="share-container" 
          ref={container => (this.container = container)} 
          className={styles['share-container']} 
          onClick={(e) => this.closeModal(e)}
        >
          <div id="share-page" className={styles['share-page']}>
            <button ref={close => (this.close = close)}
              className={styles['close-button']} 
              onClick={(e) => this.closeModal(e)}
            >
              ╳
            </button>
            <div className={styles['content']}>
              <header style={{color: '#484848'}}>             
                <h1 className={styles['title']}>Share</h1>        
                <div className={styles['description']}>
                  {`Check out this awesome listing on Fantasybnb: ${this.props.locationName}`}
                </div>
              </header>
              <div className={styles['list-entry-first']}>
                <button className={styles['clickable-link']}>
                  <span style={{marginRight: '10px'}}>{facebookIcon}</span><span>Facebook</span>
                </button>
              </div>
              <div className={styles['list-entry']}>
                <button className={styles['clickable-link']}>
                  <span style={{marginRight: '10px'}}>{twitterIcon}</span><span>Twitter</span>
                </button>
              </div>
              <div className={styles['list-entry']}>
                <button className={styles['clickable-link']}>
                  <span style={{marginRight: '10px'}}>{emailIcon}</span><span>Email</span>
                </button>
              </div>
              <div className={styles['list-entry']}>
                <button className={styles['clickable-link']}>
                  <span style={{marginRight: '10px'}}>{messengerIcon}</span><span>Messenger</span>
                </button>
              </div>
              <div className={styles['list-entry']}>
                <button className={styles['clickable-link']}>
                  <span style={{marginRight: '10px'}}>{copyIcon}</span><span>Copy Link</span>
                </button>
              </div>
              <div className={styles['list-entry']}>
                <button className={styles['clickable-link']}>
                  <span style={{marginRight: '10px'}}>{embedIcon}</span><span>Embed</span>
                </button>
              </div>
            </div>
          </div>
        </div>
    );
  }
}

export default Share;