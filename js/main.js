document.addEventListener("DOMContentLoaded", async () => {
  const app = document.getElementById("app");

  // Loader inicial
  app.innerHTML = `<div class="flex justify-center items-center h-screen">
                      <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
                    </div>`;

  // Traer proyectos desde backend
  const proyectos = await getProyectos();

  // Renderizar menú
  const menu = `
    <nav class="bg-white shadow p-4 flex justify-between">
      <h1 class="font-bold text-xl">Ticketera BI</h1>
      <div>
        <a href="index.html" class="mr-4 text-blue-500">Proyectos</a>
        <a href="tickets.html" class="text-blue-500">Tickets</a>
      </div>
    </nav>
  `;

  // Renderizar lista de proyectos
  const proyectosHTML = proyectos.map(p => `
    <div class="bg-white p-4 rounded shadow mb-4 cursor-pointer hover:bg-blue-50" onclick="verProyecto(${p.id})">
      <h2 class="font-semibold">${p.proyecto}</h2>
      <p class="text-sm text-gray-600">${p.descripcion}</p>
      <span class="text-xs px-2 py-1 rounded" style="background-color: ${p.id_tipo_proyecto == 1 ? '#03bafc' : p.id_tipo_proyecto == 2 ? '#fcf003' : '#56fc03'}">
        ${p.status}
      </span>
    </div>
  `).join("");

  app.innerHTML = menu + `<div class="p-4">${proyectosHTML}</div>`;
});

// Redirigir a detalle del proyecto
function verProyecto(id) {
  window.location.href = `proyecto.html?id=${id}`;
}
