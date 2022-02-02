const express = require("express");
const router = express();
const csvtojson = require("csvtojson");
const Csv = require("../models/csv");
const path = require("path");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");

const multer = require("multer");
var storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, path.join(__dirname + "/uploads/"));
  },
  filename: function (req, res, cb) {
    cb(null, Date.now() + ".csv");
  },
});

var upload = multer({ storage: storage });

router.post("/upload", auth, upload.single("csv"), async (req, res) => {
  await csvtojson()
    .fromFile(req.file.path)
    .then(async (csvData) => {
      const files = await Csv.find({});
      const filename = req.file.originalname;
      // console.log(req.user);
      const user = req.user;
      const newFile = await Csv.insertMany([{ filename, csvData, user }])
        .then(() => {
          console.log("inserted");
          res.send(files);
        })
        .catch((e) => console.log(e));
    });
});

router.get("/files", auth, async (req, res) => {
  const files = await Csv.find({});
  if (!files) {
    return res.status(404).send();
  }
  res.send(files);
});

router.get("/file/:id", auth, async (req, res) => {
  const { id } = req.params;
  const file = await Csv.findOne({ id });
  if (!file) {
    return res.status(404).send();
  }
  res.send(file);
});

router.get("/file/:id/data/:dataID", auth, async (req, res) => {
  const { id, dataID } = req.params;
  const file = await Csv.findById(id);
  const doc = file.csvData.id(dataID);
  res.send(doc);
});

router.patch("/file/:id/add", auth, async (req, res) => {
  const { studentUsn, studentName, IA1, IA2, IA3 } = req.body.csvData;
  const { id } = req.params;
  const file = await Csv.findById(id);
  Total = (IA1 + IA2 + IA3) / 3;
  console.log(req.body.csvData);
  console.log(id);
  await file.csvData.push({ studentUsn, studentName, IA1, IA2, IA3, Total });
  await file.save();
  res.send(file);
});

router.patch("/file/:id/edit/:dataID", auth, async (req, res) => {
  console.log(req.body.csvData);
  const { studentUsn, studentName, IA1, IA2, IA3, Total } = req.body.csvData;
  const { id, dataID } = req.params;
  const file = await Csv.findById(id);
  const doc = file.csvData.id(dataID);
  doc.studentUsn = studentUsn;
  doc.studentName = studentName;
  doc.IA1 = IA1;
  doc.IA2 = IA2;
  doc.IA3 = IA3;
  doc.Total = Total;
  await file.save();
  res.send(file);
});

router.delete("/file/:id/data/:dataID", auth, async (req, res) => {
  const { id, dataID } = req.params;
  console.log(id);
  const file = await Csv.findById(id);
  file.csvData.id(dataID).remove();
  await file.save();
  console.log("removed");
  res.send(file);
});

router.delete("/file/:id", auth, async (req, res) => {
  const { id } = req.params;
  await Csv.findByIdAndDelete(id);
  const files = await Csv.find({});
  res.send(files);
});

module.exports = router;
