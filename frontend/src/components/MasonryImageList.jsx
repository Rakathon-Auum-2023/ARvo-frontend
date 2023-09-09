import * as React from 'react';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { itemData } from '../static-data/images.data';
import { useSelector, useDispatch } from 'react-redux';
import DialogBox from './DialogBox';

export default function MasonryImageList() {

  const myState = useSelector((state) => state.updateSearch);
  const [openEmail, setOpenEmail] = React.useState(false);

  const handleButtonGroupClick = (event) => {
    event.stopPropagation();
  };

  const handleEmailClickOpen = () => {
    setOpenEmail(true);
  };

  const handleEmailClose = () => {
    setOpenEmail(false);
  };

  return (
    // <div>
    //   <h5>{myState}</h5>

    <Box sx={{ width: '100%', height: '100%', overflowY: 'scroll' }}>
      <ImageList variant="masonry" cols={3} gap={8} sx={{margin:'0'}}>
        {itemData.map((item) => (
          <ImageListItem sx={{'&:hover':{boxShadow:'5px 5px 10px 10px #efd9f5',zIndex:'0'}}} key={item.img} onClick={handleEmailClickOpen}>
            <img
              src={`${item.img}?w=248&fit=crop&auto=format`}
              srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
              alt={item.title}
              loading="lazy"
              
            />
          </ImageListItem>
        ))}
        <DialogBox open={openEmail} handleClose={handleEmailClose}/>
      </ImageList>
    </Box>
    
    // </div>
  );
}


