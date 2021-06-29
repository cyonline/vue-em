(() => {
  new Vue({
    el: '#main',
    mixins: [commonMixin],
    data() {
      return {
        webUrl: webInit.fileUrl,
        permissions: {},
        breadcrumbs: [],
        userInfo: null,
        content: {
            title: 'jiduan',            // 总览标题
            numbers: 3,                          // 每行个数
            tabs: [{                             // 每个小方格
                name: 'saosd',
                num: '4546',
            }]
        },
        //
        echartsOptions: {
          chart1: {
            title: {
              text: '质量问题分析',
            },
          },
          chart2: {
            title: {
              text: '安全问题分析',
            },
          },
        },
      };
    },
    components: {
      chart1: () => __import__('@/lookBoard/components/charts/quality-safety.vue'),
    },
    created() {
      // this.echartsOptions.chart1 = {
      //   title: {
      //     text: '质量问题分析',
      //   },
      // };
      // this.echartsOptions.chart2 = {
      //   title: {
      //     text: '安全问题分析',
      //   },
      // };
    },
  });
})();