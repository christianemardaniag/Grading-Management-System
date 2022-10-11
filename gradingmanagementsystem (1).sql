-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 11, 2022 at 06:30 AM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 8.0.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gradingmanagementsystem`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `attempt` int(11) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `username`, `email`, `password`, `attempt`, `status`) VALUES
(1, 'admin', 'christianemardaniag@gmail.com', '12345678', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `criteria`
--

CREATE TABLE `criteria` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `equiv` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `criteria`
--

INSERT INTO `criteria` (`id`, `name`, `equiv`) VALUES
(1, 'Activities/Project', 30),
(2, 'Quizes', 20),
(3, 'Recitation', 15),
(4, 'Promptness', 5),
(5, 'Major Exam', 30);

-- --------------------------------------------------------

--
-- Table structure for table `faculty`
--

CREATE TABLE `faculty` (
  `id` varchar(110) NOT NULL,
  `fullName` varchar(255) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) DEFAULT NULL,
  `contact_no` varchar(100) NOT NULL,
  `profile_picture` varchar(255) NOT NULL DEFAULT 'images/defaultUserImage.jpg',
  `attempt` int(11) NOT NULL DEFAULT 3,
  `status` varchar(20) NOT NULL DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `faculty`
--

INSERT INTO `faculty` (`id`, `fullName`, `username`, `email`, `password`, `contact_no`, `profile_picture`, `attempt`, `status`) VALUES
('1231', 'ANIAG, Christian Emard S', 'christiananiag', 'christianemardaniag@gmail.com', '12345678', '09050446098', 'images/defaultUserImage.jpg', 2, 'active');

-- --------------------------------------------------------

--
-- Table structure for table `faculty_subject`
--

CREATE TABLE `faculty_subject` (
  `id` int(11) NOT NULL,
  `faculty_id` varchar(100) NOT NULL,
  `subject_code` varchar(100) NOT NULL,
  `sections` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `faculty_subject`
--

INSERT INTO `faculty_subject` (`id`, `faculty_id`, `subject_code`, `sections`) VALUES
(96, '1231', 'IT 401', '4A');

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `id` varchar(100) NOT NULL,
  `fullName` varchar(255) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) DEFAULT NULL,
  `contact_no` varchar(100) NOT NULL,
  `gender` tinytext NOT NULL,
  `specialization` varchar(100) NOT NULL,
  `program` varchar(100) NOT NULL,
  `level` varchar(100) NOT NULL,
  `section` varchar(100) NOT NULL,
  `profile_picture` varchar(255) NOT NULL DEFAULT 'images/defaultUserImage.jpg',
  `attempt` int(11) NOT NULL DEFAULT 2,
  `status` varchar(20) NOT NULL DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`id`, `fullName`, `username`, `email`, `password`, `contact_no`, `gender`, `specialization`, `program`, `level`, `section`, `profile_picture`, `attempt`, `status`) VALUES
('2019115088', 'BELANDRES, Marc Jason Variante', 'jason', 'jason@gmail.com', 'LID5OrKM', '09772532723', 'Male', 'Business Analytics', 'BSIT', '4th Year', '4B', 'images/defaultUserImage.jpg', 2, 'active'),
('2019115302', 'ANGELES, Patrick Agdeppa', 'patrick', 'patrick@bulsu.edu.ph', 'Y4uBsSQx', '09662399839', 'Male', 'Business Analytics', 'BSIT', '4th Year', '4A', 'images/defaultUserImage.jpg', 2, 'active'),
('2019115324', 'BERNARDO, Jeanne Ruby Homelda', 'aniagchristianemard', 'aniagchristianemard@gmail.com', 'sDyUG149', '09750972256', 'Female', 'Business Analytics', 'BSIT', '4th Year', '4D', 'images/defaultUserImage.jpg', 2, 'active'),
('2019117363', 'BENAVENTE, Angelica Arceo', 'emardchristiananiag', 'emardchristiananiag@gmail.com', 'Y4Sh7gWv', '09488317041', 'Female', 'Business Analytics', 'BSIT', '4th Year', '4C', 'images/defaultUserImage.jpg', 2, 'active');

-- --------------------------------------------------------

--
-- Table structure for table `student_subject`
--

CREATE TABLE `student_subject` (
  `id` int(11) NOT NULL,
  `student_id` varchar(100) NOT NULL,
  `subject_code` varchar(100) NOT NULL,
  `grade` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `student_subject`
--

INSERT INTO `student_subject` (`id`, `student_id`, `subject_code`, `grade`) VALUES
(73, '2019115302', 'IT 401', NULL),
(74, '2019115302', 'IT 402', NULL),
(75, '2019115302', 'IT 403', NULL),
(76, '2019115302', 'CAP 401', NULL),
(77, '2019115088', 'IT 401', NULL),
(78, '2019115088', 'IT 402', NULL),
(79, '2019115088', 'IT 403', NULL),
(80, '2019115088', 'CAP 402', NULL),
(81, '2019117363', 'IT 401', NULL),
(82, '2019117363', 'IT 402', NULL),
(83, '2019117363', 'IT 403', NULL),
(84, '2019117363', 'CAP 403', NULL),
(85, '2019115324', 'IT 401', NULL),
(86, '2019115324', 'IT 402', NULL),
(87, '2019115324', 'IT 403', NULL),
(88, '2019115324', 'CAP 404', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `subject`
--

CREATE TABLE `subject` (
  `id` int(11) NOT NULL,
  `code` varchar(100) NOT NULL,
  `description` varchar(255) NOT NULL,
  `year_level` int(11) NOT NULL,
  `semester` int(11) NOT NULL,
  `specialization` varchar(100) NOT NULL,
  `lec_units` int(11) NOT NULL,
  `lab_units` int(11) NOT NULL,
  `total_units` int(11) NOT NULL,
  `hours_per_week` int(11) NOT NULL,
  `prereq` varchar(255) NOT NULL DEFAULT 'NONE',
  `co_req` varchar(255) NOT NULL DEFAULT 'NONE'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `subject`
--

INSERT INTO `subject` (`id`, `code`, `description`, `year_level`, `semester`, `specialization`, `lec_units`, `lab_units`, `total_units`, `hours_per_week`, `prereq`, `co_req`) VALUES
(7, 'IT 102', 'Introduction to Computing', 1, 1, 'General', 3, 0, 3, 3, 'NONE', 'NONE'),
(8, 'IT 103', 'Computer Programming 1', 1, 1, 'General', 2, 1, 3, 5, 'NONE', 'NONE'),
(9, 'IT 104', 'Hardware System and Servicing', 1, 1, 'General', 2, 1, 3, 5, 'NONE', 'NONE'),
(10, 'RPH 101', 'Readings in Philippine History', 1, 1, 'General', 3, 0, 3, 3, 'NONE', 'NONE'),
(11, 'AAP 101', 'Art Appreciation', 1, 1, 'General', 3, 0, 3, 3, 'NONE', 'NONE'),
(12, 'STS 101', 'Science, Technology and Society', 1, 1, 'General', 3, 0, 3, 3, 'NONE', 'NONE'),
(13, 'ARP 101', 'Filipino 1', 1, 1, 'General', 3, 0, 3, 3, 'NONE', 'NONE'),
(14, 'PE 10', 'Physical Education I', 1, 1, 'General', 2, 0, 2, 2, 'NONE', 'NONE'),
(15, 'NSTP 10', 'ROTC/LTS/CWTS', 1, 1, 'General', 3, 0, 3, 3, 'NONE', 'NONE'),
(16, 'IT 105', 'Computer Programming 2', 1, 2, 'General', 2, 1, 3, 5, 'IT 103', 'NONE'),
(17, 'IT 106', 'Networking 1', 1, 2, 'General', 2, 1, 3, 5, 'IT 104', 'NONE'),
(18, 'IT 107', 'Discrete Structures for IT', 1, 2, 'General', 3, 0, 3, 3, 'NONE', 'NONE'),
(19, 'PCM 101', 'Purposive Communication', 1, 2, 'General', 3, 0, 3, 3, 'NONE', 'NONE'),
(20, 'MMW 101', 'Mathematics in the Modern World', 1, 2, 'General', 3, 0, 3, 3, 'NONE', 'NONE'),
(21, 'UTS 101', 'Understanding the Self', 1, 2, 'General', 3, 0, 3, 3, 'NONE', 'NONE'),
(22, 'PAL101', 'Filipino 2', 1, 2, 'General', 3, 0, 3, 3, 'NONE', 'NONE'),
(23, 'PE 11', 'Physical Education I', 1, 2, 'General', 2, 0, 2, 2, 'NONE', 'NONE'),
(24, 'NSTP 11', 'ROTC/LTS/CWTS', 1, 2, 'General', 3, 0, 3, 3, 'NSTP 10', 'NONE'),
(25, 'IT 201', 'Data Structures and Algorithms', 2, 1, 'General', 2, 1, 3, 5, 'IT 105', 'NONE'),
(26, 'IT 202', 'Information Management', 2, 1, 'General', 2, 1, 3, 5, 'IT 105', 'NONE'),
(27, 'IT 203', 'Object- Oriented Programming1', 2, 1, 'General', 2, 1, 3, 5, 'IT 105', 'IT 205'),
(28, 'IT 204', 'Integrative Programming and Technologies 1', 2, 1, 'General', 2, 1, 3, 5, 'IT 105', 'NONE'),
(29, 'IT205', 'Human Computer Interface', 2, 1, 'General', 2, 1, 3, 5, 'IT 102', 'IT 203'),
(30, 'AAH 101d*', 'Reading Visual Art', 2, 1, 'General', 3, 0, 3, 3, 'NONE', 'NONE'),
(31, 'ETH 101', 'Ethics', 2, 1, 'General', 3, 0, 3, 3, 'NONE', 'NONE'),
(32, 'PE 12', 'Physical Education III', 2, 1, 'General', 2, 0, 2, 2, 'NONE', 'NONE'),
(33, 'IT 206', 'Advanced Database Systems', 2, 2, 'General', 2, 1, 3, 5, 'IT 202', 'IT 207'),
(34, 'IT 207', 'Object- Oriented Programming2', 2, 2, 'General', 2, 1, 3, 5, 'IT 203', 'IT 206'),
(35, 'IT 208', 'Platform Technologies', 2, 2, 'General', 2, 1, 3, 5, 'IT102', 'NONE'),
(36, 'IT 209', 'Interactive Systems and Technologies', 2, 2, 'General', 2, 1, 3, 5, 'IT 205', 'NONE'),
(37, 'IT 210', 'Networking 2', 2, 2, 'General', 2, 1, 3, 5, 'IT106', 'NONE'),
(38, 'TCW 101', 'The Contemporary World', 2, 2, 'General', 3, 0, 3, 3, 'NONE', 'NONE'),
(39, 'MST 101d*', 'Living in the IT Era', 2, 2, 'General', 3, 0, 3, 3, 'NONE', 'NONE'),
(40, 'PE 13', 'Physical Education IV', 2, 2, 'General', 2, 0, 2, 2, 'NONE', 'NONE'),
(41, 'IT 301', 'Application Development and Emerging Technologies', 3, 1, 'General', 2, 1, 3, 5, 'IT 206/IT 207/IT 209', 'NONE'),
(42, 'IT 302', 'Social and Professional Issues', 3, 1, 'General', 3, 0, 3, 3, 'NONE', 'NONE'),
(43, 'IT 303', 'System Analysis and Design', 3, 1, 'General', 2, 1, 3, 5, 'IT 206/IT 207/IT 209', 'NONE'),
(44, 'IT 304', 'Web Systems and Technologies 1', 3, 1, 'General', 2, 1, 3, 5, 'IT 206/IT 207/IT 209', 'NONE'),
(45, 'IT 305', 'Quantitative Methods', 3, 1, 'General', 3, 0, 3, 3, 'IT 206/IT 207/IT 209', 'NONE'),
(46, 'IT 306', 'Elective 1', 3, 1, 'General', 2, 1, 3, 5, 'IT 206/IT 207/IT 209', 'NONE'),
(47, 'IT 307', 'Elective 2', 3, 1, 'General', 2, 1, 3, 5, 'IT 206/IT 207/IT 209', 'NONE'),
(48, 'FL 301', 'Foreign Language 1', 3, 1, 'General', 3, 0, 3, 3, 'NONE', 'NONE'),
(49, 'IT 308', 'Information Assurance and Security', 3, 2, 'General', 2, 1, 3, 5, 'IT 303', 'NONE'),
(50, 'IT 309', 'Systems Integration and Architecture 1', 3, 2, 'General', 2, 1, 3, 5, 'IT 303', 'NONE'),
(51, 'IT 310', 'Web Systems and Technologies 2', 3, 2, 'General', 2, 1, 3, 5, 'IT 304', 'NONE'),
(52, 'CAP 301', 'Capstone Project and Research 1', 3, 2, 'General', 3, 0, 3, 3, 'ALL MAJOR SUBJECTS', 'NONE'),
(53, 'IT 311', 'Elective 3', 3, 2, 'General', 2, 1, 3, 5, 'IT 306/IT 307', 'NONE'),
(54, 'IT312', 'Elective 4', 3, 2, 'General', 2, 1, 3, 5, 'IT 306/IT 307', 'NONE'),
(55, 'FL 302', 'Foreign Language 2', 3, 2, 'General', 3, 0, 3, 3, 'FL 101', 'NONE'),
(56, 'RLW 101', 'Life and Works of Rizal', 3, 2, 'General', 3, 0, 3, 3, 'NONE', 'NONE'),
(57, 'IT 401', 'System Administration and Maintenance', 4, 1, 'General', 2, 1, 3, 5, 'IT 210/IT 308', 'NONE'),
(58, 'IT 402', 'System Integration and Architecture 2', 4, 1, 'General', 2, 1, 3, 5, 'IT 309', 'NONE'),
(59, 'IT 403', 'Elective 5', 4, 1, 'General', 2, 1, 3, 5, 'IT 311/IT 312', 'NONE'),
(60, 'CAP 401', 'Capstone Project and Research 2', 4, 1, 'General', 3, 0, 3, 3, 'CAP 301', 'NONE'),
(61, 'IT 404', 'Internship', 4, 2, 'General', 9, 0, 9, 486, '4th year Standing', 'NONE');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `criteria`
--
ALTER TABLE `criteria`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `faculty`
--
ALTER TABLE `faculty`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `faculty_subject`
--
ALTER TABLE `faculty_subject`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_faculty` (`faculty_id`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `student_subject`
--
ALTER TABLE `student_subject`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `subject`
--
ALTER TABLE `subject`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `criteria`
--
ALTER TABLE `criteria`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `faculty_subject`
--
ALTER TABLE `faculty_subject`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=97;

--
-- AUTO_INCREMENT for table `student_subject`
--
ALTER TABLE `student_subject`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=89;

--
-- AUTO_INCREMENT for table `subject`
--
ALTER TABLE `subject`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `faculty_subject`
--
ALTER TABLE `faculty_subject`
  ADD CONSTRAINT `fk_faculty` FOREIGN KEY (`faculty_id`) REFERENCES `faculty` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
