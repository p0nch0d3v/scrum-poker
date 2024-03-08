import { FunctionComponent } from "react";
import HeaderComponent from '../header/header.component'

type LayoutsProps = {
    children: any
}

const LayoutComponent: FunctionComponent<LayoutsProps> = ({ children }) => {
    return (
        <>
            <HeaderComponent />
            <>{children}</>
        </>)
}

export default LayoutComponent;
