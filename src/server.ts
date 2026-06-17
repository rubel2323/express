import express, {
  type Application,
  type Request,
  type Response,
} from "express";
const app: Application = express();
const port = 3000;

app.get("/user", (req: Request, res: Response) => {
  // res.send("Hello World!");
  res.status(200).json({
    message: "This is Express server",
    author: "Next Level",
    version: "2.0.12",
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
