import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

async function loadDepositRequests() {

    const box = document.getElementById("depositList");
    box.innerHTML = "";

    const snap = await getDocs(collection(db, "depositRequests"));

    snap.forEach((d) => {

        const data = d.data();

        if (data.status === "Pending") {

            box.innerHTML += `
            <div style="border:1px solid #ccc;padding:10px;margin:10px;">
                <b>${data.username}</b><br>
                Amount : ₹${data.amount}<br>
                Txn : ${data.transactionId}<br>

                <button onclick="approveDeposit('${d.id}')">
                ✅ Approve
                </button>
            </div>
            `;
        }

    });

}

window.approveDeposit = async function(id){

    const reqRef = doc(db,"depositRequests",id);
    const reqSnap = await getDoc(reqRef);

    const req = reqSnap.data();

    const userRef = doc(db,"users",req.uid);
    const userSnap = await getDoc(userRef);

    const balance = userSnap.data().balance || 0;

    await updateDoc(userRef,{
        balance: balance + Number(req.amount)
    });

    await updateDoc(reqRef,{
        status:"Approved"
    });

    alert("✅ Deposit Approved");

    loadDepositRequests();

}

loadDepositRequests();
