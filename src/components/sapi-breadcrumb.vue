<template>
  <div class="sapi-breadcrumb">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item v-for="(item, $index) in data" :key="$index">{{item}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>
<script>
export default {
  name: "sapi-breadcrumb",
  data() {
    return {};
  },
  props: {
    data: {
      type: Array,
      default: []
    }
  }
};
</script>