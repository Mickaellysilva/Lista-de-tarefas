const listaTarefas = document.getElementById("lista");
const overlay = document.getElementById("overlay");
const criarTarefa = document.getElementById("criarTarefa");
const titulo = document.getElementById("titulo");
const descricao = document.getElementById("descricao");
const campoBusca = document.getElementById("busca"); // Captura o campo de busca

let todasAsTarefas = []; 

function abrirModal() {
    overlay.classList.add("active");
    criarTarefa.classList.add("active");
}

function fecharModal() {
    overlay.classList.remove("active");
    criarTarefa.classList.remove("active");
}

function buscarTarefas() {
    fetch("http://localhost:3000/tarefas")
        .then(res => res.json())
        .then(data => {
            todasAsTarefas = data; 
            inserirTarefas(todasAsTarefas); 
        })
        .catch(err => console.error("Erro ao procurar tarefas:", err));
}

function inserirTarefas(tarefas) {
    listaTarefas.innerHTML = "";

    tarefas.forEach(tarefa => {
        listaTarefas.innerHTML += `
            <li>
                <box-icon name="x" class="btn-fechar-tarefa" data-id="${tarefa.id}"></box-icon>
                <h5>${tarefa.titulo}</h5>
                <p>${tarefa.descricao}</p>
            </li>
        `;
    });
}

function novaTarefa(event) {
    event.preventDefault();

    const tarefa = {
        titulo: titulo.value.trim(),
        descricao: descricao.value.trim()
    };

    if (!tarefa.titulo || !tarefa.descricao) {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    fetch("http://localhost:3000/tarefas", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(tarefa)
    })
    .then(res => {
        if (!res.ok) {
            throw new Error("Erro ao salvar no servidor");
        }
        return res.json();
    })
    .then(res => {
        console.log("Criada:", res);
        titulo.value = "";
        descricao.value = "";
        fecharModal();
        buscarTarefas(); 
    })
    .catch(err => {
        console.error(err);
        alert("Erro ao salvar tarefa. Verifique se o seu json-server está ligado!");
    });
}

function deletarTarefa(id) {
    fetch(`http://localhost:3000/tarefas/${id}`, {
        method: "DELETE",
    })
    .then(res => {
        if (res.ok) {
            alert("Tarefa deletada com sucesso!");
            buscarTarefas(); 
        }
    })
    .catch(err => console.error("Erro ao deletar:", err));
}

campoBusca.addEventListener("input", function() {
    const termoBusca = campoBusca.value.toLowerCase().trim();

    // Filtra comparando o título da tarefa com o termo digitado
    const tarefasFiltradas = todasAsTarefas.filter(tarefa => 
        tarefa.titulo.toLowerCase().includes(termoBusca)
    );

    inserirTarefas(tarefasFiltradas);
});

// Escutador de eventos inteligente para a lista (Delegação de Eventos)
listaTarefas.addEventListener("click", function(event) {
    if (event.target.classList.contains("btn-fechar-tarefa")) {
        const idTarefa = event.target.getAttribute("data-id");
        deletarTarefa(idTarefa);
    }
});

buscarTarefas();