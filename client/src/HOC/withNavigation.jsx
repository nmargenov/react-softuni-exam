import { useLocation } from "react-router";

export default function withNavigation(Component) {
    const WithNavigation = (props) => {
        const location = useLocation();
        return <Component {...props} location={location} />
    }

    return WithNavigation;
}