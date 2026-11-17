export const GAME_PATH = '/play';
export const HOME_PATH = '/';

export function currentPath() {
    return window.location.pathname.replace(/\/+$/, '') || '/';
}

/** Client-side navigation without a page reload. */
export function navigate(path) {
    if (currentPath() === path) return;
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate', { state: {} }));
}
