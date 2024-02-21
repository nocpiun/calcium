import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import Axios from "axios";

import useEmitter from "@/hooks/useEmitter";
import Logger from "@/utils/Logger";

const fetchURL = "https://api.github.com/repos/nocpiun/calcium/releases";

interface RepoReleaseAsset {
    name: string
    size: number
    browser_download_url: string
}

interface RepoReleaseResponse {
    html_url: string
    tag_name: string
    name: string
    assets: RepoReleaseAsset[]
    body: string
}

const ReleasesIndialogPage: React.FC = () => {
    const [list, setList] = useState<RepoReleaseResponse[]>();

    const handleTitleClick = (releaseItem: RepoReleaseResponse) => {
        window.open(releaseItem.html_url);
    };

    useEmitter([
        ["release-indialog-open", () => {
            if(list) return;

            Axios.get<RepoReleaseResponse[]>(fetchURL).then((res) => {
                setList(res.data);
            }).catch((err) => {
                Logger.error("Axios cannot fetch release list from Github, ERROR: "+ err);
            });
        }]
    ]);

    return (
        <div className="release-list">
            {list && list.map((releaseItem, index) => {
                return (
                    <div className="release-list-item" key={index}>
                        <div className="release-list-item-header">
                            <h1 onClick={() => handleTitleClick(releaseItem)}>{releaseItem.name}</h1>
                        </div>
                        <div className="release-list-item-body">
                            <ReactMarkdown linkTarget="_blank">{releaseItem.body}</ReactMarkdown>
                        </div>
                        {releaseItem.assets.length > 0 && <div className="release-assets-list">
                            {releaseItem.assets.map((asset, index) => {
                                return (
                                    <div className="release-assets-list-item" key={index}>
                                        <div className="release-assets-list-item-name">
                                            <a href={asset.browser_download_url} target="_blank" rel="noreferrer">{asset.name}</a>
                                        </div>
                                        <div className="release-assets-list-item-size">{(asset.size / 1024 / 1024).toFixed(2) +" MB"}</div>
                                    </div>
                                );
                            })}
                        </div>}
                    </div>
                );
            })}
        </div>
    );
}

export default ReleasesIndialogPage;
