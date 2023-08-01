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
            <div className="d-flex justify-content-between align-items-center flex-wrap">
                <div className="d-flex justify-content-start align-items-center gap-2 flex-wrap mb-1">
                    <h1 className="fw-lighter mb-0 pb-0">Recommended Photos</h1>
                    {interests.length > 0 ? (
                        <>
                            <div className="vr mt-1 mb-1 d-none d-lg-block"/>
                            <div className="d-flex flex-wrap gap-1">
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
                <button type="button" className="btn btn-dark d-none d-md-block" onClick={onTryAgain}>Try again</button>
                <button type="button" className="btn btn-dark d-md-none flex-fill" onClick={onTryAgain}>Try again</button>
            </div>
            <hr className="mb-1"/>
        </div>
    );
}