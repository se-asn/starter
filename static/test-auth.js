// Test Script für Smart Triathlete Authentication
console.log("🚀 Testing Smart Triathlete Authentication...");

// Demo user credentials
const testCredentials = {
    email: 'demo@example.com',
    password: 'demo123'
};

// Simulate the ClientAuth.login function
function testLogin(email, password) {
    const DEMO_USERS = [
        {
            id: '1',
            email: 'demo@example.com',
            name: 'Demo User',
            password: 'demo123'
        },
        {
            id: '2', 
            email: 'athlete@example.com',
            name: 'Elite Athlete',
            password: 'athlete123'
        },
        {
            id: '3',
            email: 'trainer@example.com', 
            name: 'Neural Trainer',
            password: 'trainer123'
        }
    ];

    console.log(`Attempting login with: ${email} / ${password}`);
    
    const user = DEMO_USERS.find(u => u.email === email && u.password === password);
    
    if (user) {
        const { password: _, ...userWithoutPassword } = user;
        const token = btoa(JSON.stringify({ 
            ...userWithoutPassword, 
            exp: Date.now() + 7 * 24 * 60 * 60 * 1000 
        }));
        
        console.log("✅ Login successful!");
        console.log("User:", userWithoutPassword);
        console.log("Token:", token);
        
        // Store in localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        
        return {
            success: true,
            user: userWithoutPassword,
            token,
            message: 'Neural link established successfully'
        };
    } else {
        console.log("❌ Login failed - invalid credentials");
        return {
            success: false,
            message: 'Invalid neural credentials detected'
        };
    }
}

// Test the authentication
const result = testLogin(testCredentials.email, testCredentials.password);

if (result.success) {
    console.log("🎉 Authentication test PASSED!");
    
    // Test localStorage storage
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
        console.log("✅ LocalStorage test PASSED!");
        console.log("Stored user:", JSON.parse(storedUser));
        
        // Test token verification
        try {
            const decoded = JSON.parse(atob(storedToken));
            if (decoded.exp > Date.now()) {
                console.log("✅ Token verification PASSED!");
                console.log("All authentication tests SUCCESSFUL! 🚀");
                
                // Redirect to dashboard would happen here
                console.log("Ready to redirect to /dashboard");
            } else {
                console.log("❌ Token expired");
            }
        } catch (e) {
            console.log("❌ Token verification failed:", e);
        }
    } else {
        console.log("❌ LocalStorage test FAILED!");
    }
} else {
    console.log("❌ Authentication test FAILED!");
}

console.log("Test completed.");
