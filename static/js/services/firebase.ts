import { Analytics, getAnalytics } from "firebase/analytics";
import { FirebaseApp, initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCrpKSCUDp_221kyxOdTTfRsO7naJRFkBo",
  authDomain: "quick-compare-e5677.firebaseapp.com",
  projectId: "quick-compare-e5677",
  storageBucket: "quick-compare-e5677.appspot.com",
  messagingSenderId: "971226954160",
  appId: "1:971226954160:web:2df022c8e78573da3c3e75",
  measurementId: "G-JZN0YBZ9TZ",
};

export let firebaseApp: FirebaseApp;
export let firebaseAnalytics: Analytics;

export function initFirebase() {
  firebaseApp = initializeApp(firebaseConfig);
  firebaseAnalytics = getAnalytics(firebaseApp);
}
