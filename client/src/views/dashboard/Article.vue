<template>
  <div>
    <n-tabs
      type="line"
      v-model:value="tabValue"
      animated
      justify-content="start"
    >
      <n-tab-pane name="list" tab="文章列表">
        <div v-for="(blog, index) in blogListInfo" style="margin-top: 15px">
          <n-card :title="blog.title">
            <div v-html="blog.content"></div>

            <template #footer>
              <n-space align="center">
                <div>发布时间：{{ blog.create_time }}</div>
                <n-button @click="toUpdate(blog)">修改</n-button>
                <n-button @click="toDelete(blog)">删除</n-button>
              </n-space>
            </template>
          </n-card>
        </div>

        <n-pagination
          @update:page="loadBlogs"
          v-model:page="pageInfo.page"
          :page-count="pageInfo.pageCount"
        />
      </n-tab-pane>
      <n-tab-pane name="add" tab="添加文章">
        <n-form>
          <n-form-item label="标题">
            <n-input v-model:value="addArticle.title"></n-input>
          </n-form-item>
          <n-form-item label="分类">
            <n-select
              v-model:value="addArticle.categoryId"
              :options="categoryOptions"
            ></n-select>
          </n-form-item>
          <n-form-item label="内容">
            <rich-text-editor v-model="addArticle.content"></rich-text-editor>
          </n-form-item>
          <n-form-item>
            <n-button @click="add"> 提交 </n-button>
          </n-form-item>
        </n-form>
      </n-tab-pane>
      <n-tab-pane name="update" tab="修改文章">
        <n-form>
          <n-form-item label="标题">
            <n-input v-model:value="updateArticle.title"></n-input>
          </n-form-item>
          <n-form-item label="分类">
            <n-select
              v-model:value="updateArticle.categoryId"
              :options="categoryOptions"
            ></n-select>
          </n-form-item>
          <n-form-item label="内容">
            <rich-text-editor
              v-model="updateArticle.content"
            ></rich-text-editor>
          </n-form-item>
          <n-form-item>
            <n-button @click="update"> 修改 </n-button>
          </n-form-item>
        </n-form>
      </n-tab-pane>
    </n-tabs>
  </div>
  <!-- {{ addArticle.content }} -->
</template>

<script setup>
import { AdminStore } from "../../stores/AdminStore";
import { ref, reactive, inject, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import RichTextEditor from "../../components/RichTextEditor.vue";

const router = useRouter();
const route = useRoute();

const message = inject("message");
const dialog = inject("dialog");
const axios = inject("axios");

const useAdminStore = AdminStore();

const addArticle = reactive({
  categoryId: 0,
  title: "",
  content: "",
});
const updateArticle = reactive({
  id: 0,
  categoryId: 0,
  title: "",
  content: "",
});

const tabValue = ref("list");
const categoryOptions = ref([]);
const blogListInfo = ref([]);

const pageInfo = reactive({
  page: 1,
  pageSize: 3,
  pageCount: 0,
  count: 0,
});
const add = async () => {
  const res = await axios.post("/blog/_token/add", addArticle);
  if (res.data.code === 200) {
    message.info(res.data.msg);
  } else {
    message.error(res.data.msg);
  }
};
const update = async () => {
  const res = await axios.put("/blog/_token/update", updateArticle);
  if (res.data.code === 200) {
    message.info(res.data.msg);
    loadBlogs();
    tabValue.value = "list";
  } else {
    message.error(res.data.msg);
  }
};

const loadCategories = async () => {
  const res = await axios.get("/category/list");
  categoryOptions.value = res.data.rows.map((item) => {
    return { label: item.name, value: item.id };
  });
  // console.log(categoryOptions.value);
};

const loadBlogs = async (page = 0) => {
  if (page !== 0) {
    pageInfo.page = page;
  }
  const res = await axios.get(
    `/blog/search?page=${pageInfo.page}&pageSize=${pageInfo.pageSize}`
  );
  const temps_rows = res.data.data.rows;
  for (const row of temps_rows) {
    row.content += "......";
    const date = new Date(row.create_time);
    row.create_time = `${date.getFullYear()}年${
      date.getMonth() + 1
    }月${date.getDate()}日`;
  }
  blogListInfo.value = temps_rows;
  pageInfo.count = res.data.data.count;
  pageInfo.pageCount = Math.ceil(pageInfo.count / pageInfo.pageSize);
  // console.log(temps_rows);
};

const toPage = async (page) => {
  pageInfo.page = page;
  loadBlogs();
};

const toUpdate = async (blog) => {
  tabValue.value = "update";
  const res = await axios.get(`/blog/details?id=${blog.id}`);
  console.log(res);
  updateArticle.categoryId = res.data.rows[0].category_id;
  updateArticle.id = res.data.rows[0].id;
  updateArticle.title = res.data.rows[0].title;
  console.log(updateArticle);
  updateArticle.content = res.data.rows[0].content;
  console.log(updateArticle);
};

const toDelete = async (blog) => {
  const res = await axios.delete(`/blog/_token/delete?id=${blog.id}`);
  if (res.data.code === 200) {
    message.info(res.data.msg);
    loadBlogs();
  } else {
    message.error(res.data.msg);
  }
};

onMounted(() => {
  loadBlogs();
  loadCategories();
});
</script>

<style lang="scss" scoped>
.n-pagination {
  margin-top: 20px;
  justify-content: center;
}
</style>
