import React from "react";
import LoaderComponent from "../components/Loader";

export default {
    title: 'Components'
}

export function Loader() {
    return (
        <div className="container">
            <LoaderComponent/>
        </div>
    )
}