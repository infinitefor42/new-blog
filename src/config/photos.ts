export interface Photo {
  id: number | string;
  url: string;
  type: "image" | "video";
  title: string;
  location: string;
  rotate?: number;
}

export const PHOTO_DATA: Photo[] = [];
