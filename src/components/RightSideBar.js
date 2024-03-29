/* eslint-disable react/jsx-no-target-blank */
import React, { useEffect, useState } from 'react';
import '../css/rightSideBar.css';
import '../index.css';
import { useDispatch, useSelector } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';
import { updateSelectedContact } from '../redux/slice/appSlice';
import { Box, Modal, ThemeProvider } from '@mui/material';

import InfoIcon from '@mui/icons-material/Info';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Button, Image } from 'antd';
import { documentFormats, imageFormats, videoFormats } from '../constants/fileFormate';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import DownloadIcon from '@mui/icons-material/Download';
import { Segmented } from 'antd';
import { limitSentence } from '../utils/limitedSentence';

const { v4: uuidv4 } = require('uuid');

const RightSideBar = () => {
  const appSlice = useSelector(state => state.appSlice);
  const selectedChat = useSelector(state => state.appSlice?.selectedContact);
  const dispatch = useDispatch();

  const [openModal, setOpenModal] = useState(false);
  const handleModalOpen = () => { setOpenModal(true) };
  const handleModalClose = () => { setOpenModal(false) };

  const [files, setFiles] = useState(null);
  const [allImage, setAllImage] = useState(null);
  const [allVideo, setAllVideo] = useState(null);
  const [allDocument, setAllDocument] = useState(null);

  const [selectedFileType, setSelectedFileType] = useState("Photos");



  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "33rem",
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    overflowY: "auto",
    height: "49rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };
  const isImage = (file) => { return imageFormats.includes('image/' + file.fileUrl.split("%2F").pop().split("_")[0]) };

  const isVideo = (file) => { return videoFormats.includes('video/' + file.fileUrl.split("%2F").pop().split("_")[0]) };

  const isDocument = (file) => { return documentFormats.includes('application/' + file.fileUrl.split("%2F").pop().split("_")[0]) };


  useEffect(() => {
    let allFile = [...appSlice.allMessages].reverse();
    let threeFiles = [];

    const filteredFiles = allFile && Object.values(allFile).filter(file => file.type !== "Text" && (isImage(file) || isVideo(file) || isDocument(file)));
    const image = allFile && Object.values(allFile).filter(file => file.type !== "Text" && isImage(file));
    const video = allFile && Object.values(allFile).filter(file => file.type !== "Text" && isVideo(file));
    const document = allFile && Object.values(allFile).filter(file => file.type !== "Text" && isDocument(file));

    setAllImage(image);
    setAllVideo(video);
    setAllDocument(document);


    for (let i = 0; i <= 2; i++) { threeFiles.push(filteredFiles[i]); }
    console.log(filteredFiles)
    setFiles(threeFiles)



  }, [appSlice.allMessages])


  const downloadFile = (url) => {
    console.log(url)
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.setAttribute('download', 'download.pdf'); // Set a default filename
    downloadLink.setAttribute('target', '_blank'); // Set a default filename
    console.log(downloadLink);
    downloadLink.click();

  };

  return (
    <>
      <div className="right-bar-header d-flex">
        <CloseIcon onClick={() => { dispatch(updateSelectedContact({ selectedContact: null })) }} />
        <p className="bold text-white">Contact Info</p>
      </div>
      <div className="item-center">
        <img src={selectedChat?.profilePhoto} className='profile-photo' alt="" />
        <p className='bold text-white'>{appSlice.selectedContact?.userName}</p>
        <p className='semi-bold text-white'>{appSlice.selectedContact?.email}</p>
      </div>

      <ThemeProvider
        theme={{
          palette: {
            primary: {
              main: '#212121',
              dark: '#393939',
            },
          },
        }}
      >
        <Box
          style={{
            "margin": "2rem 0",
            "border-radius": "0.2rem",
            "width": "100%",
            "padding": "1rem",
          }}
          sx={{
            width: "100%",
            borderRadius: 1,
            bgcolor: 'primary.main',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
          }}
        >
          <div className="d-flex">
            <InfoIcon />
            <div className="d-column">
              <p className="bold text-white">About</p>
              <p className="semi-bold text-white">{appSlice.selectedContact?.about}</p>
            </div>
          </div>
        </Box>
        <Box
          style={{
            "margin": "2rem 0",
            "borderRadius": "0.2rem",
            "width": "100%",
            "padding": "1rem",
          }}
          sx={{
            width: "100%",
            borderRadius: 1,
            bgcolor: 'primary.main',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
          }}
        >
          <div className="d-column">
            <div className="d-flex justify-bw">
              <p className="semi-bold text-white">Image, Video , docs</p>
              <Button style={{ background: "transparent" }} onClick={() => { handleModalOpen() }}>
                <p className='d-flex text-white gap-0'>12<ArrowForwardIosIcon /></p>
              </Button>

            </div>
            {(files !== null) && Object.keys(files).map(key => {
              return (
                <>
                  {(imageFormats.includes('image/' + files[key]?.fileUrl.split("%2F").pop().split("_")[0])) && (
                    <Image key={uuidv4()} width={`12rem`} height={`12rem`} style={{ margin: "1rem 0" }} src={files[key].fileUrl} />
                  )}

                  {(videoFormats.includes('video/' + files[key]?.fileUrl.split("%2F").pop().split("_")[0])) && (
                    // eslint-disable-next-line react/jsx-no-target-blank
                    <a href={`${files[key]?.fileUrl}`} target='_blank'>
                      <video style={{ "width": "19rem", "height": "11rem", margin: "1rem 0" }} key={uuidv4()} controls autoPlay={false} loop={false} muted={true} playsInline={true} className="custom-video">
                        <source src={files[key]?.fileUrl} type={`video/${files[key]?.fileUrl.split("%2F").pop().split("_")[0]}`} />
                        Your browser does not support the video tag.
                      </video></a>
                  )}

                  {(documentFormats.includes('application/' + files[key]?.fileUrl.split("%2F").pop().split("_")[0])) && (
                    // eslint-disable-next-line react/jsx-no-target-blank
                    <>
                      <ThemeProvider
                        theme={{
                          palette: {
                            primary: {
                              main: '#484848',
                              dark: '#393939',
                            },
                          },
                        }}
                      >
                        <Box
                          style={{
                            "height": "5rem",
                            "width": "17rem",
                            "margin": "2rem 0",
                          }}
                          sx={{
                            borderRadius: 1,
                            padding: "0 1rem",
                            bgcolor: 'primary.main',
                            margin: "1rem 0",
                            '&:hover': {
                              bgcolor: 'primary.dark',
                            },
                          }}
                          className="d-flex"
                        >
                          <div className="d-flex gap-0" style={{ "justify-content": "space-between", "width": "100%" }}>
                            <DocumentScannerIcon />
                            <p className="text-white bg-clear bold">
                              {files[key].text !== "" ? limitSentence(files[key].text, 10) : "Document"}
                            </p>
                            {/* <a href={`${filteredMessages[key].fileUrl}`} className='no-decoration m-0 item-center' target='_blank' download={true}> */}
                            <DownloadIcon style={{
                              margin: "0 1rem",
                              cursor: "pointer"
                            }}
                              onClick={() => { downloadFile(files[key]?.fileUrl) }}
                            />
                            {/* </a> */}
                          </div>
                        </Box>
                      </ThemeProvider>
                    </>
                  )}
                </>
              )
            })}
          </div>
        </Box>
      </ThemeProvider>
      <Modal
        open={openModal}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className='d-flex pointer'>
            <CloseIcon onClick={() => { handleModalClose() }} />
            <Segmented
              options={['Photos', 'Videos', 'Document',]}
              onChange={(value) => { setSelectedFileType(value) }} />
          </div>
          {(selectedFileType === "Photos" && allImage !== null) && Object.keys(allImage).map(key => (
            <div style={{ margin: "1rem 0" }}>
              <Image key={uuidv4()} width={`12rem`} height={`12rem`} style={{ margin: "1rem 0" }} src={allImage[key].fileUrl} />
            </div>
          ))}

          {(selectedFileType === "Videos" && allVideo !== null) && Object.keys(allVideo).map(key => (
            <div style={{ margin: "1rem 0" }}>
              <a href={`${allVideo[key]?.fileUrl}`} target='_blank'>
                <video style={{ "width": "19rem", "height": "11rem", margin: "1rem 0" }} key={uuidv4()} controls autoPlay={false} loop={false} muted={true} playsInline={true} className="custom-video">
                  <source src={allVideo[key]?.fileUrl} type={`video/${allVideo[key]?.fileUrl.split("%2F").pop().split("_")[0]}`} />
                  Your browser does not support the video tag.
                </video></a>
            </div>
          ))}

          {(selectedFileType === "Document" && allDocument !== null) && Object.keys(allDocument).map(key => (
            <div style={{ margin: "1rem 0" }}>
              <>
                <ThemeProvider
                  theme={{
                    palette: {
                      primary: {
                        main: '#484848',
                        dark: '#393939',
                      },
                    },
                  }}
                >
                  <Box
                    style={{
                      "height": "5rem",
                      "width": "20rem",
                      "margin": "2rem 0",

                    }}
                    sx={{
                      borderRadius: 1,
                      padding: "0 1rem",
                      bgcolor: 'primary.main',
                      margin: "1rem 0",
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      },
                    }}
                    className="d-flex"
                  >
                    <div className="d-flex gap-0" style={{ "justify-content": "space-between", "width": "100%" }}>
                      <DocumentScannerIcon />
                      <p className="text-white bg-clear bold">
                        {allDocument[key].text !== "" ? limitSentence(allDocument[key].text, 10) : "Document"}
                      </p>
                      {/* <a href={`${filteredMessages[key].fileUrl}`} className='no-decoration m-0 item-center' target='_blank' download={true}> */}
                      <DownloadIcon style={{
                        margin: "0 1rem",
                        cursor: "pointer"
                      }}
                        onClick={() => { downloadFile(allDocument[key]?.fileUrl) }}
                      />
                      {/* </a> */}
                    </div>
                  </Box>
                </ThemeProvider>
              </>
            </div>
          ))}
        </Box>

      </Modal>

    </>
  )
}

export default RightSideBar
