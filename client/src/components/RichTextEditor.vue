<template>
  <div>
    <Toolbar
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :mode="mode"
      style="border-bottom: 1px solid #ccc"
    />
    <Editor
      :defaultConfig="editorConfig"
      :mode="mode"
      v-model="valueHtml"
      style="height: 400px; overflow-y: hidden"
      @onCreated="handleCreated"
      @onChange="handleChange"
    />
  </div>
</template>

<script setup>
import "@wangeditor/editor/dist/css/style.css";
import {
  onBeforeUnmount,
  ref,
  shallowRef,
  onMounted,
  inject,
  reactive,
} from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";

const server_url = inject("server_url");

const editorRef = shallowRef();

const toolbarConfig = {};
toolbarConfig.excludeKeys = ["uploadVideo"];

const editorConfig = { placeholder: "请输入内容..." };
editorConfig.MENU_CONF = {};
editorConfig.MENU_CONF["uploadImage"] = {
  // 上传图片的配置
  server: `${server_url}/upload/rich_editor_upload`,
  base64LimitSize: 5 * 1024, // 5kb
};
editorConfig.MENU_CONF["insertImage"] = {
  parseImageSrc: (src) => {
    if (src.indexOf("http") !== 0) {
      return `${server_url}${src}`;
    } else {
      return src;
    }
  }, // 也支持 async 函数
};

const valueHtml = ref("");
const mode = ref("defalut");

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:model-value"]);

const handleCreated = (editor) => {
  console.log("created", editor);
  editorRef.value = editor; // 记录 editor 实例，重要！
};
const handleChange = (editor) => {
  // console.log("change:", editor.getHtml());
  if (initFinished) {
    emit("update:model-value", valueHtml.value);
  }
};

let initFinished = false;

onMounted(() => {
  setTimeout(() => {
    valueHtml.value = props.modelValue;
    initFinished = true;
  }, 10);
});
</script>

<style lang="scss" scoped></style>
