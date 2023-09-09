import {useState} from 'react';
import {Box, ImageList, ImageListItem} from '@mui/material';

const itemData = [
    'https://images.unsplash.com/photo-1549388604-817d15aa0110',
    'https://images.unsplash.com/photo-1525097487452-6278ff080c31',
    'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6',
    'https://images.unsplash.com/photo-1563298723-dcfebaa392e3',
    'https://images.unsplash.com/photo-1588436706487-9d55d73a39e3',
    'https://images.unsplash.com/photo-1574180045827-681f8a1a9622',
    'https://images.unsplash.com/photo-1530731141654-5993c3016c77',
    'https://images.unsplash.com/photo-1481277542470-605612bd2d61',
    'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7',
    'https://images.unsplash.com/photo-1516455207990-7a41ce80f7ee',
    'https://images.unsplash.com/photo-1597262975002-c5c3b14bbd62',
    'https://images.unsplash.com/photo-1519710164239-da123dc03ef4',
];

const Homepage = () => {
    const [items, setItems] = useState(itemData);
    const [selectedUrl, setSelectedUrl] = useState('http://localhost:4000/pizza.jpeg');
    
    const [openEmail, setOpenEmail] = useState(false);
  
    const handleButtonGroupClick = (event) => {
      event.stopPropagation();
    };
  
    const handleEmailClickOpen = () => {
      setOpenEmail(true);
    };
  
    const handleEmailClose = () => {
      setOpenEmail(false);
    };

    const handleSubmit = async () => {
        const prompt = document.getElementById('prompt');
        const resp = await fetch('http://localhost:4000/generate', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'prompt': prompt.value,
                'image_url': selectedUrl,
                'qr_url': 'http://localhost:4000/qr.jpg',
            })
        });
        setItems(await resp.json());
        prompt.value = '';
    };

    return (
        <div>
            <div className='home-page'>
                <div className='home-left-container'>
                    {/* <PromtInput/> */}
                    <Box sx={{ width: '100%', height: '100%', overflowY: 'scroll' }}>
                        <ImageList variant="masonry" cols={3} gap={8} sx={{ margin: '0' }}>
                            {items.map((item) => (
                                <ImageListItem sx={{ '&:hover': { boxShadow: '5px 5px 10px 10px #efd9f5', zIndex: '0' } }} key={item} onClick={handleEmailClickOpen}>
                                    <img
                                        src={item}
                                        loading="lazy"
                                    />
                                </ImageListItem>
                            ))}
                            <DialogBox open={openEmail} handleClose={handleEmailClose}/>
                        </ImageList>
                    </Box>
                </div>
                <div className='home-right-container'>
                    <div className='input-section'>
                        <h2 className='left-header'>Describe the design you'd like to create:</h2>
                        
                        <textarea id='prompt' name='prompt' className='promt-input' rows="10" cols="30" placeholder='Enter your prompt!' />
                        <input className='promt-btn' type='submit' name='submit' value="Create" onClick={handleSubmit} />
                        
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Homepage;