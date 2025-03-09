const userToggle = document.getElementById('user-toggle');
const navProfile = document.getElementById('nav-profile');
const userClose = document.getElementById('user-close');

// Toggle the menu visibility when the menu button is clicked
userToggle.addEventListener('click', () => {
    navProfile.classList.add('active');
    userToggle.style.display = 'none'; 
    userClose.style.display = 'block';
});

// Close the menu when the close button is clicked
userClose.addEventListener('click', () => {
    navProfile.classList.remove('active'); 
    userClose.style.display = 'none';
    userToggle.style.display = 'block'; 
});


const dashToggle = document.getElementById('dash-toggle');
const navLinks2 = document.getElementById('nav-links2');
const minimizeToggle = document.getElementById('minimize');


dashToggle.addEventListener('click', () => {
    navLinks2.classList.add('active');
    dashToggle.style.display = 'none'; 
    minimizeToggle.style.display = 'block';
});

// Close the menu when the close button is clicked
minimizeToggle.addEventListener('click', () => {
    navLinks2.classList.remove('active'); 
    minimizeToggle.style.display = 'none';
    dashToggle.style.display = 'block'; 
});