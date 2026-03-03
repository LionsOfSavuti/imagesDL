<?php require 'config.php';
$method = $_SERVER['REQUEST_METHOD'];
$plantId = $_GET['plant_id'] ?? null;
$days = isset($_GET['days']) ? intval($_GET['days']) : null;
if ($method === 'GET') {
  $sql = 'SELECT * FROM inventory_transactions WHERE 1=1';
  $params = [];
  if ($plantId) { $sql .= ' AND plant_id=:plant_id'; $params['plant_id']=$plantId; }
  if ($days) { $sql .= " AND created_at >= NOW() - INTERVAL '{$days} days'"; }
  $sql .= ' ORDER BY created_at DESC';
  $s = $pdo->prepare($sql); $s->execute($params); respond($s->fetchAll(PDO::FETCH_ASSOC));
}
if ($method === 'POST') {
  $b = json_input();
  $pdo->beginTransaction();
  $s = $pdo->prepare('SELECT quantity_on_hand FROM spare_parts WHERE id=:id FOR UPDATE');
  $s->execute(['id'=>$b['part_id']]);
  $qty = (int)$s->fetchColumn();
  $n = (int)$b['quantity'];
  $newQty = $b['transaction_type'] === 'in' ? $qty + $n : ($b['transaction_type'] === 'out' ? max(0, $qty - $n) : max(0, $n));
  $u = $pdo->prepare('UPDATE spare_parts SET quantity_on_hand=:q WHERE id=:id');
  $u->execute(['q'=>$newQty,'id'=>$b['part_id']]);
  $i = $pdo->prepare('INSERT INTO inventory_transactions (part_id,transaction_type,quantity,notes,plant_id) VALUES (:part_id,:transaction_type,:quantity,:notes,:plant_id)');
  $i->execute(['part_id'=>$b['part_id'],'transaction_type'=>$b['transaction_type'],'quantity'=>$n,'notes'=>$b['notes'] ?? null,'plant_id'=>$b['plant_id'] ?? null]);
  $pdo->commit();
  respond(['success'=>true], 201);
}
respond(['error'=>'Invalid request'], 400);
