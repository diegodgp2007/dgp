const API_URL = 'http://4.204.9.76:5030/api/mensajes';

function getAvatar(nombre) {
  if (!nombre) return '👤';
  return nombre.trim().charAt(0).toUpperCase();
}

let mensajeEditarId = null;

document.addEventListener('DOMContentLoaded', () => {
  // Modal
  const modal = document.getElementById('modal-editar');
  const cerrarModal = document.getElementById('cerrar-modal');
  const guardarCambios = document.getElementById('guardar-cambios');
  const nuevoMensajeInput = document.getElementById('nuevo-mensaje');

  cerrarModal.onclick = () => {
    modal.classList.remove('mostrar');
    mensajeEditarId = null;
  };

  guardarCambios.onclick = async () => {
    if (mensajeEditarId && nuevoMensajeInput.value.trim()) {
      await fetch(`${API_URL}/${mensajeEditarId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensaje: nuevoMensajeInput.value })
      });
      modal.classList.remove('mostrar');
      mensajeEditarId = null;
      cargarMensajes();
    }
  };

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.classList.remove('mostrar');
      mensajeEditarId = null;
    }
  };
});

async function cargarMensajes() {
  const res = await fetch(API_URL);
  const mensajes = await res.json();
  const contenedor = document.getElementById('mensajes');
  contenedor.innerHTML = '';
  mensajes.forEach(m => {
    const div = document.createElement('div');
    div.className = 'mensaje';
    div.innerHTML = `
      <div class="avatar">${getAvatar(m.nombre)}</div>
      <div class="mensaje-contenido">
        <div>
          <span class="mensaje-nombre">${m.nombre}</span>
          <span class="fecha">${new Date(m.fecha).toLocaleString()}</span>
        </div>
        <div class="mensaje-texto" id="texto-${m._id}">${m.mensaje}</div>
        <button class="btn-editar" data-id="${m._id}" data-mensaje="${encodeURIComponent(m.mensaje)}">Editar</button>
        <button class="btn-eliminar" data-id="${m._id}">Eliminar</button>
      </div>
    `;
    contenedor.appendChild(div);
  });

  // Eliminar
  document.querySelectorAll('.btn-eliminar').forEach(btn => {
    btn.onclick = async () => {
      const id = btn.getAttribute('data-id');
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      cargarMensajes();
    };
  });

  // Editar con modal
  document.querySelectorAll('.btn-editar').forEach(btn => {
    btn.onclick = () => {
      mensajeEditarId = btn.getAttribute('data-id');
      const mensajeActual = decodeURIComponent(btn.getAttribute('data-mensaje'));
      document.getElementById('nuevo-mensaje').value = mensajeActual;
      document.getElementById('modal-editar').classList.add('mostrar');
    };
  });
}

document.getElementById('formulario').addEventListener('submit', async e => {
  e.preventDefault();
  const nombre = document.getElementById('nombre').value;
  const mensaje = document.getElementById('mensaje').value;
  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, mensaje })
  });
  document.getElementById('formulario').reset();
  cargarMensajes();
});

cargarMensajes();