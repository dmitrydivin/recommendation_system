import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loader from "../Loader";
import ImageHandler from "../ImageHandler";
import UnsplashImage from "../UnsplashImage";

const WrapperImages = styled.section`
  max-width: 80rem;
  margin: 4rem auto;
  display: grid;
  grid-gap: 1em;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-auto-rows: 300px;
`;

export default function SimilarPhotos(props) {
    const {
        similarPhotoId,
        authUserId,
        serviceUrl,
        throttling,
        onPhotoSelected = () => {},
        onPhotoLiked = () => {},
        rows = 4
    } = props;
    const [photos, setPhotos] = useState([]);

    useEffect(() => {
        setPhotos([]);
        fetchPhotos();
    }, [similarPhotoId, authUserId]);

    async function fetchPhotos() {
        const response = await fetch(`${serviceUrl}/api/photos/${similarPhotoId}/similar?throttling=${throttling}&limit=${4 * rows}`, {
            headers: {
                'Content-Type': 'application/json',
                'AUTH_USER_ID': authUserId,
            },
        });
        if (response.ok) {
            const items = await response.json();
            setPhotos([...photos, ...items]);
        }
    }

    return (
        <InfiniteScroll next={fetchPhotos}
                        hasMore={true}
                        loader={<Loader/>}
                        dataLength={photos.length}>
            <WrapperImages>
                {photos.map((image, index) => {
                    const {id, url, title} = image;
                    return (
                        <ImageHandler key={index} title={title}
                                      onImageSelected={onPhotoSelected.bind(null, id)}
                                      onLiked={onPhotoLiked.bind(null, id)}>
                            <UnsplashImage url={url}/>
                        </ImageHandler>
                    );
                })}
            </WrapperImages>
        </InfiniteScroll>
    );
}