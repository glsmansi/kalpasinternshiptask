const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CsvSchema = new Schema([
  {
    filename: String,
    csvData: [
      {
        studentUsn: String,
        studentName: String,
        IA1: Number,
        IA2: Number,
        IA3: Number,
        Total: Number,
      },
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
]);

const Csv = mongoose.model("Csv", CsvSchema);
module.exports = Csv;
