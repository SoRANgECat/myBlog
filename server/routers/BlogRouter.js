const express = require("express");
const router = express.Router();
const { db, genid } = require("../db/DbUtils");

// 根据id查询博客
router.get("/details", async (req, res) => {
  const { id } = req.query;
  const detail_sql = "SELECT * FROM `blog` WHERE `id` = ?";
  const { err, rows } = await db.async.all(detail_sql, [id]);

  if (err === null) {
    res.send({
      code: 200,
      msg: "获取成功",
      rows,
    });
  } else {
    res.send({
      code: 500,
      msg: "获取失败",
    });
  }
});

// 查询博客
router.get("/search", async (req, res) => {
  /* 
  keyword 
  categoryId
  page
  pageSize
  */

  let { keyword, categoryId, page, pageSize } = req.query;

  // page = page === null ? 1 : page;
  // pageSize = pageSize === null ? 10 : pageSize;
  // categoryId = categoryId === null ? 0 : categoryId;
  // keyword = keyword === null ? "" : keyword;

  page ??= 1;
  pageSize ??= 10;
  categoryId ??= 0;
  keyword ??= "";

  // console.log(
  //   `page: ${page} pageSize: ${pageSize} categoryId: ${categoryId} keyword: ${keyword}`
  // );

  let params = [];
  let whereSqls = [];
  if (+categoryId !== 0) {
    whereSqls.push(" `category_id` = ? ");
    params.push(categoryId);
  }

  if (keyword !== "") {
    whereSqls.push(" (`title` like ? OR `content` LIKE ?) ");
    params.push(`%${keyword}%`);
    params.push(`%${keyword}%`);
  }

  let whereSqlStr = "";
  if (whereSqls.length > 0) {
    whereSqlStr = ` WHERE ${whereSqls.join("AND")}`;
  }

  // 查询分页数据
  let searchSql =
    " SELECT `id`,`category_id`,`create_time`,`title`,substr(`content`,0,50) AS `content` FROM `blog` " +
    whereSqlStr +
    " ORDER BY `create_time` DESC LIMIT ?,?";

  let searchSqlParams = params.concat([(+page - 1) * pageSize, +pageSize]);

  // 查询数据总数
  let searchCountSql = "SELECT count(*) AS `count` FROM `blog` " + whereSqlStr;
  let searchCountParams = params;

  let serachResult = await db.async.all(searchSql, searchSqlParams);
  let countResult = await db.async.all(searchCountSql, searchCountParams);

  // console.log(searchSql);
  // console.log(searchSqlParams);
  // console.log(serachResult);
  // console.log(searchCountSql);
  // console.log(searchCountParams);
  // console.log(countResult); //{ err: null, rows: [ { 'count(*)': 8 } ] }
  if (serachResult.err === null && countResult.err === null) {
    res.send({
      code: 200,
      msg: "查询成功",
      data: {
        keyword,
        categoryId,
        page,
        pageSize,
        rows: serachResult.rows,
        count: countResult.rows[0].count,
      },
    });
  } else {
    res.send({
      code: 500,
      msg: "查询失败",
    });
  }
});

// 添加博客
router.post("/_token/add", async (req, res) => {
  const { title, categoryId, content } = req.body;
  const id = genid.NextId();
  const create_time = new Date().getTime();

  const insert_sql =
    "INSERT INTO `blog`(`id`,`title`,`category_id`,`content`,`create_time`)VALUES(?,?,?,?,?)";

  const params = [id, title, categoryId, content, create_time];

  const { err, rows } = await db.async.run(insert_sql, params);

  if (err === null) {
    res.send({
      code: 200,
      msg: "添加成功",
    });
  } else {
    res.send({
      code: 500,
      msg: "添加失败",
    });
  }
});

// 修改博客
router.put("/_token/update", async (req, res) => {
  const { id, title, categoryId, content } = req.body;

  const update_sql =
    "UPDATE `blog` SET `title` = ?,`content`=?,`category_id`=? WHERE `id`=?";

  const params = [title, content, categoryId, id];

  const { err, rows } = await db.async.run(update_sql, params);

  if (err === null) {
    res.send({
      code: 200,
      msg: "修改成功",
    });
  } else {
    res.send({
      code: 500,
      msg: "修改失败",
    });
  }
});

// 删除博客
router.delete("/_token/delete", async (req, res) => {
  const id = req.query.id;
  const delete_sql = "DELETE FROM `blog` WHERE `id`=?";

  const { err, rows } = await db.async.run(delete_sql, [id]);

  if (err === null) {
    res.send({
      code: 200,
      msg: "删除成功",
    });
  } else {
    res.send({
      code: 500,
      msg: "删除失败",
    });
  }
});

module.exports = router;
