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

export const ALBUM_DATA: Album[] = [
  {
    id: "math-beauty",
    title: "数学之美",
    cover: "images/memory-tree/Math-Beauty/梯度.jpg",
    description: "世间万物从非静止存在，借梯度演变生长，凭散度往复流动，随旋度辗转回旋。",
    photos: [
      { url: "images/memory-tree/Math-Beauty/梯度.jpg", caption: "梯度 — 演变生长" },
      { url: "images/memory-tree/Math-Beauty/散度.jpg", caption: "散度 — 往复流动" },
      { url: "images/memory-tree/Math-Beauty/旋度.jpg", caption: "旋度 — 辗转回旋" },
    ],
  },
  {
    id: "chinese-anime",
    title: "国漫风采",
    cover: "images/memory-tree/chinese-anime/1779511186965.jpg",
    description: "国漫崛起，东方美学与现代动画的碰撞，每一帧都是匠心之作。",
    photos: [
      { url: "images/memory-tree/chinese-anime/1779511186965.jpg", caption: "瞬间一" },
      { url: "images/memory-tree/chinese-anime/1779511187986.jpg", caption: "瞬间二" },
      { url: "images/memory-tree/chinese-anime/1779511188542.jpg", caption: "瞬间三" },
      { url: "images/memory-tree/chinese-anime/1779511189002.jpg", caption: "瞬间四" },
      { url: "images/memory-tree/chinese-anime/-1349603863.jpg", caption: "瞬间五" },
      { url: "images/memory-tree/chinese-anime/-2128364103.jpg", caption: "瞬间六" },
      { url: "images/memory-tree/chinese-anime/1779511135998.jpg", caption: "瞬间七" },
      { url: "images/memory-tree/chinese-anime/1779511137304.jpg", caption: "瞬间八" },
      { url: "images/memory-tree/chinese-anime/1779511137987.jpg", caption: "瞬间九" },
      { url: "images/memory-tree/chinese-anime/1779511139655.jpg", caption: "瞬间十" },
      { url: "images/memory-tree/chinese-anime/1779511140035.jpg", caption: "瞬间十一" },
      { url: "images/memory-tree/chinese-anime/1779511140371.jpg", caption: "瞬间十二" },
      { url: "images/memory-tree/chinese-anime/1779511140788.jpg", caption: "瞬间十三" },
      { url: "images/memory-tree/chinese-anime/1779511199946.jpg", caption: "瞬间十四" },
    ],
  },
];

export const PHOTO_DATA: Photo[] = ALBUM_DATA.map((album, i) => ({
  id: i,
  url: album.cover,
  type: "image" as const,
  title: album.title,
  location: album.description || "",
  album: album.id,
}));
