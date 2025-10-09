document.addEventListener('DOMContentLoaded', () => {
    const qrLoginModal = document.getElementById('qrLoginModal');
    const qrReaderLogin = document.getElementById('qr-reader-login');
    const qrLoginMessage = document.getElementById('qrLoginMessage');

    let html5QrcodeScannerLogin = null;

    const showLoginMessage = (message, isError = false) => {
        qrLoginMessage.innerHTML = `<div class="alert alert-${isError ? 'danger' : 'info'}">${message}</div>`;
    };

    const startQrScannerLogin = () => {
        qrLoginMessage.innerHTML = ''; // Limpiar mensajes anteriores
        if (!html5QrcodeScannerLogin) {
            html5QrcodeScannerLogin = new Html5QrcodeScanner(
                "qr-reader-login",
                { fps: 10, qrbox: { width: 250, height: 250 } },
                /* verbose= */ false
            );
        }

        html5QrcodeScannerLogin.render(qrCodeSuccessCallbackLogin, qrCodeErrorCallbackLogin);
        console.log('Escáner QR para login iniciado.');
    };

    const stopQrScannerLogin = async () => {
        if (html5QrcodeScannerLogin && html5QrcodeScannerLogin.isScanning) {
            await html5QrcodeScannerLogin.stop();
            console.log('Escáner QR para login detenido.');
        }
    };

    qrLoginModal.addEventListener('shown.bs.modal', () => {
        startQrScannerLogin();
    });

    qrLoginModal.addEventListener('hidden.bs.modal', () => {
        stopQrScannerLogin();
    });

    const qrCodeSuccessCallbackLogin = async (decodedText, decodedResult) => {
        console.log(`QR escaneado para login: ${decodedText}`, decodedResult);
        await stopQrScannerLogin();

        const qrCodeContent = decodedText; // El token JWT del QR

        try {
            showLoginMessage('Verificando código QR...');
            const response = await fetch('/auth/login-qr', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ qrCodeContent }),
            });

            const data = await response.json();

            if (response.ok) {
                showLoginMessage('Inicio de sesión exitoso. Redireccionando...', false);
                // Espera 2 segundos para que el usuario vea el mensaje antes de redirigir
                setTimeout(() => {
                    window.location.href = data.redirectUrl || '/dashboard'; // Redirigir al dashboard
                }, 2000);
            } else {
                showLoginMessage(data.error || 'Error al iniciar sesión con QR', true);
            }
        } catch (error) {
            console.error('Error enviando datos de QR para login al backend:', error);
            showLoginMessage('Error de conexión con el servidor.', true);
        }
    };

    const qrCodeErrorCallbackLogin = (errorMessage) => {
        // Manejar errores del escáner de forma silenciosa si no es crítico
        // console.error(`Error de QR en login: ${errorMessage}`);
    };
});
