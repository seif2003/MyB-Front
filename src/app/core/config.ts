let apiHostFromEnv = 'http://localhost:3000';

// Load config synchronously (blocking)
function loadEnvConfig() {
  try {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/env.json', false); // false = synchronous
    xhr.send();
    if (xhr.status === 200) {
      const config = JSON.parse(xhr.responseText);
      apiHostFromEnv = config.API_HOST || 'http://localhost:3000';
    }
  } catch (error) {
    console.warn('Could not load env.json, using default API_HOST:', error);
  }
}

loadEnvConfig();

const appLocation = typeof window === 'undefined' ? undefined : window.location;
const wsProtocol = appLocation?.protocol === 'https:' ? 'wss:' : 'ws:';

export const API_BASE_URL = `${apiHostFromEnv}/api`;
export const REALTIME_URL = `${wsProtocol}//${new URL(apiHostFromEnv).hostname}:3000/realtime`;
