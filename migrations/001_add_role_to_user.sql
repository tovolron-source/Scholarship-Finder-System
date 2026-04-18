-- Migration: Add role column to user table
-- This migration adds role-based access control support to the user table

-- Add role column to user table
ALTER TABLE `user` ADD COLUMN `role` ENUM('admin', 'student') NOT NULL DEFAULT 'student' AFTER `RegistrationDate`;

-- Update existing Admin user (ID: 1) to have admin role
UPDATE `user` SET `role` = 'admin' WHERE `id` = 1;

-- Update all other users to have student role
UPDATE `user` SET `role` = 'student' WHERE `id` != 1;
