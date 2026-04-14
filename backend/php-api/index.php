<?php
// Permite que qualquer origem (seu front-end) acesse a API
header("Access-Control-Allow-Origin: *");
// Permite os métodos que você está usando
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
// Permite os cabeçalhos como Content-Type (necessário para JSON)
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Importante: Responde às requisições "OPTIONS" (preflight) que o navegador faz antes do POST
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

echo json_encode(["status" => "API PHP Online", "mensagem" => "Ponte entre React e Java pronta!"]);
?>