document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('#justificacionesTable tbody');
    const refreshBtn = document.getElementById('btnRefresh');

    const ESTADOS = ['Pendiente', 'Aprobada', 'Rechazada'];

    async function fetchJustificaciones() {
        try {
            const res = await fetch('/api/admin/justificaciones', { credentials: 'include' });
            if (!res.ok) throw new Error('Error al cargar justificaciones');
            const data = await res.json();
            renderRows(data.justificaciones || []);
        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'No se pudieron cargar las justificaciones', 'error');
        }
    }

    function renderRows(items) {
        tableBody.innerHTML = '';
        if (!items.length) {
            tableBody.innerHTML = '<tr><td colspan="9" class="text-center text-muted">No hay justificaciones</td></tr>';
            return;
        }
        const rows = items.map(j => {
            const usuario = j.usuario ? `${j.usuario.nombre} ${j.usuario.apellido} (${j.usuario.rut || ''})` : `ID ${j.id_usuario}`;
            // j.archivo guarda "<id_usuario>/<filename>"
            const archivo = j.archivo ? `<a href="/uploads_inasistencia/${encodeURIComponent(j.archivo)}" target="_blank">Ver</a>` : '<span class="text-muted">N/A</span>';
            
            const isOwnJustification = window.currentUser && j.usuario && j.usuario.id === window.currentUser.id;
            const disabledAttr = isOwnJustification ? 'disabled' : '';

            const select = `<select class="form-select form-select-sm estado-select" data-id="${j.id}" ${disabledAttr}>
                ${ESTADOS.map(e => `<option value="${e}" ${e === j.estado ? 'selected' : ''}>${e}</option>`).join('')}
            </select>`;

            const fechaSolicitud = j.createdAt ? new Date(j.createdAt).toLocaleString() : '';
            const fechaInicio = j.fecha_inicio ? new Date(j.fecha_inicio).toLocaleDateString() : '';
            const fechaFin = j.fecha_fin ? new Date(j.fecha_fin).toLocaleDateString() : '';

            return `<tr>
                <td>${j.id}</td>
                <td>${usuario}</td>
                <td>${j.motivo}</td>
                <td>${fechaSolicitud}</td>
                <td>${fechaInicio}</td>
                <td>${fechaFin}</td>
                <td>${archivo}</td>
                <td>${select}</td>
                <td class="text-end">
                    <button class="btn btn-sm btn-primary btn-guardar" data-id="${j.id}" ${disabledAttr}><i class="fa-solid fa-floppy-disk"></i> Guardar</button>
                </td>
            </tr>`;
        }).join('');
        tableBody.innerHTML = rows;
    }

    async function updateEstado(id, estado) {
        try {
            const res = await fetch(`/api/admin/justificaciones/${id}/estado`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ estado })
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || 'Error al actualizar');
            }
            await res.json();
            Swal.fire('Actualizado', 'Estado actualizado correctamente', 'success');
        } catch (err) {
            console.error(err);
            Swal.fire('Error', err.message || 'No se pudo actualizar', 'error');
        }
    }

    tableBody.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-guardar');
        if (!btn) return;
        const id = btn.getAttribute('data-id');
        const select = tableBody.querySelector(`.estado-select[data-id="${id}"]`);
        if (!select) return;
        updateEstado(id, select.value);
    });

    refreshBtn?.addEventListener('click', fetchJustificaciones);

    fetchJustificaciones();
});


