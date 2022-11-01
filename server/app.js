const express = require("express");
const multer = require("multer");
const path = require("path");
const { db } = require("./db/DbUtils");

const app = express();
const port = 8000;

// 跨域请求开放
app.use((req, res, next) => {
  // 设置允许域名的域名，*表示全部
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  // 允许跨域的请求方式
  res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");

  if (req.method === "OPTIONS") res.sendStatus(200);
  else next();
});

app.use(express.json());

const update = multer({
  dest: "./public/upload/temp",
});
app.use(update.any());
app.use(express.static(path.join(__dirname, "public")));

// token验证中间件
const ADMIN_TOKEN_PATH = "/_token";
app.all("*", async (req, res, next) => {
  // console.log(`running token`);
  if (req.path.indexOf(ADMIN_TOKEN_PATH) > -1) {
    // 登录验证
    // console.log(`running token`);
    // console.log(req.headers);
    const { token } = req.headers;
    console.log(`token:${token}`);

    const admin_token_sql = "SELECT * FROM `admin` WHERE `token` = ?";
    const adminResult = await db.async.all(admin_token_sql, [token]);
    if (adminResult.err !== null || adminResult.rows.length === 0) {
      res.send({
        code: 403,
        msg: "请先登录",
      });
      return;
    } else {
      next();
    }
  } else {
    next();
  }
});

app.use("/test", require("./routers/TestRouter"));
app.use("/admin", require("./routers/AdminRouter"));
app.use("/category", require("./routers/CategoryRouter"));
app.use("/blog", require("./routers/BlogRouter"));
app.use("/upload", require("./routers/UploadRouter"));

app.get("/", (req, res) => {
  res.send("hello from server");
});

app.listen(port, () => {
  console.log(`listening....: http://127.0.0.1:${port}`);
});
