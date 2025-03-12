const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const USERS_FILE = path.join(__dirname, '../data/users.json');

if (!fs.existsSync(USERS_FILE)) {
    console.log('⚠️  Fichier "users.json" introuvable. Génération des utilisateurs...');
    
    const generateUsers = exec('npm run generate:users');
    generateUsers.stdout.pipe(process.stdout);
    generateUsers.stderr.pipe(process.stderr);

    generateUsers.on('exit', (code) => {
        if (code === 0) {
            console.log('✅ Génération terminée. Démarrage du serveur JSON...');
            startJsonServer();
        } else {
            console.error('❌ Échec de la génération des utilisateurs.');
            process.exit(1);
        }
    });
} else {
    console.log('✅ Fichier "users.json" trouvé. Démarrage du serveur JSON...');
    startJsonServer();
}

function startJsonServer() {
    const jsonServer = exec('npx json-server --watch data/users.json --port 3000');
    jsonServer.stdout.pipe(process.stdout);
    jsonServer.stderr.pipe(process.stderr);

    setTimeout(() => {
        console.log('🚀 Démarrage de l\'application Angular...');
        const angularApp = exec('npm run start');
        angularApp.stdout.pipe(process.stdout);
        angularApp.stderr.pipe(process.stderr);
    }, 2000);
}
