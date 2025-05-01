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

const stations = [
  { name: "Radio Paradise", stream: "https://stream.radioparadise.com/mp3-192" },
  { name: "Chillhop", stream: "https://stream.zeno.fm/fh9w94c2ywzuv" },
  { name: "NDR 2", stream: "https://ndr-ndr2-niedersachsen.cast.addradio.de/ndr/ndr2/niedersachsen/mp3/128/stream.mp3" },
  { name: "BBC Radio 1", stream: "http://bbcmedia.ic.llnwd.net/stream/bbcmedia_radio1_mf_p" },
  { name: "Deutschlandfunk", stream: "https://st01.sslstream.dlf.de/dlf/01/128/mp3/stream.mp3" }
];

let user = null;

auth.onAuthStateChanged(u => {
  user = u;
  if (user) {
    authContainer.classList.add('hidden');
    app.classList.remove('hidden');
    loadStations();
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

function loadStations() {
  stationsDiv.innerHTML = "";
  stations.forEach(station => {
    const btn = document.createElement('button');
    btn.textContent = station.name;
    btn.onclick = () => {
      player.src = station.stream;
      player.play();
      saveFavorite(station);
    };
    stationsDiv.appendChild(btn);
  });
}

function saveFavorite(station) {
  if (!user) return;
  db.collection("favorites").doc(user.uid).set({
    [station.name]: station.stream
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
