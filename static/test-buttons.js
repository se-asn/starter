console.log('🚀 Testing Dashboard Button Functionality');

// Test all dashboard buttons
const buttons = document.querySelectorAll('.action-btn');
console.log(`Found ${buttons.length} action buttons`);

buttons.forEach((button, index) => {
    console.log(`Button ${index + 1}: ${button.title || button.textContent}`);
    
    // Test if button has click handler
    const hasClick = button.onclick || button.getAttribute('on:click');
    console.log(`  - Has click handler: ${!!hasClick}`);
    
    // Test if button is visible and clickable
    const isVisible = button.offsetParent !== null;
    console.log(`  - Is visible: ${isVisible}`);
    
    const isEnabled = !button.disabled;
    console.log(`  - Is enabled: ${isEnabled}`);
});

// Test zone buttons
const zoneButtons = document.querySelectorAll('.zone-btn');
console.log(`\nFound ${zoneButtons.length} zone buttons`);

zoneButtons.forEach((button, index) => {
    console.log(`Zone Button ${index + 1}: ${button.textContent}`);
    const isActive = button.classList.contains('active');
    console.log(`  - Is active: ${isActive}`);
});

console.log('\n✅ Button test completed!');
