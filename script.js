import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD7EAtMU0khSVOdcwvRPqiHPq4TYiCusxg",
  authDomain: "win-color-pro.firebaseapp.com",
  projectId: "win-color-pro",
  storageBucket: "win-color-pro.firebasestorage.app",
  messagingSenderId: "1025777239942",
  appId: "1:1025777239942:web:6c69f192e6ec7dcb940e07",
  measurementId: "G-7KXXW0JV0N"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
// ===============================
// WIN COLOR PRO - Part 1
// ===============================

// Login Elements
const loginPage = document.getElementById("loginPage");
const gamePage = document.getElementById("gamePage");

const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");

const username = document.getElementById("username");
const password = document.getElementById("password");

// Wallet
const balanceText = document.getElementById("balance");

let balance = Number(localStorage.getItem("balance")) || 1000;
let currentUser = null;
balanceText.innerHTML = "₹" + balance;

// Bet
let betAmount = 10;
let selectedBet = null;
let currentBet = null;

// Statistics
let totalBet = 0;
let totalWin = 0;
let totalLoss = 0;

// Login
loginBtn.onclick = () => {

    if(username.value.trim()=="" || password.value.trim()==""){
        alert("Username आणि Password टाका");
        return;
    }

    document.getElementById("profileName").innerHTML=username.value;

    loginPage.style.display="none";
    gamePage.style.display="block";

};

// Register
registerBtn.onclick = async () => {
  try {
    const user = await createUserWithEmailAndPassword(
      auth,
      username.value + "@wincolor.com",
      password.value
    );

    await setDoc(doc(db, "users", user.user.uid), {
      username: username.value,
      balance: 1000
    });

    alert("Register Success");
  } catch (e) {
    alert(e.message);
  }
};

// Login
loginBtn.onclick = async () => {
  try {
    const user = await signInWithEmailAndPassword(
      auth,
      username.value + "@wincolor.com",
      password.value
    );

    currentUser = user.user;
    
    const snap = await getDoc(doc(db, "users", user.user.uid));

    if (snap.exists()) {
      balance = snap.data().balance;
      balanceText.innerHTML = "₹" + balance;
      document.getElementById("profileName").innerHTML = snap.data().username;
    }

    loginPage.style.display = "none";
    gamePage.style.display = "block";
  
  if (username.value === "admin") {
    document.getElementById("adminPanel").style.display = "block";
    loadAdminUsers();
  }
  
  } catch (e) {
    alert("Login Failed");
  }
};

// Deposit
document.getElementById("depositBtn").onclick = async () => {

    balance+=100;

    balanceText.innerHTML="₹"+balance;

    localStorage.setItem("balance",balance);

if (currentUser) {
    await updateDoc(doc(db, "users", currentUser.uid), {
        balance: balance
    });
}
  
    alert("₹100 Deposit");

};

// Withdraw
document.getElementById("withdrawBtn").onclick = async () => {

    if(balance>=100){

        balance-=100;

        balanceText.innerHTML="₹"+balance;

        localStorage.setItem("balance",balance);

      if (currentUser) {
    await updateDoc(doc(db, "users", currentUser.uid), {
        balance: balance
    });
      }
      
        alert("₹100 Withdraw");

    }else{

        alert("Balance कमी आहे");

    }

};

// Logout

document.getElementById("logoutBtn").onclick=()=>{

loginPage.style.display="flex";

gamePage.style.display="none";

};

// ====================
// Bet Amount
// ====================

document.querySelectorAll(".amount").forEach(btn=>{

btn.onclick=()=>{

betAmount=Number(btn.dataset.amount);

alert("Bet Amount ₹"+betAmount);

};

});

// ====================
// Color Bets
// ====================

document.querySelector(".green").onclick=()=>{

selectedBet = "Green";

alert("Green Bet");

};

document.querySelector(".red").onclick=()=>{

selectedBet = "Red";

alert("Red Bet");

};

document.querySelector(".violet").onclick=()=>{

selectedBet = "Violet";

alert("Violet Bet");

};

document.querySelector(".big").onclick=()=>{

selectedBet = "Big";

alert("Big Bet");

};

document.querySelector(".small").onclick=()=>{

selectedBet = "Small";

alert("Small Bet");

};

document.querySelectorAll(".numbers button").forEach(btn=>{

btn.onclick=()=>{

selectedBet = btn.innerText;

alert("Number " + selectedBet);

};

});
// ====================
// Timer
// ====================

let seconds = 30;
const timer = document.getElementById("timer");

setInterval(() => {

    timer.innerHTML = "00:" + (seconds < 10 ? "0" + seconds : seconds);

    if (seconds === 0) {

        runGame();

        seconds = 30;

    }

    seconds--;

}, 1000);

// ====================
// Game Logic
// ====================

async function runGame() {

    const number = Math.floor(Math.random() * 10);

    let color = "";

    if (number === 0 || number === 5) {

        color = "Violet";

    } else if (number % 2 === 0) {

        color = "Green";

    } else {

        color = "Red";

    }

    const bs = number >= 5 ? "Big" : "Small";

  // Bet Confirm नसेल तर काहीही करू नका
if (currentBet == null) {
    addHistory(number, color, "No Bet");
    return;
  }
  
    let result = "Lose";

    totalBet++;

    if (
        currentBet === color ||
        currentBet === bs ||
        currentBet === String(number)
    ) {

        balance += betAmount;

        totalWin++;

        result = "Win";

        alert("🎉 You Won ₹" + betAmount);

    } else {

        balance -= betAmount;

        totalLoss++;

        alert("😔 You Lost ₹" + betAmount);

    }

    if (balance < 0) balance = 0;

    balanceText.innerHTML = "₹" + balance;

    localStorage.setItem("balance", balance);

if (currentUser) {
    await updateDoc(doc(db, "users", currentUser.uid), {
        balance: balance
    });
      }
  
    addHistory(number, color, result);

    document.getElementById("totalBet").innerHTML = totalBet;
    document.getElementById("totalWin").innerHTML = totalWin;
    document.getElementById("totalLoss").innerHTML = totalLoss;

    currentBet = null;
    selectedBet = null;

}

// ====================
// History
// ====================

function addHistory(number, color, result) {

    const history = document.getElementById("history");

    const row = document.createElement("tr");

    const period = Date.now();

    row.innerHTML = `
    <td>${period}</td>
    <td>${number}</td>
    <td>${result}</td>
    <td>${color}</td>
    `;

    history.prepend(row);

    while (history.rows.length > 10) {

        history.deleteRow(10);

    }

  }
// ==========================
// WIN COLOR PRO - Part 3
// Extra Features
// ==========================

// Auto Login
window.onload = () => {

    const lastUser = localStorage.getItem("username");

    if(lastUser){

        username.value = lastUser;

    }

};

// Save Username
loginBtn.addEventListener("click",()=>{

    localStorage.setItem("username",username.value);

});

// Win Rate
function updateWinRate(){

    let rate = 0;

    if(totalBet>0){

        rate=((totalWin/totalBet)*100).toFixed(1);

    }

    console.log("Win Rate : "+rate+"%");

}

// Update after every game
const oldRunGame = runGame;

runGame = function(){

    oldRunGame();

    updateWinRate();

};

// Result Animation
function flashResult(result){

    const timerBox=document.querySelector(".timerBox");

    if(result==="Win"){

        timerBox.style.background="#22c55e";

    }else{

        timerBox.style.background="#ef4444";

    }

    setTimeout(()=>{

        timerBox.style.background="#fff";

    },800);

}

// Replace runGame
const oldGame=runGame;

runGame=function(){

    oldGame();

    const lastResult=totalWin+totalLoss==0?"Lose":
    (currentBet==null?"Lose":"Win");

    flashResult(lastResult);

};

// Dark Mode

let dark=false;

function toggleDark(){

    dark=!dark;

    if(dark){

        document.body.style.background="#111";

        document.body.style.color="#fff";

    }else{

        document.body.style.background="#f3f4f6";

        document.body.style.color="#000";

    }

}

// Add Dark Button

const darkBtn=document.createElement("button");

darkBtn.innerHTML="🌙 Dark";

darkBtn.style.position="fixed";
darkBtn.style.right="10px";
darkBtn.style.bottom="70px";
darkBtn.style.padding="10px";
darkBtn.style.borderRadius="10px";

document.body.appendChild(darkBtn);

darkBtn.onclick=toggleDark;

// Notification

function showToast(text){

    const t=document.createElement("div");

    t.innerHTML=text;

    t.style.position="fixed";
    t.style.top="20px";
    t.style.left="50%";
    t.style.transform="translateX(-50%)";
    t.style.background="#000";
    t.style.color="#fff";
    t.style.padding="10px 20px";
    t.style.borderRadius="10px";
    t.style.zIndex="9999";

    document.body.appendChild(t);

    setTimeout(()=>{

        t.remove();

    },2000);

}

// Deposit Notification

document.getElementById("depositBtn").addEventListener("click",()=>{

    showToast("Deposit Success");

});

// Withdraw Notification

document.getElementById("withdrawBtn").addEventListener("click",()=>{

    showToast("Withdraw Success");

});

// Game Loaded

showToast("Win Color Pro Loaded");
document.getElementById("confirmBetBtn").onclick = () => {

    if (selectedBet == null) {
        alert("पहिले Bet निवडा");
        return;
    }

    currentBet = selectedBet;

    alert("✅ Bet Confirm : " + currentBet);

};

// ======================
// Admin Panel
// ======================

async function loadAdminUsers() {

    const tbody = document.getElementById("adminUsers");
    tbody.innerHTML = "";

    const querySnapshot = await getDocs(collection(db, "users"));

    querySnapshot.forEach((docSnap) => {

        const data = docSnap.data();

        const row = document.createElement("tr");

        row.innerHTML = `
<td>${data.username}</td>

<td>
<input type="number"
id="bal_${docSnap.id}"
value="${data.balance}">
</td>

<td>
<button onclick="updateBalance('${docSnap.id}')">
Save
</button>
</td>
`;

        tbody.appendChild(row);

    });

}

window.updateBalance = async function(uid) {
    try {
        const newBalance = Number(
            document.getElementById("bal_" + uid).value
        );

        await updateDoc(doc(db, "users", uid), {
            balance: newBalance
        });

        alert("✅ Balance Updated");
        loadAdminUsers();

    } catch (e) {
        alert(e.message);
    }
};
