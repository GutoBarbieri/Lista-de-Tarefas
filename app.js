window.onload = function() {
    loadLists();
};

function loadLists() {
    const lists = JSON.parse(localStorage.getItem('taskLists') || '[]');
    lists.forEach(list => {
        addList(list.title, list.tasks);
    });
}

document.getElementById('newList').addEventListener('click', function() {
    document.getElementById('modal').classList.remove('hidden');
    document.getElementById('headerr').classList.add('desfoque');
});

document.getElementById('newListForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const title = document.getElementById('inputTitle').value;
    if (title) {
        addList(title);
        document.getElementById('inputTitle').value = ''; // Limpar input
        document.getElementById('modal').classList.add('hidden');
        document.getElementById('headerr').classList.remove('desfoque')
    }
});

function addList(title, tasks = []) {
    const section = document.createElement('section');
    section.className = "list-section";
    section.dataset.title = title; // Armazena o título para referência futura
    section.innerHTML = `
        <div class="list-header">
            <span class="title">${title}</span>
            <button class="delete-list" onclick="deleteList(this)">Delete List</button>
        </div>
        <div class="task-entry">
            <input type="text" placeholder="Adicionar nova tarefa" />
            <button onclick="addTask(this)">+</button>
        </div>
        <ul class="tasks"></ul>
    `;
    document.getElementById('listContainer').appendChild(section);

    // Recria tarefas se existirem
    tasks.forEach(task => {
        const input = section.querySelector('.task-entry input');
        input.value = task.text;
        addTask(section.querySelector('.task-entry button'), task.completed);
    });

    updateLocalStorage();
}

function deleteList(button) {
    const listSection = button.closest('.list-section');
    listSection.remove();
}



function addTask(button, completed = false) {
    const input = button.previousElementSibling;
    if (input.value) {
        const li = document.createElement('li');
        li.innerHTML = `
            <input type="checkbox" class="task-checkbox" onclick="toggleTaskStatus(this)" ${completed ? 'checked' : ''}>
            <span class="task-text" style="text-decoration: ${completed ? 'line-through' : 'none'};">${input.value}</span>
            <button class="edit-task" onclick="editTask(this)"><i class="fi fi-rr-edit"></i></button>
            <button class="delete-task" onclick="deleteTask(this)"><i class="fi fi-rr-cross"></i></button>
        `;
        button.parentElement.nextElementSibling.appendChild(li);
        input.value = ''; // Limpa o input após adicionar
    }
    updateLocalStorage();
}

function deleteList(button) {
    const listSection = button.closest('.list-section');
    listSection.remove();
    updateLocalStorage();
}

function deleteTask(button) {
    button.parentElement.remove();
    updateLocalStorage();
}

function editTask(button) {
    const span = button.previousElementSibling;
    const currentText = span.textContent;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentText;
    input.onblur = function() {
        span.textContent = this.value;
        this.replaceWith(span);
        updateLocalStorage();
    };
    span.replaceWith(input);
    input.focus();
}

function toggleTaskStatus(checkbox) {
    const taskText = checkbox.nextElementSibling;
    if (checkbox.checked) {
        taskText.style.textDecoration = 'line-through';
    } else {
        taskText.style.textDecoration = 'none';
    }
    updateLocalStorage()
}

function updateLocalStorage() {
    const lists = [];
    document.querySelectorAll('.list-section').forEach(section => {
        const title = section.dataset.title;
        const tasks = [];
        section.querySelectorAll('.tasks li').forEach(li => {
            tasks.push({
                text: li.querySelector('.task-text').textContent,
                completed: li.querySelector('.task-checkbox').checked
            });
        });
        lists.push({ title, tasks });
    });
    localStorage.setItem('taskLists', JSON.stringify(lists));
}