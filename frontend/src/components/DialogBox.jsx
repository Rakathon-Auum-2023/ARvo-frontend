import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Configuration, OpenAIApi } from "openai";






export default function DialogBox({open, handleClose}) {

    const [textareaValue, setTextareaValue] = useState("")
    

    
    const apiKey = "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";
    const [response, setResponse] = useState('');
    const myPrompt = "You are a content marketing expert tasked with creating a General Email Subject Line content. This General Email Subject Line is about write an short email for doing site visit for a home you have already seen .The tone of voice should be Engaging. Use language that will resonate with Young Professional, age: 13 to 44. Make sure to address this audience’s biggest pain points, which are: - finding a suitable home - location convenience - affordability The collective title for the output should be: General Email Subject Line:"

    const generate = async () => {
        try {
            const result = await axios.post(
              'https://api.openai.com/v1/engines/davinci/completions',
              {
                prompt: textareaValue,
                max_tokens: 50,
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${apiKey}`,
                },
              }
            );
            setResponse(result.data.choices[0].text);
          } catch (error) {
            console.error('Error making OpenAI API request:', error);
          }
        };


    const [send, setSend] = React.useState(false);

    const handleClickSend = () => {
        setSend(true);
    };
  
    const handleAiClickSend = () => {
        setSend(true);
        generate();
    }

    const handleCloseSend = () => {
        setSend(false);
    };

    const handleTextAreaChange = (event) => {
        // Step 3: Update the state variable with the new value
        setTextareaValue(event.target.value);
      };

  return (
    <div>
      <Dialog open={open} onClose={handleClose} sx={{backgroundColor:'white'}}>
        <DialogTitle>Send Email</DialogTitle>
        <DialogContent >
          <DialogContentText>
            To <br/> Property A Viewer • 12 users
          </DialogContentText>
          <br/>
          <Button sx={{margin:'-10px 0px 10px 0px',  border:'0', color:'#c334eb', ':hover':{color:'white', backgroundColor:'#c334eb'}}} variant="outlined" onClick={handleAiClickSend}>
            ✨ AI Assistant
          </Button>
          <TextareaAutosize
            style={{width:'34rem', height:'7.5rem', resize:'none', border:'1px solid black', borderRadius:'3px'}}
            minRows={6}
            placeholder='Write me an Email for...'
            id="name"
            label="Email Address"
            value={textareaValue}
            onChange={handleTextAreaChange}

          />
        </DialogContent>
        <DialogActions sx={{padding:'25px'}}>
          <Button sx={{color:'white', backgroundColor:'#c334eb', ':hover':{color:'#c334eb', backgroundColor:'white'}}} onClick={handleClickSend}>Generate Email</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={send} onClose={handleCloseSend}>
      <DialogTitle>Broadcast</DialogTitle>
        <DialogContent >
          <DialogContentText>
            To <br/> Property A Viewer • 12 users
          </DialogContentText>
          <br/>
          {/* <DialogContentText>
            Subject
          </DialogContentText>
          <br/>
          <TextField
            style={{width:'99.3%',border:'1px solid black', borderRadius:'3px'}}
            id="name"
            fullWidth
            variant="outlined"
          /> */}
          <br/>
          <br/>
          <DialogContentText>
            Email
          </DialogContentText>
          <br/>
          <TextareaAutosize
            style={{width:'34rem', height:'7.5rem', resize:'none', overflowY:' scroll',border:'1.5px solid black', borderRadius:'3px'}}
            minRows={6}
            placeholder='Write me an Email for...'
            id="name"
            label="Email Address"
            value={response}
          />
        </DialogContent>
        <DialogActions sx={{padding:'25px'}}>
          <IconButton aria-label="delete" sx={{marginRight:'auto', border:'1px solid black', borderRadius:'4px',color:'white', backgroundColor:'#c334eb', ':hover':{color:'#c334eb', backgroundColor:'white'}}}>
            <AutoFixHighIcon />
          </IconButton>
          <Button sx={{flexGrow:'0'}} onClick={handleCloseSend}>Cancel</Button>
          <Button sx={{color:'white', backgroundColor:'#c334eb', ':hover':{color:'#c334eb', backgroundColor:'white'}}} onClick={handleCloseSend}>Send</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
