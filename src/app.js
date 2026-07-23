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
    
    // Criamos as opções do select checando qual é o status atual da tarefa para vir marcado (selected)
    card.innerHTML = `<div class="card-header">
            <h3>${task.name}</h3>
            <span class="badge-alta">${task.priority}</span>
        </div>
        <p class="card-info"><strong>Tecnologia:</strong> ${task.tech}</p>
        <p class="card-info"><strong>Horas:</strong> ${task.hours}h</p>
        <div class="card-footer">
            <select onchange="atualizarstatustarefa(${task.id}, this.value)" class="select-status-card">
                <option value="pendente" ${task.status === 'pendente' ? 'selected' : ''}>Pendente</option>
                <option value="fazendo" ${task.status === 'fazendo' ? 'selected' : ''}>Fazendo</option>
                <option value="feito" ${task.status === 'feito' ? 'selected' : ''}>Feito</option>
            </select>
            <button onclick="deletartarefa(${task.id})" class="text-red-600 hover:text-red-800 text-sm cursor-pointer">Excluir</button>
        </div>`
        cardsgrid.appendChild(card)
});
}

window.deletartarefa = function(id){
    taskslist = taskslist.filter(task => task.id !== id)
    localStorage.setItem('tasks', JSON.stringify(taskslist))
    renderizarcards()
    atualizarpainelprogresso()
}

window.atualizarstatustarefa = function(id, novostatus){
    taskslist = taskslist.map(task => {
        if (task.id === id) {
            return { ...task, status: novostatus}
        }
        return task
    })
    localStorage.setItem('tasks', JSON.stringify(taskslist))
    atualizarpainelprogresso()
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
atualizarpainelprogresso()
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


const btnlight = document.getElementById('btn-light')
const btndark = document.getElementById('btn-dark')
const htmlelement = document.documentElement

let aplicartema = (tema) =>{
    if(tema === 'dark'){
        htmlelement.classList.add('dark')
        localStorage.setItem('theme', 'dark')
    } else{
         htmlelement.classList.remove('dark')
        localStorage.setItem('theme', 'light')
    }
}

const temasalvo = localStorage.getItem('theme')

if(temasalvo){
    aplicartema(temasalvo)
}else{
    aplicartema('dark')
}


btnlight.addEventListener('click', () => aplicartema('light'))
btndark.addEventListener('click', () => aplicartema('dark'))

function atualizarpainelprogresso(){
    const pgeral = document.getElementById('progresso-geral')
    const divhorastech = document.getElementById('horas-tecnologia')
    const pPrioridades = document.getElementById('total-prioridades')

    const total = taskslist.length

    if(total === 0){
        pgeral.textContent = "Total: 0 | Feitas 0 (0%)"
        divhorastech.innerHTML = "<p class'text-gray-400'>Nenhum hora registrada.</p>"
        pPrioridades.textContent = "Alta: 0 | Média: 0 | Baixa: 0"
        return
    }

    const feitas = taskslist.filter(task => task.status === 'feito').length
    const porcentagem = Math.round((feitas/total) * 100)
    pgeral.textContent = `Total: ${total} | Feitas ${feitas} (${porcentagem}%)`

    const horasagrupadas = taskslist.reduce((acumulador, task) => {
        const tech = task.tech.toUpperCase()
        const horas = Number(task.hours) || 0

        if(!acumulador[tech]){
            acumulador[tech] = 0
        }

        acumulador[tech] +=horas
        return acumulador
}, {})

divhorastech.innerHTML = Object.entries(horasagrupadas).map(([tech,horas]) => `<p><strong>${tech}:</strong> ${horas}h</p>`).join('')



let alta = taskslist.filter(task => task.priority === 'high' || task.priority === 'alta').length
let media = taskslist.filter(task => task.priority === 'medium' || task.priority === 'media').length
let baixa = taskslist.filter(task => task.priority === 'low' || task.priority === 'baixa').length

pPrioridades.textContent = `Alta: ${alta} | Média: ${media} | Baixa: ${baixa}`

}




function exportarparacsv(){
    if(taskslist.length === 0){
        alert("Não há tarefas para exportar")
        return
    }


const cabecalho = ["id","name","tech","priority","status","hours"]

const linhas = taskslist.map(task => [
    task.id,
    `"${task.name.replace(/"/g, '""')}"`, 
        `"${task.tech}"`,
        `"${task.priority}"`,
        `"${task.status}"`,
        task.hours
    ].join(","));

let conteudocsv = [cabecalho.join(","), ...linhas].join("\n")

const blob = new Blob([conteudocsv], {type: "text/csv;charset-utf-8;"})
const url = URL.createObjectURL(blob)

const linkinvisivel = document.createElement("a")
linkinvisivel.setAttribute("href", url)
linkinvisivel.setAttribute("download", `tarefas_${Date.now()}.csv`)
document.body.appendChild(linkinvisivel)

linkinvisivel.click()
document.body.removeChild(linkinvisivel)

}
document.getElementById("btn-exportar-csv")?.addEventListener("click", exportarparacsv)

renderizarcards()
atualizarpainelprogresso()