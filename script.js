alert("script.js चालू झाला");

// Login System
const loginPage = document.getElementById("loginPage");
const gamePage = document.getElementById("gamePage");

document.getElementById("loginBtn").onclick = () => {
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();

  if(user==="" || pass===""){
    alert("Username आणि Password टाका");
    return;
  }

  loginPage.style.display="none";
  gamePage.style.display="block";
};

document.getElementById("registerBtn").onclick=()=>{
  alert("Registration Successful");
};

// Balance
let balance = 1000;
document.querySelector(".wallet h1").innerHTML="₹"+balance;

// Timer
let seconds=30;
const timer=document.getElementById("timer");

setInterval(()=>{
  seconds--;

  if(seconds<0){
    seconds=30;
    addHistory();
  }

  timer.innerHTML="00:"+(seconds<10?"0"+seconds:seconds);

},1000);

// History
function addHistory(){

 const history=document.getElementById("history");

 const period=Math.floor(Math.random()*900000)+100000;
 const number=Math.floor(Math.random()*10);

if(currentBet !== null){
    checkResult(number);
}
  
 const result=number<=4?"Small":"Big";

 const row=document.createElement("tr");

 row.innerHTML=`
 <td>${period}</td>
 <td>${number}</td>
 <td>${result}</td>
 `;

 history.insertBefore(row, history.firstChild);

 while(history.rows.length>10){
   history.deleteRow(10);
 }

}

// Betting Buttons
document.querySelector(".green").onclick=()=>{
 alert("Green निवडले");
};

document.querySelector(".violet").onclick=()=>{
 alert("Violet निवडले");
};

document.querySelector(".red").onclick=()=>{
 alert("Red निवडले");
};

document.querySelector(".big").onclick=()=>{
 alert("Big निवडले");
};

document.querySelector(".small").onclick=()=>{
 alert("Small निवडले");
};

document.querySelectorAll(".numbers button").forEach(btn=>{
 btn.onclick=()=>{
   alert("Number "+btn.innerHTML+" निवडले");
 };
});

// Demo History
for(let i=0;i<5;i++){
 addHistory();
}
document.getElementById("depositBtn").onclick = () => {
    balance += 100;
    document.querySelector(".wallet h1").innerHTML = "₹" + balance;
    alert("₹100 Deposit झाले");
};

document.getElementById("withdrawBtn").onclick = () => {
    if(balance >= 100){
        balance -= 100;
        document.querySelector(".wallet h1").innerHTML = "₹" + balance;
        alert("₹100 Withdraw झाले");
    }else{
        alert("Balance कमी आहे");
    }
};

document.getElementById("logoutBtn").onclick = () => {
    gamePage.style.display = "none";
    loginPage.style.display = "block";
};
// Bet System
let currentBet = null;
let betAmount = 100;

// Color Bet
document.querySelector(".green").onclick = () => {
    currentBet = "Green";
    alert("Green वर ₹100 Bet लावली");
};

document.querySelector(".red").onclick = () => {
    currentBet = "Red";
    alert("Red वर ₹100 Bet लावली");
};

document.querySelector(".violet").onclick = () => {
    currentBet = "Violet";
    alert("Violet वर ₹100 Bet लावली");
};

// Big Small Bet
document.querySelector(".big").onclick = () => {
    currentBet = "Big";
    alert("Big वर ₹100 Bet लावली");
};

document.querySelector(".small").onclick = () => {
    currentBet = "Small";
    alert("Small वर ₹100 Bet लावली");
};

// Number Bet
document.querySelectorAll(".numbers button").forEach(btn=>{
    btn.onclick=()=>{
        currentBet = btn.innerText;
        alert("Number "+currentBet+" वर ₹100 Bet लावली");
    };
});

// Result Check
function checkResult(number){

    let color = "";

    if(number==0 || number==5){
        color="Violet";
    }else if(number%2==0){
        color="Green";
    }else{
        color="Red";
    }

    let bs = number>=5 ? "Big":"Small";

    let win=false;

    if(currentBet==color) win=true;
    if(currentBet==bs) win=true;
    if(currentBet==String(number)) win=true;

    if(win){
        balance += betAmount;
        alert("🎉 Congratulations! You Won ₹"+betAmount);
    }else{
        balance -= betAmount;
        alert("😔 You Lost ₹"+betAmount);
    }

    document.querySelector(".wallet h1").innerHTML="₹"+balance;
    currentBet=null;
}
