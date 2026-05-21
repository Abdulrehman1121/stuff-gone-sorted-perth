-- HaulMate WA Database Schema
-- Use this file to import the database table structure into your MySQL database (e.g., via phpMyAdmin).
-- Note: The PHP API is designed to automatically create this table if it does not exist, 
-- but you can manually import this if your server restricts automatic table creation.

CREATE TABLE IF NOT EXISTS `bookings` (
  `id` VARCHAR(36) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `full_name` VARCHAR(120) NOT NULL,
  `email` VARCHAR(200) NOT NULL,
  `phone` VARCHAR(40) NOT NULL,
  `suburb` VARCHAR(120) NOT NULL,
  `street_address` VARCHAR(240) NULL,
  `contact_method` VARCHAR(20) NOT NULL,
  `service_type` VARCHAR(50) NOT NULL,
  `item_description` TEXT NULL,
  `load_size` VARCHAR(50) NULL,
  `access_notes` TEXT NULL,
  `photo_url` VARCHAR(500) NULL,
  `preferred_date` VARCHAR(20) NOT NULL,
  `preferred_time` VARCHAR(20) NOT NULL,
  `alternative_date` VARCHAR(20) NULL,
  `alternative_time` VARCHAR(20) NULL,
  `urgency` VARCHAR(30) NULL,
  `status` VARCHAR(20) DEFAULT 'pending_approval',
  `approved_date` VARCHAR(20) NULL,
  `approved_time` VARCHAR(20) NULL,
  `admin_notes` TEXT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
