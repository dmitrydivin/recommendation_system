import React from "react";
import { createRoot } from "react-dom/client";
import PhotoRecommender from "./components/PhotoRecommender";

const serviceUrl = window.serviceUrl || "http://localhost:8080";
const authUserId = window.authUserId || 0;

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<PhotoRecommender serviceUrl={serviceUrl} authUserId={authUserId}/>);