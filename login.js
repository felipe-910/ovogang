// ===============================
//  LOGIN COM GOOGLE
// ===============================

// Função chamada automaticamente pelo Google Identity
function handleCredentialResponse(response) {
    const userData = jwt_decode(response.credential);

    console.log("Logado como:", userData.email);

    // Salva no localStorage
    localStorage.setItem("usuarioLogado", JSON.stringify({
        nome: userData.name,
        email: userData.email,
        foto: userData.picture
    }));

    // Esconde tudo da tela de login
    esconderBotoesLogin();

    // Redireciona
    setTimeout(() => {
        window.location.href = "index.html";
    }, 800);
}



// ===============================
//  LOGIN NORMAL (E-MAIL / SENHA)
// ===============================

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            const usuario = document.getElementById("usuario").value.trim();
            const senha = document.getElementById("senha").value.trim();

            if (usuario === "" || senha === "") {
                alert("Preencha todos os campos!");
                return;
            }

            // Simulação de login
            const usuarioFake = {
                nome: usuario,
                email: usuario + "@gmail.com",
                foto: "https://i.ibb.co/2kJxVYs/default-user.png"
            };

            localStorage.setItem("usuarioLogado", JSON.stringify(usuarioFake));

            // Esconde tudo
            esconderBotoesLogin();

            // Redirecionar
            setTimeout(() => {
                window.location.href = "index.html";
            }, 800);
        });
    }
});



// ===============================
//  FUNÇÃO QUE ESCONDE TUDO DA TELA
// ===============================

function esconderBotoesLogin() {
    const googleBtn = document.getElementById("google-login-button");
    const loginBtn = document.querySelector(".login");
    const usuarioInput = document.getElementById("usuario");
    const senhaInput = document.getElementById("senha");
    const lembrar = document.querySelector(".remember");
    const register = document.querySelector(".register-link");

    if (googleBtn) googleBtn.style.display = "none";
    if (loginBtn) loginBtn.style.display = "none";
    if (usuarioInput) usuarioInput.style.display = "none";
    if (senhaInput) senhaInput.style.display = "none";
    if (lembrar) lembrar.style.display = "none";
    if (register) register.style.display = "none";
}



// ===============================
//  EXIBE O NOME E FOTO NO INDEX
// ===============================

document.addEventListener("DOMContentLoaded", () => {
    const dados = localStorage.getItem("usuarioLogado");

    if (dados) {
        const user = JSON.parse(dados);

        const userName = document.getElementById("nome-usuario");
        const userImg = document.getElementById("foto-usuario");

        if (userName) userName.textContent = user.nome;
        if (userImg) userImg.src = user.foto;
    }
});
