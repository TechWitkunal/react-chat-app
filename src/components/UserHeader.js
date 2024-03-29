import React, { useState } from 'react';
import '../css/userHeader.css'

import { toggleTheme } from '../redux/slice/appSlice';
import { signOut } from '../redux/slice/authSlice';
import { useNavigate } from 'react-router-dom';

import { useDispatch } from 'react-redux';

import ClickComponent from '../utils/ClickComponent';

export default function UserHeader({searchValue, setSearchValue}) {
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleMenuItemClick = (option) => {
    if (option === 'toggleTheme') {
      dispatch(toggleTheme());
    }
    if (option === 'logout') {
      localStorage.clear();
      dispatch(signOut());
      navigate("/login");
    }
    if (option === 'profile') {
      navigate("/profile");
    }
    setOpen(false); // Close the menu after clicking an item
  };

  let pathSlashMenuName = ["Change theme", "Profile", "Logout"];
  let pathSlashMenuNavigate = ["toggleTheme", "profile", "logout"];

  return (
    <div className='d-flex m-2 user-header' direction="row" spacing={2} sx={{ marginLeft: '10px', marginTop: '10px', display: 'flex', alignItems: 'center' }}>
      <div className="search-box">
        <svg className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="SearchIcon"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14"></path></svg>
        <input value={searchValue} onChange={(e) => {setSearchValue(e.target.value)}} type="search" placeholder='Search' className='contact-search-field' />
      </div>
      <div>
        <ClickComponent pathSlashMenuName={pathSlashMenuName} pathSlashMenuNavigate={pathSlashMenuNavigate} open={open} setOpen={setOpen} handleMenuItemClickPathSlash={handleMenuItemClick}/>
      </div>
    </div>
  );
}
