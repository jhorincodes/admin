<?php
require '../../config/config.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Collect form data
    $email = $_POST['teacherEmail'];
    $password = $_POST['teacherPassword'];
    $confirm_password = $_POST['teacherConfirmPassword'];
    $f_name = $_POST['teacherfName'];
    $m_name = $_POST['teachermName'];
    $l_name = $_POST['teacherlName'];
    $grade = $_POST['grade'];
    $strand = $_POST['strand'];
    $section = $_POST['section'];
    $created_by = $_POST['createdBy']; // Get admin ID from the form data

    // Check if any required fields are empty
    if (empty($email) || empty($password) || empty($confirm_password) || empty($f_name) || empty($m_name) || empty($l_name) || $grade == 'Grade' || $strand == 'Strand' || $section == 'Section') {
        echo json_encode(['status' => 'error', 'message' => 'All fields are required']);
        exit;
    }

    // Check if passwords match
    if ($password !== $confirm_password) {
        echo json_encode(['status' => 'error', 'message' => 'Passwords do not match']);
        exit;
    }

    // Check for duplicate email (teachers)
    $sql = "SELECT COUNT(*) FROM instructor_table WHERE LOWER(email) = LOWER(:email)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['email' => $email]);
    $count = $stmt->fetchColumn();

    if ($count > 0) {
        echo json_encode(['status' => 'error', 'message' => 'Email already exists']);
        exit;
    }

    // Hash the password
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Insert teacher details into the database
    $sql = "INSERT INTO instructor_table (email, f_name, m_name, l_name, grade, strand, section, password, created_by, date_created) 
            VALUES (:email, :f_name, :m_name, :l_name, :grade, :strand, :section, :password, :created_by, NOW())";

    $stmt = $pdo->prepare($sql);

    try {
        // Execute the insertion with the created_by field (admin ID)
        $stmt->execute([
            'email' => $email,
            'password' => $hashed_password,
            'f_name' => $f_name,
            'm_name' => $m_name,
            'l_name' => $l_name,
            'grade' => $grade,
            'strand' => $strand,
            'section' => $section,
            'created_by' => $created_by, // Pass the admin ID here
        ]);
        echo json_encode(['status' => 'success', 'message' => 'Registration successful']);
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Registration failed: ' . $e->getMessage()]);
    }
} 
?>
