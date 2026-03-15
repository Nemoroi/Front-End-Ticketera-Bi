let filtroAsignado = "Todos"
let proyectosGlobal = []
let ticketsGlobal = []
let miembrosGlobal = []
let modo = "nuevo"
let proyectoId = null

const fab = document.getElementById("fab")
const fabMenu = document.getElementById("fabMenu")

fab.onclick = () => fabMenu.classList.toggle("hidden")


/* ================= INIT ================= */

document.addEventListener("DOMContentLoaded", async () => {

  const params = new URLSearchParams(window.location.search)
  proyectoId = params.get("id")

  await cargarMiembros()
  pintarFiltrosAsignado()
  await cargarProyectos()
  await cargarTickets()


})

/* ================= PROYECTOS ================= */

async function cargarProyectos(){

  proyectosGlobal = await getProyectos()

}

/* ================= MIEMBROS ================= */

async function cargarMiembros(){

  miembrosGlobal = await getMiembros()

  ticketAsignado.innerHTML = `<option value="">Sin asignar</option>`

  miembrosGlobal.forEach(m => {

    ticketAsignado.innerHTML += `
      <option value="${m.id}">
        ${m.nombre}
      </option>
    `

  })

}


/* ================= CARGAR ================= */

async function cargarTickets(){

  const tickets = await getTickets()
  const estatus = await getEstatus()

  if(proyectoId){

    ticketsGlobal = tickets.filter(t => t.id_proyecto == proyectoId)

  }else{

    ticketsGlobal = tickets

    if(filtroAsignado !== "Todos"){

  ticketsGlobal = ticketsGlobal.filter(
    t => String(t.id_asignado) === String(filtroAsignado)
  )

}

  }

  llenarSelectTickets()

  renderKanban(ticketsGlobal, estatus)

}

/* ================= FILTROS ================= */

function pintarFiltrosAsignado(){

  const contenedor = document.getElementById("filtrosAsignado")

  contenedor.innerHTML = `
    <button onclick="filtrarAsignado('Todos')" class="btn-filtro">
      Todos
    </button>
  `

  miembrosGlobal.forEach(m => {

    contenedor.innerHTML += `
      <button
        onclick="filtrarAsignado('${m.id}')"
        class="btn-filtro text-white bg-blue-500"
      >
        ${m.nombre}
      </button>
    `

  })

}

function filtrarAsignado(id){

  filtroAsignado = id

  const estatus = document.querySelectorAll(".columna")

  cargarTickets()

}

/* ================= KANBAN ================= */

function renderKanban(tickets,estatus){

  const app = document.getElementById("app")

  app.innerHTML = `
  
  <h2 class="text-2xl font-bold mb-4">
  ${proyectoId ? "Tickets del Proyecto" : "Todos los Tickets"}
  </h2>

  <div class="flex gap-4 overflow-x-auto pb-4">

  ${estatus.map(e => `

  <div
  class="bg-gray-200 p-3 rounded w-72 flex-shrink-0 columna"
  data-estatus="${e.id}"
  ondragover="event.preventDefault()"
  ondrop="onDrop(event)"
  >

  <h3 class="font-semibold mb-2">
  ${e.clasificacion}
  </h3>

  ${tickets
  .filter(t => Number(t.id_estatus) === Number(e.id))
  .map(t => {

    const miembro = miembrosGlobal.find(
      m => Number(m.id) === Number(t.id_asignado)
    )

    const proyecto = proyectosGlobal.find(
      p => String(p.id) === String(t.id_proyecto)
    )

    return `

    <div
    class="ticket bg-white p-3 rounded shadow mb-2 cursor-move"
    draggable="true"
    data-id="${t.id}"
    ondragstart="onDragStart(event)"
    >

    <h4 class="font-semibold">
    ${t.tarea}
    </h4>

    <p class="text-sm text-gray-600">
    ${t.descripcion || ""}
    </p>

    <p class="text-xs text-purple-600">
    📁 ${proyecto ? proyecto.proyecto : "Sin proyecto"}
    </p>

    <p class="text-xs text-blue-600 mt-2">
    ${miembro ? "👤 " + miembro.nombre : "👤 Sin asignar"}
    </p>

    </div>

    `

  }).join("")}

  </div>

  `).join("")}

  </div>
  `

}


/* ================= SELECT ================= */

function llenarSelectTickets(){

  selectTicket.innerHTML = `<option value="">Seleccione</option>`

  ticketsGlobal.forEach(t =>{

    selectTicket.innerHTML += `
    
    <option value="${t.id}">
    ${t.tarea}
    </option>
    
    `

  })

}


selectTicket.addEventListener("change",()=>{

  const t = ticketsGlobal.find(x=>x.id == selectTicket.value)

  if(!t) return

  ticketId.value = t.id
  ticketTarea.value = t.tarea
  ticketDescripcion.value = t.descripcion
  ticketAsignado.value = t.id_asignado || ""

})


/* ================= MODAL ================= */

function abrirModalTicket(titulo){

  modalTituloTicket.textContent = titulo
  modalTicket.classList.remove("hidden")

}


function cerrarModalTicket(){

  limpiarFormularioTicket()
  modalTicket.classList.add("hidden")

}

function limpiarFormularioTicket(){

  ticketId.value = ""
  ticketTarea.value = ""
  ticketDescripcion.value = ""
  ticketAsignado.value = ""
  selectTicket.value = ""

  // NO uses formTicket.reset() — no limpia selects dinámicos confiablemente

}

/* ================= FAB ================= */

function accionNuevoTicket(){

  modo = "nuevo"

  fabMenu.classList.add("hidden")
  limpiarFormularioTicket()        // ← limpia ANTES de abrir

  selectorTicket.classList.add("hidden")
  btnEliminarTicket.classList.add("hidden")

  abrirModalTicket("Nuevo Ticket")

}


function accionEditarTicket(){

  modo = "editar"

  selectorTicket.classList.remove("hidden")
  btnEliminarTicket.classList.add("hidden")

  abrirModalTicket("Editar Ticket")

}


function accionEliminarTicket(){

  modo = "eliminar"

  selectorTicket.classList.remove("hidden")
  btnEliminarTicket.classList.remove("hidden")

  abrirModalTicket("Eliminar Ticket")

}


/* ================= GUARDAR ================= */

formTicket.addEventListener("submit", async e =>{

  e.preventDefault()

  const btn = e.target.querySelector("button[type='submit']")
  const textoOriginal = btn.textContent

  btn.textContent = "Guardando..."
  btn.disabled = true

  const data = {

    tarea: ticketTarea.value,
    descripcion: ticketDescripcion.value,
    id_proyecto: parseInt(proyectoId),
    id_estatus: 1,
    id_asignado: ticketAsignado.value ? parseInt(ticketAsignado.value) : null

  }

try{

    if(modo==="nuevo"){

      const res = await fetch(`${API_URL}/tickets/`,{
        method:"POST",
        headers:{ "Content-Type":"application/json"},
        body:JSON.stringify(data)
      })

      console.log("respuesta POST:", res.status, await res.json()) // ← AGREGA ESTO

    }

    if(modo==="editar"){

      const res = await fetch(`${API_URL}/tickets/${ticketId.value}`,{
        method:"PUT",
        headers:{ "Content-Type":"application/json"},
        body:JSON.stringify({
          tarea: ticketTarea.value,
          descripcion: ticketDescripcion.value,
          id_proyecto: parseInt(proyectoId),
          id_asignado: ticketAsignado.value ? parseInt(ticketAsignado.value) : null
        })
      })

      console.log("respuesta PUT:", res.status, await res.json()) // ← AGREGA ESTO

    }

    cerrarModalTicket()
    await cargarTickets()

  } catch(err) {               // ← AGREGA ESTE CATCH

    console.error("ERROR al guardar:", err)

  } finally {

    btn.textContent = textoOriginal
    btn.disabled = false

  }

})


/* ================= ELIMINAR ================= */

async function confirmarEliminarTicket(){

  await fetch(`${API_URL}/tickets/${ticketId.value}`,{
    method:"DELETE"
  })

  cerrarModalTicket()

  location.reload()

}


/* ================= DRAG ================= */

function onDragStart(event){

  event.dataTransfer.setData(
    "ticketId",
    event.target.dataset.id
  )

}


/* ================= DROP ================= */

async function onDrop(event){

  event.preventDefault()

  const ticketId = parseInt(
    event.dataTransfer.getData("ticketId")
  )

  const nuevoEstatus = parseInt(
    event.currentTarget.dataset.estatus
  )

  const ticket = ticketsGlobal.find(
    t => t.id === ticketId
  )

  if(!ticket) return
  if(ticket.id_estatus === nuevoEstatus) return


  ticket.id_estatus = nuevoEstatus

  const estatus = await getEstatus()

  renderKanban(ticketsGlobal, estatus)


  await fetch(`${API_URL}/tickets/${ticketId}`,{

    method:"PUT",
    headers:{ "Content-Type":"application/json"},
    body:JSON.stringify({
      tarea: ticket.tarea,
      descripcion: ticket.descripcion,
      id_proyecto: ticket.id_proyecto,
      id_estatus: nuevoEstatus,
      id_asignado: ticket.id_asignado
    })

  })

}
