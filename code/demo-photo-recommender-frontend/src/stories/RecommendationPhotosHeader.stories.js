import React from 'react';
import RecommendationPhotosHeaderComponent from "../components/RecommendationPhotosHeader";

export default {
    title: 'Components'
}

export function RecommendationPhotosHeader() {
    return (
        <RecommendationPhotosHeaderComponent authUserId={0} serviceUrl="http://localhost:6006"/>
    );
}