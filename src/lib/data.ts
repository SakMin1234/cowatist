export interface Artist {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  age: number;
  bio: string;
  bioJp: string;
}

export interface Commission {
  id: string;
  artistId: string;
  title: string;
  image: string;
  price: number;
  priceLabel: string;
  category: string;
  borderColor: "blue" | "purple" | "orange" | "gray";
  priceColor: "blue" | "orange";
  slots?: number;
  deliveryDays?: number;
  additionalInfo?: string;
  restrictions?: string[];
}

export const categories = [
  "Pixel Art",
  "Chibi",
  "Fantasy",
  "Pet",
  "Comic",
  "Full Body",
  "Head shot",
  "Half Body",
  "Landscape",
];

export const artists: Artist[] = [
  {
    id: "senjiro",
    name: "Senjiro_kun",
    avatar: "/avatars/senjiro.jpg",
    rating: 4.45,
    age: 20,
    bio: "You can call me Senjiro or Senji for short, I studying to draw for a year.",
    bioJp: "涼介が愛してる。",
  },
  {
    id: "rokuna",
    name: "Roku_na",
    avatar: "/avatars/rokuna.jpg",
    rating: 4.8,
    age: 22,
    bio: "Illustrator specializing in dynamic half-body portraits and character design.",
    bioJp: "アートは魂の表現。",
  },
  {
    id: "calon",
    name: "CalonMarker",
    avatar: "/avatars/calon.jpg",
    rating: 4.9,
    age: 25,
    bio: "Landscape and environment artist. I paint worlds you want to live in.",
    bioJp: "自然を描く。",
  },
];

export const commissions: Commission[] = [
  {
    id: "c1",
    artistId: "senjiro",
    title: "Head shot",
    image: "/art/headshot.jpg",
    price: 250,
    priceLabel: "250+ Baht",
    category: "Head shot",
    borderColor: "blue",
    priceColor: "blue",
    slots: 5,
    deliveryDays: 3,
    additionalInfo: "Rough style, soft and gentle",
    restrictions: ["Gore", "Old woman"],
  },
  {
    id: "c2",
    artistId: "rokuna",
    title: "Half Body",
    image: "/art/halfbody.jpg",
    price: 1000,
    priceLabel: "1000 Baht",
    category: "Half Body",
    borderColor: "purple",
    priceColor: "blue",
    slots: 3,
    deliveryDays: 5,
    additionalInfo: "Dynamic poses, vibrant coloring",
    restrictions: ["NSFW"],
  },
  {
    id: "c3",
    artistId: "calon",
    title: "Landscape",
    image: "/art/landscape.jpg",
    price: 1500,
    priceLabel: "1500 Baht",
    category: "Landscape",
    borderColor: "orange",
    priceColor: "orange",
    slots: 2,
    deliveryDays: 7,
    additionalInfo: "Dreamy atmospheres, starry skies",
    restrictions: [],
  },
  {
    id: "c4",
    artistId: "senjiro",
    title: "Chibi",
    image: "/art/chibi.jpg",
    price: 500,
    priceLabel: "500 Baht",
    category: "Chibi",
    borderColor: "blue",
    priceColor: "blue",
    slots: 8,
    deliveryDays: 2,
    additionalInfo: "Cute chibi style with simple backgrounds",
    restrictions: ["Gore"],
  },
  {
    id: "c5",
    artistId: "calon",
    title: "Fantasy",
    image: "/art/chibi-artist.jpg",
    price: 800,
    priceLabel: "800 Baht",
    category: "Fantasy",
    borderColor: "gray",
    priceColor: "blue",
    slots: 4,
    deliveryDays: 4,
    additionalInfo: "Elegant character designs with traditional flair",
    restrictions: [],
  },
  {
    id: "c6",
    artistId: "rokuna",
    title: "Pet",
    image: "/art/flower.jpg",
    price: 350,
    priceLabel: "350 Baht",
    category: "Pet",
    borderColor: "purple",
    priceColor: "blue",
    slots: 6,
    deliveryDays: 2,
    additionalInfo: "Soft pastel style portraits",
    restrictions: [],
  },
  {
    id: "c7",
    artistId: "senjiro",
    title: "Full Body",
    image: "/art/catgirl.jpg",
    price: 700,
    priceLabel: "700 Baht",
    category: "Full Body",
    borderColor: "blue",
    priceColor: "blue",
    slots: 3,
    deliveryDays: 5,
    additionalInfo: "Sketch style, expressive linework",
    restrictions: ["Gore"],
  },
  {
    id: "c8",
    artistId: "calon",
    title: "Landscape",
    image: "/art/mountain.jpg",
    price: 1200,
    priceLabel: "1200 Baht",
    category: "Landscape",
    borderColor: "orange",
    priceColor: "orange",
    slots: 3,
    deliveryDays: 6,
    additionalInfo: "Bright, painterly mountain and nature scenes",
    restrictions: [],
  },
];


export function getArtist(id: string) {
  return artists.find((a) => a.id === id);
}

export function getCommission(id: string) {
  return commissions.find((c) => c.id === id);
}

export function getArtistCommissions(artistId: string) {
  return commissions.filter((c) => c.artistId === artistId);
}
