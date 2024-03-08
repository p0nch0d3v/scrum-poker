import { FunctionalComponent } from "preact";
import HeaderComponent from '../header/header.component'

type LayoutsProps = {
    children: any
}

const LayoutComponent: FunctionalComponent<LayoutsProps> = ({ children }) => {
    return (
        <>
            <HeaderComponent />
            <>{children}</>
        </>)
}

export default LayoutComponent;
