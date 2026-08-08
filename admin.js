import { db, auth } from "./firebase.js";

import {
    collection,
    getDocs,
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


const ADMIN_UID = "7mVB5pMbA8UKpXxr7HA6IC5vqHw1";


onAuthStateChanged(auth, async (user) => {

    if (!user) {

        console.log("Admin login नाही.");

        return;
    }

    console.log("LOGIN UID:", user.uid);

    if (user.uid !== ADMIN_UID) {

        alert("❌ हा Admin UID नाही.");

        return;
    }

    alert("✅ ADMIN VERIFIED");

    loadDepositRequests();
});


async function loadDepositRequests() {

    const box =
        document.getElementById("depositList");

    box.innerHTML = "Loading...";

    try {

        const snap = await getDocs(
            collection(db, "depositRequests")
        );

        box.innerHTML = "";

        if (snap.empty) {

            box.innerHTML =
                "<p>कोणतीही Deposit Request नाही.</p>";

            return;
        }

        snap.forEach((d) => {

            const data = d.data();

            if (data.status === "Pending") {

                box.innerHTML += `

                    <div
                        style="
                        border:1px solid #ccc;
                        padding:15px;
                        margin:10px 0;
                        "
                    >

                        <b>
                            ${data.username || "Unknown"}
                        </b>

                        <br>

                        Amount:
                        ₹${data.amount || 0}

                        <br>

                        Transaction ID:
                        ${data.transactionId || "-"}

                        <br><br>

                        <button
                            onclick="approveDeposit('${d.id}')"
                        >
                            ✅ Approve
                        </button>

                    </div>

                `;
            }

        });

    } catch (error) {

        console.error(error);

        alert(
            "FIREBASE ERROR: " +
            error.message
        );

        box.innerHTML = "";
    }
}


window.approveDeposit = async function(id) {

    try {

        const reqRef =
            doc(db, "depositRequests", id);

        const reqSnap =
            await getDoc(reqRef);

        if (!reqSnap.exists()) {

            alert("❌ Request सापडली नाही.");

            return;
        }

        const req =
            reqSnap.data();

        const userRef =
            doc(db, "users", req.uid);

        const userSnap =
            await getDoc(userRef);

        if (!userSnap.exists()) {

            alert("❌ User सापडला नाही.");

            return;
        }

        const balance =
            userSnap.data().balance || 0;

        await updateDoc(userRef, {

            balance:
                balance + Number(req.amount)

        });

        await updateDoc(reqRef, {

            status: "Approved"

        });

        alert("✅ Deposit Approved");

        loadDepositRequests();

    } catch (error) {

        console.error(error);

        alert(
            "APPROVE ERROR: " +
            error.message
        );
    }
};
