<template>
  <div class="login-panel">
    <n-card title="管理后台登录">
      <n-form :rules="rules" :model="admin">
        <n-form-item path="account" label="账号">
          <n-input v-model:value="admin.account" placeholder="请输入账号" />
        </n-form-item>
        <n-form-item path="password" label="密码">
          <n-input
            v-model:value="admin.password"
            type="password"
            placeholder="请输入密码"
          />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-checkbox v-model:checked="admin.rember" label="记住我" />
        <n-button @click="login">登录</n-button>
      </template>
    </n-card>

    <n-card>
      <n-tabs
        class="card-tabs"
        default-value="signin"
        size="large"
        animated
        style="margin: 0 -4px"
        pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
      >
        <n-tab-pane name="signin" tab="登录">
          <n-form>
            <n-form-item-row label="用户名">
              <n-input />
            </n-form-item-row>
            <n-form-item-row label="密码">
              <n-input />
            </n-form-item-row>
          </n-form>
          <n-button type="primary" block secondary strong> 登录 </n-button>
        </n-tab-pane>
        <n-tab-pane name="signup" tab="注册">
          <n-form>
            <n-form-item-row label="用户名">
              <n-input />
            </n-form-item-row>
            <n-form-item-row label="密码">
              <n-input />
            </n-form-item-row>
            <n-form-item-row label="重复密码">
              <n-input />
            </n-form-item-row>
          </n-form>
          <n-button type="primary" block secondary strong> 注册 </n-button>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<script setup>
import { ref, reactive, inject } from "vue";
import { AdminStore } from "../stores/AdminStore";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();

const axios = inject("axios");
const message = inject("message");

const useAdminStore = AdminStore();

const rules = {
  account: [
    { require: true, message: "请输入账号", trigger: "blur" },
    { min: 3, max: 12, message: "账号长度在3到12个字符", trigger: "blur" },
  ],
  password: [
    {
      require: true,
      message: "请输入密码",
      trigger: "blur",
    },
    { min: 6, max: 18, message: "密码长度在6到18个字符", trigger: "blur" },
  ],
};

const admin = reactive({
  account: localStorage.getItem("account") || "",
  password: localStorage.getItem("password") || "",
  rember: +localStorage.getItem("rember") === 1 || false,
});

const login = async () => {
  const result = await axios.post("/admin/login", {
    account: admin.account,
    password: admin.password,
  });

  if (result.data.code === 200) {
    useAdminStore.token = result.data.data.token;
    useAdminStore.id = result.data.data.id;
    useAdminStore.account = result.data.data.account;

    localStorage.setItem("rember", admin.rember ? 1 : 0);
    if (admin.rember) {
      localStorage.setItem("account", admin.account);
      localStorage.setItem("password", admin.password);
    } else {
      localStorage.setItem("account", "");
      localStorage.setItem("password", "");
    }
    router.push("/dashboard/article");
    message.info("登录成功");
  } else {
    message.error("登录失败");
  }
};
</script>

<style lang="scss" scoped>
.login-panel {
  width: 500px;
  margin: 0 auto;
  margin-top: 200px;
}
</style>
