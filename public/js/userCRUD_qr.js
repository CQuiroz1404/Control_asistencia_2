document.addEventListener('DOMContentLoaded', () => {
    console.log('userCRUD_qr.js cargado.'); // Puedes dejar esto si quieres, o eliminarlo también

    const showQrLoginModal = document.getElementById('showQrLoginModal');
    const qrcodeCanvas = document.getElementById('qrcodeCanvas');

    // Delegación de eventos para los botones "Ver QR" -> ahora pedimos la imagen al servidor
    document.getElementById('usersTable').addEventListener('click', async (event) => {
        console.log('Evento de clic detectado en usersTable.');
        const target = event.target.closest('.view-qr-btn');
        if (target) {
            console.log('Botón Ver QR clicado.');
            // Intentar obtener el id del usuario a partir de la fila
            const row = target.closest('tr');
            const userId = row ? row.getAttribute('data-id') : null;

            if (!userId) {
                console.error('No se pudo determinar el id de usuario para generar el QR.');
                Swal.fire('Error', 'No se pudo determinar el usuario para generar el QR.', 'error');
                return;
            }

            try {
                // Limpiar canvas/area
                qrcodeCanvas.innerHTML = '';
                // Petición al servidor para generar el DataURL del QR
                const resp = await fetch(`/api/admin/users/${userId}/generate-qr-login`);
                if (!resp.ok) {
                    const jsonErr = await resp.json().catch(() => ({}));
                    throw new Error(jsonErr.error || 'Error generando QR en servidor');
                }
                const { dataUrl } = await resp.json();

                // Crear una imagen y colocar el dataUrl
                const img = document.createElement('img');
                img.src = dataUrl;
                img.alt = 'QR de login';
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
                qrcodeCanvas.appendChild(img);

                const modal = new bootstrap.Modal(showQrLoginModal);
                modal.show();
            } catch (err) {
                console.error('Error obteniendo QR desde servidor:', err);
                Swal.fire('Error', err.message || 'No se pudo generar el QR', 'error');
            }
        }
    });

    // Limpiar el QR al cerrar el modal
    showQrLoginModal.addEventListener('hidden.bs.modal', () => {
        console.log('Modal QR cerrado, limpiando canvas.');
        qrcodeCanvas.innerHTML = '';
    });
});