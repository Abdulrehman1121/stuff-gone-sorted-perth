<?php
// PHP Backend Configuration

// Database Settings
define('DB_HOST', getenv('DB_HOST') ?: '127.0.0.1');
define('DB_PORT', getenv('DB_PORT') ?: '3306');
define('DB_NAME', getenv('DB_NAME') ?: 'stuff_gone_sorted');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') !== false ? getenv('DB_PASS') : '');

// Admin Credentials (For dashboard login)
define('ADMIN_EMAIL', getenv('ADMIN_EMAIL') ?: 'admin@stuffgonesorted.com.au');
define('ADMIN_PASSWORD', getenv('ADMIN_PASSWORD') ?: 'AdminSecurePass123!'); // Change this in production!

// Simple Token Secret Key
define('TOKEN_SECRET', getenv('TOKEN_SECRET') ?: 'haulmate_wa_secret_key_987654321');

// Business Notification Email (Where new booking alerts are sent)
define('BUSINESS_EMAIL', 'abdulrehmankaleem195@gmail.com');
define('BUSINESS_SENDER', 'abdulrehmankaleem195@gmail.com');
