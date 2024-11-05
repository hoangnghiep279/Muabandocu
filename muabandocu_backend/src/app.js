import express from "express";
import "dotenv/config";

const app = express();

app.use(express.json());
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});