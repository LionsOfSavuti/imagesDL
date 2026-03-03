<?php require 'config.php';
$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;
$plantId = $_GET['plant_id'] ?? null;

if ($method === 'GET') {
  if ($plantId) { $s = $pdo->prepare('SELECT * FROM spare_parts WHERE plant_id = :plant_id ORDER BY part_number'); $s->execute(['plant_id' => $plantId]); respond($s->fetchAll(PDO::FETCH_ASSOC)); }
  respond($pdo->query('SELECT * FROM spare_parts ORDER BY part_number')->fetchAll(PDO::FETCH_ASSOC));
}

$body = json_input();
if ($method === 'POST') {
  $s = $pdo->prepare('INSERT INTO spare_parts (part_number, name, description, category, unit_price, reorder_point, quantity_on_hand, plant_id) VALUES (:part_number,:name,:description,:category,:unit_price,:reorder_point,:quantity_on_hand,:plant_id)');
  $s->execute([
    'part_number'=>$body['part_number'],'name'=>$body['name'],'description'=>$body['description'] ?? null,'category'=>$body['category'],'unit_price'=>$body['unit_price'] ?? 0,
    'reorder_point'=>$body['reorder_point'] ?? 0,'quantity_on_hand'=>$body['quantity_on_hand'] ?? 0,'plant_id'=>$body['plant_id'] ?? null
  ]);
  respond(['success'=>true], 201);
}
if ($method === 'PUT' && $id) {
  $s = $pdo->prepare('UPDATE spare_parts SET part_number=:part_number,name=:name,description=:description,category=:category,unit_price=:unit_price,reorder_point=:reorder_point,quantity_on_hand=:quantity_on_hand WHERE id=:id');
  $s->execute(['id'=>$id,'part_number'=>$body['part_number'],'name'=>$body['name'],'description'=>$body['description'] ?? null,'category'=>$body['category'],'unit_price'=>$body['unit_price'] ?? 0,'reorder_point'=>$body['reorder_point'] ?? 0,'quantity_on_hand'=>$body['quantity_on_hand'] ?? 0]);
  respond(['success'=>true]);
}
if ($method === 'DELETE' && $id) {
  $s = $pdo->prepare('DELETE FROM spare_parts WHERE id=:id');
  $s->execute(['id'=>$id]);
  respond(['success'=>true]);
}
respond(['error'=>'Invalid request'], 400);
