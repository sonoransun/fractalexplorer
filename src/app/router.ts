// Minimal hash router for the three views over one persistent canvas:
//   #/            -> home (scrolling landing)
//   #/explore?... -> explorer (scene encoded in the query)
//   #/history     -> the long-form history page
// Legacy bare-scene hashes (#k=...&cx=...) are treated as explore for back-compat.
export type RouteName = 'home' | 'explore' | 'history';

export interface Route {
  name: RouteName;
  query: string; // the scene query (for explore)
}

export const parseRoute = (hash: string): Route => {
  const raw = hash.startsWith('#') ? hash.slice(1) : hash;
  if (raw === '' || raw === '/') return { name: 'home', query: '' };
  const q = raw.indexOf('?');
  const path = q >= 0 ? raw.slice(0, q) : raw;
  const query = q >= 0 ? raw.slice(q + 1) : '';
  if (path === '/history') return { name: 'history', query: '' };
  if (path === '/explore') return { name: 'explore', query };
  // legacy deep-links written before routing existed
  if (/(^|&)(k|cx|cy|z)=/.test(raw)) return { name: 'explore', query: raw };
  return { name: 'home', query: '' };
};

export const HOME_HREF = '#/';
export const HISTORY_HREF = '#/history';
export const exploreHref = (query: string): string => (query ? `#/explore?${query}` : '#/explore');

/** Navigate by setting the hash (fires `hashchange`, unlike the in-explorer replaceState writer). */
export const navigate = (href: string): void => {
  if (location.hash === href) window.dispatchEvent(new HashChangeEvent('hashchange'));
  else location.hash = href;
};
