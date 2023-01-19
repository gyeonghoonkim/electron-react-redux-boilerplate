import React, { useEffect } from 'react'
const { ipcRenderer } = window.require("electron");

import SearchAppBar from './Header'
import Contents from './Contents'
import Sidebar from './Sidebar';
import styled from 'styled-components';
// import logo from "../../assets/FullLogo.png"
import { useDispatch } from 'react-redux';
import { initialize } from '../redux/reducer';

const Page = styled.div`
  display : flex;
  flex-direction : row;
  background : gray;
`
const SideSection = styled.div`
  flex-basis : 250px;
  background : #252636;
  border-right : solid #1e1f2b 1px;
  height: 100vh;
  color : #2A2B3D;
  flex-grow : 0;
  flex-shrink : 0;
  display : flex;
  flex-direction : column;
`

const MainSection = styled.div`
  display : flex;
  flex-direction : column;
  flew-grow:1;
  flex-basis : 100%;
  height : 100vh;
  background : black;
`

const HeaderSection = styled.div`
  background : #313348;
  border-bottom : solid #1e1f2b 1px;
`

const ContentsSection = styled.div`
  padding : 18px;
  flex-basis : 100%;
  background : #2A2B3D;
  overflow : auto;
  &::-webkit-scrollbar {
    background: transparent;
    width: 7px;
    height: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #787c96;
    border-radius: 4px;
    
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: #a3a6bf;
  }
`
const LogoSection = styled.div`
  align-content : center;
  img {
      margin-top : 5px;
      width: 250px;
      height: 68px;
      object-fit: cover;
  }
`
const SidebarSection = styled.div`
  overflow : auto;
  height : 500px;
  flex-basis : 100%;
  &::-webkit-scrollbar {
    background: transparent;
    width: 7px;
    height: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #787c96;
    border-radius: 4px;
    
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: #a3a6bf;
  }
`

function DermaView() {

    useEffect(() => {
        ipcRenderer.send("load_idlist", "")
    }, [])

    const dispatch = useDispatch()

    const onLogoClick = () => {
        dispatch(initialize("initialize"))
    }

    return (
        <>
            <Page>
                <SideSection>
                    <LogoSection>
                        <img src="../../app/assets/FullLogo.png" onClick={onLogoClick} style={{ cursor: 'pointer' }}></img>
                    </LogoSection>
                    <SidebarSection>
                        <Sidebar />
                    </SidebarSection>
                </SideSection>
                <MainSection>
                    <HeaderSection>
                        <SearchAppBar />
                    </HeaderSection>
                    <ContentsSection>
                        <Contents />
                    </ContentsSection>
                </MainSection>
            </Page>
        </>
    )
}

export default DermaView
