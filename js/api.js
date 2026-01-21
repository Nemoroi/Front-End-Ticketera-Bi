const API_URL = "https://backend-ticketera-bi.onrender.com"; // reemplaza con tu URL

// Obtener todos los proyectos
async function getProyectos() {
  const res = await fetch(`${API_URL}/proyectos`);
  return res.json();
}

// Obtener todos los tickets
async function getTickets() {
  const res = await fetch(`${API_URL}/tickets`);
  return res.json();
}

// Obtener tickets de un proyecto específico
async function getTicketsByProyecto(id) {
  const tickets = await getTickets();
  return tickets.filter(t => t.id_proyecto === id);
}

// Obtener estatus
async function getEstatus() {
  const res = await fetch(`${API_URL}/estatus`);
  return res.json();
}

// Obtener miembros
async function getMiembros() {
  const res = await fetch(`${API_URL}/miembros`);
  return res.json();
}
