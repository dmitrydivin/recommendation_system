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
export default function RecommendationPhotos(props) {
    const {
        authUserId,
        serviceUrl,
        throttling,
        onPhotoSelected = () => {},
        onPhotoLiked = () => {},
        rows = 4
    } = props;
    const [photos, setPhotos] = useState([]);
    const [viewed, setViewed] = useState([]);

    useEffect(() => {
        setPhotos([]);
        setViewed([]);
        fetchPhotos();
    }, [authUserId]);

    async function fetchPhotos() {
        if (viewed.length > 0) {
            await fetch(`${serviceUrl}/api/photos/${viewed.join(',')}/viewed`, {
                method: 'put',
                headers: {
                    'Content-Type': 'application/json',
                    'AUTH_USER_ID': authUserId,
                },
            });
        }
        const response = await fetch(`${serviceUrl}/api/recommendations?throttling=${throttling}&limit=${4 * rows}&hitRate=0.0`, {
            headers: {
                'Content-Type': 'application/json',
                'AUTH_USER_ID': authUserId,
            },
        });
        if (response.ok) {
            const items = await response.json();
            setPhotos([...photos, ...items]);
            setViewed(items.map(it => it.id));
        }
    }

    async function handleOnLike(photoId) {
        onPhotoLiked(photoId);
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
                                      onLiked={handleOnLike.bind(null, id)}>
                            <UnsplashImage url={url}/>
                        </ImageHandler>
                    );
                })}
            </WrapperImages>
        </InfiniteScroll>
    );
}