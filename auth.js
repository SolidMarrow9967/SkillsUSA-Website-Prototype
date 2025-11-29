// ===== Firebase Auth Setup =====

// Import Firebase modules
import { 
  initializeApp 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";


// ===== Replace these with YOUR Firebase config values =====
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_DOMAIN.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_BUCKET.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


// ===== REGISTER =====
const regForm = document.getElementById("registerForm");
if (regForm) {
  regForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    const name = document.getElementById("registerName").value;

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("✅ Account created successfully!");
      localStorage.setItem("username", name);
      window.location.href = "login.html";
    } catch (error) {
      alert("⚠️ " + error.message);
    }
  });
}


// ===== LOGIN =====
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("✅ Welcome back!");
      window.location.href = "members/dashboard.html";
    } catch (error) {
      alert("⚠️ " + error.message);
    }
  });
}


// ===== LOGOUT =====
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    alert("You have been logged out.");
    window.location.href = "../login.html";
  });
}


// ===== PROTECT MEMBER PAGES =====
const protectedPages = [
  "dashboard.html", "announcements.html", "chat.html", 
  "events.html", "media.html", "directory.html", "admin.html"
];

onAuthStateChanged(auth, (user) => {
  const path = window.location.pathname;
  const currentPage = path.split("/").pop();

  if (!user && protectedPages.includes(currentPage)) {
    // Redirect to login if user not signed in
    window.location.href = "../login.html";
  } else if (user && currentPage === "login.html") {
    // Redirect logged-in users to dashboard
    window.location.href = "members/dashboard.html";
  }

  // Update username dynamically
  const username = localStorage.getItem("username");
  if (username) {
    const nameElement = document.getElementById("username");
    if (nameElement) nameElement.textContent = username;
  }
});
