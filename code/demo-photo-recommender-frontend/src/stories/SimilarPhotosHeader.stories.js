import React from 'react';
import SimilarPhotosHeaderComponent from "../components/SimilarPhotosHeader";

export default {
    title: 'Components'
}

export function SimilarPhotosHeader(props) {
    return (
        <SimilarPhotosHeaderComponent photoId={1} serviceUrl="http://localhost:6006"/>
    );
}