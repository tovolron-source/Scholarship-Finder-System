-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 22, 2026 at 12:58 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sfs`
--

-- --------------------------------------------------------

--
-- Table structure for table `application`
--

CREATE TABLE `application` (
  `ApplicationID` int(11) NOT NULL,
  `StudentID` int(11) NOT NULL,
  `ScholarshipID` int(11) NOT NULL,
  `Status` enum('Pending','Under Review','Approved','Rejected') DEFAULT 'Pending',
  `PersonalStatement` longtext DEFAULT NULL,
  `TranscriptPath` varchar(500) DEFAULT NULL,
  `IDDocumentPath` varchar(500) DEFAULT NULL,
  `RecommendationPath` varchar(500) DEFAULT NULL,
  `DateApplied` timestamp NOT NULL DEFAULT current_timestamp(),
  `LastUpdated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `application`
--

INSERT INTO `application` (`ApplicationID`, `StudentID`, `ScholarshipID`, `Status`, `PersonalStatement`, `TranscriptPath`, `IDDocumentPath`, `RecommendationPath`, `DateApplied`, `LastUpdated`) VALUES
(1, 5, 1, 'Pending', 'POST http://localhost:5000/api/notifications/generate/deadlines\nPOST http://localhost:5000/api/notifications/generate/statusPOST http://localhost:5000/api/notifications/generate/deadlines\nPOST http://localhost:5000/api/notifications/generate/status', NULL, NULL, NULL, '2026-04-22 10:11:41', '2026-04-22 10:11:41');

-- --------------------------------------------------------

--
-- Table structure for table `favorite`
--

CREATE TABLE `favorite` (
  `FavoriteID` int(11) NOT NULL,
  `StudentID` int(11) NOT NULL,
  `ScholarshipID` int(11) NOT NULL,
  `CreatedAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `favorite`
--

INSERT INTO `favorite` (`FavoriteID`, `StudentID`, `ScholarshipID`, `CreatedAt`) VALUES
(7, 7, 1, '2026-04-17 11:42:45'),
(8, 7, 5, '2026-04-17 11:42:46'),
(9, 7, 6, '2026-04-17 11:42:47'),
(10, 7, 4, '2026-04-17 11:42:57');

-- --------------------------------------------------------

--
-- Table structure for table `notification`
--

CREATE TABLE `notification` (
  `NotificationID` int(11) NOT NULL,
  `StudentID` int(11) NOT NULL,
  `Type` enum('deadline','status','new_scholarship','application','general') DEFAULT 'general',
  `Title` varchar(255) NOT NULL,
  `Message` longtext NOT NULL,
  `ScholarshipID` int(11) DEFAULT NULL,
  `ApplicationID` int(11) DEFAULT NULL,
  `IsRead` tinyint(1) DEFAULT 0,
  `CreatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `UpdatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `scholarship`
--

CREATE TABLE `scholarship` (
  `ScholarshipID` int(11) NOT NULL,
  `ScholarshipName` varchar(255) NOT NULL,
  `Provider` varchar(255) NOT NULL,
  `Type` enum('Merit','Need-based','Athletic','Government','Private') NOT NULL,
  `Description` longtext DEFAULT NULL,
  `Benefits` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`Benefits`)),
  `Amount` varchar(100) DEFAULT NULL,
  `Slots` int(11) DEFAULT 0,
  `GWARequirement` decimal(3,2) DEFAULT 0.00,
  `Deadline` date DEFAULT NULL,
  `ApplicationMethod` varchar(255) DEFAULT NULL,
  `GoogleFormLink` varchar(500) DEFAULT NULL,
  `ProviderContact` varchar(255) DEFAULT NULL,
  `EligibilityRequirements` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`EligibilityRequirements`)),
  `ApplicationProcess` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`ApplicationProcess`)),
  `CreatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `UpdatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `scholarship`
--

INSERT INTO `scholarship` (`ScholarshipID`, `ScholarshipName`, `Provider`, `Type`, `Description`, `Benefits`, `Amount`, `Slots`, `GWARequirement`, `Deadline`, `ApplicationMethod`, `GoogleFormLink`, `ProviderContact`, `EligibilityRequirements`, `ApplicationProcess`, `CreatedAt`, `UpdatedAt`) VALUES
(1, 'DOST Science & Technology Scholarship', 'Department of Science and Technology', 'Government', 'Full scholarship program for STEM students with strong academic performance and commitment to serving the country after graduation.', '[\"Full tuition fee coverage\",\"Monthly living allowance\",\"Book allowance\",\"Thesis/Research grant\"]', '$5,000/year', 50, 3.00, '2026-04-29', 'Online Application', 'https://forms.google.com/dost-scholarship', 'scholarships@dost.gov', '{\"gwa\":\"2.6\",\"courses\":\"\",\"yearLevel\":\"\"}', '[\"Submit online application form\",\"Upload required documents (transcript, ID, recommendation letter)\",\"Take entrance examination\",\"Attend interview if shortlisted\"]', '2026-04-11 10:09:39', '2026-04-20 11:11:19'),
(2, 'Google Excellence Scholarship', 'Google Inc.', 'Private', 'Scholarship for exceptional students pursuing careers in technology with demonstrated leadership and community involvement.', '[\"One-time grant of $10,000\", \"Mentorship from Google engineers\", \"Internship opportunity\", \"Access to Google developer resources\"]', '$10,000', 20, 3.50, '2026-05-15', 'Online Application', 'https://forms.google.com/google-excellence', 'scholarships@google.com', '{\"gwa\": 3.5, \"courses\": [\"BS Computer Science\", \"BS Information Technology\", \"BS Software Engineering\"], \"yearLevel\": [\"3rd Year\", \"4th Year\"]}', '[\"Complete online application\", \"Submit essay on technology and society\", \"Provide two letters of recommendation\", \"Participate in video interview\"]', '2026-04-11 10:09:39', '2026-04-20 11:16:58'),
(3, 'Academic Merit Award', 'State University Foundation', 'Merit', 'Merit-based scholarship for high-achieving students across all disciplines.', '[\"Tuition reduction of $3,000 per semester\",\"Priority course registration\",\"Access to honors lounge\"]', '$3,000/semester', 100, 3.80, '2026-03-27', 'University Portal', 'https://forms.google.com/merit-award', 'foundation@stateuniversity.edu', '{\"gwa\":\"5\",\"courses\":\"\",\"yearLevel\":\"\"}', '[\"Submit application through university portal\",\"No additional documents required (automatic review based on grades)\"]', '2026-04-11 10:09:39', '2026-04-20 10:47:06'),
(4, 'Future Engineers Scholarship', 'Engineering Society of America', 'Merit', 'Supporting the next generation of engineers through financial assistance and professional development.', '[\"Annual grant of $4,500\", \"Conference attendance sponsorship\", \"Professional networking events\"]', '$4,500', 30, 3.20, '2026-06-01', 'Online Application', 'https://forms.google.com/future-engineers', 'scholarships@esa.org', '{\"gwa\": 3.2, \"courses\": [\"BS Engineering\", \"BS Computer Engineering\", \"BS Electrical Engineering\"], \"yearLevel\": [\"2nd Year\", \"3rd Year\", \"4th Year\"]}', '[\"Fill out application form\", \"Submit project portfolio\", \"Provide faculty recommendation\"]', '2026-04-11 10:09:39', '2026-04-20 11:20:31'),
(5, 'Community Champions Grant', 'National Youth Foundation', 'Need-based', 'Financial support for students who demonstrate commitment to community service and leadership.', '[\"$2,500 annual grant\", \"Leadership training workshops\", \"Community project funding\"]', '$2,500', 75, 2.50, '2026-04-15', 'Online Application', 'https://forms.google.com/community-champions', 'grants@nyf.org', '{\"gwa\": 2.5, \"courses\": [\"All Programs\"], \"yearLevel\": [\"1st Year\", \"2nd Year\", \"3rd Year\", \"4th Year\"], \"financialStatus\": [\"Low Income\"]}', '[\"Complete application form\", \"Submit community service documentation\", \"Write essay on leadership experience\"]', '2026-04-11 10:09:39', '2026-04-20 11:20:57'),
(6, 'Women in STEM Scholarship', 'Tech Women Network', 'Merit', 'Empowering women pursuing careers in science, technology, engineering, and mathematics.', '[\"Annual scholarship of $6,000\", \"Mentorship program\", \"Industry networking events\", \"Career development workshops\"]', '$6,000', 25, 3.30, '2026-05-30', 'Online Application', 'https://forms.google.com/women-stem', 'scholarships@techwomen.org', '{\"gwa\": 3.3, \"courses\": [\"BS Computer Science\", \"BS Engineering\", \"BS Mathematics\", \"BS Physics\"], \"yearLevel\": [\"1st Year\", \"2nd Year\", \"3rd Year\", \"4th Year\"]}', '[\"Online application submission\", \"Personal statement on STEM goals\", \"Faculty recommendation letter\"]', '2026-04-11 10:09:39', '2026-04-20 11:21:16'),
(7, 'JUAN scholarship', 'Juan', 'Merit', 'juan provides scholarships', '[\"Full tuition coverage\",\"Monthly allowance\"]', '$2,500', 1, 3.00, '2026-04-25', 'University Portal', 'https://forms.google.com/juanaward', 'juan@scholarship.com', '{\"gwa\":\"3.0\",\"courses\":[\"All Programs\"],\"yearLevel\":[\"2nd Year\",\"3rd Year\",\"4th Year\"]}', '[\"Submit application form\",\"Submit proof of enrollment\"]', '2026-04-22 10:38:14', '2026-04-22 10:38:14');

-- --------------------------------------------------------

--
-- Table structure for table `student_profile`
--

CREATE TABLE `student_profile` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `fullName` varchar(255) DEFAULT NULL,
  `gender` varchar(50) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `school` varchar(255) DEFAULT NULL,
  `course` varchar(255) DEFAULT NULL,
  `yearLevel` varchar(50) DEFAULT NULL,
  `gwa` decimal(3,2) DEFAULT NULL,
  `financialStatus` varchar(50) DEFAULT NULL,
  `contactNumber` varchar(20) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `profilePhoto` varchar(500) DEFAULT NULL,
  `profileCompletion` int(11) DEFAULT 20
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_profile`
--

INSERT INTO `student_profile` (`id`, `userId`, `fullName`, `gender`, `address`, `school`, `course`, `yearLevel`, `gwa`, `financialStatus`, `contactNumber`, `createdAt`, `updatedAt`, `profilePhoto`, `profileCompletion`) VALUES
(2, 5, 'TOVOLRON', 'Male', '123, Pineapple Street, BIkini Bottom', 'Earth State University', 'BS BIAS', '4th Year', 2.53, 'High Income', '09123456789', '2026-04-05 15:19:52', '2026-04-20 10:58:46', '/uploads/profile-1775404125872-525757832.jpg', 100),
(4, 7, 'VJ ABJELINA', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-10 11:06:06', '2026-04-10 11:06:06', NULL, 20),
(6, 9, '12 34', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-21 12:23:24', '2026-04-21 12:23:24', NULL, 20);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `RegistrationDate` datetime DEFAULT current_timestamp(),
  `role` enum('admin','student') NOT NULL DEFAULT 'student'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `Name`, `Email`, `Password`, `RegistrationDate`, `role`) VALUES
(1, 'Admin', 'admin@bisu.edu.ph', '$2a$10$mxZi9HZpYhJizmp/90aBse2L/O5buPDoKG/i1ilG.266pz17XSMSm', '2026-04-18 18:02:27', 'admin'),
(5, 'TOVOLRON', 'tovolron@gmail.com', '$2a$10$m1PgKcoQZORBOr4ylcrZO.TXClI9PekUipRYz42eAe6JccbUZUk0m', '2026-04-03 19:32:06', 'student'),
(7, 'VJ ABJELINA', 'vj.abjelina@bisu.edu.ph', '$2a$10$q3Jm.mbBZjbmapTwHqsQceJDQgLZzV16CDXhA/5OpsaxEAQRIu1QG', '2026-04-10 19:06:06', 'student'),
(9, '12 34', 'abjelinav1@gmail.com', '$2a$10$MDkzukV8ojhinAhGvlH6oeUwc/0cYe/JN97.DhYOKSxwVzcx1Pc4G', '2026-04-21 20:23:24', 'student');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `application`
--
ALTER TABLE `application`
  ADD PRIMARY KEY (`ApplicationID`),
  ADD UNIQUE KEY `unique_student_scholarship_app` (`StudentID`,`ScholarshipID`),
  ADD KEY `idx_student_id` (`StudentID`),
  ADD KEY `idx_scholarship_id` (`ScholarshipID`),
  ADD KEY `idx_status` (`Status`),
  ADD KEY `idx_date_applied` (`DateApplied`);

--
-- Indexes for table `favorite`
--
ALTER TABLE `favorite`
  ADD PRIMARY KEY (`FavoriteID`),
  ADD UNIQUE KEY `unique_student_scholarship` (`StudentID`,`ScholarshipID`),
  ADD KEY `ScholarshipID` (`ScholarshipID`);

--
-- Indexes for table `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`NotificationID`),
  ADD KEY `ScholarshipID` (`ScholarshipID`),
  ADD KEY `ApplicationID` (`ApplicationID`),
  ADD KEY `idx_student_id` (`StudentID`),
  ADD KEY `idx_type` (`Type`),
  ADD KEY `idx_is_read` (`IsRead`),
  ADD KEY `idx_created_at` (`CreatedAt`);

--
-- Indexes for table `scholarship`
--
ALTER TABLE `scholarship`
  ADD PRIMARY KEY (`ScholarshipID`);

--
-- Indexes for table `student_profile`
--
ALTER TABLE `student_profile`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `userId` (`userId`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `application`
--
ALTER TABLE `application`
  MODIFY `ApplicationID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `favorite`
--
ALTER TABLE `favorite`
  MODIFY `FavoriteID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `notification`
--
ALTER TABLE `notification`
  MODIFY `NotificationID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `scholarship`
--
ALTER TABLE `scholarship`
  MODIFY `ScholarshipID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `student_profile`
--
ALTER TABLE `student_profile`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `application`
--
ALTER TABLE `application`
  ADD CONSTRAINT `application_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `application_ibfk_2` FOREIGN KEY (`ScholarshipID`) REFERENCES `scholarship` (`ScholarshipID`) ON DELETE CASCADE;

--
-- Constraints for table `favorite`
--
ALTER TABLE `favorite`
  ADD CONSTRAINT `favorite_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `favorite_ibfk_2` FOREIGN KEY (`ScholarshipID`) REFERENCES `scholarship` (`ScholarshipID`) ON DELETE CASCADE;

--
-- Constraints for table `notification`
--
ALTER TABLE `notification`
  ADD CONSTRAINT `notification_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `notification_ibfk_2` FOREIGN KEY (`ScholarshipID`) REFERENCES `scholarship` (`ScholarshipID`) ON DELETE SET NULL,
  ADD CONSTRAINT `notification_ibfk_3` FOREIGN KEY (`ApplicationID`) REFERENCES `application` (`ApplicationID`) ON DELETE SET NULL;

--
-- Constraints for table `student_profile`
--
ALTER TABLE `student_profile`
  ADD CONSTRAINT `student_profile_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
