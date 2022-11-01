<template>
  <div class="container">
    <div class="nav">
      <div @click="homePage">首页</div>
      <div>
        <n-popselect
          @update:value="selectedCategoryById"
          v-model:value="selectedCategory"
          :options="categoryOptions"
          trigger="click"
        >
          <div>
            分类 <span>{{ categoryName }}</span>
          </div>
        </n-popselect>
      </div>
      <div @click="dashboard">后台</div>
    </div>
    <n-divider />

    <n-space class="search">
      <n-input
        v-model:value="pageInfo.keyword"
        :style="{ width: '500px' }"
        placeholder="请输入关键字"
      />

      <n-button type="primary" ghost @click="loadBlogs()">搜索</n-button>
    </n-space>

    <div
      v-for="(blog, index) in blogListInfo"
      style="margin-top: 15px; cursor: pointer"
      @click="toDetail(blog)"
    >
      <n-card :title="blog.title">
        <div v-html="blog.content"></div>
        <template #footer>
          <n-space align="center">
            <div>发布时间：{{ blog.create_time }}</div>
          </n-space>
        </template>
      </n-card>
    </div>
    <n-pagination
      @update:page="loadBlogs"
      v-model:page="pageInfo.page"
      :page-count="pageInfo.pageCount"
    />
    <n-divider />
    <div class="footer">
      <div>power by xiaojumao</div>
      <div>xxxxxxxxxx</div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const message = inject("message");
const dialog = inject("dialog");
const axios = inject("axios");

const selectedCategory = ref(0);
const categoryOptions = ref([]);

const pageInfo = reactive({
  page: 1,
  pageSize: 3,
  pageCount: 0,
  count: 0,
  keyword: "",
  categoryId: 0,
});
const blogListInfo = ref([]);

const categoryName = computed(() => {
  const selectedOption = categoryOptions.value.find((option) => {
    return option.value === selectedCategory.value;
  });
  return selectedOption ? selectedOption.label : "";
});

const selectedCategoryById = (categoryId) => {
  pageInfo.categoryId = categoryId;
  loadBlogs();
};

const loadBlogs = async (page = 0) => {
  if (page !== 0) {
    pageInfo.page = page;
  }
  const res = await axios.get(
    `/blog/search?keyword=${pageInfo.keyword}&page=${pageInfo.page}&pageSize=${pageInfo.pageSize}&categoryId=${pageInfo.categoryId}`
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
const loadCategories = async () => {
  const res = await axios.get("/category/list");
  categoryOptions.value = res.data.rows.map((item) => {
    return { label: item.name, value: item.id };
  });
  // console.log(categoryOptions.value);
};

// 跳转
const homePage = () => {
  router.push("/");
};
const dashboard = () => {
  router.push("/login");
};
const toDetail = (blog) => {
  router.push({ path: "/detail", query: { id: blog.id } });
};

onMounted(() => {
  loadCategories();
  loadBlogs();
});
</script>

<style lang="scss" scoped>
.container {
  width: 1200px;
  margin: 0 auto;
}

.nav {
  display: flex;
  font-size: 20px;
  padding-top: 20px;
  color: #64676a;
  gap: 10px;
  div {
    cursor: pointer;

    &:hover {
      color: #f60;
    }

    span {
      font-size: 12px;
    }
  }
}

.n-pagination {
  margin-top: 16px;
  justify-content: center;
}
.footer {
  text-align: center;
  font-size: 12px;
  color: rgb(68, 67, 67);
}
</style>
