const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🚀 Setting up Sales & Expense Management System...\n');

// Generate a secure JWT secret
const jwtSecret = crypto.randomBytes(64).toString('hex');

// Create .env file if it doesn't exist
const envPath = path.join(__dirname, 'server', '.env');
const envContent = `PORT=5000
MONGODB_URI=mongodb://localhost:27017/sales_expense_db
JWT_SECRET=${jwtSecret}
NODE_ENV=development`;

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created server/.env file with secure JWT secret');
} else {
  console.log('ℹ️  server/.env file already exists');
}

// Create uploads directory
const uploadsPath = path.join(__dirname, 'server', 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log('✅ Created uploads directory');
} else {
  console.log('ℹ️  Uploads directory already exists');
}

console.log('\n🎉 Setup complete! You can now run the application with:');
console.log('   npm run dev');
console.log('\n📝 Next steps:');
console.log('   1. Make sure MongoDB is running');
console.log('   2. Run "npm run dev" to start the application');
console.log('   3. Open http://localhost:3000 in your browser');
console.log('   4. Register your first admin user');
console.log('\n💡 Tip: Use the start.bat (Windows) or start.sh (Linux/Mac) scripts for easy startup');