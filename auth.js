// Arquivo: auth.js
// Contém a lógica de autenticação usando Firebase Authentication

// SEU CLIENT ID CORRETO (Mantido para o Google Sign-In, se for usado separadamente):
const CLIENT_ID = '91256477872-i17e1vmum1g04s9cig0c2njorau5eld6.apps.googleusercontent.com';

// Importa as instâncias do Firebase (assumindo que firebase_config.js foi carregado)
// As variáveis 'app' e 'auth' são globais após o carregamento de firebase_config.js

/**
 * Realiza o cadastro de um novo usuário com email e senha.
 * @param {string} email - O email do novo usuário.
 * @param {string} password - A senha do novo usuário.
 * @returns {Promise<object>} - Objeto de resultado com sucesso/erro.
 */
async function registerUser(email, password) {
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        
        // Salva o estado de login
        localStorage.setItem('is_logged_in', 'true');
        localStorage.setItem('user_email', userCredential.user.email);
        
        return { success: true, message: "Usuário cadastrado com sucesso!" };
    } catch (error) {
        console.error("Erro no cadastro:", error);
        let message = "Erro desconhecido no cadastro.";
        if (error.code === 'auth/email-already-in-use') {
            message = "Este email já está em uso.";
        } else if (error.code === 'auth/invalid-email') {
            message = "O formato do email é inválido.";
        } else if (error.code === 'auth/weak-password') {
            message = "A senha deve ter pelo menos 6 caracteres.";
        }
        return { success: false, message: message };
    }
}

/**
 * Realiza o login de um usuário com email e senha.
 * @param {string} email - O email do usuário.
 * @param {string} password - A senha do usuário.
 * @returns {Promise<object>} - Objeto de resultado com sucesso/erro.
 */
async function loginUser(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        
        // Salva o estado de login
        localStorage.setItem('is_logged_in', 'true');
        localStorage.setItem('user_email', userCredential.user.email);
        
        return { success: true, message: "Login bem-sucedido!" };
    } catch (error) {
        console.error("Erro no login:", error);
        let message = "Erro desconhecido no login.";
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            message = "Email ou senha inválidos.";
        } else if (error.code === 'auth/invalid-email') {
            message = "O formato do email é inválido.";
        }
        return { success: false, message: message };
    }
}

/**
 * Verifica se o usuário está logado (usando localStorage como cache).
 */
function isUserLoggedIn() {
    // A verificação mais robusta seria usar auth.currentUser, mas para o escopo
    // do frontend, o localStorage é suficiente para a navegação.
    return localStorage.getItem('is_logged_in') === 'true';
}

/**
 * Retorna dados básicos do perfil.
 */
function getUserProfile() {
    if (isUserLoggedIn()) {
        // Retorna o email salvo no localStorage
        return { email: localStorage.getItem('user_email') || 'Usuário Logado' };
    }
    return null;
}

/**
 * Logout
 */
async function logout() {
    try {
        await auth.signOut();
        localStorage.removeItem('is_logged_in');
        localStorage.removeItem('user_email');
        // Redireciona após o logout
        window.location.href = 'index.html';
    } catch (error) {
        console.error("Erro ao fazer logout:", error);
        alert("Erro ao fazer logout. Tente novamente.");
    }
}

// --- Funções de Login Google (Mantidas, mas podem ser integradas ao Firebase) ---

/**
 * Callback executado quando o login do Google é bem-sucedido (Mantido para compatibilidade)
 */
function handleCredentialResponse(response) {
    console.log("Token JWT recebido:", response.credential);

    // Decodificar token (requer jwt-decode.js)
    const profile = jwt_decode(response.credential);

    // Salvar no localStorage
    localStorage.setItem('user_email', profile.email);
    localStorage.setItem('is_logged_in', 'true');

    // Redirecionar
    window.location.href = 'index.html';
}

/**
 * Inicializa o botão do Google (Mantido para compatibilidade)
 */
document.addEventListener('DOMContentLoaded', function() {
    if (typeof google !== "undefined") {
        google.accounts.id.initialize({
            client_id: CLIENT_ID,
            callback: handleCredentialResponse
        });
        
        // Renderiza o botão no container
        const googleButton = document.getElementById("google-login-button");
        if (googleButton) {
            google.accounts.id.renderButton(
                googleButton,
                { theme: "outline", size: "large", type: "standard", text: "signin_with", shape: "pill" }
            );
        }
    }
});
