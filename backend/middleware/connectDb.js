const mongoose = require("mongoose");
require("dotenv").config();
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const dbConnect = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@mazid158.1lx4zdb.mongodb.net/?appName=Mazid158`;

    cached.promise = mongoose.connect(uri).then(mongoose => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

module.exports = dbConnect;
