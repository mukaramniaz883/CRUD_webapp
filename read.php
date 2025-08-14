<?php
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
include_once 'db_connection.php';

$result = $conn->query('SELECT id, name, description, created_at, updated_at FROM items ORDER BY id DESC');
$out = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $out[] = $row;
    }
    echo json_encode($out);
} else {
    echo json_encode([]);
}
$conn->close();
?>