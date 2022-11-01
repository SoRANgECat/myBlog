<template>
  <n-h1>后台文章管理</n-h1>
  <div class="main-panel">
    <div class="menus">
      <div v-for="(menu, index) in menus" @click="toPage(menu)">
        {{ menu.name }}
      </div>
    </div>
    <div class="menu-contents"><router-view></router-view></div>
  </div>
</template>

<script setup>
import { AdminStore } from "../../stores/AdminStore";
import { ref, reactive, inject } from "vue";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();

const axios = inject("axios");
const message = inject("message");

const useAdminStore = AdminStore();

const menus = [
  { name: "首页", href: "/" },
  { name: "文章管理", href: "/dashboard/article" },
  { name: "分类管理", href: "/dashboard/category" },
  { name: "退出", href: "logout" },
];

const toPage = (menu) => {
  if (menu.href === "logout") {
    router.push("/login");
  } else {
    router.push(menu.href);
  }
};
</script>

<style lang="scss" scoped>
.n-h1 {
  text-align: center;
}
.main-panel {
  display: flex;
  color: #64676a;
  max-width: 1200px;
  margin: 20px auto;
}

.menus {
  padding: 20px 0;
  box-sizing: border-box;
  line-height: 55px;
  text-align: center;
  width: 180px;
  height: 95vh;
  border: 1px solid #343a40;

  div {
    cursor: pointer;
    &:hover {
      color: #fd760e;
    }
  }
}

.menu-contents {
  padding: 20px;
  width: 100%;
  border: 1px solid #343a40;
}
</style>
