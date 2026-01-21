document.addEventListener("DOMContentLoaded", async () => {
  const app = document.getElementById("app");

  // 🔹 Loader (Render puede demorar)
  app.innerHTML = `
    <div class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
    </div>
  `;

  // 🔹 Leer ID del proyecto desde la URL
  const params = new URLSearchParams(window.location.search);
  const proyectoId = parseInt(params.get("id"));

  if (!proyectoId) {
    app.innerHTML = "<p>Proyecto no válido</p>";
    return;
  }

  // 🔹 Traer datos
  const tickets = await getTickets();
  const estatus = await getEstatus();

  const ticketsProyecto = tickets.filter(
    t => t.id_proyecto === proyectoId
  );

  // 🔹 Construir Kanban
  const kanban = `
    <h2 class="text-2xl font-bold mb-4">Tickets del Proyecto</h2>
    <div class="flex gap-4 overflow-x-auto">
      ${estatus.map(e => `
        <div class="bg-gray-200 p-3 rounded w-64 flex-shrink-0">
          <h3 class="font-semibold mb-2">${e.clasificacion}</h3>

          ${ticketsProyecto
            .filter(t => t.id_estatus === e.id)
            .map(t => `
              <div class="bg-white p-3 rounded shadow mb-2">
                <h4 class="font-semibold">${t.tarea}</h4>
                <p class="text-sm text-gray-600">${t.descripcion || ''}</p>
              </div>
            `).join("")}
        </div>
      `).join("")}
    </div>
  `;

  app.innerHTML = kanban;
});
