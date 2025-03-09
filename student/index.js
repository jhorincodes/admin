let studentId; // Global declaration of studentId
let userGrade, userStrand, userSection; // Store user's grade, strand, and section

$(document).ready(function () {
    // Navigation and UI elements
    const navLinks = document.querySelectorAll('.sidebar-nav ul li a');
    const cards = document.querySelectorAll('.cards-grid .card');
    const contentName = document.getElementById('content-name');
    const contentPath = document.getElementById('content-path');
    const backBtn = document.getElementById('backBtn');
    const scannerContainer = document.getElementById('scanner-container');
    const typeContainer = document.getElementById('typeContainer');
    const scannerResult = document.getElementById('scanner-result');
    const viewQRCodeContainer = document.getElementById('viewQRCodeContainer');
    const resultsSection = document.getElementById('results-section');
    const cardsGrid = document.getElementById('cardsGrid');

    // QR Code Scanner elements
    const video = document.getElementById('scanner-video');
    const scanButton = document.getElementById('scan-button');
    const qrCodeFname = document.getElementById('qr-codeFname');
    const qrCodeGrade = document.getElementById('qr_codeGrade');
    const qrCodeLrn = document.getElementById('qr_codeLrn');
    const viewBtn = document.getElementById('viewBtn');
    const lrnButton = document.getElementById('lrn-button');
    const lrnFname = document.getElementById('lrn-Fname');
    const lrnGrade = document.getElementById('lrn_Grade');
    const lrnLrn = document.getElementById('lrn_Lrn');
    const closeBtn = document.getElementById('closeStudentBtn');
    const attendanceHistory = document.getElementById('class-attendance-history');
    const typeLrn = document.getElementById('typeLrn');
    const attendanceTable = document.getElementById('attendance-table').getElementsByTagName('tbody')[0];

    let scannerActive = false;

    // Function to disable arrow keys in input fields
    function arrowKeyEnabled(inputNumber) {
        inputNumber.addEventListener("keydown", (event) => {
            if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                event.preventDefault();
            }
        });
    }

    if (typeLrn) arrowKeyEnabled(typeLrn);

    // Function to update the page path
    function updatePath(pageName) {
        contentName.textContent = pageName;
        const currentPath = contentPath.textContent.split('/')[0];
        contentPath.textContent = `${currentPath} / ${pageName}`;
        localStorage.setItem('currentPage', pageName);
    }

    // Function to show the cards grid
    function showCardsGrid() {
        cardsGrid.style.display = "grid";
        scannerContainer.style.display = "none";
        backBtn.style.display = "none";
        viewQRCodeContainer.style.display = "none";
        resultsSection.style.display = "none";
        attendanceHistory.style.display = "none";
        updatePath('Dashboard');
    }

    // Function to show the scanner for attendance
    function showScanAttendance() {
        cardsGrid.style.display = "none";
        backBtn.style.display = "block";
        scannerContainer.style.display = "flex";
        resultsSection.style.display = "none";
        attendanceHistory.style.display = "none";
        updatePath('Attendance');
    }

    function showType() {
        typeContainer.style.display = "flex";
        scannerResult.style.display = "none";
    }

    function showScan() {
        scannerResult.style.display = "flex";
        typeContainer.style.display = "none";
    }

    // Function to show attendance records
    function showAttendanceRecord() {
        cardsGrid.style.display = "none";
        backBtn.style.display = "block";
        resultsSection.style.display = "flex";
        attendanceHistory.style.display = "none";
        updatePath('Attendance Record');
    }

    // Function to show the QR code
    function showQrCode() {
        cardsGrid.style.display = "none";
        viewQRCodeContainer.style.display = "flex";
        backBtn.style.display = "block";
        resultsSection.style.display = "none";
        attendanceHistory.style.display = "none";
        updatePath('QR Code');
    }

    // Function to show attendance history
    function showAttendanceHistory() {
        cardsGrid.style.display = "none";
        scannerContainer.style.display = "none";
        resultsSection.style.display = "none";
        attendanceHistory.style.display = "flex";
        updatePath('Attendance History');
        fetchAttendanceHistory(); // Fetch and display attendance history
    }

    // Event listener for the "View Attendance History" button
    viewBtn.addEventListener('click', function (e) {
        e.preventDefault();
        showAttendanceHistory();
    });

    // Event listener for the "Close Attendance History" button
    closeBtn.addEventListener('click', function (e) {
        e.preventDefault();
        showScanAttendance(); // Return to the scanner view
    });

    // Add event listeners to navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const pageName = this.getAttribute('data-page');
            updatePath(pageName);

            if (pageName === 'Attendance') {
                showScanAttendance();
            } else if (pageName === 'QR Code') {
                showQrCode();
            } else if (pageName === 'Attendance Record') {
                showAttendanceRecord();
            } else if (pageName === 'Attendance History') {
                showAttendanceHistory();
            } else {
                showCardsGrid();
            }
        });
    });

    // Add event listeners to cards
    cards.forEach(card => {
        card.addEventListener('click', function (e) {
            e.preventDefault();
            const pageName = this.getAttribute('data-page');
            updatePath(pageName);

            if (pageName === 'Attendance') {
                showScanAttendance();
            } else if (pageName === 'QR Code') {
                showQrCode();
            } else if (pageName === 'Attendance Record') {
                showAttendanceRecord();
            } else if (pageName === 'Attendance History') {
                showAttendanceHistory();
            } else {
                showCardsGrid();
            }
        });
    });

    // Back button functionality
    backBtn.addEventListener('click', function (e) {
        e.preventDefault();
        showCardsGrid();
    });

    // Restore the last viewed page
    const savedPage = localStorage.getItem('currentPage');
    if (savedPage) {
        updatePath(savedPage);
        if (savedPage === 'Attendance') {
            showScanAttendance();
        } else if (savedPage === 'QR Code') {
            showQrCode();
        } else if (savedPage === 'Attendance Record') {
            showAttendanceRecord();
        } else if (savedPage === 'Attendance History') {
            showAttendanceHistory();
        } else {
            showCardsGrid();
        }
    } else {
        updatePath('Dashboard');
        showCardsGrid();
    }

    // Get the elements
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menu-toggle');
    const menuClose = document.getElementById('menu-close');
    const mainContent = document.querySelector('.main-content');

    // Function to toggle the sidebar
    function toggleSidebar() {
        const isSmallScreen = window.innerWidth <= 768;  // For small screens
        const isLargeScreen = window.innerWidth > 768;   // For large screens

        if (isSmallScreen) {
            sidebar.classList.toggle('active'); // Toggle sidebar visibility on small screens
        } else if (isLargeScreen) {
            sidebar.classList.toggle('active');
            mainContent.classList.toggle('sidebar-active'); // Adjust the margin for large screens
        }
    }

    // Add event listeners to the buttons
    menuToggle.addEventListener('click', toggleSidebar);
    menuClose.addEventListener('click', toggleSidebar);

    // Ensure that the sidebar behaves correctly based on screen size on page load
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768 && sidebar.classList.contains('active')) {
            mainContent.classList.add('sidebar-active'); // Apply margin for large screens
        } else {
            mainContent.classList.remove('sidebar-active'); // Remove margin if on smaller screens
        }
    });

    $.ajax({
        url: '../backend/api/students/student-id.php',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response.status === 'success' && response.userId) {
                studentId = response.userId;  // Store the studentId globally
                const userRole = response.userRole;
                const role = response.studentRole;
                console.log('User ID: ', studentId);
                console.log('User role: ', userRole);
                console.log('Role: ', role);

                // Fetch and display user information based on role
                if (userRole === 'student') {
                    fetchStudentInfo(studentId);
                    fetchAttendanceRecords(studentId);
                    if (role == 'Student') {
                        $('#student-role').text(`${role}`);
                        showType();
                    } else if (role == 'Class Coordinator') {
                        $('#student-role').text(`${role}`);
                        showScan();
                    }
                }
            } else {
                console.log('User ID not found');
            }
        },
        error: function (xhr, status, error) {
            console.error('AJAX Error: ' + status + ' ' + error);
        }
    });

    function fetchStudentInfo(studentId) {
        $.ajax({
            url: `../backend/api/instructor/students_display.php?id=${studentId}`,
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                try {
                    console.log('Student Details Response:', response);
                    $('#name').text(`${response.f_name} ${response.m_name} ${response.l_name}`);
                    $('#display_name').text(`${response.f_name} ${response.m_name} ${response.l_name}`);
                    $('#grade').text(`${response.grade} ${response.strand} - ${response.section}`);
                    $('#display-grade-strand-section').text(`Attendance for: ${response.grade} ${response.strand} - ${response.section}`);
                    $('#email').text(response.email);
                    $('#lrn').text(response.lrn);
                    $('#dateCreated').text(new Date(response.date_created).toLocaleDateString());
                    const qrCodePath = response.qrcodes;
                    $('#qrCodeContainer').html(`
                        <h3>QR Code</h3>
                        <img src='../backend/api/instructor/${qrCodePath}' alt='Student QR Code' style='max-width: 200px;'>
                    `);
                    $('#downloadQRBtn').click(function () {
                        downloadQRCode(qrCodePath);
                    });
                    // Store user's grade, strand, and section
                    userGrade = response.grade;
                    userStrand = response.strand;
                    userSection = response.section;

                } catch (error) {
                    console.error('Error displaying student info:', error);
                    alert('An error occurred while displaying the student details.');
                }
            },
            error: function (xhr, status, error) {
                console.error('AJAX error:', error);
                alert('An error occurred while fetching the student details.');
            }
        });
    }

    // Download QR Code
    function downloadQRCode(qrCodePath) {
        const link = document.createElement('a');
        link.href = `../backend/api/instructor/${qrCodePath}`;
        link.download = 'qr_code.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Logout functionality
    function logout() {
        sessionStorage.clear();
        localStorage.clear();

        // Make an AJAX call to the server to destroy the session
        fetch('../backend/api/students/logout.php', {
            method: 'POST',
            credentials: 'include' // Include cookies in the request
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    // Redirect the user to the login page
                    window.location.href = "../user-role/index.html";
                } else {
                    console.error('Logout failed:', data.message);
                }
            })
            .catch(error => {
                console.error('Error during logout:', error);
            });
    }

    document.getElementById('logoutBtn').addEventListener('click', logout);

    // Function to start the scanner
    async function startScanner() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
            video.srcObject = stream;
            video.play();
            scannerActive = true;
            requestAnimationFrame(scan);
        } catch (error) {
            console.error("Error accessing the camera: ", error);
        }
    }

    // Function to stop the scanner
    function stopScanner() {
        const stream = video.srcObject;
        if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
        }
        video.srcObject = null;
        scannerActive = false;
    }

    let isScannerEnabled = true;
    let lastScanTime = 0; // to track the last scan time

    function scan() {
        const now = new Date();
        const currentTime = now.toLocaleString();
        if (scannerActive && video.readyState === video.HAVE_ENOUGH_DATA && isScannerEnabled) {
            // Ensure that the scanner only processes a scan after a minimum time difference
            if (currentTime - lastScanTime < 2000) { // 2 seconds buffer between scans
                return; // Skip this scan if it's within the 2 seconds buffer time
            }

            lastScanTime = currentTime; // Update the last scan time

            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);

            if (code) {
                try {
                    // Reset previous message and fields for new scan
                    $('#attendanceDisplay').text('');
                    document.getElementById('type-container').reset();
                    qrCodeFname.textContent = '';
                    qrCodeGrade.textContent = '';
                    qrCodeLrn.textContent = '';
                    timeIn1.textContent = '';

                    
                    // Parse the QR code content
                    const qrData = JSON.parse(code.data);
                    const studentId = qrData.studentId;
                    const lrn = qrData.lrn;
                    
                    // Check if student exists in the database
                    checkStudentInDatabase(studentId, lrn, (exists, studentData) => {
                        if (exists) {
                            // Display student info
                            qrCodeFname.textContent = `${studentData.f_name} ${studentData.m_name} ${studentData.l_name}`;
                            qrCodeGrade.textContent = `${studentData.grade} ${studentData.strand} ${studentData.section}`;
                            qrCodeLrn.textContent = lrn;
                            
                            // Update current time on scan
                            const now = new Date();
                            const timestampValue = now.toLocaleString();
                            timeIn1.textContent = timestampValue;
                            
                            
                            // Check if student has already been scanned
                            if (userGrade === studentData.grade && userStrand === studentData.strand && userSection === studentData.section) {
                                validateAndMarkStudentPresent(studentId, lrn, timestampValue);
                            } else {
                                $('#attendanceDisplay').css('backgroundColor', '#dc3545');
                                $('#attendanceDisplay').text(`This scanner is only for: ${userGrade} ${userStrand} - ${userSection}.`);
                                console.error(`This scanner is only for: ${userGrade} ${userStrand} - ${userSection}.`);
                            }
                        } else {
                            $('#attendanceDisplay').css('backgroundColor', '#dc3545');
                            $('#attendanceDisplay').text(`Student not found in the database.`);
                        }
                    });
                } catch (error) {
                    console.error('Error parsing QR code content:', error);
                    alert('Invalid QR code format.');
                }
            }
        }

        // Continue scanning
        if (scannerActive) {
            requestAnimationFrame(scan);
        }
    }
    function checkStudentInDatabase(studentId, lrn, callback) {
        console.log("Checking student with studentId:", studentId, "and LRN:", lrn); // Debugging
    
        $.ajax({
            url: `../backend/api/students/check-student.php?studentId=${studentId}&lrn=${lrn}`,
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                console.log("Backend response:", response); // Debugging
                if (response.status === 'success' && response.student) {
                    callback(true, response.student);
                } else {
                    callback(false, null);
                }
            },
            error: function (xhr, status, error) {
                console.error('AJAX Error: ' + status + ' ' + error);
                callback(false, null);
            }
        });
    }
    function checkStudentbyLrn(lrn, callback) {
        console.log("Checking student with LRN:", lrn); // Debugging
    
        $.ajax({
            url: `../backend/api/students/check-student-lrn.php?lrn=${lrn}`,
            type: 'POST',
            dataType: 'json',
            success: function (response) {
                console.log("Backend response:", response); // Debugging
                if (response.status === 'success' && response.student) {
                    callback(true, response.student);
                } else {
                    callback(false, null);
                }
            },
            error: function (xhr, status, error) {
                console.error('AJAX Error: ' + status + ' ' + error);
                callback(false, null);
            }
        });
    }

function validateAndMarkStudentPresent(studentId, lrn, timeIn) {
    const school_year = '2024-2025'; // Example school year
    const semester = '2nd';
    const setShift = getSetAndShift(new Date(timeIn));

    const data = {
        studentId: studentId,
        lrn: lrn,
        school_year: school_year,
        semester: semester,
        timestamp: timeIn,
        shift_set: setShift
    };

    $.ajax({
        url: '../backend/api/students/mark-attendance.php',
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(data),
        success: function (response) {
            if (response.status === 'success') {
                // Show success message for a short time
                $('#attendanceDisplay').css('backgroundColor', '#28a745');  // Green for success
                $('#attendanceDisplay').text(`Attendance marked successfully.`);

                fetchAttendanceRecords(); // Refresh attendance records
            } else if (response.status === 'already-marked') {
                console.error('Attendance already marked', response.message);
                $('#attendanceDisplay').css('backgroundColor', 'orange');  // Yellow for already marked
                $('#attendanceDisplay').text(response.message);
            } else {
                console.error('Failed to mark attendance:', response.message);
                $('#attendanceDisplay').css('backgroundColor', '#dc3545');
                $('#attendanceDisplay').text(`Failed to mark attendance: ${response.message}`);
            }
        },
        error: function (xhr, status, error) {
            console.error('AJAX Error: ' + status + ' ' + error);
        }
    });
}

function lrnAttendance() {
    $('#type-container').on('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission

        // Clear any previous messages
        $('#attendanceDisplay').html('');
        $('#type-button').text('Checking...').attr('disabled', true);

        // Extract the LRN from the form input
        const lrn = $('#typeLrn').val().trim();
        // Reset previous message and fields for new scan
        $('#attendanceDisplay').text('');
        $('#typeLrn').text('');
        qrCodeFname.textContent = '';
        qrCodeGrade.textContent = '';
        qrCodeLrn.textContent = '';
        timeIn1.textContent = '';

        if (!lrn) {
            $('#attendanceDisplay').html('<div class="alert alert-danger">Please enter a valid LRN.</div>');
            $('#type-button').text('Submit').attr('disabled', false);
            return;
        }

        // Check if the student exists in the database
        checkStudentbyLrn(lrn, (exists, studentData) => {
            if (exists) {
                // Display student info
                qrCodeFname.textContent = `${studentData.f_name} ${studentData.m_name} ${studentData.l_name}`;
                qrCodeGrade.textContent = `${studentData.grade} ${studentData.strand} ${studentData.section}`;
                   studentIdvalue = `${studentData.id}`;
                qrCodeLrn.textContent = lrn;

                // Update current time on scan
                const now = new Date();
                const timestampValue = now.toLocaleString();
                timeIn1.textContent = timestampValue;

                // Check if the student belongs to the correct grade, strand, and section
                if (userGrade === studentData.grade && userStrand === studentData.strand && userSection === studentData.section) {
                    validateAndMarkStudentPresent(studentIdvalue, lrn, timestampValue);
                } else {
                    $('#attendanceDisplay').css('backgroundColor', '#dc3545');
                    $('#attendanceDisplay').text(`This scanner is only for: ${userGrade} ${userStrand} - ${userSection}.`);
                    console.error(`This scanner is only for: ${userGrade} ${userStrand} - ${userSection}.`);
                }
            } else {
                $('#attendanceDisplay').css('backgroundColor', '#dc3545');
                $('#attendanceDisplay').text('Student not found in the database.');
            }

            $('#type-button').text('Submit').attr('disabled', false);
        });
    });
}

// Call the lrnAttendance function to set up the event listener
lrnAttendance();


    function fetchAttendanceRecords(studentId) {
        console.log("Fetching attendance records for student ID:", studentId); // Debugging

        $.ajax({
            url: '../backend/api/students/fetch-attendance.php', // Update the URL if needed
            type: 'GET',
            dataType: 'json',
            data: {
                studentId: studentId  // Pass the student ID (studentId) to the PHP script
            },
            success: function (response) {
                if (response.status === 'success' && response.attendance) {
                    attendanceTable.innerHTML = ''; // Clear existing rows

                    response.attendance.forEach((record, index) => {
                        const newRow = attendanceTable.insertRow();
                        newRow.innerHTML = `
                            <td>${index + 1}</td>
                            <td>${record.lrn}</td>
                            <td>${record.grade} ${record.strand} - ${record.section}</td>
                            <td>${record.timestamp}</td>
                            <td>${record.shift_set}</td>
                        `;
                    });
                } else {
                    console.error('Failed to fetch attendance records:', response.message);
                }
            },
            error: function (xhr, status, error) {
                console.error('AJAX Error: ' + status + ' ' + error);
            }
        });
    }
    fetchAttendanceRecords(); // Fetch attendance records on page load

    // Function to fetch attendance data
    function fetchAttendanceHistory() {
        $.ajax({
            url: '../backend/api/students/class-attendance.php', // Update this URL if needed
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                if (response.status === 'success' && response.attendance) {
                    const attendanceHistoryTable = $('#attendanceHistory'); // Table body for displaying records
                    attendanceHistoryTable.empty(); // Clear the table before inserting new records

                    response.attendance.forEach((record, index) => {
                        const newRow = $('<tr></tr>'); // Create a new row for the table

                        newRow.html(`
                            <td>${index + 1}</td>
                            <td>${record.f_name} ${record.m_name} ${record.l_name}</td>
                            <td>${record.lrn}</td>
                            <td>${record.grade} ${record.strand} - ${record.section}</td>
                            <td>${record.timestamp}</td>
                            <td>${record.shift_set}</td>
                        `);

                        attendanceHistoryTable.append(newRow); // Append the new row to the table body
                    });
                    const classAttendanceTable = $('#classAttendanceTable'); // Table body for displaying records
                    classAttendanceTable.empty(); // Clear the table before inserting new records

                    response.attendance.forEach((record, index) => {
                        const newRow = $('<tr></tr>'); // Create a new row for the table

                        newRow.html(`
                            <td>${index + 1}</td>
                            <td>${record.f_name} ${record.m_name} ${record.l_name}</td>
                            <td>${record.timestamp}</td>
                        `);

                        classAttendanceTable.append(newRow); // Append the new row to the table body
                    });
                } else {
                    console.error('Failed to fetch attendance records:', response.message);
                }
            },
            error: function (xhr, status, error) {
                console.error('AJAX Error: ' + status + ' ' + error);
            }
        });
    }
    fetchAttendanceHistory();

    function getSetAndShift(date) {
        const day = date.getDay(); // 0 (Sunday) to 6 (Saturday)
        const hours = date.getHours();
        const isAM = hours < 12;

        if (day >= 1 && day <= 3) { // Monday to Wednesday
            return isAM ? 'AM - Set A' : 'PM - Set A';
        } else if (day >= 4 && day <= 5) { // Thursday to Friday
            return isAM ? 'AM - Set B' : 'PM - Set B';
        } else {
            return isAM ? 'AM' : 'PM -' + 'Weekend'; // Handle weekends if necessary
        }
    }
    // Function to update the current time every second
    function updateCurrentTime() {
        const currentTimeElement1 = document.getElementById('time1');
        const currentTimeElement2 = document.getElementById('time2');
        setInterval(() => {
            const now = new Date();
            const formattedTime = now.toLocaleTimeString(); // Format time with live seconds
            currentTimeElement1.textContent = formattedTime;
            currentTimeElement2.textContent = formattedTime;
        }, 1000); // Update every second
    }

    // Call the function to start updating the time
    updateCurrentTime();

    // Toggle the scanner state when the button is clicked
    scanButton.addEventListener('click', () => {
        if (scannerActive) {
            stopScanner();
            scanButton.textContent = 'Scan';
            scanButton.style.backgroundColor = ''; // Reset to default color
        } else {
            startScanner();
            scanButton.textContent = 'Stop';
            scanButton.style.backgroundColor = 'red'; // Change to red color
        }
    });
});