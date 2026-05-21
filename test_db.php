<?php
require_once __DIR__ . '/php/config.php';
try {
    $pdo = new PDO("mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME, DB_USER, DB_PASS);
    $stmt = $pdo->query("SELECT * FROM bookings ORDER BY created_at DESC LIMIT 5");
    $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo "COUNT: " . count($bookings) . "\n";
    print_r($bookings);
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
