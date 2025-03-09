<?php
require '../../config/config.php'; // Include your database connection

// Fetch teachers' data from the database
$sql = "SELECT id, f_name, m_name, l_name, grade, strand, section, email, date_created FROM instructor_table";
$stmt = $pdo->prepare($sql);
$stmt->execute();

// Fetch all records from the instructor_table
$instructors = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Return data as JSON
echo json_encode($instructors);
?>
