import { Box } from "@mui/material";
import { FunctionComponent } from "react";
import HeaderComponent from '../header/header.component';

type LayoutProps = {
    children: any
}

const layoutBoxStyle = {
    height: 'calc(100vh - 64px)',
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
