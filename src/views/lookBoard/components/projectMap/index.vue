<template>
  <div class="wrapper">
      <carousel ref="carousel" :list="list" :props="props"></carousel>
  </div>
</template>

<script>
import carousel from '@/views/lookBoard/components/common/carousel.vue'
export default {
  name: 'ProjectMap',
  data: function () {
    return {
      list: [],
      props:{
        imgUrl: 'ImgUrl',
        title: 'ProjectName'
      }
    };
  },
  components:{
      'carousel':carousel
  },
  props: {
    data:{
      type:Array,
      required: true,
      default:function(){
        return []
      }
    }
  },
  watch: {
    data:function(n){
      console.info('projectMap',n);
      this.list = n.slice();
    }
    
  },
  mounted: function () {
    console.info('projectMap',this.data);
    this.list = this.data;
  },
  methods: {
    
  },
};

</script>

<style scoped>
  .wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
    box-shadow: 0px 1px 4px #ccc;
    border-radius: 3px;
  }
</style>

