document.addEventListener('DOMContentLoaded', function () {
  // Actualizar la URL del Dashboard en la navbar
  const dashboardNavLink = document.querySelector('.navbar-nav .nav-item:nth-child(1) .nav-link');
  if (dashboardNavLink) {
    dashboardNavLink.href = '/admin';
  }

  // Manejo del botón eliminar de la tabla de usuarios en el dashboard
  document.addEventListener('click', function (e) {
    if (e.target.closest('.btn-delete-user-dashboard')) {
      const btn = e.target.closest('.btn-delete-user-dashboard');
      const id = btn.getAttribute('data-id');
      if (!id) return;

      Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminarlo!',
        cancelButtonText: 'Cancelar'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await fetch(`/admin/users/${id}`, {
              method: 'DELETE',
            });

            const resultData = await response.json();

            if (response.ok) {
              Swal.fire(
                '¡Eliminado!',
                resultData.message,
                'success'
              );
              location.reload(); // Recargar la página para actualizar la tabla
            } else {
              Swal.fire('Error', resultData.error || 'Error al eliminar usuario', 'error');
            }
          } catch (error) {
            console.error('Error al eliminar usuario:', error);
            Swal.fire('Error', 'Error de conexión al eliminar usuario', 'error');
          }
        }
      });
    }
  });
});
