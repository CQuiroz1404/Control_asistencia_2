document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-justificacion');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;

        const formData = new FormData(form);
        // Añadir la hora del cliente (formato compatible con DATETIME: YYYY-MM-DD HH:mm:ss)
        if (typeof moment !== 'undefined') {
            formData.set('client_datetime', moment().format('YYYY-MM-DD HH:mm:ss'));
        }

        try {
            const res = await fetch('/enviar_justificacion', {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });

            const ct = res.headers.get('content-type') || '';
            if (ct.includes('application/json')) {
                const json = await res.json();
                if (res.ok) {
                    Swal.fire({ icon: 'success', title: '¡Enviado!', text: json.message, confirmButtonText: 'Aceptar' })
                    .then(() => { window.location.href = '/dashboard_usuario'; });
                } else {
                    Swal.fire({ icon: 'error', title: 'Error', text: json.error || 'No se pudo enviar la justificación.' });
                }
            } else if (res.status === 302 || res.status === 401) {
                Swal.fire({ icon: 'warning', title: 'Sesión', text: 'Tu sesión expiró o no estás autenticado.' })
                .then(() => { window.location.href = '/login'; });
            } else {
                const txt = await res.text();
                console.error('Respuesta inesperada:', txt);
                Swal.fire({ icon: 'error', title: 'Error', text: 'Respuesta inesperada del servidor.' });
            }
        } catch (err) {
            console.error('Error enviando justificación:', err);
            Swal.fire({ icon: 'error', title: 'Error de red', text: 'No se pudo conectar con el servidor.' });
        } finally {
            if (submitBtn) submitBtn.disabled = false;
        }
    });
});
