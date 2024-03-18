import React, { useEffect } from 'react'
import Contact from '../components/Contact';

import { useSelector } from 'react-redux';

const ChatPage = () => {
  const store = useSelector(state => state.authSlice);

  useEffect(() => {
    if (!store.user) {
      // navigate("/login")
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Contact />
    </>
  )
}

export default ChatPage
