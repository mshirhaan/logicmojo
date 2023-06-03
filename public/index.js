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

let isLoggedIn = false;
let loggedInUserData;

function save() {
  database.ref("problems/" + 1).set({
    id: 1,
    category: "array",
    problemName: "Two Sum",
    problemLink: "https://leetcode.com/problems/two-sum/",
    notes: "use maps",
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
      const row = table.insertRow(-1);
      const cell1 = row.insertCell(0);
      const cell2 = row.insertCell(1);
      const cell3 = row.insertCell(2);
      const cell4 = row.insertCell(3);
      const cell5 = row.insertCell(4);
      const cell6 = row.insertCell(5);
      const cell7 = row.insertCell(6);
      cell1.innerHTML = problem.id;
      cell2.innerHTML = problem.category;
      cell3.innerHTML = `<a target="_blank" href=${problem.problemLink}>${problem.problemName}</a>`;
      cell4.innerHTML = `<textarea>${
        loggedInUserData.notes[problem.id]
      }</textarea>`;
      cell5.innerHTML = `<button onclick="openCode(${problem.id})">View Code</button>`;
      cell7.innerHTML = `<button onclick="editProblem(${problem.id})">Submit</button>`;
    });
  });
}

const table = document.getElementById("table");
const login = document.getElementById("login");
const backdrop = document.getElementById("backdrop");
const codeBlock = document.getElementById("code-block");
const codeContainer = document.getElementById("code-container");

function openCode(id) {
  backdrop.style.display = "block";
  codeContainer.style.display = "block";
  codeBlock.innerHTML = problems.find(
    (problem) => problem.key == id
  ).value.code;
}

function closeCode() {
  backdrop.style.display = "none";
  codeContainer.style.display = "none";
}

function editProblem(id) {
  database.ref("problems/" + id).update({
    id: 1,
    category: "arrdday",
    problemName: "Two Sum",
    problemLink: "https://leetcode.com/problems/two-sum/",
    notes: "use maps",
    code: `if(} {
        
        
        
        
        
                ddjdjd
                ddjdjd
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
                ddd
            }`,
  });
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
      isLoggedIn = true;

      login.style.display = "none";
      table.style.display = "block";
      firebase
        .database()
        .ref(`users/${res.user.uid}`)
        .once("value", (data) => {
          loggedInUserData = data.val();
          alert("Successfully Logged In");
          loadProblems();
          console.log(data.val());
        });
    });
}
