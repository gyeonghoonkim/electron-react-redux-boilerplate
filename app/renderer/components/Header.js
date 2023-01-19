import React, { useEffect, useState, useRef, useLayoutEffect } from 'react'
import { styled, alpha } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
const { ipcRenderer } = window.require("electron");
import { useDispatch, batch, useSelector } from 'react-redux';
import { UPDATE_DIRS, updateDirs } from '../redux/reducer';
import { SEARCH_TYPE, setSearchType } from '../redux/reducer';
import AlertSnackbar from './AlertSnackbar';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import DownloadIcon from '@mui/icons-material/Download';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { selectImage } from '../redux/reducer';

const IconWrapper = styled('div')(({ theme }) => ({
    height: '100%',
    // position: 'absolute',
    // pointerEvents: 'none',
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'flex-end'
}));

const SearchButton = styled(Button)(({ theme }) => ({
    boxShadow: 'none',
    textTransform: 'none',
    fontSize: 16,
    padding: '6px 12px',
    marginRight: '6px',
    lineHeight: 1.5,
    backgroundColor: alpha(theme.palette.common.white, 0.25),
    color: '#D1D5DB',
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.8),
        boxShadow: 'none',
        color: '#313348'
    },
}));

const DownloadButton = styled(IconButton)(({ theme }) => ({
    color: '#D1D5DB',
    '&:hover': {
        color: 'white'
    },
}));

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    marginRight: 10,
    width: 'auto',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: '#D1D5DB',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
    },
}));

const alertMessage = {
    'not8': "8자리 숫자를 입력해주세요.",
    'notNumber': "오직 숫자만 입력해주세요.",
    'notExist': "존재하지 않는 ID입니다."
}


export default function SearchAppBar() {

    // State
    const selected = useSelector(state => state.selected)
    const [searchValue, setSearchValue] = useState("")

    // const [downloadProgress, setDownloadProgress] = useState("none")

    // 최초 실행 useEffect
    useEffect(() => {
        ipcRenderer.on("send_dirs", (event, payload) => {
            // payload.map((dir) => console.log(dir))
            console.log("send_dirs got")
            batch(() => {
                dispatch(setSearchType("byID"))
                dispatch(updateDirs(payload))
                // setOpen(false)
            })
        })
        ipcRenderer.on("search_alert", (event, payload) => {
            console.log(payload)
            setAlertWarning(alertMessage[payload])
            handleClickWarning()
        })
        // ipcRenderer.on("download_progress", (event, payload) => {
        //     setDownloadProgress(payload);
        //     if (payload === 100) {
        //         setAlertSuccess("다운로드 성공");
        //         setDownloadProgress("none")
        //         // setTimeout(() => { setDownloadProgress(0); }, 3000);
        //     }
        // })
        ipcRenderer.on("download_start", (event, payload) => {
            if (payload !== undefined) {
                progress.current.style.display = 'inline';
                dispatch(selectImage([]))
            }
        })
        ipcRenderer.on("download_complete", (event, payload) => {
            progress.current.style.display = 'none';
            setAlertSuccess("다운로드 성공");
            handleClickSuccess()
        })
    }, [])

    const progress = useRef()

    // Alert - Warning
    const [openWarning, setOpenWarning] = useState(false);
    const [alertWarning, setAlertWarning] = useState("")
    const handleCloseWarning = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenWarning(false);
    };
    const handleClickWarning = () => {
        setOpenWarning(true);
    };

    // Alert - Success
    const [openSuccess, setOpenSuccess] = useState(false);
    const [alertSuccess, setAlertSuccess] = useState("")
    const handleCloseSuccess = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSuccess(false);
    };
    const handleClickSuccess = () => {
        setOpenSuccess(true);
    };

    // Search 기능
    const onSearchChange = (e) => {
        setSearchValue(e.target.value)
    }
    const onClickSearchButton = () => {
        dispatch(selectImage([]))
        ipcRenderer.send('search_clicked', { searchValue })
        console.log('button clicked!')
    }
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            onClickSearchButton();
        }
    }


    const selectDir = useRef("")

    const dispatch = useDispatch() // usedispatch라는 Hook는 꼭 여기서 선언해야 한다.

    const onClickDownloadButton = () => {
        if (selected.length === 0) {
            setAlertWarning("사진을 선택해주세요")
            handleClickWarning()
        } else {
            ipcRenderer.send("dir_dialog", selected)
        }
    }

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });


    return (
        <>
            <Snackbar open={openWarning} autoHideDuration={3000} onClose={handleCloseWarning} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert variant="standard" onClose={handleCloseWarning} severity="warning" sx={{ width: '100%' }}>
                    {alertWarning}
                </Alert>
            </Snackbar>
            <Snackbar open={openSuccess} autoHideDuration={3000} onClose={handleCloseSuccess} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert variant="standard" onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
                    {alertSuccess}
                </Alert>
            </Snackbar>
            <Toolbar disableGutters sx={{ padding: '2px 18px' }}>
                <Search>
                    <SearchIconWrapper>
                        <SearchIcon sx={{ color: '#D1D5DB' }} />
                    </SearchIconWrapper>
                    <StyledInputBase
                        onChange={onSearchChange}
                        onKeyDown={handleKeyPress}
                        value={searchValue}
                        placeholder="ID"
                        inputProps={{ 'aria-label': 'search' }}
                    />
                </Search>
                <SearchButton onClick={onClickSearchButton}>Search</SearchButton>
                <IconWrapper>
                    <Box sx={{ m: 1, position: 'relative' }} >
                        <CircularProgress
                            ref={progress}
                            size={37}
                            sx={{
                                color: '#D1D5DB',
                                position: 'absolute',
                                top: '5%',
                                left: '5%',
                                display: 'none',
                            }}
                        // variant="determinate"
                        // value={downloadProgress}
                        />
                        <DownloadButton onClick={onClickDownloadButton}>
                            <DownloadIcon />
                        </DownloadButton>
                    </Box>
                </IconWrapper>
            </Toolbar>
        </>
    );
}