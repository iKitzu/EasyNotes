function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const loginData = {
        email: email,
        password: password
    };

    // Enviar la solicitud POST al endpoint de inicio de sesión
    fetch('http://localhost:8080/auth/login', { // Asegúrate de que esta URL sea correcta
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData)
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Credenciales incorrectas. Verifique su email y contraseña.');
            } else if (response.status === 500) {
                throw new Error('Error en el servidor. Inténtelo más tarde.');
            } else {
                throw new Error('Credenciales incorrectas. Verifique su email y contraseña.');
            }
        }
        return response.json();
    })
    .then(data => {
        const token = data.token; // Asegúrate de que la API devuelva un campo token

        // Guardar el token en el localStorage
        if (token) {
            localStorage.setItem('token', token);

            // Redirigir a otra página después del inicio de sesión exitoso
            window.location.href = '/assets/view/index.html'; // Cambia esto según tu estructura de rutas
        } else {
            throw new Error('No se recibió el token de autenticación.');
        }
    })
    .catch(error => {
        const errorMessage = document.getElementById('errorMessage');
        errorMessage.style.display = 'block';
        errorMessage.textContent = error.message;
    });
}

// Add floating label behavior
document.querySelectorAll('input').forEach(input => {
    input.setAttribute('placeholder', ' ');
});
