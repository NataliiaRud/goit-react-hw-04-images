import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getImages } from 'services/api';
import { Loader } from 'components/Loader/Loader';
import { ImageGalleryItem } from 'components/ImageGalleryItem/ImageGalleryItem';
import { GalleryWrapper } from './ImageGallery.styled';
import { Button } from 'components/Button/Button';
import { Modal } from 'components/Modal/Modal';

const ERROR_MSG = 'Something went wrong';

export const ImageGallery = ({ searchTerm, page, loadMore }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('idle');
  const [itemModal, setItemModal] = useState({ img: '', tags: '' });
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [isModalShown, setIsModalShown] = useState(false);

  useEffect(() => {
    if (searchTerm === '') {
      return;
    }
    if (page === 1) {
      setImages([]);
    }
    async function fetchData() {
      try {
        setStatus('pending');
        setLoading(true);

        const res = await getImages(searchTerm, page);
        if (res.data.totalHits === 0) {
          setImages([]);
          setStatus('rejected');
          return;
        }

        setImages(prevImages => [...prevImages, ...res.data.hits]);
        setLoading(true);
        setStatus('resolved');
        setTotalPages(Math.floor(res.data.totalHits / 12));
      } catch (error) {
        setError(ERROR_MSG);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [searchTerm, page]);

  const onModalDisplay = itemModal => {
    setIsModalShown(true);
    setItemModal(itemModal);
  };

  const onModalClose = () => {
    setIsModalShown(false);
  };

  return (
    <>
      {status === 'rejected' && <span>Bad search request! Try again.</span>}
      {loading && <Loader />}
      {error && <div>{error}</div>}
      <GalleryWrapper>
        {[...images].map(item => (
          <ImageGalleryItem
            onImageClick={onModalDisplay}
            item={item}
            key={item.id}
          />
        ))}
      </GalleryWrapper>
      {images.length > 0 && status !== 'pending' && page <= totalPages && (
        <Button onClick={loadMore}>Load More</Button>
      )}
      {isModalShown && (
        <Modal modalData={itemModal} onModalClose={onModalClose} />
      )}
    </>
  );
};

ImageGallery.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  page: PropTypes.number.isRequired,
  loadMore: PropTypes.func.isRequired,
};
