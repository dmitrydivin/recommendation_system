import React, {useState} from 'react';
import SimilarPhotosComponent from "../components/SimilarPhotos";

export default {
    title: 'Components'
}

export function SimilarPhotos() {
    const [similarPhotoId, setSimilarPhotoId] = useState(45);
    return (
        <div className="container">
            <SimilarPhotosComponent serviceUrl="http://localhost:6006" authUserId={0} similarPhotoId={similarPhotoId} onPhotoSelected={setSimilarPhotoId} throttling={0.3} rows={3}/>
        </div>
    );
}
