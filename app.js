// Firebase-Konfiguration (ersetze durch deine echten Werte)
const firebaseConfig = {
  apiKey: "AIzaSyDBT9CEUfq_n11cbN0S7uCoO6cDUoHYvhg",
  authDomain: "radio-f99dc.firebaseapp.com",
  projectId: "radio-f99dc",
  storageBucket: "radio-f99dc.firebasestorage.app",
  messagingSenderId: "350420303935",
  appId: "1:350420303935:web:87b25e38f0137a70bcf88a",
  measurementId: "G-LJD8W3LXTR"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const authContainer = document.getElementById('auth-container');
const app = document.getElementById('app');
const stationsDiv = document.getElementById('stations');
const player = document.getElementById('player');
const favoritesList = document.getElementById('favorites');

let user = null;

auth.onAuthStateChanged(u => {
  user = u;
  if (user) {
    authContainer.classList.add('hidden');
    app.classList.remove('hidden');
    searchStations('pop');
    loadFavorites();
  } else {
    authContainer.classList.remove('hidden');
    app.classList.add('hidden');
  }
});

function login() {
  auth.signInWithEmailAndPassword(emailInput.value, passwordInput.value)
    .catch(alert);
}

function register() {
  auth.createUserWithEmailAndPassword(emailInput.value, passwordInput.value)
    .catch(alert);
}

function logout() {
  auth.signOut();
}

function searchStations(searchTerm = "") {
  fetch(`https://de1.api.radio-browser.info/json/stations/search?name=${encodeURIComponent(searchTerm)}&limit=30`)
    .then(res => res.json())
    .then(data => {
      stationsDiv.innerHTML = "";
      data.forEach(station => {
        const btn = document.createElement('button');
        btn.textContent = station.name;
        btn.onclick = () => {
          player.src = station.url_resolved;
          player.play();
          saveFavorite(station.name, station.url_resolved);
        };
        stationsDiv.appendChild(btn);
      });
    })
    .catch(err => {
      stationsDiv.innerHTML = "<p>Fehler beim Laden der Radiosender.</p>";
    });
}

function saveFavorite(name, stream) {
  if (!user) return;
  db.collection("favorites").doc(user.uid).set({
    [name]: stream
  }, { merge: true });
}

function loadFavorites() {
  if (!user) return;
  db.collection("favorites").doc(user.uid).get().then(doc => {
    if (doc.exists) {
      const data = doc.data();
      favoritesList.innerHTML = "";
      for (const [name, stream] of Object.entries(data)) {
        const li = document.createElement("li");
        li.textContent = name;
        li.onclick = () => {
          player.src = stream;
          player.play();
        };
        favoritesList.appendChild(li);
      }
    }
  });
}
