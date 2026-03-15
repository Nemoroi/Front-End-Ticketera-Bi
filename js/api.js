const API_URL = "https://backend-ticketera-bi.onrender.com";


// =========================
// PROYECTOS
// =========================

// Obtener todos los proyectos
async function getProyectos() {
  const res = await fetch(`${API_URL}/proyectos`);
  return res.json();
}

// Crear proyecto
async function crearProyecto(data) {
  const res = await fetch(`${API_URL}/proyectos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return res.json();
}

// Actualizar proyecto
async function actualizarProyecto(id, data) {
  const res = await fetch(`${API_URL}/proyectos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return res.json();
}

// Eliminar proyecto
async function eliminarProyecto(id) {
  const res = await fetch(`${API_URL}/proyectos/${id}`, {
    method: "DELETE"
  });

  return res.json();
}


// =========================
// TICKETS
// =========================

// Obtener todos los tickets
async function getTickets() {
  const res = await fetch(`${API_URL}/tickets`);
  return res.json();
}

// Obtener tickets por proyecto
async function getTicketsByProyecto(id) {
  const tickets = await getTickets();
  return tickets.filter(t => t.id_proyecto === id);
}


// =========================
// ESTATUS
// =========================

async function getEstatus() {
  const res = await fetch(`${API_URL}/estatus`);
  return res.json();
}


// =========================
// MIEMBROS
// =========================

async function getMiembros() {
  const res = await fetch(`${API_URL}/miembros`);
  return res.json();
}


// =========================
// TIPOS DE PROYECTO
// =========================

async function getTipos_Proyecto() {
  const res = await fetch(`${API_URL}/tipos-proyecto`);
  return res.json();
}


// =========================
// PRIORIDADES
// =========================

async function getPrioridades() {
  const res = await fetch(`${API_URL}/prioridades`);
  return res.json();
}