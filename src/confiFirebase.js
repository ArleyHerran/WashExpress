// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import {getAuth, indexedDBLocalPersistence} from "firebase/auth";
import {getFirestore, initializeFirestore,persistentSingleTabManager, persistentLocalCache,  CACHE_SIZE_UNLIMITED } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBbKSKZeaGWwvE7CjV8Ghum84e4Cey6wyk",
  authDomain: "aprendiz-sena-arleyherran.firebaseapp.com",
  projectId: "aprendiz-sena-arleyherran",
  storageBucket: "aprendiz-sena-arleyherran.appspot.com",
  messagingSenderId: "751498340784",
  appId: "1:751498340784:web:03774b728579349c750e75"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
initializeFirestore(app,
  {localCache:
    persistentLocalCache(/*settings*/{tabManager: persistentSingleTabManager()})
    
});



const auth = getAuth(app);
const db = getFirestore(app);


// Habilitar el almacenamiento en caché persistente

  




export{auth,db};