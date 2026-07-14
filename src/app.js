let taskform = document.getElementById('task-form')
let cardsgrid = document.querySelector('.cards-grid')

let taskslist = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : []

function renderizarcards(){
    cardsgrid.innerHTML = ''

    taskslist.forEach(task => {
        const card = document.createElement('div')
        card.className = 'card-tarefa'
        card.innerHTML = `<div class="card-header">
                <h3>${task.name}</h3>
                <span class="badge-alta">${task.priority}</span>
            </div>
            <p class="card-info"><strong>Tecnologia:</strong> ${task.tech}</p>
            <p class="card-info"><strong>Horas:</strong> ${task.hours}h</p>
            <div class="card-footer">
                <span class="badge-fazendo">${task.status}</span>
                <button onclick="deletartarefa(${task.id})" class="text-red-600 hover:text-red-800 text-sm cursor-pointer">Excluir</button>
            </div>`
            cardsgrid.appendChild(card)
    });
}

window.deletartarefa = function(id){
    taskslist = taskslist.filter(task => task.id !== id)
    localStorage.setItem('tasks', JSON.stringify(taskslist))
    renderizarcards()
}


taskform.addEventListener('submit', function(event){
    event.preventDefault()


const taskname = document.getElementById('task-name').value 
const tasktech = document.getElementById('task-tech').value 
const taskpriority = document.getElementById('task-priority').value 
const taskstatus = document.getElementById('task-status').value 
const taskhours = document.getElementById('task-hours').value 

 const newtask ={
    id:Date.now(),
    name: taskname,
    tech: tasktech,
    priority: taskpriority,
    status: taskstatus,
    hours: taskhours
 }

 taskslist.push(newtask)

 localStorage.setItem('tasks', JSON.stringify(taskslist))

 taskform.reset()
renderizarcards()

alert("Tarefa adicionada com sucesso", newtask)
alert("lista completa de tarefas", taskslist)
})
renderizarcards()