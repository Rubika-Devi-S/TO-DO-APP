const list = document.getElementById("todolist");
const input = document.getElementById("taskinput");

// Fetch and display all todos with animations
function fetchTodos() {
  fetch("/api/todos")
    .then((res) => res.json())
    .then((data) => {
      list.innerHTML = "";

      data.forEach((todo, index) => {
        const li = document.createElement("li");
        li.style.animationDelay = `${index * 0.1}s`;
        li.textContent = todo.task;

        if (todo.completed) {
          li.classList.add("completed");
        }

        // Toggle completed on click (task area only)
        li.addEventListener("click", (e) => {
          if (!e.target.classList.contains("delete-btn")) {
            updateTodo(todo.id);
          }
        });

        // Delete button with enhanced styling
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "×";
        deleteBtn.onclick = (e) => {
          e.stopPropagation(); // prevent toggling
          deleteTodo(todo.id);
        };

        li.appendChild(deleteBtn);
        list.appendChild(li);
      });
    })
    .catch((err) => console.error("Error fetching todos:", err));
}

// Add a new todo with validation animation
function addTodo() {
  const task = input.value.trim();
  if (!task) {
    // Shake animation for empty input
    input.style.animation = "shake 0.5s ease-in-out";
    setTimeout(() => {
      input.style.animation = "";
    }, 500);
    return;
  }

  fetch("/api/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task }),
  })
    .then(() => {
      input.value = "";
      input.style.borderColor = "#48dbfb";
      setTimeout(() => {
        input.style.borderColor = "";
      }, 300);
      fetchTodos(); // Refresh with animations
    })
    .catch((err) => console.error("Error adding todo:", err));
}

// Delete a todo with confirmation animation
function deleteTodo(id) {
  fetch(`/api/todos/${id}`, { method: "DELETE" })
    .then(() => {
      // Animate removal of all items then refresh
      const items = list.querySelectorAll("li");
      items.forEach((item, index) => {
        setTimeout(() => {
          item.style.animation = "fadeOut 0.3s ease-out forwards";
        }, index * 50);
      });
      setTimeout(fetchTodos, 400);
    })
    .catch((err) => console.error("Error deleting todo:", err));
}

// Toggle completed
function updateTodo(id) {
  fetch(`/api/todos/${id}`, { method: "PUT" })
    .then(fetchTodos)
    .catch((err) => console.error("Error updating todo:", err));
}

// Load todos on page load with stagger animation
fetchTodos();

// Enter key support
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTodo();
  }
});

// Focus input on page load
window.addEventListener("load", () => {
  input.focus();
});
