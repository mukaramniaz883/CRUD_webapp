<?php
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: DELETE');
header('Access-Control-Allow-Headers: Content-Type');

include_once 'db_connection.php';

$input = json_decode(file_get_contents('php://input'), true);
if (empty($input['id'])) {
    echo json_encode(['success' => false, 'message' => 'ID is required.']);
    exit;
}
$id = (int)$input['id'];

$stmt = $conn->prepare('DELETE FROM items WHERE id = ?');
if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Prepare failed: ' . $conn->error]);
    exit;
}
$stmt->bind_param('i', $id);
if ($stmt->execute()) {
    echo json_encode(['success' => true, 'affected_rows' => $stmt->affected_rows]);
} else {
    echo json_encode(['success' => false, 'message' => $stmt->error]);
}
$stmt->close();
$conn->close();
?>