import React from 'react';
import RecommendationSettingsComponent from "../components/RecommendationSettings";

export default {
    title: 'Components'
}


export function RecommendationSettings() {
    const serviceUrl = "http://localhost:6006"
    return (
        <RecommendationSettingsComponent serviceUrl={serviceUrl} onChanged={(it) => alert("settings was changed: " + JSON.stringify(it))}/>
    );
}