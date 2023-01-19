import React, { useLayoutEffect, useState } from 'react'
const { ipcRenderer } = window.require("electron");
import { useSelector, useDispatch, batch } from 'react-redux';
const path = require('path')
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TreeView from '@mui/lab/TreeView';
import TreeItem, { treeItemClasses } from '@mui/lab/TreeItem';
import Typography from '@mui/material/Typography';
import FolderIcon from '@mui/icons-material/Folder';
import TopicIcon from '@mui/icons-material/Topic';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { MAKE_FOLDER_TREE, makeFolderTree } from '../redux/reducer';
import { UPDATE_DIRS, updateDirs } from '../redux/reducer';
import { SEARCH_TYPE, setSearchType } from '../redux/reducer';
import { selectImage } from '../redux/reducer';

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
    color: theme.palette.text.secondary,
    [`& .${treeItemClasses.content}`]: {
        color: theme.palette.text.secondary,
        // borderTopRightRadius: theme.spacing(2),
        // borderBottomRightRadius: theme.spacing(2),
        paddingRight: theme.spacing(1),
        fontWeight: theme.typography.fontWeightMedium,
        '&.Mui-expanded': {
            fontWeight: theme.typography.fontWeightRegular,
        },
        '&:hover': {
            // backgroundColor: theme.palette.action.hover,
            backgroundColor: '#1c1d2b',
        },
        '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
            // backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
            backgroundColor: '#171824',
            color: '#b3b4c7',
        },
        [`& .${treeItemClasses.label}`]: {
            fontWeight: 'inherit',
            color: '#b3b4c7',
        },
    },
    [`& .${treeItemClasses.group}`]: {
        marginLeft: 0,
        [`& .${treeItemClasses.content}`]: {
            paddingLeft: theme.spacing(2),
        },
    },
}));

function StyledTreeItem(props) {
    const {
        bgColor,
        color,
        labelIcon: LabelIcon,
        labelInfo,
        labelText,
        onDoubleClick,
        onClick,
        ...other
    } = props;

    return (
        <div style={{ overflowX: 'hidden' }}>
            <StyledTreeItemRoot
                sx={{ width: '100%' }}
                onDoubleClick={onDoubleClick}
                onClick={onClick}
                label={
                    <Box sx={{ display: 'flex', width: 190, alignItems: 'center', p: 0.5, pr: 0 }}>
                        <Box component={LabelIcon} color="inherit" sx={{ mr: 1 }} />
                        <Typography variant="body2" sx={{ fontWeight: 'inherit', flexGrow: 1 }}>
                            {labelText}
                        </Typography>
                        <Typography variant="caption" color="#9595a3">
                            {labelInfo}
                        </Typography>
                    </Box>
                }
                style={{
                    '--tree-view-color': color,
                    '--tree-view-bg-color': bgColor,
                }}
                {...other}
            />
        </div>
    );
}

StyledTreeItem.propTypes = {
    bgColor: PropTypes.string,
    color: PropTypes.string,
    labelIcon: PropTypes.elementType.isRequired,
    labelInfo: PropTypes.string,
    labelText: PropTypes.string.isRequired,
};


export default function Sidebar() {

    const dispatch = useDispatch()

    const [folderTree, setFolderTree] = useState({})

    const [focusedFolder, setFocusedFolder] = useState("")

    useLayoutEffect(() => {
        console.log('uselayouteffect')
        ipcRenderer.send("request_dirs", "")
        ipcRenderer.on("load_dirs", (event, payload) => {
            // payload.map((dir) => console.log(dir))
            const folderTreePayload = payload
            setFolderTree(folderTreePayload)
            // console.log('test1')
            // console.log(folderTree['2002'])
            // console.log('test2')
            // console.log(folderTreePayload['2002'])

            // dispatch(makeFolderTree(payload))

        })
    }, [])
    // const folderTree = useSelector(state => state.foldertree)
    // const test = Object.keys(folderTree).map((item, index) => (
    //     <div>
    //         {(Object.keys(folderTree).length !== 0) && <p>test{folderTree[item]}</p>}
    //     </div>
    // ))
    // const onClickFolder = () => {
    //     // ipcRenderer.send('folder_clicked', { focusedFolder })
    //     console.log('folder clicked!')
    // }

    const FolderTreeView = (Object.keys(folderTree).length === 0) ? (<div></div>) : Object.keys(folderTree).reverse().map((year, idx) => (<div key={`treeview${idx}`}>
        <StyledTreeItem key={`year${year}`} nodeId={year} labelText={year} labelIcon={FolderIcon} >
            {Object.keys(folderTree[year].length !== 0) && Object.keys(folderTree[year]).map((month, idx) => (
                <StyledTreeItem key={`month${month}`} nodeId={month} labelText={month} labelIcon={TopicIcon} >
                    {folderTree[year][month].split(',').map((day, idx) => (
                        <StyledTreeItem key={`day${day}`} nodeId={day} labelText={day} labelIcon={FolderOpenIcon} onClick={() => {
                            dispatch(selectImage([]))
                            console.log([year, month, day].toString())
                            ipcRenderer.send('folder_clicked', [year, month, day])
                            ipcRenderer.on("send_folder_dirs", (event, payload) => {
                                batch(() => {
                                    dispatch(setSearchType("byDate"))
                                    dispatch(updateDirs(payload))
                                })
                            })
                        }} />
                    ))}
                </StyledTreeItem>
            ))}
        </StyledTreeItem>
    </div>))

    return (
        <>
            <TreeView
                aria-label="folder-tree"
                // defaultExpanded={['3']}
                defaultCollapseIcon={<ArrowDropDownIcon sx={{ color: '#a1a2b5' }} />}
                defaultExpandIcon={<ArrowRightIcon sx={{ color: '#a1a2b5' }} />}
                defaultEndIcon={<div style={{ width: 24 }} />}
                sx={{ flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
            >
                {FolderTreeView}
            </TreeView>
        </>
    )

}
