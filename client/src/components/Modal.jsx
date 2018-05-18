import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import styles from '../styles/modal-style.css';

// const CSS = styles._getCss();

const Modal = ({isOpen, children, color}) => {
  
  const transitions = {
    enter: styles['fade-enter'],
    enterActive: styles['fade-enter-active'],
    exit: styles['fade-exit'],
    exitActive: styles['fade-exit-active']
  }
  return (
      <div>
        <TransitionGroup>
          <CSSTransition classNames={transitions} timeout={200} key={isOpen}>
            {isOpen ? 
              <div id="modal" 
                className={styles['modal-wrapper']} 
                style={{backgroundColor: color}}>
                {children}
              </div>
              : <div></div>
            }
          </CSSTransition>
        </TransitionGroup>
      </div>
  );    
};

export default Modal;
