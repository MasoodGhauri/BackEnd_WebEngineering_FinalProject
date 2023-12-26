const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyCIMVbys_WZTQNSDwIb80bmaMMVtxu_Mo4",
  authDomain: "askpro-92774.firebaseapp.com",
  projectId: "askpro-92774",
  storageBucket: "askpro-92774.appspot.com",
  messagingSenderId: "799741108602",
  appId: "1:799741108602:web:6f532fe3bb4b41a041b6c3",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

module.exports = {
  storage,
  app,
};
