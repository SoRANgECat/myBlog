const express = require("express");
const router = express.Router();
const { db, genid } = require("../db/DbUtils");
const fs = require("fs");

router.post("/rich_editor_upload", async (req, res) => {
  console.log(req.files);
  if (!req.files) {
    res.send({
      error: 1,
      message: "失败信息",
    });
    return;
  }

  const files = req.files;
  const ret_files = [];

  for (let file of files) {
    // 获取文件后缀名
    console.log(typeof file.originalname);
    const file_ext = file.originalname.substring(
      file.originalname.lastIndexOf(".") + 1
    );
    //为文件随机取名
    const file_name = `${genid.NextId()}.${file_ext}`;

    // 修改名字并从temp移动到upload下
    fs.renameSync(
      `${process.cwd()}/public/upload/temp/${file.filename}`,
      `${process.cwd()}/public/upload/${file_name}`
    );
    ret_files.push(`/upload/` + file_name);
  }

  res.json({
    errno: 0, // 注意：值是数字，不能是字符串
    data: {
      url: ret_files[0], // 图片 src ，必须
      // alt: "yyy", // 图片描述文字，非必须
      // href: "zzz", // 图片的链接，非必须
    },
  });
});

module.exports = router;
