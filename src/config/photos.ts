export interface Photo {
  id: number | string;
  url: string;
  type: "image" | "video";
  title: string;
  location: string;
  rotate?: number;
  album?: string;
}

export interface Album {
  id: string;
  title: string;
  cover: string;
  description?: string;
  photos: { url: string; type?: "image" | "video"; rotate?: number; caption?: string }[];
}

export const ALBUM_DATA: Album[] = [];

export const PHOTO_DATA: Photo[] = ALBUM_DATA.map((album, i) => ({
  id: i,
  url: album.cover,
  type: "image" as const,
  title: album.title,
  location: album.description || "",
  album: album.id,
}));
