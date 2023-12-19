/* eslint-disable react/jsx-no-target-blank */
import React, { useState } from "react";
import axios from "axios";

import './styles/style.scss'

export default function News(props) {
    const [news, setNews] = useState([]);

    const iso2 = props.iso2;

    const getNews = async () => {
        try {
            const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=${iso2}&category=general&apiKey=e47f79fe1bea417cab1ed34393ab9e09`);
            const news = response.data.articles;
            setNews(news);
        } catch (err) {
            console.error(err.message);
        }
    }

    function convertUtcToReadable(utcDateString, locale = 'en-US', timeZone = 'UTC') {
        const options = {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          timeZone,
        };
      
        const utcDate = new Date(utcDateString);
        const readableDate = new Intl.DateTimeFormat(locale, options).format(utcDate);
      
        return readableDate;
    }

    return (
        <div>
            {news.length === 0 && (
                <div className="news-button-container">
                    <button className="get-news-button" onClick={getNews}>Voir les actualités</button>
                </div>
            )}

            {news.length > 0 && (
                <div className="slider-container">
                    {news.map((newl, index) => (
                        <div key={index} className="slider-item">
                            <p className="title">{newl.title}</p>
                            <div className="side-b-side">
                                <p>{newl.author}</p>
                                <p>{convertUtcToReadable(newl.publishedAt, 'fr-FR', 'Europe/Paris')}</p>
                                <p><a className="news-url" href={newl.url} target="_blank">Lire l'article</a></p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}