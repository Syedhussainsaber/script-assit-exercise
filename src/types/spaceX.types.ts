export interface Launch {
    id: string;
    name: string;
    date_utc: string;
    date_local: string;
    success: boolean;
    details: string | null;
    links: {
      patch: {
        small: string | null;
        large: string | null;
      };
      webcast: string | null;
      article: string | null;
      wikipedia: string | null;
    };
    rocket: string;
    launchpad: string;
    payloads: string[];
    crew: string[];
    flight_number: number;
    upcoming: boolean;
    cores: {
      reused: boolean;
      landing_success: boolean | null;
      landing_type: string | null;
      landpad: string | null;
    }[];
  }
  
  export interface Rocket {
    id: string;
    name: string;
    type: string;
    active: boolean;
    stages: number;
    boosters: number;
    cost_per_launch: number;
    success_rate_pct: number;
    first_flight: string;
    country: string;
    company: string;
    height: {
      meters: number;
      feet: number;
    };
    diameter: {
      meters: number;
      feet: number;
    };
    mass: {
      kg: number;
      lb: number;
    };
    payload_weights: {
      id: string;
      name: string;
      kg: number;
      lb: number;
    }[];
    description: string;
    flickr_images: string[];
    wikipedia: string;
  }
  
  export interface CrewMember {
    id: string;
    name: string;
    agency: string;
    image: string;
    wikipedia: string;
    launches: string[];
    status: string;
  }
  
  export interface Launchpad {
    id: string;
    name: string;
    full_name: string;
    locality: string;
    region: string;
    latitude: number;
    longitude: number;
    details: string;
    status: string;
  }
  
  export interface LaunchesQueryParams {
    limit?: number;
    page?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    success?: boolean;
    upcoming?: boolean;
    year?: number;
    search?: string;
  }