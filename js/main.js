/*
document.addEventListener("DOMContentLoaded", function () {
    let currentChapter = 0;
    const chapters = ["Chapter 1 content here...", "Chapter 2 content here...", "Chapter 3 content here..."];
    
    const epubContainer = document.getElementById("epub-container");
    const prevButton = document.getElementById("prev-chapter");
    const nextButton = document.getElementById("next-chapter");

    function loadChapter(index) {
        epubContainer.innerHTML = chapters[index];
        prevButton.disabled = index === 0;
        nextButton.disabled = index === chapters.length - 1;
    }

    prevButton.addEventListener("click", function () {
        if (currentChapter > 0) {
            currentChapter--;
            loadChapter(currentChapter);
        }
    });

    nextButton.addEventListener("click", function () {
        if (currentChapter < chapters.length - 1) {
            currentChapter++;
            loadChapter(currentChapter);
        }
    });

    // Load the first chapter initially
    loadChapter(currentChapter);
});
*/

document.addEventListener('DOMContentLoaded', function () {
    // Handle login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('http://localhost:3000/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                });

                const data = await response.json();
                if (response.ok) {
                    alert('Login successful!');
                    window.location.href = '../index.html'; // Redirect to the main page
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred during login');
            }
        });
    }

    // Handle signup form submission
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('http://localhost:3000/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                });

                const data = await response.json();
                if (response.ok) {
                    alert('Account created successfully!');
                    window.location.href = 'login.html'; // Redirect to the login page
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred during signup');
            }
        });
    }
});
