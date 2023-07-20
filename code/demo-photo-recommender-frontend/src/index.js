import React, {useEffect, useState} from "react";
import { createRoot } from "react-dom/client";
import PhotoRecommender from "./components/PhotoRecommender";
import {v4 as uuidv4} from 'uuid';

function getServiceUrl() {
    const {href} = window.location;
    if (href.endsWith("/")) {
        return href.substring(0, href.length - 1);
    }
    return href
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function PhotoRecommenderWrapper() {
    const serviceUrl = getServiceUrl();
    const [authUserId, setAuthUserId] = useState();

    async function createOrGetUser() {
        let uuid = getCookie('AUTH_UUID');
        if (!uuid) {
            uuid = uuidv4();
            document.cookie = `AUTH_UUID=${uuid}`;
        }
        const res = await fetch(`${serviceUrl}/api/user?uuid=${uuid}`, {method: 'post'});
        const userId = await res.json();
        setAuthUserId(userId);
    }

    useEffect(() => {
        createOrGetUser();
    }, []);
    if (authUserId) {
        return (<PhotoRecommender serviceUrl={serviceUrl} authUserId={authUserId}/>);
    } else {
        return null;
    }
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<PhotoRecommenderWrapper/>);