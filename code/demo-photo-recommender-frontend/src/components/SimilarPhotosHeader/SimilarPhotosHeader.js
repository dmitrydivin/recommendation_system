import React, {useEffect, useState} from 'react';

export default function SimilarPhotosHeader(props) {
    const {photoId, serviceUrl, onClose = () => {}} = props;
    const [imageUrl, setImageUrl] = useState();

    async function loadPhoto() {
        const response = await fetch(`${serviceUrl}/api/photos/${photoId}`);
        if (response.ok) {
            const {url} = await response.json();
            setImageUrl(url);
        }
    }

    useEffect(() => {
        loadPhoto();
    }, [photoId, serviceUrl]);


    if (!imageUrl) {
        return null;
    }

    return (
        <div className="sticky-top bg-white">
            <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex justify-content-start align-items-center gap-3">
                    <img src={`${imageUrl}?fm=jpg&w=1080&q=80&fit=max`} alt="" className="object-fit-contain border rounded" style={{maxHeight: 50}}/>
                    <h1 className="fw-lighter">Similar Photos</h1>
                </div>
                <button type="button" className="btn btn-dark" aria-label="Close" onClick={onClose}>Close</button>
            </div>
            <hr className="mt-0"/>
        </div>
    );
}