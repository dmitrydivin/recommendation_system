import React, {useState} from 'react';
import styled from "styled-components";

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
`;

const UnsplashInterestWrapper = styled.div`
  cursor: pointer;
  filter: invert(${props => props.$selected ? 0 : 0.4});
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const InterestTitle = styled.div`
  position: absolute;
  color: white;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  vertical-align: middle;
  padding-left: 5px;
  padding-right: 5px;
`

function UnsplashInterest(props) {
    const {
        interest, onSelected = () => {
        }, imageUrl
    } = props;
    const [selected, setSelected] = useState(false);

    function handleOnSelect() {
        const state = !selected;
        setSelected(state);
        onSelected(state, interest);
    }

    return (
        <UnsplashInterestWrapper onClick={handleOnSelect} $selected={selected}>
            <InterestTitle>{interest}</InterestTitle>
            <Img src={`${imageUrl}?fm=jpg&w=1080&q=80&fit=max`} alt=""/>
        </UnsplashInterestWrapper>
    );
}

const WrapperInterests = styled.section`
  max-width: 80rem;
  margin: 4rem auto;
  display: grid;
  grid-gap: 1em;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  grid-auto-rows: 200px;
`;

export default function RecommendationSettings(props) {
    const {onChanged} = props;
    const [interests, setInterests] = useState([]);

    function handleOnSelectInterest(added, interest) {
        if (added) {
            setInterests([...interests, interest]);
        } else {
            setInterests(interests.filter(it => it !== interest))
        }
    }
    function handleOnStart() {
        onChanged({interests});
    }

    return (
        <div>
            <h1 className="text-center fw-lighter">Preferred Interests</h1>
            <WrapperInterests>
                <UnsplashInterest interest="mountain" onSelected={handleOnSelectInterest}
                                  imageUrl="https://images.unsplash.com/photo-1422837284172-a925ac273aa9"/>
                <UnsplashInterest interest="flower" onSelected={handleOnSelectInterest}
                                  imageUrl="https://images.unsplash.com/37/ic1dX3kBQjGNaPQb8Xel_1920%20x%201280.jpg"/>
                <UnsplashInterest interest="night" onSelected={handleOnSelectInterest}
                                  imageUrl="https://images.unsplash.com/flagged/photo-1557570005-70c0f9fddb8b"/>
                <UnsplashInterest interest="town" onSelected={handleOnSelectInterest}
                                  imageUrl="https://images.unsplash.com/photo-1428342628092-61f9e5d578f2"/>
                <UnsplashInterest interest="animal" onSelected={handleOnSelectInterest}
                                  imageUrl="https://images.unsplash.com/photo-1420820016693-e2450d77cc77"/>
                <UnsplashInterest interest="plant" onSelected={handleOnSelectInterest}
                                  imageUrl="https://images.unsplash.com/photo-1428394667087-b00dfb48cd00"/>
                <UnsplashInterest interest="desert" onSelected={handleOnSelectInterest}
                                  imageUrl="https://images.unsplash.com/photo-1431162020154-5eb22b2456d6"/>
                <UnsplashInterest interest="sea" onSelected={handleOnSelectInterest}
                                  imageUrl="https://images.unsplash.com/photo-1434600705575-4285a88363a8"/>
                <UnsplashInterest interest="tree" onSelected={handleOnSelectInterest}
                                  imageUrl="https://images.unsplash.com/photo-1420593248178-d88870618ca0"/>
                <UnsplashInterest interest="human" onSelected={handleOnSelectInterest}
                                  imageUrl="https://images.unsplash.com/photo-1527734936079-4503237ac2ab"/>
                <UnsplashInterest interest="road"  onSelected={handleOnSelectInterest}
                                  imageUrl="https://images.unsplash.com/photo-1554869663-3a7abdccc86d"/>
                <UnsplashInterest interest="snow"  onSelected={handleOnSelectInterest}
                                  imageUrl="https://images.unsplash.com/photo-1543299697-acf3e9193636"/>
            </WrapperInterests>
            <figure className="text-center">
                <blockquote className="blockquote">
                    <p>Preferred interests are optional for selection: in this case, everything will be shown.</p>
                </blockquote>
                <figcaption className="blockquote-footer">
                    In the recommendations, a "Like" to a photo will enhance interests in it.
                </figcaption>
                <figcaption className="blockquote-footer">
                    Clicking on any photo will open similar.
                </figcaption>
            </figure>
            {/*<h2 className="text-center">Settings</h2>*/}
            <div className="d-flex justify-content-center">
                <button className="btn btn-dark" style={{width: 300}} onClick={handleOnStart}>Get recommendations</button>
            </div>
        </div>
    );
}