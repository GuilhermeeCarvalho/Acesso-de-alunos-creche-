package com.univille.AccessControl.service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.univille.AccessControl.exception.RecursoNaoEncontradoException;
import com.univille.AccessControl.model.Crianca;
import com.univille.AccessControl.repository.CriancaRepository;
import com.univille.AccessControl.repository.RegistroRepository;
import com.univille.AccessControl.repository.ResponsavelCriancaRepository;

@Service
public class CriancaService {

    private final CriancaRepository criancaRepository;
    private final ResponsavelCriancaRepository responsavelCriancaRepository;
    private final RegistroRepository registroRepository;

    public CriancaService(CriancaRepository criancaRepository,
                          ResponsavelCriancaRepository responsavelCriancaRepository,
                          RegistroRepository registroRepository) {
        this.criancaRepository = criancaRepository;
        this.responsavelCriancaRepository = responsavelCriancaRepository;
        this.registroRepository = registroRepository;
    }

    public Crianca salvar(Crianca crianca) {
        return criancaRepository.save(crianca);
    }

    public Crianca salvarDocumento(Long id, MultipartFile arquivo) {
        Crianca crianca = criancaRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Criança não encontrada"));

        validarArquivoDocumento(arquivo);

        String bucket = getEnvVar("SUPABASE_BUCKET");
        String supabaseUrl = getEnvVar("SUPABASE_URL");
        String serviceKey = getEnvVar("SUPABASE_SERVICE_KEY");
        String objetoPath = construirCaminhoDoObjeto(id, arquivo.getOriginalFilename());
        String documentoAnterior = crianca.getDocumentoPath();

        uploadDocumentoParaSupabase(bucket, supabaseUrl, serviceKey, objetoPath, arquivo);

        if (documentoAnterior != null && !documentoAnterior.isBlank()) {
            excluirDocumentoAnterior(bucket, supabaseUrl, serviceKey, documentoAnterior);
        }

        crianca.setDocumentoPath(objetoPath);
        crianca.setDocumentoAtualizadoEm(LocalDateTime.now());
        crianca.setPrecisaPlantao(true);

        return criancaRepository.save(crianca);
    }

    public Map<String, Object> buscarDocumento(Long id) {
        Crianca crianca = criancaRepository.findById(id)
            .orElseThrow(() -> new RecursoNaoEncontradoException("Criança não encontrada"));

        String documentoPath = crianca.getDocumentoPath();
        if (documentoPath == null || documentoPath.isBlank()) {
        throw new RecursoNaoEncontradoException("Documento não encontrado para a criança");
        }

        Map<String, Object> dados = new HashMap<>();
        dados.put("documentoPath", documentoPath);
        dados.put("documentoAtualizadoEm", crianca.getDocumentoAtualizadoEm());
        dados.put("signedUrl", gerarSignedUrl(documentoPath));

        return dados;
    }

    public Crianca removerDocumento(Long id) {
        Crianca crianca = criancaRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Criança não encontrada"));

        String documentoPath = crianca.getDocumentoPath();
        if (documentoPath != null && !documentoPath.isBlank()) {
            String bucket = getOptionalEnvVar("SUPABASE_BUCKET");
            String supabaseUrl = getOptionalEnvVar("SUPABASE_URL");
            String serviceKey = getOptionalEnvVar("SUPABASE_SERVICE_KEY");

            if (bucket != null && supabaseUrl != null && serviceKey != null) {
                excluirDocumentoAnterior(bucket, supabaseUrl, serviceKey, documentoPath);
            }
        }

        crianca.setDocumentoPath(null);
        crianca.setDocumentoAtualizadoEm(null);
        crianca.setPrecisaPlantao(false);

        return criancaRepository.save(crianca);
    }

    private String gerarSignedUrl(String documentoPath) {
        String bucket = getEnvVar("SUPABASE_BUCKET");
        String supabaseUrl = getEnvVar("SUPABASE_URL");
        String serviceKey = getEnvVar("SUPABASE_SERVICE_KEY");

        try {
            String body = """
            {
              "expiresIn": 3600
        }
            """;

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(
                            supabaseUrl +
                            "/storage/v1/object/sign/" +
                            bucket +
                            "/" +
                            documentoPath))
                    .header("apikey", serviceKey)
                    .header("Authorization", "Bearer " + serviceKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(body))
                    .build();

            HttpClient client = HttpClient.newHttpClient();
            HttpResponse<String> response = client.send(
                    request,
                    HttpResponse.BodyHandlers.ofString());

            System.out.println("STATUS SIGNED URL: " + response.statusCode());
            System.out.println("BODY SIGNED URL: " + response.body());

            if (response.statusCode() >= 400) {
                throw new RuntimeException("Erro ao gerar Signed URL: " + response.body());
            }

            ObjectMapper mapper = new ObjectMapper();
            JsonNode json = mapper.readTree(response.body());

            JsonNode signedUrlNode = json.get("signedURL"); // <-- teste com signedURL
            if (signedUrlNode == null || signedUrlNode.asText().isBlank()) {
                throw new RuntimeException("Resposta do Supabase não trouxe signedURL: " + response.body());
            }

            String signedPath = signedUrlNode.asText();

            return supabaseUrl + "/storage/v1" + signedPath;

        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar Signed URL", e);
        }
    }

    private void validarArquivoDocumento(MultipartFile arquivo) {
        if (arquivo == null || arquivo.isEmpty()) {
            throw new IllegalArgumentException("Arquivo de documento é obrigatório.");
        }

        String contentType = arquivo.getContentType();
        if (contentType == null || !(contentType.equals("image/jpeg") || contentType.equals("image/jpg"))) {
            throw new IllegalArgumentException("O documento deve ser uma imagem JPG ou JPEG.");
        }

        long tamanhoMaximo = 5 * 1024 * 1024;
        if (arquivo.getSize() > tamanhoMaximo) {
            throw new IllegalArgumentException("O documento não pode ultrapassar 5 MB.");
        }
    }

    private String construirCaminhoDoObjeto(Long id, String nomeArquivoOriginal) {
        String nomeArquivo = System.currentTimeMillis() + "-" + nomeArquivoOriginal.replaceAll("[^a-zA-Z0-9._-]", "_");
        return String.format("criancas/%d/%s", id, nomeArquivo);
    }

    private void uploadDocumentoParaSupabase(
        String bucket,
        String supabaseUrl,
        String serviceKey,
        String objetoPath,
        MultipartFile arquivo) {

    try {

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(
                        supabaseUrl +
                        "/storage/v1/object/" +
                        bucket +
                        "/" +
                        objetoPath))
                .header("apikey", serviceKey)
                .header("Authorization", "Bearer " + serviceKey)
                .header("Content-Type", arquivo.getContentType())
                .POST(HttpRequest.BodyPublishers.ofByteArray(
                        arquivo.getBytes()))
                .build();

        HttpClient client = HttpClient.newHttpClient();

        HttpResponse<String> response =
                client.send(request,
                        HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() >= 400) {
            throw new RuntimeException(
                    "Falha ao enviar documento para Supabase Storage: "
                            + response.body());
        }

    } catch (IOException e) {
        throw new RuntimeException(
                "Erro ao enviar documento para Supabase",
                e);

    } catch (InterruptedException e) {
        Thread.currentThread().interrupt();

        throw new RuntimeException(
                "Erro ao enviar documento para Supabase",
                e);
    }
}

    private void excluirDocumentoAnterior(String bucket, String supabaseUrl, String serviceKey, String documentoPath) {
    if (documentoPath == null || documentoPath.isBlank()) {
        return;
    }

    try {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(
                        supabaseUrl +
                        "/storage/v1/object/" +
                        bucket +
                        "/" +
                        documentoPath))
                .header("apikey", serviceKey)
                .header("Authorization", "Bearer " + serviceKey)
                .DELETE()
                .build();

        HttpClient client = HttpClient.newHttpClient();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() == 404) {
            System.out.println(
            "Documento não encontrado no Supabase. Prosseguindo com exclusão da criança.");
        return;
    }

    if (response.statusCode() >= 400) {
        throw new RuntimeException(
            "Falha ao excluir documento do Supabase Storage: " + response.body());
    }

    } catch (IOException ex) {
        throw new RuntimeException("Falha ao excluir documento do Supabase Storage.", ex);
    } catch (InterruptedException ex) {
        Thread.currentThread().interrupt();
        throw new RuntimeException("Falha ao excluir documento do Supabase Storage.", ex);
    }
}

    private String getEnvVar(String name) {
        String value = System.getenv(name);
        if (value == null || value.isBlank()) {
            throw new IllegalStateException("Variável de ambiente obrigatória não encontrada: " + name);
        }
        return value;
    }

    private String getOptionalEnvVar(String name) {
        String value = System.getenv(name);
        return (value == null || value.isBlank()) ? null : value;
    }

    public List<Crianca> listarTodos() {
        return criancaRepository.findAll();
    }

   public Crianca atualizar(Long id, Crianca dadosAtualizados) {
    Crianca crianca = criancaRepository.findById(id)
            .orElseThrow(() -> new RecursoNaoEncontradoException("Criança não encontrada"));

    if (dadosAtualizados.getNome() != null && !dadosAtualizados.getNome().isBlank()) {
        crianca.setNome(dadosAtualizados.getNome());
    }

    if (dadosAtualizados.getTurma() != null && !dadosAtualizados.getTurma().isBlank()) {
        crianca.setTurma(dadosAtualizados.getTurma());
    }

    if (dadosAtualizados.getTurno() != null) {
        crianca.setTurno(dadosAtualizados.getTurno().isBlank() ? null : dadosAtualizados.getTurno());
    }

    crianca.setPrecisaPlantao(dadosAtualizados.isPrecisaPlantao());

    return criancaRepository.save(crianca);
}

    @Transactional
    public void remover(Long id) {
        Crianca crianca = criancaRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Criança não encontrada"));

        String documentoPath = crianca.getDocumentoPath();
        if (documentoPath != null && !documentoPath.isBlank()) {
            String bucket = getOptionalEnvVar("SUPABASE_BUCKET");
            String supabaseUrl = getOptionalEnvVar("SUPABASE_URL");
            String serviceKey = getOptionalEnvVar("SUPABASE_SERVICE_KEY");

            if (bucket != null && supabaseUrl != null && serviceKey != null) {
                excluirDocumentoAnterior(bucket, supabaseUrl, serviceKey, documentoPath);
            } else {
                System.out.println("Supabase não configurado — pulando exclusão de documento para: " + documentoPath);
            }
        }

        registroRepository.deleteByCriancaId(id);
        responsavelCriancaRepository.deleteByCriancaId(id);
        criancaRepository.deleteById(id);
    }
}