import React from 'react';
import UnsplashImageComponent from "../components/UnsplashImage";

export default {
    title: 'Components'
}

export function UnsplashImage() {
    return (
        <div className="container">
            <UnsplashImageComponent url="https://images.unsplash.com/photo-1549737524-aef1a1f12ccd"/>
        </div>
    );
}