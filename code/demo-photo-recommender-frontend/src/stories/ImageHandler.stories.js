import React from 'react';
import UnsplashImage from "../components/UnsplashImage";
import ImageHandlerComponent from "../components/ImageHandler";

export default {
    title: 'Components'
}

export function ImageHandler() {
    return (
        <ImageHandlerComponent title="My title" onLiked={()=> alert("The image is liked")} onImageSelected={() => alert("The image is selected")}>
            <UnsplashImage url="https://images.unsplash.com/photo-1549737524-aef1a1f12ccd"/>
        </ImageHandlerComponent>
    );
}