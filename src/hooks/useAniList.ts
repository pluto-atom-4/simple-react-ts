import { useEffect, useState } from 'react';

/**
 * TypeScript interfaces for AniList API response
 */
interface AniListMedia {
  id: number;
  title: {
    romaji: string;
    english?: string;
  };
  coverImage: {
    large: string;
  };
  episodes?: number;
  meanScore?: number;
}

interface AniListResponse {
  data: {
    Page: {
      media: AniListMedia[];
    };
  };
}

interface UseAniListReturn {
  data: AniListMedia[] | null;
  loading: boolean;
  error: string | null;
  retry: () => void;
}

/**
 * Custom hook for fetching anime listings from AniList GraphQL API
 * @returns Object containing data, loading state, error, and retry function
 */
function useAniList(): UseAniListReturn {
  const [data, setData] = useState<AniListMedia[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAniList = async () => {
    setLoading(true);
    setError(null);

    const query = `
      query {
        Page(page: 1, perPage: 12) {
          media(sort: POPULARITY_DESC, type: ANIME) {
            id
            title {
              romaji
              english
            }
            coverImage {
              large
            }
            episodes
            meanScore
          }
        }
      }
    `;

    try {
      const response = await fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const result: AniListResponse = await response.json();

      // Check for GraphQL errors in the response
      if ('errors' in result) {
        throw new Error('Failed to fetch anime listings from AniList API');
      }

      setData(result.data.Page.media);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(`Failed to load anime listings. Please try again. (${errorMessage})`);
      console.error('AniList fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAniList();
  }, []);

  return {
    data,
    loading,
    error,
    retry: fetchAniList,
  };
}

export default useAniList;
