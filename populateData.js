const { MongoClient, ObjectId } = require('mongodb');
const url = 'mongodb://localhost:27017';  // MongoDB connection URL
const dbName = 'Food';         // Replace with your database name
const collectionName = 'fooditems';  // Replace with your collection name

async function populateDatabase() {
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const categories = ['Veg', 'Non-Veg', 'South Indian', 'Italian'];

        // Generate 100 items
        const items = Array.from({ length: 100 }, (_, i) => ({
            _id: new ObjectId(),  // Use 'new' keyword with ObjectId
            description: `Sample food item description ${i + 1}`,
            fooditemId: new ObjectId().toString(),  // Use 'new' keyword with ObjectId
            price: 150 + (i % 50) * 10,
            imgBuffer: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxISEhUTEhM...',
            category: categories[i % categories.length],
            __v: 0
        }));

        // Insert data into MongoDB
        const result = await collection.insertMany(items);
        console.log(`${result.insertedCount} documents inserted`);

    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

populateDatabase();
