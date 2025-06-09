// login-test.js
// Test script to verify login functionality

const testCredentials = [
    { email: 'demo@example.com', password: 'demo123', name: 'Demo User' },
    { email: 'admin@example.com', password: 'admin123', name: 'Admin User' }
];

async function testLogin(credentials) {
    try {
        const response = await fetch('http://localhost:5174/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
                rememberMe: false
            })
        });

        const data = await response.json();
        
        if (data.success) {
            console.log(`✅ Login erfolgreich für ${credentials.name}:`);
            console.log(`   ID: ${data.user.id}`);
            console.log(`   Name: ${data.user.name}`);
            console.log(`   Email: ${data.user.email}`);
            return data;
        } else {
            console.log(`❌ Login fehlgeschlagen für ${credentials.name}: ${data.message}`);
            return null;
        }
    } catch (error) {
        console.log(`❌ Fehler beim Login-Test für ${credentials.name}:`, error.message);
        return null;
    }
}

async function runLoginTests() {
    console.log('🔐 Teste Login-Funktionalität...\n');
    
    for (const credentials of testCredentials) {
        await testLogin(credentials);
        console.log('');
    }
    
    console.log('📋 Anweisungen für manuellen Test:');
    console.log('1. Öffne http://localhost:5174/login im Browser');
    console.log('2. Verwende die Demo-Zugangsdaten:');
    console.log('   Email: demo@example.com');
    console.log('   Password: demo123');
    console.log('3. Nach dem Login navigiere zu /member/training-plan');
    console.log('4. Überprüfe die Fortschrittsbalken und Datenbankstatus-Anzeige');
}

runLoginTests();
