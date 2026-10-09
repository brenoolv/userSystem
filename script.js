const form = document.querySelector('#formCadastro');
const buscarCep = document.querySelector('#buscarCep');
const cep = document.querySelector('#cep');
const estado = document.querySelector('#estado');

function mensagem(texto, tipo = "sucesso") {

}

function mensagem(texto, tipo = "sucesso") {
    Toastify ({
        text: texto,
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
            background: tipo === "sucesso"
            ? "#198754"
            : "#dc3545"
        }
    }).showToast();
}

// ouvir evento de click no buscaCep
buscarCep.addEventListener("click", async function(){
    // expressão regex
    const valor = cep.value.replace(/\D/g, "");
    if (valor.length !== 8) {
        mensagem("Digite um CEP válido");
        return;     
    } try {
        const resposta = await fetch(`https://viacep.com.br/ws/${valor}/json/`);
        const dados = await resposta.json();
        if (!resposta.ok || dados.erro) 
            throw new Error("CEP não encontado");
        document.querySelector('#logradouro').value = dados.logradouro;
        document.querySelector('#bairro').value = dados.bairro;
        document.querySelector('#estado').value = dados.estado;
        document.querySelector('#cidade').value = dados.localidade;
        mensagem("Endereço encontrado!");
        
    } catch (erro){
        mensagem(erro.message, "erro");
    }
});

// ouvir evento submit do formulário
form.addEventListener("submit", function(event){
    event.preventDefault();
    Object.fromEntries([...form.elements].filter(element => element.id).map(element => [element.id, element.value]));

    form.reset();
}); 

// criar opções de seleção dinamicamente
function adicionarOpcao(select,texto,valor) {
    select.add(new Option(texto, valor));
}

// carregar os estados disponiveis
async function carregarEstados() {
    try {
        const resposta = await fetch ("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome");
        if (!resposta.ok) {
            throw new Error("Não foi possivel carregar os estados");
        }
        const estados = await resposta.json();
        estados.forEach(item => adicionarOpcao(estado, item.nome, item.sigla));
    } catch (erro) {}

};
carregarEstados();
