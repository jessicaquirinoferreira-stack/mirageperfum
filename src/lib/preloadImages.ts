import logoImg from '../assets/images/mirage_official_logo.webp';
import noirImg from '../assets/images/perfume_noir_imperial_1792849951149.webp';
import oudImg from '../assets/images/perfume_oud_mystique_1792849951456.webp';
import roseImg from '../assets/images/perfume_rose_velours_1792849952027.webp';
import ambreImg from '../assets/images/perfume_ambre_royal_1792849967109.webp';
import avatarImg from '../assets/images/concierge_avatar.webp';

export const CRITICAL_IMAGES = [
  logoImg,
  noirImg,
  oudImg,
  roseImg,
  ambreImg,
  avatarImg,
];

/**
 * Preloads all essential site images asynchronously into memory for instant rendering
 */
export function preloadAllSiteImages(): Promise<void[]> {
  const promises = CRITICAL_IMAGES.map((src) => {
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.src = src;
      img.decoding = 'async';
      if (img.complete) {
        resolve();
      } else {
        img.onload = () => resolve();
        img.onerror = () => resolve(); // Always resolve so UI never blocks
      }
    });
  });

  return Promise.all(promises);
}
