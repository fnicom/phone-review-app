import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCcmV7rpiHeiafR_YQrOiEeEnQ6AwKKMWA",
  projectId: "phone-review-app",
  storageBucket: "phone-review-app.firebasestorage.app",
  appId: "1:1004398125500:android:a835237d3d0f68e5218bb9"
};

// Inicializa o Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Exporta as instâncias do Firebase e Firestore
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app; 