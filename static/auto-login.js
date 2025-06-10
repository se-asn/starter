console.log("🚀 Auto-Login Test Started");

// Simulate clicking the Demo Login button
function autoLogin() {
    console.log("🔄 Triggering auto login...");
    
    // Set demo credentials
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    if (emailInput && passwordInput) {
        emailInput.value = 'demo@example.com';
        passwordInput.value = 'demo123';
        
        // Trigger change events to update Svelte bindings
        emailInput.dispatchEvent(new Event('input'));
        passwordInput.dispatchEvent(new Event('input'));
        
        console.log("✅ Credentials set, submitting form...");
        
        // Find and click submit button
        const submitButton = document.querySelector('.auth-submit');
        if (submitButton) {
            submitButton.click();
            console.log("✅ Submit button clicked");
        } else {
            console.log("❌ Submit button not found");
        }
    } else {
        console.log("❌ Input fields not found");
    }
}

// Wait for page to load, then auto-login
setTimeout(autoLogin, 2000);
