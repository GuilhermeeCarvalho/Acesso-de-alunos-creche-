package com.univille.AccessControl.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

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

        String arquivoTemporario = armazenarArquivoTemporario(arquivo, id);
        crianca.setDocumentoPath(arquivoTemporario);
        crianca.setDocumentoAtualizadoEm(LocalDateTime.now());

        return criancaRepository.save(crianca);
    }

    public Map<String, Object> buscarDocumento(Long id) {
        Crianca crianca = criancaRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Criança não encontrada"));

        Map<String, Object> dados = new HashMap<>();
        dados.put("documentoPath", crianca.getDocumentoPath());
        dados.put("documentoAtualizadoEm", crianca.getDocumentoAtualizadoEm());
        return dados;
    }

    private void validarArquivoDocumento(MultipartFile arquivo) {
        if (arquivo == null || arquivo.isEmpty()) {
            throw new IllegalArgumentException("Arquivo de documento é obrigatório.");
        }

        String contentType = arquivo.getContentType();
        if (contentType == null || !(contentType.equals("image/jpeg") || contentType.equals("image/jpg") || contentType.equals("image/png"))) {
            throw new IllegalArgumentException("O documento deve ser uma imagem JPG, JPEG ou PNG.");
        }

        long tamanhoMaximo = 5 * 1024 * 1024;
        if (arquivo.getSize() > tamanhoMaximo) {
            throw new IllegalArgumentException("O documento não pode ultrapassar 5 MB.");
        }
    }

    private String armazenarArquivoTemporario(MultipartFile arquivo, Long id) {
        try {
            Path diretorioBase = Path.of(System.getProperty("java.io.tmpdir"), "crianca-documentos", String.valueOf(id));
            Files.createDirectories(diretorioBase);

            String nomeArquivo = System.currentTimeMillis() + "-" + arquivo.getOriginalFilename();
            Path destino = diretorioBase.resolve(nomeArquivo);
            Files.copy(arquivo.getInputStream(), destino, StandardCopyOption.REPLACE_EXISTING);
            return destino.toString();
        } catch (IOException ex) {
            throw new RuntimeException("Falha ao armazenar documento temporariamente.", ex);
        }
    }

    public List<Crianca> listarTodos() {
        return criancaRepository.findAll();
    }

    public Crianca atualizar(Long id, Crianca dadosAtualizados) {
        Crianca crianca = criancaRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Criança não encontrada"));

        crianca.setNome(dadosAtualizados.getNome());
        crianca.setTurma(dadosAtualizados.getTurma());

        return criancaRepository.save(crianca);
    }

    @Transactional
    public void remover(Long id) {
        if (!criancaRepository.existsById(id)) {
            throw new RecursoNaoEncontradoException("Criança não encontrada");
        }

        registroRepository.deleteByCriancaId(id);
        responsavelCriancaRepository.deleteByCriancaId(id);
        criancaRepository.deleteById(id);
    }
}