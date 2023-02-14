import ReactDOM from "react-dom";
import propTypes from 'prop-types'

import { Overlay } from "./style";

export default function Loader ({ isLoading }) {
    if(!isLoading) {
        return null;
    }
    return (
        ReactDOM.createPortal(
            <Overlay>
                <div className="loader"/>
            </Overlay>,
            document.getElementById('loader-root')
        )
    )
}

Loader.propTypes = {
    isLoading: propTypes.bool.isRequired,
}