import prodClassicBlack from '@/assets/prod-classic-black.jpg';
import prodClassicWhite from '@/assets/prod-classic-white.jpg';
import prodPlatformBlack from '@/assets/prod-platform-black.jpg';
import prodLined from '@/assets/prod-lined.jpg';
import prodKidsPink from '@/assets/prod-kids-pink.jpg';
import prodSlideBlack from '@/assets/prod-slide-black.jpg';

// Interfaces moved to src/lib/utils.ts


export const products: Product[] = [
  {
    id: '1',
    name: 'Classic Clog Noir',
    price: 4500,
    oldPrice: 5500,
    description: 'Le sabot classique par excellence. Confort ultime, légèreté incomparable. Idéal pour toutes les occasions.',
    category: 'homme',
    colors: [
      { name: 'Noir', hex: '#000000', image: prodClassicBlack },
      { name: 'Blanc', hex: '#FFFFFF', image: prodClassicWhite },
    ],
    sizes: [39, 40, 41, 42, 43, 44, 45],
    isPack: false,
    images: [prodClassicBlack, prodClassicWhite],
  },
  {
    id: '2',
    name: 'Classic Clog Blanc',
    price: 4500,
    description: 'Élégance pure en blanc. Un indispensable pour l\'été algérien.',
    category: 'femme',
    colors: [
      { name: 'Blanc', hex: '#FFFFFF', image: prodClassicWhite },
      { name: 'Noir', hex: '#000000', image: prodClassicBlack },
    ],
    sizes: [36, 37, 38, 39, 40, 41],
    isPack: false,
    images: [prodClassicWhite, prodClassicBlack],
  },
  {
    id: '3',
    name: 'Platform Clog',
    price: 6200,
    oldPrice: 7800,
    description: 'Plateforme audacieuse pour un style affirmé. Semelle épaisse, confort maximal.',
    category: 'femme',
    colors: [
      { name: 'Noir', hex: '#000000', image: prodPlatformBlack },
    ],
    sizes: [36, 37, 38, 39, 40, 41],
    isPack: false,
    images: [prodPlatformBlack],
  },
  {
    id: '4',
    name: 'Clog Fourré Confort',
    price: 5800,
    oldPrice: 7200,
    description: 'Doublure chaude et moelleuse. Parfait pour les soirées fraîches.',
    category: 'femme',
    colors: [
      { name: 'Beige', hex: '#E8D5C4', image: prodLined },
    ],
    sizes: [36, 37, 38, 39, 40, 41, 42],
    isPack: false,
    images: [prodLined],
  },
  {
    id: '5',
    name: 'Kids Classic Rose',
    price: 3200,
    oldPrice: 3800,
    description: 'Fun et confortable pour les petits pieds. Couleurs vives, sourires garantis.',
    category: 'enfant',
    colors: [
      { name: 'Rose', hex: '#FF69B4', image: prodKidsPink },
    ],
    sizes: [24, 25, 26, 27, 28, 29, 30, 31, 32],
    isPack: false,
    images: [prodKidsPink],
  },
  {
    id: '6',
    name: 'Slide Classique',
    price: 3800,
    description: 'La slide minimaliste. Glisser, marcher, conquérir.',
    category: 'homme',
    colors: [
      { name: 'Noir', hex: '#000000', image: prodSlideBlack },
    ],
    sizes: [39, 40, 41, 42, 43, 44, 45],
    isPack: false,
    images: [prodSlideBlack],
  },
  {
    id: '7',
    name: 'Pack Duo Classique',
    price: 7900,
    oldPrice: 10000,
    description: 'Deux paires classiques noir et blanc. L\'offre idéale pour ne jamais choisir.',
    category: 'homme',
    colors: [
      { name: 'Noir', hex: '#000000', image: prodClassicBlack },
      { name: 'Blanc', hex: '#FFFFFF', image: prodClassicWhite },
    ],
    sizes: [39, 40, 41, 42, 43, 44, 45],
    isPack: true,
    images: [prodClassicBlack, prodClassicWhite],
  },
  {
    id: '8',
    name: 'Pack Famille',
    price: 11500,
    oldPrice: 14500,
    description: 'Un pack pour toute la famille. Homme, femme et enfant réunis.',
    category: 'enfant',
    colors: [
      { name: 'Noir', hex: '#000000', image: prodClassicBlack },
      { name: 'Rose', hex: '#FF69B4', image: prodKidsPink },
    ],
    sizes: [24, 25, 26, 27, 28, 36, 37, 38, 39, 40, 41, 42, 43],
    isPack: true,
    images: [prodClassicBlack, prodKidsPink],
  },
];

export const categories = [
  { id: 'femme', label: 'Femme' },
  { id: 'homme', label: 'Homme' },
  { id: 'enfant', label: 'Enfant' },
] as const;

// Utils moved to src/lib/utils.ts
// Static data deprecated - use DB

