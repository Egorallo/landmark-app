export {};

declare global {
  interface Landmark {
    id?: string;
    userId: string;
    userRating: number;
    name: string;
    description: string;
    rating: number;
    totalRating: number;
    visitors: number;
    long: number;
    lat: number;
    images: string[];
  }
}
