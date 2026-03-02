let proyectos = [];
let tiposProyecto = [];
let modo = "nuevo";

let filtroTipo = "Todos";
let filtroEstatus = "Todos";

let estatusLista = ["Creado", "Procesando", "Finalizado"];

/* ================= FAB ================= */

fab.onclick = () => fabMenu.classList.toggle("hidden");

/* ================= MODAL ================= */

function abrirModal(titulo) {
  modalTitulo.textContent = titulo;
  modalProyecto.classList.remove("hidden");
}

function cerrarModal() {
  modalProyecto.classList.add("hidden");
  formProyecto.reset();
  btnEliminarProyecto.classList.add("hidden");
}

/* ================= CARGAS ================= */

async function cargarProyectos() {

  proyectos = await getProyectos();

  pintarProyectos();
  llenarSelectProyectos();
}

async function cargarTiposProyecto() {

  tiposProyecto = await getTipos_Proyecto();

  proyectoTipo.innerHTML = `<option value="">Seleccione</option>`;

  tiposProyecto.forEach(t => {

    proyectoTipo.innerHTML += `
      <option value="${t.id}">
        ${t.clasificacion}
      </option>
    `;

  });

  pintarFiltros();
}

function cargarEstatus() {

  proyectoStatus.innerHTML = `<option value="">Seleccione</option>`;

  estatusLista.forEach(e => {

    proyectoStatus.innerHTML += `
      <option value="${e}">
        ${e}
      </option>
    `;

  });

  pintarFiltrosEstatus();
}

/* ================= FILTROS ================= */

function pintarFiltros() {

  const contenedor = document.getElementById("filtrosTipo");

  contenedor.innerHTML = `
    <button onclick="filtrarTipo('Todos')" class="btn-filtro">
      Todos
    </button>
  `;

  tiposProyecto.forEach(t => {

    contenedor.innerHTML += `
      <button 
        onclick="filtrarTipo('${t.id}')"
        class="btn-filtro text-white"
        style="background:${t.color}"
      >
        ${t.clasificacion}
      </button>
    `;

  });

}

function pintarFiltrosEstatus() {

  const contenedor = document.getElementById("filtrosEstatus");

  contenedor.innerHTML = `
    <button onclick="filtrarEstatus('Todos')" class="btn-filtro">
      Todos
    </button>
  `;

  estatusLista.forEach(e => {

    let color = "#6b7280";

    if (e === "Creado") color = "#2563eb";
    if (e === "Procesando") color = "#f59e0b";
    if (e === "Finalizado") color = "#10b981";

    contenedor.innerHTML += `
      <button 
        onclick="filtrarEstatus('${e}')"
        class="btn-filtro text-white"
        style="background:${color}"
      >
        ${e}
      </button>
    `;

  });

}

function filtrarTipo(tipo) {
  filtroTipo = tipo;
  pintarProyectos();
}

function filtrarEstatus(estado) {
  filtroEstatus = estado;
  pintarProyectos();
}

/* ================= PINTAR PROYECTOS ================= */

function pintarProyectos() {

  listaProyectos.innerHTML = "";

  let lista = proyectos;

  if (filtroTipo !== "Todos") {
    lista = lista.filter(p => p.id_tipo_proyecto == filtroTipo);
  }

  if (filtroEstatus !== "Todos") {
    lista = lista.filter(p => p.status == filtroEstatus);
  }

  lista.forEach(p => {

    const tipo = tiposProyecto.find(t => t.id == p.id_tipo_proyecto);

    const colorEstado =
      p.status === "Creado" ? "#2563eb" :
      p.status === "Procesando" ? "#f59e0b" :
      "#10b981";

    listaProyectos.innerHTML += `

      <div class="card-proyecto cursor-pointer"
           onclick="abrirTickets(${p.id})"
           oncontextmenu="editarDesdeTarjeta(event, ${p.id})">

        <div class="flex justify-between items-center mb-2">

          <span 
            class="px-2 py-1 text-xs rounded text-white"
            style="background:${tipo?.color || "#999"}"
          >
            ${tipo?.clasificacion || ""}
          </span>

          <span 
            class="px-2 py-1 text-xs rounded text-white"
            style="background:${colorEstado}"
          >
            ${p.status}
          </span>

        </div>

        <h3 class="titulo">${p.proyecto}</h3>

        <p class="descripcion">
          ${p.descripcion || ""}
        </p>

      </div>

    `;

  });

}

/* ================= CLICK TARJETA ================= */

function abrirTickets(id) {

  window.location.href = `tickets.html?id=${id}`;

}

function editarDesdeTarjeta(e, id) {

  e.preventDefault();

  const proyecto = proyectos.find(p => p.id == id);

  if (!proyecto) return;

  modo = "editar";

  selectorProyecto.classList.add("hidden");

  proyectoId.value = proyecto.id;
  proyectoNombre.value = proyecto.proyecto;
  proyectoDescripcion.value = proyecto.descripcion;
  proyectoTipo.value = proyecto.id_tipo_proyecto;
  proyectoStatus.value = proyecto.status;
  proyectoCliente.value = proyecto.cliente_interno;

  btnEliminarProyecto.classList.remove("hidden");

  abrirModal("Editar Proyecto");

}

/* ================= SELECT PROYECTOS ================= */

function llenarSelectProyectos() {

  selectProyecto.innerHTML = `<option value="">Seleccione</option>`;

  proyectos.forEach(p => {

    selectProyecto.innerHTML += `
      <option value="${p.id}">
        ${p.proyecto}
      </option>
    `;

  });

}

selectProyecto.addEventListener("change", () => {

  const proyecto = proyectos.find(p => p.id == selectProyecto.value);
  if (!proyecto) return;

  proyectoId.value = proyecto.id;
  proyectoNombre.value = proyecto.proyecto;
  proyectoDescripcion.value = proyecto.descripcion;
  proyectoTipo.value = proyecto.id_tipo_proyecto;
  proyectoStatus.value = proyecto.status;
  proyectoCliente.value = proyecto.cliente_interno;

});

/* ================= ACCIONES FAB ================= */

function accionNuevo() {

  modo = "nuevo";

  selectorProyecto.classList.add("hidden");
  proyectoNombre.parentElement.classList.remove("hidden");
  btnEliminarProyecto.classList.add("hidden");

  abrirModal("Nuevo Proyecto");

}

function accionEditar() {

  modo = "editar";

  selectorProyecto.classList.remove("hidden");
  proyectoNombre.parentElement.classList.remove("hidden");
  btnEliminarProyecto.classList.add("hidden");

  abrirModal("Editar Proyecto");

}

function accionEliminar() {

  modo = "eliminar";

  selectorProyecto.classList.remove("hidden");
  proyectoNombre.parentElement.classList.add("hidden");
  btnEliminarProyecto.classList.remove("hidden");

  abrirModal("Eliminar Proyecto");

}

/* ================= GUARDAR ================= */

formProyecto.addEventListener("submit", async e => {

  e.preventDefault();

  const data = {

    proyecto: proyectoNombre.value,
    descripcion: proyectoDescripcion.value,
    id_tipo_proyecto: parseInt(proyectoTipo.value),
    status: proyectoStatus.value,
    cliente_interno: proyectoCliente.value,
    fecha_creacion: new Date().toISOString().split("T")[0],
    borrado: false

  };

  if (modo === "nuevo") {

    await crearProyecto(data);

  }

  if (modo === "editar") {

    await actualizarProyecto(proyectoId.value, data);

  }

  cerrarModal();
  cargarProyectos();

});

/* ================= ELIMINAR ================= */

async function confirmarEliminarProyecto() {

  if (!proyectoId.value)
    return alert("Seleccione un proyecto");

  await eliminarProyecto(proyectoId.value);

  cerrarModal();
  cargarProyectos();

}

/* ================= INIT ================= */

async function init() {

  await cargarTiposProyecto();
  cargarEstatus();
  await cargarProyectos();

}

init();
