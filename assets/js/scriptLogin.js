function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const loginData = { email, password };

    fetch('http://172.16.101.158:8080/notes/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        console.log('Respuesta del servidor:', data); // Verifica la respuesta

        const token = data.token;

        if (token) {
            localStorage.setItem('token', token);
            console.log('Token guardado en localStorage:', token); // Verifica si se guarda correctamente

            // Decodifica el token para obtener el ID del usuario
            const decodedToken = jwt_decode(token);
            const userId = decodedToken.sub;  // El campo "sub" ahora contiene el ID del usuario

            // Guarda el ID en localStorage
            localStorage.setItem('userId', userId);
            console.log('ID de usuario guardado en localStorage:', userId); // Verifica si se guarda correctamente

            // Redirigir al usuario después de iniciar sesión
            window.location.href = 'http://172.16.101.159/assets/view/EasyNotes.html';
        } else {
            throw new Error('No se recibió el token de autenticación.');
        }
    })
    .catch(error => {
        const errorMessage = document.getElementById('errorMessage');
        errorMessage.style.display = 'block';
        errorMessage.textContent = error.message;
        console.error('Error durante el inicio de sesión:', error); // Verifica si hay errores
    });
}

// Add floating label behavior
document.querySelectorAll('input').forEach(input => {
    input.setAttribute('placeholder', ' ');
});