<?php require 'config.php';
$plantId = $_GET['plant_id'] ?? null;
if ($plantId) { $s=$pdo->prepare('SELECT * FROM ai_recommendations WHERE plant_id=:plant_id ORDER BY created_at DESC'); $s->execute(['plant_id'=>$plantId]); respond($s->fetchAll(PDO::FETCH_ASSOC)); }
respond($pdo->query('SELECT * FROM ai_recommendations ORDER BY created_at DESC')->fetchAll(PDO::FETCH_ASSOC));
