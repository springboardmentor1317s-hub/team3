// ============================================
// AUTHENTICATION SYSTEM - CampusEventHub
// ============================================

// Initialize localStorage if not exists
function initializeAuth() {
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
    }
    if (!localStorage.getItem('currentUser')) {
        localStorage.setItem('currentUser', JSON.stringify(null));
    }
}

// Register new user
function registerUser(fullName, email, password, userType) {
    initializeAuth();
    
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if email already exists
    if (users.find(u => u.email === email)) {
        return {
            success: false,
            message: 'Email already registered! Please login instead.'
        };
    }
    
    // Create new user
    const newUser = {
        id: Date.now(),
        fullName: fullName,
        email: email,
        password: btoa(password), // Simple base64 encoding (use proper hashing in production)
        userType: userType, // 'student' or 'admin'
        registeredDate: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    return {
        success: true,
        message: 'Registration successful! Please login.',
        user: newUser
    };
}

// Login user
function loginUser(email, password, userType) {
    initializeAuth();
    
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Find user by email and type
    const user = users.find(u => 
        u.email === email && 
        u.userType === userType
    );
    
    if (!user) {
        return {
            success: false,
            message: 'Invalid email or user type. Please check your credentials.'
        };
    }
    
    // Verify password
    if (btoa(password) !== user.password) {
        return {
            success: false,
            message: 'Incorrect password. Please try again.'
        };
    }
    
    // Set current user session
    localStorage.setItem('currentUser', JSON.stringify({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        userType: user.userType,
        loginTime: new Date().toISOString()
    }));
    
    return {
        success: true,
        message: 'Login successful!',
        user: user,
        userType: user.userType
    };
}

// Get current logged-in user
function getCurrentUser() {
    initializeAuth();
    const currentUser = localStorage.getItem('currentUser');
    return currentUser ? JSON.parse(currentUser) : null;
}

// Logout user
function logoutUser() {
    localStorage.setItem('currentUser', JSON.stringify(null));
    return {
        success: true,
        message: 'Logged out successfully'
    };
}

// Check if user is authenticated
function isAuthenticated() {
    const currentUser = getCurrentUser();
    return currentUser !== null;
}

// Redirect based on user type
function redirectToDashboard(userType) {
    if (userType === 'admin') {
        window.location.href = 'admin-dashboard.html';
    } else if (userType === 'student') {
        window.location.href = 'student-dashboard.html';
    }
}

// Protect dashboard pages (call at the start of dashboard pages)
function protectPage() {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        alert('Please login first');
        window.location.href = 'login.html';
        return false;
    }
    
    return true;
}

// Get all users (for admin purposes)
function getAllUsers() {
    initializeAuth();
    return JSON.parse(localStorage.getItem('users')) || [];
}

// Update user profile
function updateUserProfile(userId, updatedData) {
    initializeAuth();
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        return { success: false, message: 'User not found' };
    }
    
    users[userIndex] = { ...users[userIndex], ...updatedData };
    localStorage.setItem('users', JSON.stringify(users));
    
    // Update current user if it's the logged-in user
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
        localStorage.setItem('currentUser', JSON.stringify({
            ...currentUser,
            ...updatedData
        }));
    }
    
    return { success: true, message: 'Profile updated successfully' };
}

// Delete user (admin only)
function deleteUser(userId) {
    initializeAuth();
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    users = users.filter(u => u.id !== userId);
    localStorage.setItem('users', JSON.stringify(users));
    
    return { success: true, message: 'User deleted successfully' };
}

// Demo users for testing (optional)
function createDemoUsers() {
    initializeAuth();
    
    // Clear existing data for demo
    localStorage.setItem('users', JSON.stringify([]));
    
    // Create demo admin
    registerUser('Admin User', 'admin@campus.com', 'admin123', 'admin');
    
    // Create demo student
    registerUser('Student User', 'student@campus.com', 'student123', 'student');
    
    console.log('Demo users created. Admin: admin@campus.com (pass: admin123), Student: student@campus.com (pass: student123)');
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', initializeAuth);
