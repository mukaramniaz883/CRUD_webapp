<?php
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

include_once 'db_connection.php';

$input = json_decode(file_get_contents('php://input'), true);

if (empty($input['name']) || empty($input['description'])) {
    echo json_encode(['success' => false, 'message' => 'Name and description are required.']);
    exit;
}

$name = $conn->real_escape_string($input['name']);
$description = $conn->real_escape_string($input['description']);

$stmt = $conn->prepare('INSERT INTO items (name, description) VALUES (?, ?)');
if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Prepare failed: ' . $conn->error]);
    exit;
}
$stmt->bind_param('ss', $name, $description);
if ($stmt->execute()) {
    echo json_encode(['success' => true, 'id' => $stmt->insert_id]);
} else {
    echo json_encode(['success' => false, 'message' => $stmt->error]);
}
$stmt->close();
$conn->close();
?>