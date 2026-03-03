<?php require 'config.php';
$id = $_GET['id'] ?? null;
if ($id) {
  $stmt = $pdo->prepare('SELECT * FROM plants WHERE id = :id');
  $stmt->execute(['id' => $id]);
  respond($stmt->fetchAll(PDO::FETCH_ASSOC));
}
respond($pdo->query('SELECT * FROM plants ORDER BY name')->fetchAll(PDO::FETCH_ASSOC));
