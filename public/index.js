const firebaseConfig = {
  apiKey: "AIzaSyB_pxw4fcp0Sr7lxHn0cZnibqISVfXlS9g",
  authDomain: "logicmojo-may.firebaseapp.com",
  projectId: "logicmojo-may",
  storageBucket: "logicmojo-may.appspot.com",
  messagingSenderId: "271463577439",
  appId: "1:271463577439:web:2e1a2c2db89db79ae1e8ea",
  measurementId: "G-L5CC5VQNQM",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Set database variable
var database = firebase.database();

let loggedInUserData;
let loggedInUserUid;

function save() {
  database.ref("problems/" + 1).set({
    id: 1,
    category: "arrasssy",
    problemName: "Two Sum",
    problemLink: "https://leetcode.com/problems/two-sum/",
    notes: "use maos",
    code: `if(} {
    
    
    
    
    
            ddjdjd
            ddjdjd
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
            ddd
        }`,
  });

  alert("Saved");
}

var problems = [];

function loadProblems() {
  const tbody = document.querySelector("#table tbody");

  // Remove all rows from the table body
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }

  problems = [];

  // Retrieve all key-value pairs
  database.ref("problems").once("value", function (snapshot) {
    // The 'snapshot' object contains all the data in your Firebase database

    // Loop through each child node
    snapshot.forEach(function (childSnapshot) {
      // Get the key and value of the current child
      var key = childSnapshot.key;
      var value = childSnapshot.val();

      // Push the key-value pair to the array
      problems.push({ key: key, value: value });
    });

    Object.values(problems).forEach(({ value: problem }) => {
      const storedObjectString = localStorage.getItem("loggedInUserData");

      loggedInUserData = JSON.parse(storedObjectString);

      const tbody = table.getElementsByTagName("tbody")[0];

      // Create a new row
      const row = tbody.insertRow(-1);

      const cell1 = row.insertCell(0);
      //cell1.contentEditable = true;
      const cell2 = row.insertCell(1);
      cell2.contentEditable = true;
      const cell3 = row.insertCell(2);
      const cell4 = row.insertCell(3);
      cell4.contentEditable = true;
      cell4.style.whiteSpace = "pre-line";
      const cell5 = row.insertCell(4);
      const cell6 = row.insertCell(5);
      const cell7 = row.insertCell(6);
      cell1.innerHTML = problem.id;
      cell2.innerHTML = problem.category;
      cell3.innerHTML = `<a class="link-light" target="_blank" href=${problem.problemLink}>${problem.problemName}</a>`;
      // cell4.innerHTML = `<textarea>${
      //   loggedInUserData.notes[problem.id]
      // }</textarea>`;

      cell4.innerHTML = problem.notes;
      //cell5.innerHTML = `<button onclick="openCode(${problem.id})">View Code</button>`;

      cell5.innerHTML = `<button
      type="button"
      class="btn btn-primary"
      data-bs-toggle="modal"
      data-bs-target="#exampleModal"
      onclick='openCode(${problem.id})'
    >
      View Code
    </button>`;
      cell7.innerHTML = `<button class="btn btn-primary" onclick="editProblem(event, ${problem.id})">Submit</button>`;
    });
  });
}

const table = document.getElementById("table");
const login = document.getElementById("login");
const logout = document.getElementById("logout");
const signup = document.getElementById("signup");
const navTabs = document.getElementById("nav-tabs");

function openCode(id) {
  let codeModalBody = document.getElementById("code-modal-body");
  codeModalBody.style.whiteSpace = "pre-line";
  codeModalBody.innerText = `${
    problems.find((problem) => problem.key == id).value.code
  }`;
}

function closeCode() {
  backdrop.style.display = "none";
  codeContainer.style.display = "none";
}

function editProblem(event, id) {
  const row = event.target.closest("tr");
  console.log(row);
  const cells = row.querySelectorAll("td");
  const rowData = Array.from(cells).map((cell) => cell.textContent.trim());
  console.log(rowData);
  database.ref("problems/" + rowData[0]).update({
    id: rowData[0],
    category: rowData[1],
    problemName: cells[2].querySelectorAll('input')[0].value,
    problemLink: cells[2].querySelectorAll('input')[1].value,
    notes: rowData[3],
    code: cells[4].innerText,
  });

  loadProblems();
}

function register(e) {
  e.preventDefault();
  let email = document.getElementById("regemail").value;
  let password = document.getElementById("regpassword").value;
  let username = document.getElementById("regusername").value;

  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((res) => {
      let user = {
        username,
        email,
        password,
      };

      firebase
        .database()
        .ref(`users/${res.user.uid}`)
        .set(user)
        .then(() => {
          alert("New user is registered");
        });
    })

    .catch((err) => {
      if (err.code == "auth/email-already-in-use")
        alert("Email Already exists");
      console.log(err);
    });
}

function onLogin(e) {
  e.preventDefault();

  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((res) => {
      localStorage.setItem("isLoggedIn", "true");

      login.style.display = "none";
      logout.style.display = "block";
      signup.style.display = "none";
      table.style.display = "block";
      navTabs.style.display = "none";
      firebase
        .database()
        .ref(`users/${res.user.uid}`)
        .once("value", (data) => {
          loggedInUserUid = res.user.uid;
          loggedInUserData = data.val();
          const objectString = JSON.stringify(loggedInUserData);
          localStorage.setItem("loggedInUserData", objectString);
          alert("Successfully Logged In");
          loadProblems();
          console.log(data.val());
        });
    });
}

function onLogout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("loggedInUserData");
  table.style.display = "none";
  login.style.display = "block";
  logout.style.display = "none";
  navTabs.style.display = "flex";

  const tbody = document.querySelector("#table tbody");

  // Remove all rows from the table body
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }

  problems = [];
}

if (localStorage.getItem("isLoggedIn") == "true") {
  table.style.display = "block";
  loadProblems();
} else {
  login.style.display = "block";
  signup.style.display = "block";

  toggleAuth();
}

function toggleAuth() {
  if (signup.style.display == "none") {
    login.style.display = "none";
    signup.style.display = "block";
    document.getElementById("login-tab").className = "nav-link";
    document.getElementById("signup-tab").className = "nav-link active";
  } else {
    login.style.display = "block";
    signup.style.display = "none";
    document.getElementById("login-tab").className = "nav-link active";
    document.getElementById("signup-tab").className = "nav-link";
  }
}

function addProblem() {
  const tbody = table.getElementsByTagName("tbody")[0];

  // Create a new row
  const row = tbody.insertRow(-1);

  const cell1 = row.insertCell(0);
  cell1.contentEditable = true;
  const cell2 = row.insertCell(1);
  cell2.contentEditable = true;
  const cell3 = row.insertCell(2);
  
  cell3.innerHTML =`<input placeholder="Problem Name" id="problem-name"> 
  <input placeholder="Problem Link" id="problem-link">`
  const cell4 = row.insertCell(3);
  cell4.contentEditable = true;
  cell4.contentEditable = true;
  cell4.style.whiteSpace = "pre-line";
  const cell5 = row.insertCell(4);
  cell5.contentEditable = true;
  const cell6 = row.insertCell(5);
  const cell7 = row.insertCell(6);


  cell7.innerHTML = `<button class="btn btn-primary" onclick="editProblem(event, ${1})">Submit</button>`;
}
