const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const fs = require('fs');

console.log('🗄️ Initializing database...');

// Remove existing file if it exists
if (fs.existsSync('database.sqlite')) {
  fs.unlinkSync('database.sqlite');
  console.log('📁 Removed old database file');
}

// Create new database
const db = new sqlite3.Database('database.sqlite', (err) => {
  if (err) {
    console.error('Error creating database:', err);
    process.exit(1);
  }
  console.log('✅ Database file created');
});

// Create tables and insert data
db.serialize(() => {
  // Create tables
  console.log('🏗️ Creating tables...');
  
  db.run(`CREATE TABLE IF NOT EXISTS tenants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    subscription_plan TEXT DEFAULT 'free',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'member',
    tenant_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants (id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT,
    user_id INTEGER NOT NULL,
    tenant_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (tenant_id) REFERENCES tenants (id)
  )`);

  // Insert tenants
  console.log('🏢 Adding tenants...');
  db.run('INSERT INTO tenants (slug, name) VALUES (?, ?)', ['acme', 'Acme Corporation']);
  db.run('INSERT INTO tenants (slug, name) VALUES (?, ?)', ['globex', 'Globex Corporation']);

  // Insert users
  console.log('👥 Adding users...');
  const passwordHash = bcrypt.hashSync('password', 10);
  
  db.run('INSERT INTO users (email, password_hash, role, tenant_id) VALUES (?, ?, ?, ?)', 
    ['admin@acme.test', passwordHash, 'admin', 1]);
  db.run('INSERT INTO users (email, password_hash, role, tenant_id) VALUES (?, ?, ?, ?)', 
    ['user@acme.test', passwordHash, 'member', 1]);
  db.run('INSERT INTO users (email, password_hash, role, tenant_id) VALUES (?, ?, ?, ?)', 
    ['admin@globex.test', passwordHash, 'admin', 2]);
  db.run('INSERT INTO users (email, password_hash, role, tenant_id) VALUES (?, ?, ?, ?)', 
    ['user@globex.test', passwordHash, 'member', 2]);

  console.log('✅ Database initialized successfully!');
  console.log('🔐 Test accounts:');
  console.log('  - admin@acme.test (password: password)');
  console.log('  - user@acme.test (password: password)'); 
  console.log('  - admin@globex.test (password: password)');
  console.log('  - user@globex.test (password: password)');
});

db.close((err) => {
  if (err) {
    console.error('Error closing database:', err);
  } else {
    console.log('🚀 Ready to start server with: npm run dev');
  }
  process.exit(0);
});