import React, { useRef } from 'react';
import '../css/userHeader.css'

import { useSelector } from 'react-redux';

import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import MoreVertIcon from '@mui/icons-material/MoreVert';


// const [open, setOpen] = useState(false);
// let pathSlashMenuName = ["Change theme", "Profile", "Logout"]
// let pathSlashMenuNavigate = ["toggleTheme", "profile", "logout"]
// const handleMenuItemClickPathSlash = (option) => {
//     if (option === 'toggleTheme') {
//         dispatch(toggleTheme());
//     }
//     if (option === 'logout') {
//         localStorage.clear();
//         dispatch(signOut());
//         navigate("/login");
//     }
//     if (option === 'profile') {
//         navigate("/profile");
//     }
//     setOpen(false); // Close the menu after clicking an item
// };
export default function ClickComponent({ pathSlashMenuName, pathSlashMenuNavigate, open, setOpen, handleMenuItemClickPathSlash }) {

    const anchorRef = useRef(null);
    const isDarkTheme = useSelector(state => state.appSlice.isDarkTheme)

    const handleToggle = () => { setOpen((prevOpen) => !prevOpen); };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) { return; }
        setOpen(false);
    };

    function handleListKeyDown(event) {
        if (event.key === 'Tab') { event.preventDefault(); setOpen(false); }
        else if (event.key === 'Escape') { setOpen(false); }
    }


    return (
        <div className='d-flex m-2 user-header' direction="row" spacing={2} sx={{ marginLeft: '10px', marginTop: '10px', display: 'flex', alignItems: 'center' }}>
            <div>
                <MoreVertIcon
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
                                        {/* <MenuItem onClick={() => handleMenuItemClickPathSlash('toggleTheme')}>Change theme</MenuItem> */}
                                        {/* <MenuItem onClick={() => handleMenuItemClickPathSlash('profile')}>Profile</MenuItem> */}
                                        {/* <MenuItem onClick={() => handleMenuItemClickPathSlash('logout')}>Logout</MenuItem> */}
                                        {pathSlashMenuName && pathSlashMenuName.map((item, index) => {
                                            return (
                                                <MenuItem key={index} onClick={() => handleMenuItemClickPathSlash(pathSlashMenuNavigate[index])}>{item}</MenuItem>
                                            )
                                        })}
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
            </div>
        </div>
    );

}
