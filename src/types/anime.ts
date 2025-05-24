// types/anime.ts

export interface Anime {
  mal_id: number;
  title: string;
  title_english: string;
  title_japanese: string;
  type: string;
  source: string;
  episodes: number;
  status: string;
  airing: boolean;
  aired: {
    from: string;
    to: string;
    string: string;
  };
  duration: string;
  rating: string;
  score: number;
  scored_by: number;
  rank: number;
  popularity: number;
  members: number;
  favorites: number;
  synopsis: string;
  background: string;
  season: string;
  year: number;
  studios: {
    mal_id: number;
    type: string;
    name: string;
  }[];
  genres: {
    mal_id: number;
    type: string;
    name: string;
  }[];
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
    webp: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
  trailer: {
    youtube_id: string;
    url: string;
    embed_url: string;
  };
  // Adding the properties that were causing errors
  relations?: {
    relation: string;
    entry: {
      mal_id: number;
      type: string;
      name: string;
      url: string;
    }[];
  }[];
  recommendations?: {
    entry: {
      mal_id: number;
      title: string;
      url: string;
      images: {
        jpg: {
          image_url: string;
        };
      };
    };
    url: string;
  }[];
}

export interface Character {
  character: {
    mal_id: number;
    url: string;
    images: {
      jpg: {
        image_url: string;
      };
      webp: {
        image_url: string;
      };
    };
    name: string;
  };
  role: string;
  voice_actors: {
    person: {
      mal_id: number;
      url: string;
      images: {
        jpg: {
          image_url: string;
        };
      };
      name: string;
    };
    language: string;
  }[];
}

export interface AnimeResponse {
  data: Anime[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
    items: {
      count: number;
      total: number;
      per_page: number;
    };
  };
}

export interface AnimeDetailResponse {
  data: Anime;
}

export interface CharactersResponse {
  data: Character[];
}

export interface RelatedAnimeResponse {
  data: {
    relation: string;
    entry: {
      mal_id: number;
      type: string;
      name: string;
      url: string;
    }[];
  }[];
}
