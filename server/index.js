require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const CORS = require("cors");
const multer = require("multer");
const app = express();
const connectDB = require("./connectDB/index");
let connect = connectDB();
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const uploadMulter = multer({ storage });

const corsOptions = {
  origin: "http://localhost:3000",
  status: 200,
};

app.use(CORS(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

// app.post("/api/registerUser", async (req, res) => {
//   const { email, name } = req.body;
//   try {
//     let q = `INSERT INTO users (name, email)
//     VALUES (${name}, ${email})`;
//     connect.query(q, (err, data) => {
//       if (err) return new Error(err);
//       res.status(200).send({ data, message: "User Register Successfully" });
//     });
//   } catch (error) {
//     res.status(error.response.status).send({ message: error.message });
//   }
// });

app.get("/api/getAllImages", async (req, res) => {
  try {
    let allImgData = [];
    let q = "SELECT * FROM images";
    connect.query(q, (err, data) => {
      if (err) return new Error(err);
      data.map((ele) => {
        allImgData.push({ imgPath: ele.imgPath, imgId: ele.ID });
      });
      res.status(200).send({ data: allImgData });
    });
  } catch (error) {
    res.status(error.response.status).send({ message: error.message });
  }
});

app.post("/api/uploadImg", uploadMulter.single("file"), (req, res) => {
  const file = req.file;
  const path = file.path.split("\\").join("/");

  try {
    let q = `INSERT INTO images (imgPath) VALUES (?)`;
    connect.query(q, [path], (err, data) => {
      if (err) return new Error(err);
      res.status(200).send({ data });
    });
  } catch (error) {
    res.status(error.response.status).send({ message: error.message });
  }
});

app.post("/api/updateImg", uploadMulter.single("file"), async (req, res) => {
  const { imgId, prevImgPath } = req.body;
  const file = req.file;
  const path = file.path.split("\\").join("/");
  try {
    const q = `UPDATE images SET imgPath = ? WHERE ID = ?;`;
    connect.query(q, [path, imgId], (err, data) => {
      if (err) return new Error(err);
      fs.unlinkSync(`./${prevImgPath}`);
      res.status(200).send({ data });
    });
  } catch (error) {
    res.status(error.response.status).send({ message: error.message });
  }
});

app.post("/api/deleteImg", async (req, res) => {
  const { imgId, imgPath } = req.body;
  try {
    const q = `DELETE FROM images WHERE ID = ?;`;
    connect.query(q, [imgId], (err, data) => {
      if (err) return new Error(err);
      fs.unlinkSync(`./${imgPath}`);
      res.status(200).send({ data });
    });
  } catch (error) {
    res.status(error.response.status).send({ message: error.message });
  }
});

app.listen(process.env.PORT, () =>
  console.log(`App is listening on ${process.env.PORT}`)
);
