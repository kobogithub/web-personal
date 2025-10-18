import { loadEnv } from 'vite';

const env = loadEnv(process.env.NODE_ENV || 'production', process.cwd(), '');

// Variables opcionales para servicios de terceros
export const GTAG_MEASUREMENT_ID = env.GTAG_MEASUREMENT_ID || '';
export const GISCUS_REPO = env.GISCUS_REPO || '';
export const GISCUS_REPO_ID = env.GISCUS_REPO_ID || '';
export const GISCUS_CATEGORY = env.GISCUS_CATEGORY || '';
export const GISCUS_CATEGORY_ID = env.GISCUS_CATEGORY_ID || '';

// Variable requerida solo en servidor (con validación)
export const GITHUB_PERSONAL_ACCESS_TOKEN = (() => {
  const token = env.GITHUB_PERSONAL_ACCESS_TOKEN;
  
  // Solo advertir en el servidor (no en el cliente)
  if (!token && typeof window === 'undefined') {
    console.warn('⚠️  GITHUB_PERSONAL_ACCESS_TOKEN no está configurado. Las estadísticas de repositorios pueden no funcionar correctamente.');
  }
  
  return token || '';
})();
