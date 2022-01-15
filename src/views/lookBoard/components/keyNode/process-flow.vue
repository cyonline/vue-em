<template>
    <div class="process">
        <div class="process-flow" v-if="process.length > 0">
        <div class="process-step" v-for="(item, index) in process" :key="index">
            <div class="step-node">
                <el-tooltip placement="bottom" popper-class="step-info" effect="light">
                    <div slot="content"  class="step-info" >
                        <div>工作项名称：{{ item.WorkItemName }}</div>
                        <div>计划完成时间：{{ formatDate(item.PlanEndTime) || "--" }}</div>
                        <div>节点状态：{{ getStatus(item.Status) || "--" }}</div>
                        <div>
                            实际完成时间：{{ formatDate(item.ActualEndTime || "--") }}
                        </div>
                        <div>
                            延误原因：{{ formatDate(item.DelayReason || "--") }}
                        </div>
                        <div>
                            完成情况说明：{{ formatDate(item.CompleteDescription || "--") }}
                        </div>
                    </div>
                <div class="step-pos" :class="getStateClass(item.Status, true)" @mouseover="pointHover(item, index)"
                    @mouseout="pointOut(item, index)" >
                    <i class="iconfont" v-if="item.Status!=1"><svg t="1632651339399" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2207" width="18" height="20"><path d="M221 592c-44.183 0-80-35.817-80-80s35.817-80 80-80 80 35.817 80 80-35.817 80-80 80z m291 0c-44.183 0-80-35.817-80-80s35.817-80 80-80 80 35.817 80 80-35.817 80-80 80z m291 0c-44.183 0-80-35.817-80-80s35.817-80 80-80 80 35.817 80 80-35.817 80-80 80z" fill="#ffffff" p-id="2208"></path></svg></i>
                    <i class="iconfont" v-if="item.Status==1"><svg t="1632704951252" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3441" width="14" height="20"><path d="M817.728 198.72l111.744 114.56-545.216 532.128-285.92-273.024 110.528-115.712 174.176 166.336z" p-id="3442" fill="#ffffff"></path></svg></i>
                    
                </div>
                </el-tooltip>
            <div
                class="step-line"
                :class="getStateClass(item.Status, true)"
                v-if="process.length - 1 != index"
            ></div>
            </div>
            <div class="step-date">
            {{ item.WorkItemName }}
            </div>
        </div>
        </div>
        <div class="nodata" v-if="process.length==0">暂无数据</div>
    </div>
</template>
<script>
export default {
  data: function() {
    return {
      devideIndex: ""
    };
  },

  props: {
    //数据
    processData: {
      type: Array,
      default: function() {
        return [];
      }
    },
    type: {
      type: Number | String,
      default: 0
    },
    phase: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  computed: {
    process: function() {
      console.info("processData", this.processData);
      this.processData.forEach(function(ele) {
        ele["active"] = false;
      });
      return this.processData;
    },
    phaseWidth: function() {
      return this.process.length * 120 + 100;
    }
  },
  methods: {
    //格式化时间
    formatDate: function(date) {
      if (!date) {
        return "";
      }
      var splitStr = "";
      if (date.indexOf("T") > -1) {
        splitStr = "T";
      } else if (date.indexOf(" ") > -1) {
        splitStr = " ";
      }
      return date.split(splitStr)[0];
    },

    //获取进度条样式类名
    getProcessClass: function(index) {
      var that = this;
      var classStr = "";
      if (index < that.processData.length - 1) {
        classStr += "border-left";
        if (that.processData[index + 1][that.processProps.finished]) {
          if (that.processData[index + 1][that.processProps.finished] === 1) {
            classStr += " border-ing";
          } else {
            classStr += " border-finished";
          }
        }
      }

      return classStr;
    },

    // 获取状态对应样式类名
    getStateClass: function(state, isActive) {
      if (!isActive) return "";
      var className = "";
      if (state == 0) {
        className = "no-start";
      } else if (state == 1) {
        className = "finished";
      } else {
        className = state == 2 ? "delay" : "delay-finish";
      }
      return className;
    },
    // 添加阶段分隔线
    getDevide: function(index) {
      var len = (this.devideIndex = this.process.findIndex(function(ele) {
        return ele.WorkItemPhase == 1;
      }));
      return len - 1 == index ? "devide" : "";
    },
    getStatus: function(state) {
      var obj = {
        0: "未开始",
        1: "按时完成",
        2: "已延期",
        3: "延期完成"
      };
      return obj[state];
    },
    pointHover: function(item, index) {
      this.$set(this.process[index], "active", true);
      this.$forceUpdate();
    },
    pointOut: function(item, index) {
      this.$set(this.process[index], "active", false);
      this.$forceUpdate();
    }
  },

  mounted: function() {
    // console.log("1234"+ JSON.stringify(this.processData) )
    // console.info(this.phaseWidth)
  },

  components: {}
};
</script>
<style>
.el-tooltip__popper{
    background-color: #ffffffe7!important;
    line-height: 25px!important;
    border:none!important;
    box-shadow: 0px 1px 4px #ccc;
    width: auto;
    max-width: 300px;
}
</style>
<style scoped>
    * {
        box-sizing: border-box;
    }

.process {
    height: 120px;
    position: relative;
    overflow-y: hidden;
    overflow-x: hidden;
}
    .process:hover{
        overflow-x:auto;
    }
    .process::-webkit-scrollbar{
        height: 10px;
        background-color: transparent;
    }

    .process::-webkit-scrollbar-track {
        border-radius: 10px;
    } /* 滚动条的滑轨背景颜色 */

    .process::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background-color: #ccc;
    } /* 滑块颜色 */
    .process .nodata{
        text-align: center;
        color: #999;
    }
    .process-flow {
        width: auto;
        height: 95px;
        display: inline-flex;
        flex-direction: row;
        flex-wrap: nowrap;
        padding: 10px 50px;
    }
    .process-flow .process-step {
        width: 120px;
        position: relative;
        display: inline-block;
        flex-shrink: 0;
        font-size: 14px;
    }
    .process-flow .process-step .step-name {
        height: 30px;
        line-height: 20px;
        padding: 5px;
        display: inline-block;
        transform: translateX(-30%);
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .process-flow .process-step .step-node {
        width: 100%;
        height: 20px;
        display: inline-flex;
        position: relative;
        align-items: center;
        flex-wrap: wrap;
    }
    .process-flow .process-step .step-node .step-pos {
        width: 20px;
        height: 20px;
        display: inline-block;
        border-radius: 50%;
        box-sizing: border-box;
        cursor: pointer;
    }
.step-pos>i{
    display: block;
    text-align: center;
}
.step-line {
    width: calc(100% - 20px);
    height: 3px;
    display: inline-block;
}

.step-date {
    width: 100%;
    height: 20px;
    line-height: 20px;
    display: inline-block;

    transform: translateX(-40%);
    text-align: center;
}
.step-date.devide::after {
    content: "";
    display: inline-block;
    position: absolute;
    top: 60%;
    right: 0;
    height: 50px;
    width: 2px;
    background: #c0c0c0;
}

.process-phase {
    height: 53px;
    border-top: 2px solid #ddd;
    padding: 10px 0px;
}
.process-phase .p1,
.process-phase .p2 {
    float: left;
    height: 100%;
    text-align: center;
    font-size: 16px;
}

.no-start {
    background: #D8D8D8;
}
.finished {
    background: #5AD8A6;
}
.delay {
    background: #E0494B;
}
.delay-finish {
    background: #f59a23;
}
</style>
