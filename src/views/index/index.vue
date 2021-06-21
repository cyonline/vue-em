<template>
  <div id="index">
    <layout></layout>
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