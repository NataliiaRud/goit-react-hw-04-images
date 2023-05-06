import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { createPortal } from 'react-dom';
import { Overlay, ModalContainer } from './Modal.styled';

export const Modal = ({ onModalClose, modalData }) => {
  useEffect(() => {
    const onKeyDown = e => {
      if (e.code === `Escape`) {
        onModalClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);

    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onModalClose]);

  const onBackdropeClick = e => {
    if (e.target === e.currentTarget) {
      onModalClose();
    }
  };

  const { largeImageURL, tags } = modalData;
  return createPortal(
    <Overlay onClick={onBackdropeClick}>
      <ModalContainer>
        <img src={largeImageURL} alt={tags} />
      </ModalContainer>
    </Overlay>,
    document.querySelector('#modal-root')
  );
};

Modal.propTypes = {
  modalData: PropTypes.shape({
    tags: PropTypes.string.isRequired,
    largeImageURL: PropTypes.string.isRequired,
  }),
  onModalClose: PropTypes.func.isRequired,
};
