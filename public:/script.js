const form = document.getElementById('todo-form');
const list = document.getElementById('todo-list');

async function loadTodos() {
  const res = await fetch('/todos');
  const todos = await res.json();

  list.innerHTML = ''; 

  todos.forEach(todo => {
    const li = document.createElement('li');
    li.textContent = `${todo.name} (Priority: ${todo.priority}) - Fun: ${todo.isFun ? 'Yes' : 'No'}`;

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.onclick = async () => {
      await fetch(`/todos/${todo.id}`, { method: 'DELETE' });
      loadTodos();
    };

    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

form.onsubmit = async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const priority = document.getElementById('priority').value;
  const isFun = document.getElementById('isFun').checked;

  await fetch('/todos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name,
      priority,
      isComplete: false,
      isFun
    })
  });

  form.reset();
  loadTodos();
};

loadTodos();
