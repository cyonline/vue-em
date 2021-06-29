<template>
  <div id="index">
    <layout>
      <template>
        这是一个插槽
        <router-view/>
      </template>
    </layout>
  </div>
</template>
<script>
import layout from "../../components/layout/layout.vue";
export default {
  components: { layout },
  name: "index",
  data() {
    return {
      title: "",
    };
  },
};
</script>
<style lang="less" scoped>
</style>