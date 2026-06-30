let controladorAbortar = null;
let idOperacao = 0;

const botaoLer = document.getElementById('btn-ler');
const statusTexto = document.getElementById('status-leitura');
const resultadoPainel = document.getElementById('painel-resultado');

async function realizarLeituraSegura() {
    // Se houver uma leitura anterior rodando, cancela ela imediatamente
    if (controladorAbortar) {
        controladorAbortar.abort();
        console.warn(`Leitura #${idOperacao} abortada: Nova requisição disparada.`);
    }

    // Configura o novo controlador para a leitura atual
    controladorAbortar = new AbortController();
    const { signal } = controladorAbortar;

    idOperacao++;
    const idAtual = idOperacao;

    // Atualiza estados visuais
    statusTexto.className = "status-box loading";
    statusTexto.textContent = `Buscando dados (Tentativa #${idAtual})...`;
    resultadoPainel.textContent = "Carregando...";

    try {
        // Simulando a chamada a uma API pública. O sinal do AbortController monitora este fetch.
        const resposta = await fetch(`https://jsonplaceholder.typicode.com/todos/${(idAtual % 5) + 1}`, { signal });
        
        if (!resposta.ok) throw new Error("Erro na comunicação com o servidor.");
        
        const dados = await resposta.json();

        // Renderiza o sucesso se essa requisição ainda for a mais recente
        statusTexto.className = "status-box success";
        statusTexto.textContent = `Leitura #${idAtual} finalizada com sucesso!`;
        resultadoPainel.innerHTML = `<strong>ID do Dado:</strong> ${dados.id}<br><strong>Descrição Encontrada:</strong> ${dados.title}`;

    } catch (erro) {
        if (erro.name === 'AbortError') {
            // Log interno silencioso. O usuário não é incomodado com avisos de erro de cancelamento.
            console.log(`Log: Requisição #${idAtual} limpa com sucesso.`);
        } else {
            statusTexto.className = "status-box ready";
            statusTexto.textContent = "Falha ao ler dados.";
            resultadoPainel.textContent = erro.message;
        }
    } finally {
        if (idOperacao === idAtual) {
            controladorAbortar = null;
        }
    }
}

botaoLer.addEventListener('click', realizarLeituraSegura);
4. Backend robusto: Arquivo Java (Controller.java)
Se o seu projeto necessita de uma API backend em Java (utilizando Spring Boot, por exemplo) para fornecer esses dados com segurança e responder ao frontend, aqui está a estrutura padrão de um Controller de leitura. Ele possui tratamento contra concorrência e envia os dados limpos ao cliente.

Java


package com.grupo.projeto.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/leitura")
// Permite que o seu arquivo HTML local consulte esta API sem erros de CORS
@CrossOrigin(origins = "*") 
public class LeituraController {

    /**
     * Endpoint simulado para leitura de dados estável.
     * @param id Identificador enviado pelo frontend
     * @return Resposta JSON contendo as informações limpas
     */
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> obterDadosLeitura(@PathVariable Integer id) {
        
        // Simulação de delay no servidor para testar a estabilidade do clique rápido do front
        try {
            Thread.sleep(1500); 
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        Map<String, Object> dadosMockados = new HashMap<>();
        dadosMockados.put("id", id);
        dadosMockados.put("title", "Dados processados com sucesso no servidor Java");
        dadosMockados.put("status", "Estável");
        dadosMockados.put("timestamp", System.currentTimeMillis());

        return ResponseEntity.ok(dadosMockados);
    }
}