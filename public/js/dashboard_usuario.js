document.addEventListener('DOMContentLoaded', () => {
  const asistenciaForm = document.getElementById('asistenciaForm');
  const notificationModalEl = document.getElementById('notificationModal');
  const notificationModal = new bootstrap.Modal(notificationModalEl);
  const notificationModalBody = document.getElementById('notificationModalBody');

  if (asistenciaForm) {
    asistenciaForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const tipo = event.submitter.value;

      try {
        const response = await fetch(`/asistencia/registrar/${usuarioId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tipo })
        });

        const data = await response.json();

        if (response.ok) {
          // Si el marcaje fue de salida, mostramos mensaje + cuenta regresiva y cerramos sesión en 3s
          if (tipo === 'salida') {
            let seconds = 3;
            notificationModalBody.innerHTML = `
              <div class="alert alert-success">
                ${data.message}
                <div class="mt-2">Se procederá a cerrar sesión en <strong id="logout-countdown">${seconds}</strong> segundos...</div>
              </div>
            `;

            // Hacemos el modal no dismissible y ocultamos botones de cierre para que la notificación permanezca
            // Creamos una nueva instancia con opciones no dismissible
            const modalInstance = new bootstrap.Modal(notificationModalEl, { backdrop: 'static', keyboard: false });

            // Ocultar botón de cierre (la 'X') si existe
            const closeBtn = notificationModalEl.querySelector('.btn-close');
            if (closeBtn) closeBtn.style.display = 'none';
            // Ocultar botón 'Cerrar' del footer si existe
            const footerCloseBtn = notificationModalEl.querySelector('.modal-footer .btn[data-bs-dismiss]');
            if (footerCloseBtn) footerCloseBtn.style.display = 'none';

            // Mostrar modal y comenzar cuenta regresiva
            modalInstance.show();

            const countdownEl = document.getElementById('logout-countdown');
            const interval = setInterval(() => {
              seconds -= 1;
              if (countdownEl) countdownEl.textContent = seconds;
              if (seconds <= 0) {
                clearInterval(interval);
                // Redirigir a la ruta de logout del servidor
                window.location.href = '/logout';
              }
            }, 1000);
          } else {
            notificationModalBody.innerHTML = `<div class="alert alert-success">${data.message}</div>`;
          }
        } else {
          notificationModalBody.innerHTML = `<div class="alert alert-danger">${data.error || 'Error al registrar asistencia.'}</div>`;
          // Si es intento de salida y hubo un error (por ejemplo: ya marcó salida), mostrar el modal.
          if (tipo === 'salida') notificationModal.show();
        }
      } catch (error) {
        console.error('Error en la petición de asistencia:', error);
        notificationModalBody.innerHTML = '<div class="alert alert-danger">Error de conexión con el servidor.</div>';
        if (tipo === 'salida') notificationModal.show();
      } finally {
        // Si no es salida, el modal ya se mostrará aquí; para salida ya lo mostramos antes.
        if (tipo !== 'salida') notificationModal.show();
      }
    });
  }

});