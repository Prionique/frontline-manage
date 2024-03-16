const par = new URLSearchParams(window.location.search)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, get, set, ref, child, push, remove } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
const firebaseConfig = {
  apiKey: "AIzaSyAkknZyH3N6-ZMm31c8o3zFQSv8s45YMDY",
  authDomain: "frontline-sport.firebaseapp.com",
  databaseURL: "https://frontline-sport-default-rtdb.firebaseio.com",
  projectId: "frontline-sport",
  storageBucket: "frontline-sport.appspot.com",
  messagingSenderId: "446981204542",
  appId: "1:446981204542:web:23010639c79d8a6cef7f6f",
  measurementId: "G-4S6SFCJ90N",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

var trainingId = par.get("id")

document.getElementById("dtt").innerHTML = `${trainingId.slice(
    8,
    10
  )}.${trainingId.slice(5, 7)}&nbsp&nbsp<strong>${trainingId.slice(
    11
  )}</strong>`;



function displayUsers() {
  const trainingList = document.getElementById("trainingList");
  const trainingId = par.get("id");
  // Reference to the specific training node in Firebase
  const trainingRef = ref(db, `users/`);
  const checkedUsersRef = ref(db, `kick/trainings/${trainingId}/present`);

  let checkedUsers = []; // Initialize an empty array to store checked users

  // Fetch the checked users from Firebase
  get(checkedUsersRef).then((snapshot) => {
    if (snapshot.exists()) {
      checkedUsers = snapshot.val(); // Assign the checked users to the array
    }

  });

  // Fetch all users and generate checkboxes
  get(trainingRef).then((snapshot) => {
    const users = snapshot.val();
    let checkboxesHTML = "";

    if (users) {
      Object.keys(users).forEach((userId) => {
        if (snapshot.val()[userId]["dir"].includes("kick")) {
          const user = snapshot.val()[userId];
          let cardColor = ''; // Set initial card color
          if (
            user['cost'] && // Check if there's a cost associated
            user['cost']['kick'] !== 'free' && // Make sure it's not a free user
            (!user['paymentHistory'] || !user['paymentHistory']['kick'])
          ) {
            // If user hasn't paid, set card color to red
            cardColor = 'red';
          }

          // Determine if the user is checked
          
          const isChecked = checkedUsers.includes(snapshot.val()[userId]["id"]);

          checkboxesHTML += `
            <div class="checkbox-container" style="color: ${cardColor};">
              <input type="checkbox" id="${userId}" class="user_check" ${isChecked ? 'checked' : ''}>
              <label for="${userId}" style="width: 100%;">${userId}</label>
            </div>`;
        }
      });
      trainingList.innerHTML = checkboxesHTML;
    }
  });
}


displayUsers();

// Save button event listener
document.getElementById("saveBtn").addEventListener("click", () => {
  const Checkboxes = document.querySelectorAll(
    "#trainingList input[type=checkbox]:checked"
  );
  console.log(Checkboxes)
  Checkboxes.forEach((checkbox) => {
    console.log(checkbox.id)
    get(ref(db, `users/${checkbox.id}`)).then(sn => {
      console.log(sn.val()["id"])
    })
  });
  const promises = []; // Array to store all the promises

  Checkboxes.forEach((checkbox) => {
    const promise = get(ref(db, `users/${checkbox.id}`)).then(
      (snapshot) => {
        if (snapshot.val()["dir"].includes("kick")) {
          return snapshot.val()["id"];
        }
        return null; // Return null if the condition is not met
      }
    );
    promises.push(promise); // Add the promise to the array
  });

  // Wait for all promises to resolve
  Promise.all(promises).then((results) => {
    // Filter out null values and create a new array
    const ar = results.filter((id) => id !== null);
    console.log(ar); // Log the updated array
    console.log(results)
    // Set the data to Firebase after all promises are resolved
    let d = new URLSearchParams(window.location.search);
    set(ref(db, `kick/trainings/${d.get("id")}/present`), ar);

    // Show the alert
    const alertMessage = document.getElementById("alertMessage");
    alertMessage.style.display = "block";

    // Hide the alert after a few seconds (e.g., 3 seconds)
    setTimeout(() => {
      alertMessage.style.display = "none";
    }, 3000); // 3000 milliseconds = 3 seconds
  });
});

// Initially hide the alert when the page loads
document.addEventListener("DOMContentLoaded", () => {
  const alertMessage = document.getElementById("alertMessage");
  alertMessage.style.display = "none";
});
