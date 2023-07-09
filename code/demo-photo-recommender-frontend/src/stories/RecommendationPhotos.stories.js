import React, {useState} from 'react';
import RecommendationPhotosComponent from "../components/RecommendationPhotos";
import {useInterval} from "usehooks-ts";


export default {
    title: 'Components'
}

export function RecommendationPhotos() {
    const serviceUrl = "http://localhost:6006"
    async function handleOnLike(photoId) {
        await fetch(`${serviceUrl}/api/photos/${photoId}/like`, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'AUTH_USER_ID': 0,
            },
        });
        await refreshUserExperience();
    }

    async function refreshUserExperience() {
        await fetch(`${serviceUrl}/api/user/experience/rollup?recentTime=60000`, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'AUTH_USER_ID': 0,
            },
        });
    }

    useInterval(refreshUserExperience, 5000);

    async function resetUser() {
        await fetch(`${serviceUrl}/api/user/history`, {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
                'AUTH_USER_ID': 0,
            },
        });
        await fetch(`${serviceUrl}/api/user/interests`, {
            method: 'post',
            body: JSON.stringify([]),
            headers: {
                'Content-Type': 'application/json',
                'AUTH_USER_ID': 0,
            },
        });
        window.document.location.reload();
    }

    return (
        <div className="container">
            <div className="sticky-top">
                <button onClick={resetUser}>Reset User</button>
            </div>

            <RecommendationPhotosComponent serviceUrl={serviceUrl} authUserId={0} throttling={0.3} onPhotoLiked={handleOnLike} rows={3}/>
        </div>
    );
}
