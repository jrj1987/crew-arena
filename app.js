(() => {
  const STORAGE_KEY = "todo-tasks-v1";

  const form = document.getElementById("task-form");
  const input = document.getElementById("task-input");
  const list = document.getElementById("task-list");
  const emptyMsg = document.getElementById("empty-msg");

  /** @type {{id: string, text: string, done: boolean}[]} */
  let tasks = load();

  function load() {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  function render() {
    list.innerHTML = "";

    for (const task of tasks) {
      const li = document.createElement("li");
      if (task.done) li.classList.add("done");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.done;
      checkbox.setAttribute("aria-label", "Marcar como hecha");
      checkbox.addEventListener("change", () => {
        task.done = checkbox.checked;
        save();
        render();
      });

      const text = document.createElement("span");
      text.textContent = task.text;

      const del = document.createElement("button");
      del.type = "button";
      del.className = "delete-btn";
      del.textContent = "Eliminar";
      del.addEventListener("click", () => {
        tasks = tasks.filter((t) => t.id !== task.id);
        save();
        render();
      });

      li.append(checkbox, text, del);
      list.appendChild(li);
    }

    emptyMsg.hidden = tasks.length > 0;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    tasks.push({ id: crypto.randomUUID(), text, done: false });
    input.value = "";
    save();
    render();
    input.focus();
  });

  render();
})();
