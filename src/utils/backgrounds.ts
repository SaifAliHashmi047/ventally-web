// Import all default background images — same files as the RN app
import bg1 from '../assets/images/bg1.png';
import bg2 from '../assets/images/bg2.png';
import bg3 from '../assets/images/bg3.png';
import bg4 from '../assets/images/bg4.jpeg';
import bg5 from '../assets/images/bg5.jpeg';
import bg6 from '../assets/images/bg6.jpeg';
import bg7 from '../assets/images/bg7.jpeg';
import bg8 from '../assets/images/bg8.jpeg';

export interface DefaultBackground {
  id: string;
  name: string;
  image: string; // imported asset URL
  isDefault: true;
}

export interface CustomBackground {
  id: string;
  name: string;
  uri: string; // base64 data URI — persists across refreshes
  isDefault?: false;
}

// Exact same order and names as the RN app's defaultBackgrounds array
export const defaultBackgrounds: DefaultBackground[] = [
  { id: '1', name: 'Cosmic Dreams',   image: bg1, isDefault: true },
  { id: '2', name: 'Aurora Borealis', image: bg2, isDefault: true },
  { id: '3', name: 'Forest Mist',     image: bg3, isDefault: true },
  { id: '4', name: 'Ocean Breeze',    image: bg4, isDefault: true },
  { id: '5', name: 'Ocean Breeze',    image: bg5, isDefault: true },
  { id: '6', name: 'Ocean Breeze',    image: bg6, isDefault: true },
  { id: '7', name: 'Ocean Breeze',    image: bg7, isDefault: true },
  { id: '8', name: 'Ocean Breeze',    image: bg8, isDefault: true },
];

/**
 * Returns a React CSSProperties object that applies the correct background.
 * - Default backgrounds → full-cover image
 * - Custom backgrounds  → base64 data URI, full-cover
 * - Fallback            → bg1 (Cosmic Dreams)
 */
export const getBackgroundStyle = (
  id: string | null | undefined,
  customBackgrounds: CustomBackground[] = []
): React.CSSProperties => {
  const coverStyle: React.CSSProperties = {
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  if (!id) {
    return { backgroundImage: `url(${bg1})`, ...coverStyle };
  }

  // Custom background (base64 data URI stored in Redux/localStorage)
  const custom = customBackgrounds.find(bg => bg.id === id);
  if (custom?.uri) {
    return { backgroundImage: `url(${custom.uri})`, ...coverStyle };
  }

  // Default background image
  const def = defaultBackgrounds.find(bg => bg.id === id);
  if (def) {
    return { backgroundImage: `url(${def.image})`, ...coverStyle };
  }

  // Fallback to first default
  return { backgroundImage: `url(${bg1})`, ...coverStyle };
};

/**
 * Returns just the image src string for <img> tags / thumbnail previews.
 */
export const getBackgroundSrc = (
  id: string | null | undefined,
  customBackgrounds: CustomBackground[] = []
): string => {
  if (!id) return bg1;

  const custom = customBackgrounds.find(bg => bg.id === id);
  if (custom?.uri) return custom.uri;

  const def = defaultBackgrounds.find(bg => bg.id === id);
  if (def) return def.image;

  return bg1;
};
