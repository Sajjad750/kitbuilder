import React from 'react';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = () => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      border: '1px solid rgba(255, 255, 255, 0.3)',  // Semi-transparent white for border
      borderRadius: '4px',
      padding: '4px 8px',
      backgroundColor: 'rgba(211, 211, 211, 0.3)', // Light grey with transparency
    }}>
      <IconButton style={{padding: '0', marginLeft: '8px', color: 'white'}}>
        <SearchIcon />
      </IconButton>
      <InputBase
        className='nunito-r'
        placeholder="Search your shirt type here..."
        inputProps={{ 'aria-label': 'search' }}
        style={{
          flex: 1,
          marginLeft: '8px',
          color: 'white'
        }}
      />
    </div>
  );
}

export default SearchBar;
