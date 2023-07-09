import React, {useState} from 'react';
import styled from 'styled-components';
import {Heart, HeartFill} from 'react-bootstrap-icons';

const ImageWrapper = styled.div`
  cursor: pointer;
  position: relative;
  display: inline-block;
  
  &:hover {
    div {
      display: flex;
    }
  }
`

const ImageOverlay = styled.div`
  display: none;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 35px;
  padding: 2px;
  background: linear-gradient(to bottom, transparent, gray);
  justify-content: space-between;
  padding-left: 5px;
  padding-right: 5px;
  align-items: center;
`

const ImageTitle = styled.span`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  color: white;
`

const LikeButton = styled.span`
  border-radius: 4px;
  background-color: white;
  min-height: 28px;
  min-width: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    vertical-align: middle;
  }
`

export default function ImageHandler(props) {
    const {children, onImageSelected = () => {}, onLiked = () => {}, title} = props;
    const [liked, setLiked] = useState(false);

    function handleOnLike(e) {
        e.stopPropagation();
        if (!liked) {
            setLiked(true);
            onLiked();
        }
    }

    function handleOnImageSelect(e) {
        onImageSelected();
    }

    return (
        <ImageWrapper onClick={handleOnImageSelect}>
            {children}
            <ImageOverlay>
                <ImageTitle>{title}</ImageTitle>
                <LikeButton onClick={handleOnLike}>
                    {liked ? <HeartFill color="red" size={16}/> : <Heart color="gray" size={16}/>}
                </LikeButton>
            </ImageOverlay>
        </ImageWrapper>
    );
}