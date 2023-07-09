import React from 'react';
import styled from 'styled-components';

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export default function UnsplashImage({ url }) {
    return <Img src={`${url}?fm=jpg&w=1080&q=80&fit=max`} alt="" />
}