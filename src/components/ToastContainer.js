import { useEffect, useState } from "react";
import {Alert, Snackbar } from '@mui/material';
import { toastManager } from "../utils/toast";

export default function ToastContainer() {

  const [messages, setMessages] = useState([]);
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function handleAddToast({type, text} ) {
      setOpen(true)
      setMessages((prevState) => [
        ...prevState,
        {id: Math.random(), type, text}
      ]);
    }

    toastManager.on('addtoast',handleAddToast)

    return() => {
      toastManager.removeListener('addtoast', handleAddToast)
    }
  },[]);
  
  const handleRemoveMessage = (id) => {
    setOpen(false)
    setMessages((prevState) => prevState.filter((message) => message.id !== id))
  }
  return (
    <>
      {
        messages.map((m) => (
          <Snackbar
            key={m.id}
            open={open}
            onClose={handleRemoveMessage}
            message={m.text}
            autoHideDuration={3000}
          >
            <Alert onClose={handleRemoveMessage} severity={m.type} variant="filled" sx={{ width: '100%' }}>
            {m.text}
          </Alert>
        </Snackbar>
        ))
      }
    </>
  )
}