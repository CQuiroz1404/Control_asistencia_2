document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('#licenciasTable tbody');
    const refreshBtn = document.getElementById('btnRefreshLic');
    const filtroRutInput = document.getElementById('filtroRut');
    const btnAplicarFiltro = document.getElementById('btnAplicarFiltro');
    const btnLimpiarFiltro = document.getElementById('btnLimpiarFiltro');
    const ESTADOS = ['Pendiente', 'Aprobada', 'Rechazada'];
    let cacheLicencias = [];

    async function fetchLicencias() {
        try {
            const res = await fetch('/api/admin/licencias', { credentials: 'include' });
            if (!res.ok) throw new Error('Error al cargar licencias');
            const data = await res.json();
            cacheLicencias = data.licencias || [];
            renderRows(cacheLicencias);
        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'No se pudieron cargar las licencias', 'error');
        }
    }

    function renderRows(items) {
        tableBody.innerHTML = '';
        if (!items.length) {
            tableBody.innerHTML = '<tr><td colspan="11" class="text-center text-muted">No hay licencias</td></tr>';
            return;
        }
        const rows = items.map(l => {
            const usuario = l.usuario ? `${l.usuario.nombre} ${l.usuario.apellido} (${l.usuario.rut || ''})` : `ID ${l.id_usuario}`;
            
            const isOwnLicense = window.currentUser && l.usuario && l.usuario.id === window.currentUser.id;
            const disabledAttr = isOwnLicense ? 'disabled' : '';

            const select = `<select class="form-select form-select-sm estado-select" data-id="${l.id}" ${disabledAttr}>${ESTADOS.map(e => `<option value="${e}" ${e === l.estado ? 'selected' : ''}>${e}</option>`).join('')}</select>`;
            return `<tr>
                <td>${usuario}</td>
                <td>${select}</td>
                <td class="text-end">
                    <button class="btn btn-sm btn-secondary me-1 btn-ver" data-id="${l.id}"><i class="fa-solid fa-eye"></i> Ver</button>
                    <button class="btn btn-sm btn-primary btn-guardar" data-id="${l.id}" ${disabledAttr}><i class="fa-solid fa-floppy-disk"></i> Guardar</button>
                </td>
            </tr>`;
        }).join('');
        tableBody.innerHTML = rows;
    }

    async function updateEstado(id, estado) {
        try {
            const res = await fetch(`/api/admin/licencias/${id}/estado`, {
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
            Swal.fire('Actualizado', 'Estado de la licencia actualizado', 'success');
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

    // Ver detalle en modal (oculta ID de licencia)
    tableBody.addEventListener('click', (e) => {
        const btnVer = e.target.closest('.btn-ver');
        if (!btnVer) return;
        const id = Number(btnVer.getAttribute('data-id'));
        const l = cacheLicencias.find(x => x.id === id);
        if (!l) return;
        const usuario = l.usuario ? `${l.usuario.nombre} ${l.usuario.apellido} (${l.usuario.rut || ''})` : `ID ${l.id_usuario}`;
        const detalleHtml = `
            <div class="row g-2">
                <div class="col-md-6"><strong>Usuario</strong><div>${usuario}</div></div>
                <div class="col-md-6"><strong>Folio</strong><div>${l.folio || ''}</div></div>
                <div class="col-md-4"><strong>Emisión</strong><div>${l.fecha_emision || ''}</div></div>
                <div class="col-md-4"><strong>Desde</strong><div>${l.fecha_inicio || ''}</div></div>
                <div class="col-md-4"><strong>Hasta</strong><div>${l.fecha_fin || ''}</div></div>
                <div class="col-md-4"><strong>Días Reposo</strong><div>${l.dias_reposo ?? ''}</div></div>
                <div class="col-md-8"><strong>Profesional</strong><div>${l.profesional || ''}</div></div>
                <div class="col-md-6"><strong>Nombre Trabajador</strong><div>${l.nombre_trabajador || ''}</div></div>
                <div class="col-md-6"><strong>RUT Trabajador</strong><div>${l.rut_trabajador || ''}</div></div>
                <div class="col-md-4"><strong>Edad</strong><div>${l.edad_trabajador ?? ''}</div></div>
                <div class="col-md-4"><strong>Sexo</strong><div>${l.sexo_trabajador || ''}</div></div>
                <div class="col-md-4"><strong>Tipo Licencia</strong><div>${l.tipo_licencia || ''}</div></div>
                <div class="col-12"><strong>Dirección Reposo</strong><div>${l.direccion_reposo || ''}</div></div>
                <div class="col-12"><strong>Teléfono</strong><div>${l.telefono_contacto || ''}</div></div>
            </div>
        `;
        const body = document.getElementById('detalleLicenciaBody');
        body.innerHTML = detalleHtml;
        const modal = new bootstrap.Modal(document.getElementById('licenciaDetalleModal'));
        modal.show();
    });

    // Filtrado por RUT (cliente)
    function normalizeRut(s) {
        return String(s || '').replace(/\.|-/g, '').toLowerCase();
    }
    function applyFilter() {
        const term = normalizeRut(filtroRutInput?.value || '');
        if (!term) { renderRows(cacheLicencias); return; }
        const filtered = cacheLicencias.filter(l => {
            const rut = l.usuario && l.usuario.rut ? normalizeRut(l.usuario.rut) : '';
            return rut.includes(term);
        });
        renderRows(filtered);
    }
    btnAplicarFiltro?.addEventListener('click', applyFilter);
    btnLimpiarFiltro?.addEventListener('click', () => {
        if (filtroRutInput) filtroRutInput.value = '';
        renderRows(cacheLicencias);
    });

    refreshBtn?.addEventListener('click', fetchLicencias);

    fetchLicencias();
});


