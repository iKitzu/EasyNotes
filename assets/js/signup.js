async function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const passwordError = document.getElementById('passwordError');
    const successMessage = document.getElementById('successMessage');

    // Validar longitud de la contraseña
    if (password.length < 8) {
        passwordError.textContent = 'La contraseña debe tener al menos 8 caracteres';
        passwordError.style.display = 'block';
        return false;
    }
    
    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
        passwordError.textContent = '¡Las contraseñas no coinciden!';
        passwordError.style.display = 'block';
        return false;
    }
    
    // Limpiar mensajes de error
    passwordError.style.display = 'none';
    
    const signupData = {
        nombre: name, // Cambiado a "nombre"
        email: email,
        contraseña: password // Cambiado a "contraseña"
    };

    try {
        // Actualiza la URL para que apunte al nuevo endpoint
        const response = await fetch('http://172.16.101.158:8080/notes/api/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(signupData)
        });

        if (!response.ok) {
            if (response.status === 400) {
                throw new Error('Error en la solicitud. Por favor verifica los datos ingresados.');
            } else if (response.status === 500) {
                throw new Error('Error en el servidor. Inténtalo más tarde.');
            } else {
                throw new Error('Error desconocido. Inténtalo más tarde.');
            }
        }

        const data = await response.json();
        successMessage.textContent = '¡Cuenta creada exitosamente!';
        successMessage.style.display = 'block';

        // Redirigir a la página de inicio de sesión después de 2 segundos
        setTimeout(() => {
            window.location.href = 'http://172.16.101.159/index.html';
        }, 2000);
    } catch (error) {
        passwordError.textContent = error.message;
        passwordError.style.display = 'block';
    }
}

// Añadir comportamiento de etiqueta flotante
document.querySelectorAll('input').forEach(input => {
    input.setAttribute('placeholder', ' ');
});

// Validación de contraseña en la entrada
document.getElementById('password').addEventListener('input', function(e) {
    const passwordError = document.getElementById('passwordError');
    if (this.value.length < 8) {
        passwordError.textContent = 'La contraseña debe tener al menos 8 caracteres';
        passwordError.style.display = 'block';
    } else {
        passwordError.style.display = 'none';
    }
});
