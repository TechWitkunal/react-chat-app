import React, { useState, useRef } from 'react';
import '../css/userHeader.css'

import { toggleTheme } from '../redux/slice/appSlice';
import { signOut } from '../redux/slice/authSlice';
import { useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';

import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import MenuIcon from '@mui/icons-material/Menu'; // Import MenuIcon


export default function UserHeader() {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isDarkTheme = useSelector(state => state.appSlice.isDarkTheme)

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleMenuItemClick = (option) => {
    if (option === 'toggleTheme') {
      dispatch(toggleTheme());
    }
    if (option === 'logout') {
      localStorage.clear();
      dispatch(signOut());
      navigate("/login");
    }
    if (option === 'setting') {
      navigate("/setting");
    }
    setOpen(false); // Close the menu after clicking an item
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  }

  return (
    <div className='d-flex m-2 user-header' direction="row" spacing={2} sx={{ marginLeft: '10px', marginTop: '10px', display: 'flex', alignItems: 'center' }}>
      <div>
        <MenuIcon
          ref={anchorRef}
          id="composition-button"
          aria-controls={open ? 'composition-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        />
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          placement="bottom-start"
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === 'bottom-start' ? 'left top' : 'left bottom',
              }}
            >
              <Paper sx={{ backgroundColor: isDarkTheme ? 'rgb(33, 33, 33, 0.75)' : '#eeeeeefa' }}>
                {/* <Paper sx={{  backgroundColor: 'rgb(33, 33, 33, 0.75)' }}> */}
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id="composition-menu"
                    aria-labelledby="composition-button"
                    onKeyDown={handleListKeyDown}
                  >
                    {/* <MenuItem onClick={() => handleMenuItemClick('Contact')}>Contact</MenuItem> */}
                    <MenuItem onClick={() => handleMenuItemClick('toggleTheme')}>Change theme</MenuItem>
                    <MenuItem onClick={() => handleMenuItemClick('setting')}>Setting</MenuItem>
                    <MenuItem onClick={() => handleMenuItemClick('logout')}>Logout</MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
      {/* input */}
      <div className="search-box">
        <svg className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="SearchIcon"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14"></path></svg>
        <input type="search" placeholder='Search' className='contact-search-field' />
      </div>
    </div>
  );
}
