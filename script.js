// 🔥 Replace with your Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let currentFilter = "all";

// ➕ Add Task
function addTask() {
  const text = document.getElementById("taskInput").value.trim();
  const priority = document.getElementById("priority").value;
  const dueDate = document.getElementById("dueDate").value;

  if (text === "") return;

  db.collection("tasks").add({
    text,
    priority,
    dueDate,
    completed: false,
    createdAt: new Date()
  });

  document.getElementById("taskInput").value = "";
}

// 🔍 Filter
function filterTasks(type) {
  currentFilter = type;
  loadTasks();
}

// 🔄 Load Tasks
function loadTasks() {
  db.collection("tasks")
    .orderBy("createdAt", "desc")
    .onSnapshot(snapshot => {
      const list = document.getElementById("taskList");
      list.innerHTML = "";

      snapshot.forEach(doc => {
        const data = doc.data();

        if (currentFilter === "completed" && !data.completed) return;
        if (currentFilter === "pending" && data.completed) return;

        const li = document.createElement("li");
        li.classList.add(data.priority.toLowerCase());

        if (data.completed) li.classList.add("completed");

        const span = document.createElement("span");
        span.innerText = `${data.text} (${data.priority}) - ${data.dueDate || "No date"}`;

        span.onclick = () => {
          db.collection("tasks").doc(doc.id).update({
            completed: !data.completed
          });
        };

        const actions = document.createElement("div");
        actions.classList.add("actions");

        // ✏ Edit
        const edit = document.createElement("button");
        edit.innerText = "✏";
        edit.onclick = () => {
          const newText = prompt("Edit task:", data.text);
          if (newText) {
            db.collection("tasks").doc(doc.id).update({ text: newText });
          }
        };

        // ❌ Delete
        const del = document.createElement("button");
        del.innerText = "🗑";
        del.onclick = () => {
          db.collection("tasks").doc(doc.id).delete();
        };

        actions.appendChild(edit);
        actions.appendChild(del);

        li.appendChild(span);
        li.appendChild(actions);

        list.appendChild(li);
      });
    });
}

// Start app
loadTasks();