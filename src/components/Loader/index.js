import { useEffect } from "react";
import ReactDOM from "react-dom";
import propTypes from 'prop-types';
import {delay} from '../../utils/formatTime'
import { Overlay } from "./style"

export default function Loader ({ isLoading }) {

    useEffect(() => {
        async function load() {
            await delay(700);
        }
        load()
    }, [isLoading])
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