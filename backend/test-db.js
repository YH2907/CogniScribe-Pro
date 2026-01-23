// Test script to verify database connection and note operations
require('dotenv').config();
const mongoose = require('mongoose');
const Note = require('./models/Note');
const User = require('./models/User');

async function testDatabase() {
    console.log('\n🧪 Testing Blind Notes Database...\n');

    try {
        // Test 1: Database Connection
        console.log('Test 1: Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log('✅ Database connected successfully');
        console.log(`   Database name: ${mongoose.connection.name}`);

        // Test 2: Check collections
        console.log('\nTest 2: Checking collections...');
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log(`✅ Found ${collections.length} collections:`);
        collections.forEach(col => console.log(`   - ${col.name}`));

        // Test 3: Count existing notes
        console.log('\nTest 3: Counting existing notes...');
        const noteCount = await Note.countDocuments();
        console.log(`✅ Found ${noteCount} notes in database`);

        // Test 4: Count users
        console.log('\nTest 4: Counting users...');
        const userCount = await User.countDocuments();
        console.log(`✅ Found ${userCount} users in database`);

        // Test 5: Create a test note
        console.log('\nTest 5: Creating test note...');
        const testUserId = new mongoose.Types.ObjectId();
        const testNote = new Note({
            text: 'Test note - ' + new Date().toISOString(),
            userId: testUserId
        });
        await testNote.save();
        console.log('✅ Test note created successfully');
        console.log(`   Note ID: ${testNote._id}`);

        // Test 6: Retrieve the test note
        console.log('\nTest 6: Retrieving test note...');
        const retrieved = await Note.findById(testNote._id);
        console.log('✅ Test note retrieved successfully');
        console.log(`   Content: ${retrieved.text}`);

        // Test 7: Delete the test note
        console.log('\nTest 7: Deleting test note...');
        await Note.findByIdAndDelete(testNote._id);
        console.log('✅ Test note deleted successfully');

        console.log('\n✅ All tests passed! Database is working correctly.\n');

    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        console.error('   Full error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Database connection closed\n');
    }
}

testDatabase();
