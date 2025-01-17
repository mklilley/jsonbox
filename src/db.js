/**
 * A singleton implemetaion for the database
 */

const mongoose = require('mongoose');
const config = require('./config');

module.exports = (() => {
	let instance;
	let db = mongoose.connection;

	const connectToDb = () => {
		mongoose.connect(config.MONGO_URL, {
			useCreateIndex: true,
			useNewUrlParser: true,
			useUnifiedTopology: true
		});
	};

	const createInstance = () => {
		db.on('error', error => {
			console.error('Error in MongoDb connection: ' + error);
			mongoose.disconnect(); // Trigger disconnect on any error
		});
		db.on('connected', () => console.log('Data Db connected'));
		db.on('disconnected', () => {
			console.log('MongoDB disconnected!');
			connectToDb();
		});

		connectToDb();
		    // Define schemas
    const schemas = {
        Data: new mongoose.Schema({
					_box: { type: String, index: true, select: false }, // box to which the record belongs
					_collection: { type: String, index: true }, // Any collection if user passes in URL
					_createdOn: Date, // Date on which its created
					_apiKey: { type: String, index: true, select: false }, // API KEY used to create / update the record
					_updatedOn: Date, // Date on which its updated
					_expiry: { type: Date, select: false }, // date after which this record will be deleted
					data: { type: Object } // Actual data of the record
				}),
        BoxTimeStamps: new mongoose.Schema({
						_box: { type: String, index: true, select: false }, // box to which the record belongs
            boxLastModified: { type: Date, default: null },
						_expiry: { type: Date, select: false }, // date after which this record will be deleted
        }),
    };

		// Once switched on the index will be be set in mongodb. Might need to remove it in order to switch off the behaviour
		if (config.ENABLE_DATA_EXPIRY) {
			schemas.Data.index({ _expiry: 1 }, { expireAfterSeconds: 0 });
			schemas.BoxTimeStamps.index({ _expiry: 1 }, { expireAfterSeconds: 0 });
		}


		const models = {
				Data: mongoose.models.Data || mongoose.model('Data', schemas.Data),
				BoxTimeStamps: mongoose.models.BoxTimeStamps || mongoose.model('BoxTimeStamps', schemas.BoxTimeStamps),
			};
	
			
		return models;

	};

	return {
		getInstance: () => {
			if (!instance) {
				instance = createInstance();
			}
			return instance;
		}
	};
})();
