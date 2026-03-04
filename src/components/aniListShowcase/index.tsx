import React from 'react';
import './index.css';
import { useAniList19 } from '../../hooks/useAniList';

const title = 'Anime Listings (AniList GraphQL)';

function AniListShowcase() {
  const data = useAniList19();

  return (
    <section className="layout-column anilist-showcase-container">
      <p className="anilist-title">{title}</p>
      <div className="anilist-grid">
        {data && data.length > 0 ? (
          data.map((anime) => (
            <div key={anime.id} className="anime-card">
              <div className="anime-cover-wrapper">
                <img
                  src={anime.coverImage.large}
                  alt={anime.title.romaji}
                  className="anime-cover"
                />
              </div>
              <div className="anime-info">
                <h3 className="anime-title" title={anime.title.romaji}>
                  {anime.title.romaji}
                </h3>
                {anime.episodes && (
                  <p className="anime-episodes">Episodes: {anime.episodes}</p>
                )}
                {anime.meanScore && (
                  <p className="anime-score">⭐ Score: {anime.meanScore / 10}</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="no-data">No anime listings found</p>
        )}
      </div>
    </section>
  );
}

export default AniListShowcase;
