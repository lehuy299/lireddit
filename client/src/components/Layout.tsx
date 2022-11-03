import NavBar from "./NavBar";
import { Wrapper, WrapperVariant } from "./Wrapper"

interface LayoutProps {
    children: React.ReactNode;
    variant?: WrapperVariant;
}

const Layout: React.FC<LayoutProps> = ({ children, variant }) => {
    return (
        <>
            <NavBar />
            <Wrapper variant={variant}>
                {children}
            </Wrapper>
        </>
    )
}

export default Layout