document.addEventListener('DOMContentLoaded', () => {
    const inputLicencia = document.getElementById('archivo-licencia');
    const resultadosDiv = document.getElementById('resultados-licencia');
    const spinner = document.getElementById('spinner');
    const enviarLicenciaBtn = document.getElementById('enviar-licencia-btn');
    const idUsuarioInput = document.getElementById('id-usuario');

    let archivoPdfSeleccionado = null; // Variable para almacenar el archivo PDF
    let datosExtraidosGlobal = null; // Variable para almacenar los datos extraídos

    if (inputLicencia) { // Solo ejecutar si el input existe en la página actual
        inputLicencia.addEventListener('change', async (event) => {
            const file = event.target.files[0];
            archivoPdfSeleccionado = file; // Almacena el archivo seleccionado

            // Validar que el archivo sea PDF
            if (!file) {
                return; // No hay archivo seleccionado
            }

            if (file.type !== 'application/pdf') {
                // Limpiar el input
                event.target.value = '';
                archivoPdfSeleccionado = null;

                // Mostrar error con Swal.fire
                Swal.fire({
                    icon: 'error',
                    title: 'Archivo no válido',
                    text: 'Solo se permiten archivos PDF. Por favor selecciona un archivo con extensión .pdf',
                    confirmButtonText: 'Entendido'
                });
                return;
            }

            // Si es PDF válido, proceder con el procesamiento
            resultadosDiv.style.display = 'none';
            spinner.style.display = 'block';
            enviarLicenciaBtn.disabled = true; // Deshabilita el botón mientras se procesa

            try {
                const fileReader = new FileReader();
                fileReader.onload = async function() {
                    const typedarray = new Uint8Array(this.result);
                    const pdf = await pdfjsLib.getDocument(typedarray).promise;
                    let textoCompleto = '';

                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const textContent = await page.getTextContent();
                        const pageText = textContent.items.map(item => item.str).join(' ');
                        textoCompleto += pageText + '\n';
                    }

                    // Usamos la función de pdfExtractor.js
                    const datos = extraerDatosLicencia(textoCompleto);
                    datosExtraidosGlobal = datos; // Almacena los datos extraídos globalmente

                    // Asegurar que el spinner se muestre por al menos 1.5 segundos
                    setTimeout(() => {
                        document.getElementById('folio').textContent = datos.folio;
                        document.getElementById('nombre').textContent = datos.nombre;
                        document.getElementById('rut').textContent = datos.rut;
                        document.getElementById('edad').textContent = datos.edad;
                        document.getElementById('sexo').textContent = datos.sexo;
                        document.getElementById('tipoLicencia').textContent = datos.tipoLicencia;
                        document.getElementById('fechaEmision').textContent = datos.fechaEmision;
                        document.getElementById('inicioReposo').textContent = datos.inicioReposo;
                        document.getElementById('fechaTermino').textContent = datos.fechaTermino;
                        document.getElementById('dias').textContent = datos.dias;
                        document.getElementById('profesional').textContent = datos.profesional;
                        document.getElementById('telefono').textContent = datos.telefono;
                        document.getElementById('direccion').textContent = datos.direccion;

                        spinner.style.display = 'none';
                        resultadosDiv.style.display = 'block';
                        enviarLicenciaBtn.disabled = false; // Habilita el botón
                    }, 1500);
                };
                fileReader.readAsArrayBuffer(file);
            } catch (error) {
                console.error('Error al procesar el PDF:', error);
                spinner.style.display = 'none';
                enviarLicenciaBtn.disabled = true; // Mantén el botón deshabilitado si hay un error
                Swal.fire({
                    icon: 'error',
                    title: 'Error al procesar el PDF',
                    text: 'Hubo un error al procesar el archivo PDF. Asegúrate de que sea un archivo válido.',
                    confirmButtonText: 'Entendido'
                });
            }
        });
    }

    // Event listener para el botón de enviar licencia
    if (enviarLicenciaBtn) {
        enviarLicenciaBtn.addEventListener('click', async (event) => {
            event.preventDefault(); // Evita el envío del formulario tradicional

            // Comprobaciones más específicas para dar feedback claro al usuario
            // Intentar localizar el input de id_usuario si no existe en la variable
            if (!idUsuarioInput || !idUsuarioInput.value) {
                const alt = document.querySelector('input[name="id_usuario"]');
                if (alt && alt.value) {
                    idUsuarioInput = alt; // usar fallback
                }
            }

            if (!archivoPdfSeleccionado) {
                (typeof Swal !== 'undefined') ? Swal.fire({
                    icon: 'warning',
                    title: 'Archivo faltante',
                    text: 'Por favor selecciona un archivo PDF antes de enviar.',
                    confirmButtonText: 'Entendido'
                }) : alert('Por favor selecciona un archivo PDF antes de enviar.');
                return;
            }

            if (!datosExtraidosGlobal) {
                (typeof Swal !== 'undefined') ? Swal.fire({
                    icon: 'warning',
                    title: 'Datos no extraídos',
                    text: 'Aún no se han extraído los datos del PDF. Espera a que termine el procesamiento y vuelve a intentarlo.',
                    confirmButtonText: 'Entendido'
                }) : alert('Aún no se han extraído los datos del PDF. Espera a que termine el procesamiento y vuelve a intentarlo.');
                return;
            }

            if (!idUsuarioInput || !idUsuarioInput.value) {
                (typeof Swal !== 'undefined') ? Swal.fire({
                    icon: 'warning',
                    title: 'Usuario no identificado',
                    text: 'No se pudo determinar el ID del usuario. Inicia sesión o recarga la página.',
                    confirmButtonText: 'Entendido'
                }) : alert('No se pudo determinar el ID del usuario. Inicia sesión o recarga la página.');
                return;
            }

            const formData = new FormData();
            formData.append('archivoLicencia', archivoPdfSeleccionado); // 'archivoLicencia' debe coincidir con el nombre esperado en Multer
            formData.append('id_usuario', idUsuarioInput.value);

            // Añadir todos los datos extraídos al formData
            for (const key in datosExtraidosGlobal) {
                // Asegúrate de que los nombres de las claves coincidan con los del modelo si es necesario.
                // Aquí hago una pequeña adaptación para que coincidan con los nombres del modelo.
                let fieldName = key;
                if (key === 'nombre') fieldName = 'nombre_trabajador';
                else if (key === 'rut') fieldName = 'rut_trabajador';
                else if (key === 'edad') fieldName = 'edad_trabajador';
                else if (key === 'sexo') fieldName = 'sexo_trabajador';
                else if (key === 'direccion') fieldName = 'direccion_reposo';
                else if (key === 'telefono') fieldName = 'telefono_contacto';
                else if (key === 'fechaEmision') fieldName = 'fecha_emision';
                else if (key === 'inicioReposo') fieldName = 'fecha_inicio'; // Corregido
                else if (key === 'fechaTermino') fieldName = 'fecha_fin';
                else if (key === 'dias') fieldName = 'dias_reposo';
                else if (key === 'tipoLicencia') fieldName = 'tipo_licencia';
                else if (key === 'profesional') fieldName = 'profesional'; // Ya coincide

                formData.append(fieldName, datosExtraidosGlobal[key]);
            }

            // Mostrar spinner y deshabilitar botón
            spinner.style.display = 'block';
            resultadosDiv.style.display = 'none';
            enviarLicenciaBtn.disabled = true;

            try {
                const response = await fetch('/api/licenses', {
                    method: 'POST',
                    body: formData, // No establecer Content-Type, fetch lo hace automáticamente con FormData
                    credentials: 'include' // Enviar cookies (accessToken) con la petición
                });

                // Antes de parsear JSON, comprobar content-type para evitar intentar parsear HTML
                const contentType = response.headers.get('content-type') || '';
                if (contentType.includes('application/json')) {
                    const result = await response.json();

                    if (response.ok) {
                        Swal.fire({
                            icon: 'success',
                            title: '¡Éxito!',
                            text: result.message,
                            confirmButtonText: 'Aceptar'
                        }).then(() => {
                            window.location.href = '/dashboard_usuario';
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: result.error || 'No se pudo crear la licencia.',
                            confirmButtonText: 'Entendido'
                        });
                    }
                } else if (contentType.includes('text/html') || response.status === 302 || response.status === 401) {
                    // Probablemente un redirect al login o respuesta HTML (sesión expirada)
                    Swal.fire({
                        icon: 'warning',
                        title: 'Sesión expirada o no autenticado',
                        text: 'Tu sesión pudo haber expirado. Por favor inicia sesión de nuevo.',
                        confirmButtonText: 'Ir al login'
                    }).then(() => {
                        window.location.href = '/login';
                    });
                } else {
                    // Respuesta inesperada, intentar leer texto para debugging
                    const txt = await response.text();
                    console.error('Respuesta inesperada del servidor:', txt);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Respuesta inesperada del servidor. Revisa la consola para más detalles.',
                        confirmButtonText: 'Entendido'
                    });
                }
            } catch (error) {
                console.error('Error al enviar licencia:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de conexión',
                    text: 'Hubo un error de red o de servidor al intentar enviar la licencia.',
                    confirmButtonText: 'Entendido'
                });
            } finally {
                spinner.style.display = 'none';
                enviarLicenciaBtn.disabled = false;
                resultadosDiv.style.display = 'block'; // Mostrar resultados nuevamente si no se redirige
            }
        });
    }
});
