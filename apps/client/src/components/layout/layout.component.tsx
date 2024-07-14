import { Box } from "@mui/material";
import { FunctionComponent } from "react";
import HeaderComponent from '../header/header.component';

type LayoutProps = {
    children: any
}

const layoutBoxStyle = {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
}

const LayoutComponent: FunctionComponent<LayoutProps> = ({ children }) => {
    return (
        <>
            <HeaderComponent />
            <Box sx={layoutBoxStyle}>{children}</Box>
        </>)
}

export default LayoutComponent;
