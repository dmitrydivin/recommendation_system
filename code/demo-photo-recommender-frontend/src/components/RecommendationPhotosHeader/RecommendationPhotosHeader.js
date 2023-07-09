import React, {useEffect, useState} from 'react';
import { useInterval} from "usehooks-ts";

export default function RecommendationPhotosHeader(props) {
    const {serviceUrl, authUserId, onTryAgain = () => {}} = props;
    const [interests, setInterests] = useState([]);

    async function loadInterests() {
        const response = await fetch(`${serviceUrl}/api/user/interests?limit=5`, {
            headers: {
                'Content-Type': 'application/json',
                'AUTH_USER_ID': authUserId,
            },
        });
        const data = await response.json();
        setInterests(Object.keys(data));
    }

    async function deleteInterest(interest) {
        await fetch(`${serviceUrl}/api/user/interests/${interest}`, {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
                'AUTH_USER_ID': authUserId,
            },
        });
        loadInterests();
        setInterests(interests.filter(it => it !== interest));
    }

    useEffect(() => {
        loadInterests();
    }, [serviceUrl]);

    useInterval(() => loadInterests(), 5000);
    return (
        <div className="sticky-top bg-white">
            <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex justify-content-start align-items-center gap-3">
                    <h1 className="fw-lighter">Recommended Photos</h1>
                    {interests.length > 0 ? (
                        <>
                            <div className="vr mt-2 mb-2"/>
                            <div className="hstack gap-1">
                                <div className="fw-light">Most important interests:</div>
                                {interests.map((it, index) => {
                                    return (
                                        <div key={index} className="badge text-bg-light border border-dark-subtle d-flex align-items-center gap-1">
                                            <div className="fw-light lh-base">
                                                {it}
                                            </div>
                                            <button type="button" className="btn-close" aria-label="Close" onClick={deleteInterest.bind(null, it)}></button>
                                        </div>
                                    );
                                })}
                            </div>

                        </>
                    ) : null}

                </div>
                <button type="button" className="btn btn-dark" onClick={onTryAgain}>Try again</button>
            </div>
            <hr className="mt-0"/>
        </div>
    );
}