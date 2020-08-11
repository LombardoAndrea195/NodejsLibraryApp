
const MongoClient = require("mongodb").MongoClient;

const dbConnectionUrl = 'mongodb://lombi95:lombi95@mongodb-shard-00-00.sn4ih.mongodb.net:27017,mongodb-shard-00-01.sn4ih.mongodb.net:27017,mongodb-shard-00-02.sn4ih.mongodb.net:27017/users?ssl=true&replicaSet=atlas-11u0c0-shard-0&authSource=admin&retryWrites=true&w=majority';


function initialize(
    dbName,
    dbCollectionName,
    successCallback,
    failureCallback
) {
    MongoClient.connect(dbConnectionUrl,{useUnifiedTopology: true }, function(err, dbInstance) {
        if (err) {
            console.log(`[MongoDB connection] ERROR: ${err}`);
            failureCallback(err); // this should be "caught" by the calling function
        } else {
            const dbObject = dbInstance.db(dbName);
            const dbCollection = dbObject.collection(dbCollectionName);
            console.log("[MongoDB connection] SUCCESS");

            successCallback(dbCollection);
        }
        
    });
}

module.exports = {
    initialize
};

// << db init >>

