import React from 'react';
import {MemoryRouter, Route, Routes, useNavigate, useParams} from 'react-router-dom';
import RecommendationPhotos from "../RecommendationPhotos";
import RecommendationPhotosHeader from "../RecommendationPhotosHeader";
import RecommendationSettings from "../RecommendationSettings";

import SimilarPhotos from "../SimilarPhotos";
import SimilarPhotosHeader from "../SimilarPhotosHeader";
import {useInterval} from "usehooks-ts";


function RecommendationPhotosPage(props) {
    const {serviceUrl, authUserId} = props;
    const navigate = useNavigate();

    async function refreshUserExperience() {
        await fetch(`${serviceUrl}/api/user/experience/rollup?recentTime=60000`, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'AUTH_USER_ID': authUserId,
            },
        });
    }

    useInterval(refreshUserExperience, 5000);

    function handleOnTryAgain() {
        navigate("/");
    }

    async function handleOnPhotoLiked(photoId) {
        await fetch(`${serviceUrl}/api/photos/${photoId}/like`, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'AUTH_USER_ID': authUserId,
            },
        });
        await refreshUserExperience();
    }

    function handleOnPhotoSelected(photoId) {
        navigate(`/photos/${photoId}/similar`);
    }

    return (
        <div className="vstack">
            <RecommendationPhotosHeader serviceUrl={serviceUrl} authUserId={authUserId} onTryAgain={handleOnTryAgain}/>
            <RecommendationPhotos serviceUrl={serviceUrl} authUserId={authUserId}
                                  onPhotoSelected={handleOnPhotoSelected}
                                  onPhotoLiked={handleOnPhotoLiked}
                                  throttling={0.3}
                                  rows={4}
            />
        </div>
    );
}

function SimilarPhotosPage(props) {
    const {serviceUrl, authUserId} = props;
    const {id} = useParams();
    const navigate = useNavigate();

    function handleOnClose() {
        navigate('/recommendations');
    }

    async function handleOnPhotoLiked(photoId) {
        await fetch(`${serviceUrl}/api/photos/${photoId}/like`, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'AUTH_USER_ID': authUserId,
            },
        });
        await fetch(`${serviceUrl}/api/user/experience/rollup?recentTime=60000`, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'AUTH_USER_ID': authUserId,
            },
        });
    }

    function handleOnPhotoSelected(photoId) {
        navigate(`/photos/${photoId}/similar`);
    }

    return (
        <div className="vstack">
            <SimilarPhotosHeader photoId={id}
                                 serviceUrl={serviceUrl}
                                 onClose={handleOnClose}/>
            <SimilarPhotos serviceUrl={serviceUrl}
                           authUserId={authUserId}
                           similarPhotoId={id}
                           onPhotoSelected={handleOnPhotoSelected} onPhotoLiked={handleOnPhotoLiked}
                           rows={4}
            />
        </div>
    );
}

function RecommendationSettingsPage(props) {
    const {serviceUrl, authUserId} = props;
    const navigate = useNavigate();

    async function handleOnChanged({interests}) {
        await fetch(`${serviceUrl}/api/user/history`, {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
                'AUTH_USER_ID': authUserId,
            },
        });
        await fetch(`${serviceUrl}/api/user/interests`, {
            method: 'post',
            body: JSON.stringify(interests),
            headers: {
                'Content-Type': 'application/json',
                'AUTH_USER_ID': authUserId,
            },
        });
        await fetch(`${serviceUrl}/api/user/experience/rollup`, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'AUTH_USER_ID': authUserId,
            },
        });
        navigate(`/recommendations`);
    }

    return (
        <RecommendationSettings onChanged={handleOnChanged}/>
    );
}

export default function PhotoRecommender(props) {
    const {serviceUrl, authUserId} = props;

    return (
        <MemoryRouter>
            <Routes>
                <Route path="/"
                       element={<RecommendationSettingsPage serviceUrl={serviceUrl} authUserId={authUserId}/>}/>
                <Route path="/recommendations"
                       element={<RecommendationPhotosPage serviceUrl={serviceUrl} authUserId={authUserId}/>}/>
                <Route path="/photos/:id/similar"
                       element={<SimilarPhotosPage serviceUrl={serviceUrl} authUserId={authUserId}/>}/>
            </Routes>
        </MemoryRouter>
    );
}