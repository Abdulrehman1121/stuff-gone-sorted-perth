<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/api.php'; // Includes sendHtmlEmail function

$to = BUSINESS_EMAIL; // abdulrehmanmakki18@gmail.com
$subject = "Test Email from HaulMate WA (XAMPP)";
$html = "<h1>This is a test email</h1><p>If you received this, the XAMPP PHP mail() function is working properly.</p>";
$text = "This is a test email. If you received this, the XAMPP PHP mail() function is working properly.";

echo "Attempting to send an email to: $to\n";
echo "Sender: " . BUSINESS_SENDER . "\n";

$result = sendHtmlEmail($to, $subject, $html, $text);

if ($result) {
    echo "SUCCESS: The PHP mail() function returned true. Check your inbox (and spam folder).\n";
} else {
    echo "FAILED: The PHP mail() function returned false. Your XAMPP sendmail might not be configured.\n";
    $error = error_get_last();
    if ($error !== null) {
        echo "Error message: " . $error['message'] . "\n";
    }
}
?>
