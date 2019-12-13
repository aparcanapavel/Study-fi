const express = require("express");
const app = require("./server/server");
// const app = express();

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
