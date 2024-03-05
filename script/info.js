import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getDatabase,
  set,
  ref,
  get,
  remove
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { config } from "./switch.js";

const app = initializeApp(config);
const db = getDatabase(app);

const kick_switch = document.getElementById("kickboxSwitch");
const mma_switch = document.getElementById("mmaSwitch");

const kick_cost_switch = document.getElementById("kickboxCostSwitch");
const mma_cost_switch = document.getElementById("mmaCostSwitch");

const date = document.getElementById("userDate")

const nameElement = document.getElementById("username");
let id = new URLSearchParams(window.location.search);

get(ref(db, "users")).then((sn) => {
    Object.keys(sn.val()).forEach((el) => {
        get(ref(db, `/users/${el}`)).then((sn_) => {
            if (id.get("id") === sn.val()[el]["id"].toString()){
                if (sn_.val()["dir"]) {
                    if (Array.from(sn_.val()["dir"]).includes("kick")) {
                        kick_switch.checked=true
                        kick_cost_switch.disabled = false
                        if (sn_.val()["cost"]["kick"] === "free") {
                            kick_cost_switch.checked = true
                        }
                    } 
                    if (Array.from(sn_.val()["dir"]).includes("mma")) {
                        mma_switch.checked=true
                        mma_cost_switch.disabled = false
                        if (sn_.val()["cost"]["mma"] === "free") {
                            mma_cost_switch.checked = true
                        }
                    }
                }
                date.value = sn_.val()["date"]


            }
        })
    })
})
kick_switch.addEventListener("click", function () {
    get(ref(db, "users")).then((sn) => {
        Object.keys(sn.val()).forEach((el) => {
            get(ref(db, `/users/${el}`)).then((sn_) => {
                if (id.get("id") === sn.val()[el]["id"].toString()) {
                    let dt = []; // Initialize dt here
                    if (sn_.val()["dir"]) { // Check if 'dir' exists
                        dt = Object.values(sn_.val()["dir"]); // If it exists, assign its value to dt
                    }
                    if (kick_switch.checked) {
                        kick_cost_switch.disabled = false
                        if (!dt.includes("kick")) {
                            dt.push("kick");
                            set(ref(db, `users/${el}/dir`), dt);
                        }
                    } else {
                        kick_cost_switch.checked = false
                        kick_cost_switch.disabled = true


                        dt = dt.filter((el) => el !== "kick");
                        set(ref(db, `users/${el}/dir`), dt);
                        set(ref(db, `users/${el}/cost/kick`), "paid")
                    }
                }
            });
        });
    });
});

mma_switch.addEventListener("click", function () {
    get(ref(db, "users")).then((sn) => {
        Object.keys(sn.val()).forEach((el) => {
            get(ref(db, `/users/${el}`)).then((sn_) => {
                if (id.get("id") === sn.val()[el]["id"].toString()) {
                    let dt = []; // Initialize dt here
                    if (sn_.val()["dir"]) { // Check if 'dir' exists
                        dt = Object.values(sn_.val()["dir"]); // If it exists, assign its value to dt
                    }
                    if (mma_switch.checked) {
                        mma_cost_switch.disabled = false
                        if (!dt.includes("mma")) {
                            dt.push("mma");
                            set(ref(db, `users/${el}/dir`), dt);
                        }
                    } else {
                        mma_cost_switch.disabled = true
                        mma_cost_switch.checked = false
                        dt = dt.filter((el) => el !== "mma");
                        set(ref(db, `users/${el}/dir`), dt);
                        set(ref(db, `users/${el}/cost/mma`), "paid")
                    }
                }
            });
        });
    });
});
kick_cost_switch.addEventListener("click", function () {
    get(ref(db, "users")).then((sn) => {
        Object.keys(sn.val()).forEach((el) => {
            get(ref(db, `/users/${el}`)).then((sn_) => {
                if (id.get("id") === sn.val()[el]["id"].toString()) {
                    if (kick_cost_switch.checked) {
                        set(ref(db, `/users/${el}/cost/kick`), "free")
                    } else {
                        set(ref(db, `/users/${el}/cost/kick`), "paid")
                    }
                }
            });
        });
    });
})
mma_cost_switch.addEventListener("click", function () {
    get(ref(db, "users")).then((sn) => {
        Object.keys(sn.val()).forEach((el) => {
            get(ref(db, `/users/${el}`)).then((sn_) => {
                if (id.get("id") === sn.val()[el]["id"].toString()) {
                    if (mma_cost_switch.checked) {
                        set(ref(db, `/users/${el}/cost/mma`), "free")
                    } else {
                        set(ref(db, `/users/${el}/cost/mma`), "paid")
                    }
                }
            });
        });
    });
})

date.addEventListener("change", function () {
   

    get(ref(db, "users")).then((sn) => {
        Object.keys(sn.val()).forEach((el) => {
            get(ref(db, `/users/${el}`)).then((sn_) => {
                if (id.get("id") === sn.val()[el]["id"].toString()) {
                    set(ref(db, `users/${el}/date`), date.value.trim())
                }
            });
        });
    });
    
})
get(ref(db, "users")).then((snapshot) => {
  let data = snapshot.val();
  Object.keys(data).forEach((el) => {
    if (data[el]["id"].toString() === id.get("id")) {
      nameElement.value = el;
      nameElement.setAttribute("readonly", "readonly");
    }
  });
});

document.getElementById("delete").addEventListener("click", function() {
    get(ref(db, "users")).then((sn) => {
        Object.keys(sn.val()).forEach((el) => {
            get(ref(db, `/users/${el}`)).then((sn_) => {
                if (id.get("id") === sn.val()[el]["id"].toString()) {
                    if (confirm("Точно удалить?")) {
                        remove(ref(db, `/users/${el}`))
                        window.location.href = 'members.html'
                    }
                }
            });
        });
    });
})

// Save new username to Firebase and delete old data
document.getElementById("saveUsername").addEventListener("click", function() {
    let newUsername = document.getElementById("newUsername").value.trim();
    if (newUsername !== "") {
        get(ref(db, "users")).then((sn) => {
            Object.keys(sn.val()).forEach((el) => {
                get(ref(db, `/users/${el}`)).then((sn_) => {
                    if (id.get("id") === sn.val()[el]["id"].toString()) {
                        if (confirm("Are you sure you want to change your username?")) {
                            // Update username
                            set(ref(db, `users/${newUsername}`), sn_.val());
                            remove(ref(db, `/users/${el}`)); // Delete old data
                            window.location.href = 'members.html'; // Redirect
                        }
                    }
                });
            });
        });
    } else {
        alert("Please enter a valid username.");
    }
});
