<?php
// Enable error reporting for debugging, but in production, turn it off
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// Handle OPTIONS Preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Set JSON response header for actions except file downloads
header('Content-Type: application/json');

require_once __DIR__ . '/config.php';

// Establish Database Connection & Setup Table
try {
    $dsnWithoutDb = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];
    // Connect to MySQL server first without selecting a database
    $pdo = new PDO($dsnWithoutDb, DB_USER, DB_PASS, $options);
    
    // Auto-create database if it doesn't exist
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `" . DB_NAME . "` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $pdo->exec("USE `" . DB_NAME . "`");

    // Auto-create bookings table if it doesn't exist
    $createTableSql = "
    CREATE TABLE IF NOT EXISTS bookings (
        id VARCHAR(36) PRIMARY KEY,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        full_name VARCHAR(120) NOT NULL,
        email VARCHAR(200) NOT NULL,
        phone VARCHAR(40) NOT NULL,
        suburb VARCHAR(120) NOT NULL,
        street_address VARCHAR(240) NULL,
        contact_method VARCHAR(20) NOT NULL,
        service_type VARCHAR(50) NOT NULL,
        item_description TEXT NULL,
        load_size VARCHAR(50) NULL,
        access_notes TEXT NULL,
        photo_url VARCHAR(500) NULL,
        preferred_date VARCHAR(20) NOT NULL,
        preferred_time VARCHAR(20) NOT NULL,
        alternative_date VARCHAR(20) NULL,
        alternative_time VARCHAR(20) NULL,
        urgency VARCHAR(30) NULL,
        status VARCHAR(20) DEFAULT 'pending_approval',
        approved_date VARCHAR(20) NULL,
        approved_time VARCHAR(20) NULL,
        admin_notes TEXT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ";
    $pdo->exec($createTableSql);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "error" => "Database connection/setup failed: " . $e->getMessage()
    ]);
    exit;
}

// Helper: Response wrappers
function sendSuccess($data = []) {
    echo json_encode(array_merge(["success" => true], $data));
    exit;
}

function sendError($message, $code = 400) {
    http_response_code($code);
    echo json_encode(["success" => false, "error" => $message]);
    exit;
}

// Helper: UUID v4 generator
function generateUUID() {
    return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );
}

// Helper: JWT-like Stateless Authentication Tokens
function generateToken() {
    $expiry = time() + (30 * 24 * 60 * 60); // 30 days
    $payload = ADMIN_EMAIL . ':' . $expiry;
    $sig = hash_hmac('sha256', $payload, TOKEN_SECRET);
    return base64_encode($payload . ':' . $sig);
}

function verifyToken($token) {
    $decoded = base64_decode($token);
    if (!$decoded) return false;
    $parts = explode(':', $decoded);
    if (count($parts) !== 3) return false;
    list($email, $expiry, $sig) = $parts;
    if ($email !== ADMIN_EMAIL) return false;
    if (time() > $expiry) return false;
    $expectedSig = hash_hmac('sha256', $email . ':' . $expiry, TOKEN_SECRET);
    return hash_equals($expectedSig, $sig);
}

function requireAuth() {
    $headers = apache_request_headers();
    $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
    if (empty($authHeader) && isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
    }

    if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        $token = $matches[1];
        if (verifyToken($token)) {
            return true;
        }
    }
    sendError("Unauthorized. Please sign in.", 401);
}

// Helper: Email Sender using native mail() with HTML headers
function sendHtmlEmail($to, $subject, $htmlBody, $textFallback) {
    $boundary = md5(uniqid(time()));
    
    $headers = "From: " . BUSINESS_SENDER . "\r\n";
    $headers .= "Reply-To: " . BUSINESS_EMAIL . "\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: multipart/alternative; boundary=\"$boundary\"\r\n";
    
    // Multipart Body
    $body = "--$boundary\r\n";
    $body .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $body .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
    $body .= $textFallback . "\r\n\r\n";
    
    $body .= "--$boundary\r\n";
    $body .= "Content-Type: text/html; charset=UTF-8\r\n";
    $body .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
    $body .= $htmlBody . "\r\n\r\n";
    $body .= "--$boundary--";

    return mail($to, $subject, $body, $headers);
}

// Router Actions
$action = isset($_GET['action']) ? $_GET['action'] : '';

switch ($action) {
    case 'submit':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') sendError("Method Not Allowed", 405);
        
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) sendError("Invalid JSON input");

        // Validate required fields
        $required = ['full_name', 'email', 'phone', 'suburb', 'contact_method', 'service_type', 'preferred_date', 'preferred_time'];
        foreach ($required as $f) {
            if (empty($input[$f])) {
                sendError("Field '$f' is required.");
            }
        }

        $id = generateUUID();
        $stmt = $pdo->prepare("
            INSERT INTO bookings (
                id, full_name, email, phone, suburb, street_address, contact_method, 
                service_type, item_description, load_size, access_notes, photo_url, 
                preferred_date, preferred_time, alternative_date, alternative_time, urgency, status
            ) VALUES (
                :id, :full_name, :email, :phone, :suburb, :street_address, :contact_method, 
                :service_type, :item_description, :load_size, :access_notes, :photo_url, 
                :preferred_date, :preferred_time, :alternative_date, :alternative_time, :urgency, 'pending_approval'
            )
        ");

        $stmt->execute([
            'id' => $id,
            'full_name' => $input['full_name'],
            'email' => $input['email'],
            'phone' => $input['phone'],
            'suburb' => $input['suburb'],
            'street_address' => isset($input['street_address']) ? $input['street_address'] : null,
            'contact_method' => $input['contact_method'],
            'service_type' => $input['service_type'],
            'item_description' => isset($input['item_description']) ? $input['item_description'] : null,
            'load_size' => isset($input['load_size']) ? $input['load_size'] : null,
            'access_notes' => isset($input['access_notes']) ? $input['access_notes'] : null,
            'photo_url' => isset($input['photo_url']) ? $input['photo_url'] : null,
            'preferred_date' => $input['preferred_date'],
            'preferred_time' => $input['preferred_time'],
            'alternative_date' => isset($input['alternative_date']) ? $input['alternative_date'] : null,
            'alternative_time' => isset($input['alternative_time']) ? $input['alternative_time'] : null,
            'urgency' => isset($input['urgency']) ? $input['urgency'] : null,
        ]);

        // Email Alert to business owner
        $photoHtml = !empty($input['photo_url']) ? "<p style='margin:12px 0;'><a href='{$input['photo_url']}' style='color:#1e3a8a;'>View uploaded photo</a></p>" : "";
        
        $row = function($lbl, $val) {
            if (empty($val)) return "";
            return "<tr><td style='padding:6px 12px;color:#64748b;font-size:13px;'>$lbl</td><td style='padding:6px 12px;color:#0f172a;font-size:14px;font-weight:500;'>$val</td></tr>";
        };

        // Determine administration URL from request protocol/host
        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
        $adminUrl = $protocol . $_SERVER['HTTP_HOST'] . "/admin";

        $subject = "New Booking Request - HaulMate WA";
        $html = "
        <div style='font-family:Inter,Arial,sans-serif;background:#f8fafc;padding:24px;'>
          <div style='max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;'>
            <div style='background:#0f1b3d;color:#fde047;padding:20px 24px;'>
              <h1 style='margin:0;font-size:20px;'>New Booking Request</h1>
              <p style='margin:4px 0 0;color:#cbd5e1;font-size:13px;'>Status: Pending Approval</p>
            </div>
            <div style='padding:20px 24px;'>
              <h2 style='margin:0 0 8px;font-size:15px;color:#0f172a;'>Customer</h2>
              <table style='width:100%;border-collapse:collapse;'>
                {$row("Name", $input['full_name'])}
                {$row("Email", $input['email'])}
                {$row("Phone", $input['phone'])}
                {$row("Suburb", $input['suburb'])}
                {$row("Address", isset($input['street_address']) ? $input['street_address'] : "")}
                {$row("Preferred contact", $input['contact_method'])}
              </table>
              <h2 style='margin:18px 0 8px;font-size:15px;color:#0f172a;'>Service</h2>
              <table style='width:100%;border-collapse:collapse;'>
                {$row("Service", $input['service_type'])}
                {$row("Load size", isset($input['load_size']) ? $input['load_size'] : "")}
                {$row("Items", isset($input['item_description']) ? $input['item_description'] : "")}
                {$row("Access notes", isset($input['access_notes']) ? $input['access_notes'] : "")}
              </table>
              $photoHtml
              <h2 style='margin:18px 0 8px;font-size:15px;color:#0f172a;'>Preferred schedule</h2>
              <table style='width:100%;border-collapse:collapse;'>
                {$row("Preferred date", $input['preferred_date'])}
                {$row("Preferred time", $input['preferred_time'])}
                {$row("Alternative date", isset($input['alternative_date']) ? $input['alternative_date'] : "")}
                {$row("Alternative time", isset($input['alternative_time']) ? $input['alternative_time'] : "")}
                {$row("Urgency", isset($input['urgency']) ? $input['urgency'] : "")}
              </table>
              <div style='margin-top:24px;text-align:center;'>
                <a href='$adminUrl' style='display:inline-block;background:#fde047;color:#0f1b3d;text-decoration:none;padding:12px 22px;border-radius:8px;font-weight:700;'>Open admin dashboard</a>
              </div>
            </div>
          </div>
        </div>";
        $text = "New booking from {$input['full_name']} ({$input['email']}, {$input['phone']}) in {$input['suburb']}. Service: {$input['service_type']}. Preferred: {$input['preferred_date']} {$input['preferred_time']}. Admin Dashboard: $adminUrl";

        @sendHtmlEmail(BUSINESS_EMAIL, $subject, $html, $text);

        sendSuccess(["id" => $id]);
        break;

    case 'upload':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') sendError("Method Not Allowed", 405);
        if (!isset($_FILES['photo'])) sendError("No photo uploaded");

        $file = $_FILES['photo'];
        if ($file['error'] !== UPLOAD_ERR_OK) {
            sendError("File upload error: " . $file['error']);
        }

        // Limit size to 8MB
        if ($file['size'] > 8 * 1024 * 1024) {
            sendError("Photo must be under 8MB");
        }

        // Check file extension
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
        if (!in_array($ext, $allowed)) {
            sendError("Invalid file type. Allowed extensions: " . implode(', ', $allowed));
        }

        // Create uploads directory
        $uploadDir = __DIR__ . '/uploads/';
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $filename = generateUUID() . '.' . $ext;
        $destPath = $uploadDir . $filename;

        if (move_uploaded_file($file['tmp_name'], $destPath)) {
            $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
            $publicUrl = $protocol . $_SERVER['HTTP_HOST'] . "/php/uploads/" . $filename;
            sendSuccess(["publicUrl" => $publicUrl]);
        } else {
            sendError("Failed to save uploaded file on server");
        }
        break;

    case 'login':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') sendError("Method Not Allowed", 405);
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) sendError("Invalid JSON input");

        $email = isset($input['email']) ? trim($input['email']) : '';
        $password = isset($input['password']) ? $input['password'] : '';

        // Case-insensitive email check, exact password check
        if (strtolower($email) === strtolower(ADMIN_EMAIL) && $password === ADMIN_PASSWORD) {
            $token = generateToken();
            sendSuccess(["token" => $token]);
        } else {
            sendError("Invalid email or password");
        }
        break;

    case 'list':
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') sendError("Method Not Allowed", 405);
        requireAuth();

        $stmt = $pdo->query("SELECT * FROM bookings ORDER BY created_at DESC LIMIT 1000");
        $bookings = $stmt->fetchAll();

        // Convert null values to null explicitly for consistency
        foreach ($bookings as &$b) {
            foreach ($b as $k => $v) {
                if ($v === null) {
                    $b[$k] = null;
                }
            }
        }

        sendSuccess(["bookings" => $bookings]);
        break;

    case 'update_status':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') sendError("Method Not Allowed", 405);
        requireAuth();

        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input || empty($input['id']) || empty($input['status'])) {
            sendError("Invalid booking status data");
        }

        $id = $input['id'];
        $status = $input['status'];
        $approvedDate = isset($input['approved_date']) ? $input['approved_date'] : null;
        $approvedTime = isset($input['approved_time']) ? $input['approved_time'] : null;
        $adminNotes = isset($input['admin_notes']) ? $input['admin_notes'] : null;

        // Fetch booking detail first
        $stmt = $pdo->prepare("SELECT * FROM bookings WHERE id = :id");
        $stmt->execute(['id' => $id]);
        $b = $stmt->fetch();
        if (!$b) sendError("Booking not found");

        // Update database
        $updateSql = "
            UPDATE bookings SET 
                status = :status,
                approved_date = :approved_date,
                approved_time = :approved_time,
                admin_notes = :admin_notes
            WHERE id = :id
        ";
        $updateStmt = $pdo->prepare($updateSql);
        $updateStmt->execute([
            'id' => $id,
            'status' => $status,
            'approved_date' => $status === 'approved' ? ($approvedDate ?: $b['preferred_date']) : null,
            'approved_time' => $status === 'approved' ? ($approvedTime ?: $b['preferred_time']) : null,
            'admin_notes' => $adminNotes
        ]);

        // Refetch updated row
        $stmt->execute(['id' => $id]);
        $updated = $stmt->fetch();

        // Send email to customer if approved or rejected
        $customerName = $updated['full_name'];
        $customerEmail = $updated['email'];
        $service = $updated['service_type'];

        if ($status === 'approved') {
            $date = $updated['approved_date'] ?: $updated['preferred_date'];
            $time = $updated['approved_time'] ?: $updated['preferred_time'];
            
            $subject = "Your Booking Has Been Approved - HaulMate WA";
            $html = "
            <div style='font-family:Inter,Arial,sans-serif;background:#f8fafc;padding:24px;'>
              <div style='max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;'>
                <div style='background:#0f1b3d;color:#fde047;padding:24px;'>
                  <h1 style='margin:0;font-size:22px;'>Your booking is approved</h1>
                </div>
                <div style='padding:24px;color:#0f172a;'>
                  <p>Hi $customerName,</p>
                  <p>Good news — your rubbish removal booking has been <strong>approved</strong>.</p>
                  <div style='background:#f1f5f9;border-radius:10px;padding:16px;margin:16px 0;'>
                    <p style='margin:4px 0;'><strong>Service:</strong> $service</p>
                    <p style='margin:4px 0;'><strong>Date:</strong> $date</p>
                    <p style='margin:4px 0;'><strong>Time:</strong> $time</p>
                    <p style='margin:4px 0;'><strong>Location:</strong> {$updated['suburb']}" . (!empty($updated['street_address']) ? " — " . $updated['street_address'] : "") . "</p>" . 
                    (!empty($updated['load_size']) ? "<p style='margin:4px 0;'><strong>Load size:</strong> {$updated['load_size']}</p>" : "") . 
                    (!empty($updated['item_description']) ? "<p style='margin:4px 0;'><strong>Notes:</strong> {$updated['item_description']}</p>" : "") . 
                    (!empty($updated['access_notes']) ? "<p style='margin:4px 0;'><strong>Access:</strong> {$updated['access_notes']}</p>" : "") . "
                  </div>
                  <p>We'll arrive on time and contact you if we need any extra details.</p>
                  <p>Thanks,<br/>HaulMate WA<br/>Phone: 0415 125 702</p>
                </div>
              </div>
            </div>";
            $text = "Hi $customerName, your booking is approved. Service: $service. Date: $date. Time: $time. Location: {$updated['suburb']}. Call 0415 125 702 if you need anything. — HaulMate WA";
            
            @sendHtmlEmail($customerEmail, $subject, $html, $text);

        } elseif ($status === 'rejected') {
            $subject = "Update on Your Booking Request - HaulMate WA";
            $notesHtml = !empty($adminNotes) ? "<p style='background:#f1f5f9;padding:12px;border-radius:8px;'>$adminNotes</p>" : "";
            
            $html = "
            <div style='font-family:Inter,Arial,sans-serif;background:#f8fafc;padding:24px;'>
              <div style='max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;'>
                <div style='background:#0f1b3d;color:#fde047;padding:24px;'>
                  <h1 style='margin:0;font-size:20px;'>About your booking request</h1>
                </div>
                <div style='padding:24px;color:#0f172a;'>
                  <p>Hi $customerName,</p>
                  <p>Thanks for reaching out to HaulMate WA. Unfortunately we're unable to confirm your booking for {$updated['preferred_date']} at {$updated['preferred_time']}.</p>
                  $notesHtml
                  <p>Please give us a call or send a quick message on <a href='tel:0415125702' style='color:#1e3a8a;'>0415 125 702</a> and we'll find another time that works.</p>
                  <p>Thanks,<br/>HaulMate WA</p>
                </div>
              </div>
            </div>";
            $text = "Hi $customerName, we couldn't confirm your booking. Please call 0415 125 702 to arrange another time. — HaulMate WA";
            
            @sendHtmlEmail($customerEmail, $subject, $html, $text);
        }

        sendSuccess(["booking" => $updated]);
        break;

    default:
        sendError("Invalid action", 400);
}
