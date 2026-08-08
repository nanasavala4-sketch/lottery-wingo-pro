alert("ADMIN JS LOADED");

import { db } from "./firebase.js";

alert("FIREBASE IMPORTED");

import {
    collection,
    getDocs,
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

alert("FIRESTORE IMPORTED");

async function loadDepositRequests() {

    alert("LOADING DEPOSITS");

    try {

        const box = document.getElementById("depositList");

        if (!box) {
            alert("depositList NOT FOUND");
            return;
        }

        box.innerHTML = "Loading...";

        const snap = await getDocs(
            collection(db, "depositRequests")
        );

        alert("Documents: " + snap.size);

        box.innerHTML = "";

        snap.forEach((d) => {

            const data = d.data();

            if (data.status === "Pending") {

                box.innerHTML += `
                    <div style="
                        border:1px solid #ccc;
                        padding:15px;
                        margin:10px;
                    ">

                        <b>${data.username || ""}</b><br>

                        Amount: ₹${data.amount || 0}<br>

                        Txn: ${data.transactionId || ""}<br>

                        Status: ${data.status || ""}<br><br>

                        <button onclick="approveDeposit('${d.id}')">
                            ✅ Approve
                        </button>

                    </div>
                `;
            }

        });

    } catch (error) {

        alert("FIREBASE ERROR: " + error.message);

        console.error(error);
    }
}

window.approveDeposit = async function(id) {

    try {

        const reqRef = doc(db, "depositRequests", id);

        const reqSnap = await getDoc(reqRef);

        if (!reqSnap.exists()) {
            alert("Deposit request not found");
            return;
        }

        const req = reqSnap.data();

        const userRef = doc(db, "users", req.uid);

        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            alert("User not found");
            return;
        }

        const balance = userSnap.data().balance || 0;

        await updateDoc(userRef, {
            balance: balance + Number(req.amount)
        });

        await updateDoc(reqRef, {
            status: "Approved"
        });

        alert("✅ Deposit Approved");

        loadDepositRequests();

    } catch (error) {

        alert("APPROVE ERROR: " + error.message);

        console.error(error);
    }
};

loadDepositRequests();
