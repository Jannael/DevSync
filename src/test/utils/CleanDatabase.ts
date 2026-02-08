import mongoose from 'mongoose'

async function CleanDatabase() {
	const db = mongoose.connection.db
	if (!db) return

	const collections = await db.listCollections().toArray()

	for (const collection of collections) {
		// avoid system collections
		if (!collection.name.startsWith('system.')) {
			await db.collection(collection.name).deleteMany({})
		}
	}
}
export default CleanDatabase
