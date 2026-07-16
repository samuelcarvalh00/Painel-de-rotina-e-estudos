let taskform = document.getElementById('task-form')
let cardsgrid = document.querySelector('.cards-grid')

let taskslist = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : []

function renderizarcards(listadetarefas = taskslist
){
    cardsgrid.innerHTML = ''

    if(listadetarefas.length === 0){
        cardsgrid.innerHTML = `<p class="text-gray-500 text-center col-span-full py-8">Nenhuma tarefa foi encontrada com esses filtros.</p>`
        return
    }

    listadetarefas.forEach(task => {
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

})
renderizarcards()

let aplicarfiltros = () => {
    const filtrotech = document.getElementById('filter-tech').value
      const filtrostatus = document.getElementById('filter-status').value
        const filtropriority= document.getElementById('filter-priority').value
            const tarefasfiltradas = taskslist.filter(task => {
                const batetech = filtrotech === 'todos' || task.tech === filtrotech
                const batestatus = filtrostatus === 'todos' || task.status === filtrostatus
                let priorityconvertida = task.priority
                if(filtropriority === 'baixa') priorityconvertida = 'low'
                if(filtropriority === 'media') priorityconvertida = 'medium'
                if(filtropriority === 'alta') priorityconvertida = 'high'
                const batepriority = filtropriority === 'todos' || priorityconvertida === filtropriority
                
                return batetech && batestatus && batepriority
            })


renderizarcards(tarefasfiltradas)
}

const btnfiltrar = document.getElementById('btn-filtro')
btnfiltrar.addEventListener('click',aplicarfiltros)