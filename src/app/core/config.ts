const appLocation = typeof window === 'undefined' ? undefined : window.location;
const apiProtocol = appLocation?.protocol || 'http:';
const apiHost = appLocation?.hostname || 'localhost';
const wsProtocol = apiProtocol === 'https:' ? 'wss:' : 'ws:';

export const API_BASE_URL = `${apiProtocol}//${apiHost}:3000/api`;
export const REALTIME_URL = `${wsProtocol}//${apiHost}:3000/realtime`;
