<template>
  <div>
   <router-view />
  </div>
</template>

<script>
import treeSelect from '@/components/sapi-tree-select'


export default {
  name: "lookBoard",
  data() {
      
    return  {
        // webUrl: webInit.fileUrl,
        webUrl: '',
        permissions: {},
        breadcrumbs: [],
        
      };
  },
  components: {
      
   
     
    },
  methods: {},
  watch: {
     
    },
     created: function() {
     
    },
};
</script>
<style lang="less">
  @import url('./style.css');
</style>