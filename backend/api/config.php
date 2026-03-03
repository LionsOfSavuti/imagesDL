<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

$host = getenv('POSTGRES_HOST') ?: '127.0.0.1';
$port = getenv('POSTGRES_PORT') ?: '5432';
$db = getenv('POSTGRES_DB') ?: 'spare_parts_db';
$user = getenv('POSTGRES_USER') ?: 'spare_user';
$pass = getenv('POSTGRES_PASSWORD') ?: 'spare_password';

$dsn = "pgsql:host=$host;port=$port;dbname=$db";
$pdo = new PDO($dsn, $user, $pass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);

function json_input() { return json_decode(file_get_contents('php://input'), true) ?? []; }
function respond($data, int $status = 200) { http_response_code($status); echo json_encode($data); exit; }
