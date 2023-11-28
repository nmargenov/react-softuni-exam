import { Component  } from "react";
import { Error } from "../Error/Error";
import { Link } from "react-router-dom";
import styles from "./errorBoundary.module.css";

export default class ErrorBoundary extends Component{
    constructor(){
        super();

        this.state = {
            hasError: false,
        }
    }

    static getDerivedStateFromError(err) {
        return {
            hasError: true,
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
          this.setState({ hasError: false });
        }
      }

    render() {
        if (this.state.hasError) {
            return(
                <div className={styles["main-errorBoundary"]}>
                        <Error/>
                        <Link to="/feed">Back to home</Link>
                </div>
            )
        }

        return this.props.children;
    }
}
