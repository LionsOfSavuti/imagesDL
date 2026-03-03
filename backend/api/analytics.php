<?php require 'config.php';
$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'GET') {
  $eventType = $_GET['event_type'] ?? null;
  if ($eventType) { $s=$pdo->prepare('SELECT * FROM analytics_events WHERE event_type=:event_type ORDER BY created_at DESC'); $s->execute(['event_type'=>$eventType]); respond($s->fetchAll(PDO::FETCH_ASSOC)); }
  respond($pdo->query('SELECT * FROM analytics_events ORDER BY created_at DESC')->fetchAll(PDO::FETCH_ASSOC));
}
if ($method === 'POST') {
  $b = json_input();
  $s=$pdo->prepare('INSERT INTO analytics_events (event_type,event_data,session_id,user_id) VALUES (:event_type,:event_data::jsonb,:session_id,:user_id)');
  $s->execute(['event_type'=>$b['event_type'],'event_data'=>json_encode($b['event_data'] ?? null),'session_id'=>$b['session_id'] ?? null,'user_id'=>$b['user_id'] ?? null]);
  respond(['success'=>true], 201);
}
respond(['error'=>'Invalid request'], 400);
