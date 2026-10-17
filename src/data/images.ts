/**
 * Every photo on the site is registered here. Files live in public/images/tabletalk/
 * (Pexels and Unsplash editorial photography, see manifest.json there; no attribution required).
 * These are illustrative images: none was taken at a listed restaurant, and restaurant pages say so.
 */
const BASE = "/images/tabletalk";

export const siteImages = {
  homeHero: { src: `${BASE}/home-hero.jpg`, alt: "Candlelit restaurant dining room with set tables and warm low light", width: 2000, height: 1333 },
  restaurantsHero: { src: `${BASE}/restaurants-hero.jpg`, alt: "Bright restaurant dining room with wooden tables laid for lunch", width: 2000, height: 1333 },
  collectionsHero: { src: `${BASE}/collections-hero.jpg`, alt: "Table laid with white linen, glassware and a folded menu", width: 2000, height: 1333 },
  citiesHero: { src: `${BASE}/cities-hero.jpg`, alt: "City street at night lined with lit restaurant fronts", width: 2000, height: 1333 },
  awardsHero: { src: `${BASE}/awards-hero.jpg`, alt: "Chef finishing a plate with tweezers at the pass", width: 2000, height: 1333 },
  guidesHero: { src: `${BASE}/guides-hero.jpg`, alt: "Hands holding an open menu at a restaurant table", width: 2000, height: 1333 },
  aboutHero: { src: `${BASE}/about-hero.jpg`, alt: "Host stand with a reservation book and a lamp at a restaurant entrance", width: 2000, height: 1333 },
  requestHero: { src: `${BASE}/request-hero.jpg`, alt: "Empty table set for two with wine glasses and candles", width: 2000, height: 1333 },
  forRestaurantsHero: { src: `${BASE}/for-restaurants-hero.jpg`, alt: "Open kitchen pass with cooks plating during service", width: 2000, height: 1333 },
  contactHero: { src: `${BASE}/contact-hero.jpg`, alt: "Bartender pouring a cocktail at a dimly lit bar", width: 2000, height: 1333 },
  diningModern: { src: `${BASE}/dining-modern.jpg`, alt: "Modern restaurant interior with banquettes and pendant lights", width: 1400, height: 933 },
  diningClassic: { src: `${BASE}/dining-classic.jpg`, alt: "Classic dining room with chandeliers, white tablecloths and upholstered chairs", width: 1400, height: 933 },
  diningBright: { src: `${BASE}/dining-bright.jpg`, alt: "Daylit dining room with plain wooden tables and white walls", width: 1400, height: 933 },
  diningMoody: { src: `${BASE}/dining-moody.jpg`, alt: "Dark panelled dining room with low lamps and leather seating", width: 1400, height: 933 },
  dishDark: { src: `${BASE}/dish-dark.jpg`, alt: "Fine-dining plate photographed against a dark background", width: 1400, height: 933 },
  dishDark2: { src: `${BASE}/dish-dark-2.jpg`, alt: "Composed tasting-menu course on a ceramic plate", width: 1400, height: 933 },
  dishBright: { src: `${BASE}/dish-bright.jpg`, alt: "Colourful plated dish with fresh herbs on a bright table", width: 1400, height: 933 },
  dishSeafood: { src: `${BASE}/dish-seafood.jpg`, alt: "Seafood course plated with a light sauce", width: 1400, height: 933 },
  chefPlating: { src: `${BASE}/chef-plating.jpg`, alt: "Chef plating a dish with tweezers in a restaurant kitchen", width: 1400, height: 933 },
  chefPass: { src: `${BASE}/chef-pass.jpg`, alt: "Cooks working the pass in an open kitchen", width: 1400, height: 933 },
  winePour: { src: `${BASE}/wine-pour.jpg`, alt: "Sommelier pouring red wine into a glass at the table", width: 1400, height: 933 },
  wineGlasses: { src: `${BASE}/wine-glasses.jpg`, alt: "Wine glasses and a bottle on a restaurant table", width: 1400, height: 933 },
  cellar: { src: `${BASE}/cellar.jpg`, alt: "Wine bottles resting in a cellar rack", width: 1400, height: 933 },
  cocktail: { src: `${BASE}/cocktail.jpg`, alt: "Cocktail on a bar counter with soft lighting", width: 1400, height: 933 },
  coupleDinner: { src: `${BASE}/couple-dinner.jpg`, alt: "Two people sharing dinner at a candlelit table", width: 1400, height: 933 },
  groupToast: { src: `${BASE}/group-toast.jpg`, alt: "Group of friends raising glasses in a toast at dinner", width: 1400, height: 933 },
  businessDinner: { src: `${BASE}/business-dinner.jpg`, alt: "Colleagues talking over dinner at a restaurant table", width: 1400, height: 933 },
  tastingCounter: { src: `${BASE}/tasting-counter.jpg`, alt: "Guests seated at a chef's counter watching the kitchen", width: 1400, height: 933 },
  chefsTable: { src: `${BASE}/chefs-table.jpg`, alt: "Chef presenting a course to guests at a chef's table", width: 1400, height: 933 },
  exteriorNight: { src: `${BASE}/exterior-night.jpg`, alt: "Restaurant frontage lit up at night on a city street", width: 1400, height: 933 },
  cityStreet: { src: `${BASE}/city-street.jpg`, alt: "Evening street with cafes and restaurants in a city centre", width: 1400, height: 933 },
  dessert: { src: `${BASE}/dessert.jpg`, alt: "Plated dessert with fruit and cream", width: 1400, height: 933 },
  bread: { src: `${BASE}/bread.jpg`, alt: "Freshly baked sourdough loaves on a wooden board", width: 1400, height: 933 },
  coffee: { src: `${BASE}/coffee.jpg`, alt: "Coffee and pastry served on a cafe table", width: 1400, height: 933 },
  hostStand: { src: `${BASE}/host-stand.jpg`, alt: "Restaurant host greeting guests at the entrance", width: 1400, height: 933 },
  tableLinen: { src: `${BASE}/table-linen.jpg`, alt: "Close-up of cutlery and a folded napkin on white linen", width: 1400, height: 933 },
  menuHands: { src: `${BASE}/menu-hands.jpg`, alt: "Diner reading a printed menu at the table", width: 1400, height: 933 },
} as const;

export type SiteImageKey = keyof typeof siteImages;
export type SiteImage = (typeof siteImages)[SiteImageKey];

export function isSiteImageKey(value: string): value is SiteImageKey {
  return Object.prototype.hasOwnProperty.call(siteImages, value);
}

/** Resolve a data-file image key, falling back to the home hero so a typo never breaks a page. */
export function getImage(key: string): SiteImage {
  return isSiteImageKey(key) ? siteImages[key] : siteImages.homeHero;
}
