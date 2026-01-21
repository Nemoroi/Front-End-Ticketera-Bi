let ticketsGlobal = [];
let cambiosPendientes = [];

document.addEventListener("DOMContentLoaded", async () => {
  const app = document.getElementById("app");

  // Loader
  app.innerHTML = `
    <div class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
    </div>
  `;

  const tickets = await getTickets();
  const estatus = await getEstatus();

  ticketsGlobal = tickets;

  renderKanban(tickets, estatus);

  document.getElementById("btnGuardar").addEventListener("click", () => {
    console.log("Cambios pendientes:", cambiosPendientes);
    alert("Cambios listos para enviar al backend (ver consola)");
  });
});

function renderKanban(tickets, estatus) {
  const app = document.getElementById("app");

  app.innerHTML = `
    <h2 class="text-2xl font-bold mb-4">Todos los Tickets</h2>

    <div class="flex gap-4 overflow-x-auto pb-4">
      ${estatus.map(e => `
        <div
          class="bg-gray-200 p-3 rounded w-72 sm:w-80 flex-shrink-0 columna"
          data-estatus="${e.id}"
          ondragover="event.preventDefault()"
          ondrop="onDrop(event)"
        >
          <h3 class="font-semibold mb-2">${e.clasificacion}</h3>

          ${tickets
            .filter(t => t.id_estatus === e.id)
            .map(t => `
              <div
                class="ticket bg-white p-3 rounded shadow mb-2 cursor-move text-sm sm:text-base"
                draggable="true"
                data-id="${t.id}"
                ondragstart="onDragStart(event)"
              >
                <h4 class="font-semibold">${t.tarea}</h4>
                <p class="text-sm text-gray-600">${t.descripcion || ""}</p>
              </div>
            `).join("")}
        </div>
      `).join("")}
    </div>
  `;
}

// ===== DRAG & DROP =====

function onDragStart(event) {
  event.dataTransfer.setData("ticketId", event.target.dataset.id);
}

function onDrop(event) {
  event.preventDefault();

  const ticketId = parseInt(event.dataTransfer.getData("ticketId"));
  const nuevoEstatus = parseInt(event.currentTarget.dataset.estatus);

  const ticket = ticketsGlobal.find(t => t.id === ticketId);

  if (ticket && ticket.id_estatus !== nuevoEstatus) {
    ticket.id_estatus = nuevoEstatus;

    cambiosPendientes.push({
      id_ticket: ticketId,
      nuevo_estatus: nuevoEstatus
    });

    // Re-render visual
    getEstatus().then(estatus => {
      renderKanban(ticketsGlobal, estatus);
    });
  }
}
