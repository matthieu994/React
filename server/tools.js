module.exports = {
    show: function (db, collection) {
        db.collection(collection).find({}).toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
        });
    },
    show: function (db, collection, query) {
        db.collection(collection).find(query).toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
        });
    },
    showCollections: function (db) {
        db.listCollections().toArray(function (err, collInfos) {
            console.log(collInfos);
        });
    },
    removeCollection: function (collection) {
        collection.remove({}, function (err) {
            if (err) return err;
        });
    },
    deleteAllTokens: function (collection) {
        collection.find({}, function (err, users) {
            if(err) return err;
            users.forEach(function (user) {
                collection.update({ _id: user._id }, {
                    token: ''
                }, function (err) {
                    if (err) return err;
                })
            });
        });
    }
}