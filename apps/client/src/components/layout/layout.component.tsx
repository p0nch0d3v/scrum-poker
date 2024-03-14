import { FunctionComponent } from "react";
import HeaderComponent from '../header/header.component'

type LayoutProps = {
    children: any
}

const LayoutComponent: FunctionComponent<LayoutProps> = ({ children }) => {
    return (
        <>
            <HeaderComponent />
            <>{children}</>
        </>)
}

export default LayoutComponent;
