-- Database setup for CRUD application
-- Run this script in your MySQL environment to create the database and table

CREATE DATABASE IF NOT EXISTS crud_app;
USE crud_app;

-- Create items table
CREATE TABLE IF NOT EXISTS items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Optional: Insert some sample data
INSERT INTO items (name, description) VALUES 
('Sample Item 1', 'This is the first sample item'),
('Sample Item 2', 'This is the second sample item with more details');