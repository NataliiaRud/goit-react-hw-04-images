import { useState } from "react";
import { Searchbar } from "./Searchbar/Searchbar";
import { ImageGallery, resetSearch } from "./ImageGallery/ImageGallery";
import { AppContainer } from "./App.styled";

export const App =()=> {
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(1);

  const onSubmit = value => {
    setSearchValue(value);
    setPage(1);
  };

  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };
  

      return (<AppContainer>
        <Searchbar onSubmit={onSubmit} />
        <ImageGallery searchTerm={searchValue} page={page} loadMore={loadMore}/>
      </AppContainer>
      );
    
  
  };