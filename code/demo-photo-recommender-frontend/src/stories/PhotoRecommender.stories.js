import React from 'react';
import PhotoRecommenderComponent from "../components/PhotoRecommender";

export default {
    title: 'App'
}

export function PhotoRecommender() {
    return (
        <div className="container">
            <PhotoRecommenderComponent serviceUrl="http://localhost:6006" authUserId={0}/>
        </div>
    );
}