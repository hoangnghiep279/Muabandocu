import express from "express";
const app = express();

app.use(express.json());
const port = process.env.PORT || 3000;

const mockUsser = [
  { id: 1, uName: "nghiep", age: 18 },
  { id: 2, uName: "ha", age: 21 },
  { id: 3, uName: "quan", age: 22 },
  { id: 4, uName: "dieu", age: 28 },
  { id: 5, uName: "viet", age: 12 },
  { id: 6, uName: "anh", age: 15 },
];
// get hieen thi
app.get("/", (req, res) => {
  res.send(mockUsser[mockUsser.length - 1].id.toString());
});

// post them san pham ... (add item)
app.post("/register", (req, res) => {
  res.sendStatus(201);
});

// update toàn bộ nội dung của item
app.put("/user/angela", (req, res) => {
  res.sendStatus(200);
});

// update 1 phần nội dung của item
app.patch("/user/angela", (req, res) => {
  res.sendStatus(200);
});
app.delete("/user/angela", (req, res) => {
  res.sendStatus(200);
});

app.get("/user", (req, res) => {
  console.log(req.query);
  const {
    query: { filter, value },
  } = req;
  if (!filter && !value) return res.send(mockUsser);
  if (filter && value)
    return res.send(
      mockUsser.filter((user) => {
        if (typeof userValue === "number") {
          return userValue.toString().includes(value);
        }
        if (typeof userValue === "string") {
          return userValue.includes(value);
        }
      })
    );
});

app.post("/user", (req, res) => {
  console.log(req.body);
  const { body } = req;
  const newUser = { id: mockUsser[mockUsser.length - 1].id + 1, ...body }; // vì id bằng 6 nên [mockUsser.length - 1] bằng 5 thì = mockUsser[5] và id của nó công thêm 1 thì bằng 7
  mockUsser.push(newUser);
  return res.status(200).send(newUser);
});

app.put("/user/:id", (req, res) => {
  const {
    body,
    params: { id },
  } = req;

  const parsedID = parseInt(id);
  if (isNaN(parsedID)) return res.sendStatus(400);

  const findUserIndex = mockUsser.findIndex((user) => user.id === parsedID);

  if (findUserIndex === -1) return res.sendStatus(404);
  mockUsser[findUserIndex] = { id: parsedID, ...body };
  return res.sendStatus(200);
});

app.get("/user/:id", (req, res) => {
  // console.log(req.params);

  const parseID = parseInt(req.params.id);
  if (isNaN(parseID))
    return res.status(400).send({ msg: "bad request and invalid ID" });

  const findUser = mockUsser.find((user) => user.id === parseID);
  if (!findUser)
    return res.status(404).send("we can't find user, please re-enter");
  return res.send(findUser);
});

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
