<template>
  <div class="header_bar">
    <slot name="head"></slot>
    <div class="header_tabs">
      <div
        @click="tabIndex = idx"
        v-for="(panel, idx) in tabs"
        :key="idx"
        class="header_tab"
        :class="{ header_tab__active: idx === tabIndex }">{{ props.label === '*this' ? panel :panel[props.label] }}</div>
    </div>
    <slot name="tail"></slot>
  </div>
</template>

<script>
export default {
  name: 'PanelTab',
  data: function () {
    return {
      tabIndex: 0, //
    };
  },
  props: {
    value: {
      type: Number|String,
      required: false,
    },
    tabs: {
      type: Array,
      default: function () {
        return [];
      },
    },
    props: {
      type: Object,
      default: function () {
        return {
          label: 'MenuName', // *this表示自身
        };
      },
    },
  },
  watch: {
    tabIndex: function (n) {
      this.$emit('input', n);
    },
    value: function (n) {
      this.tabIndex = n;
    },
  },
  mounted: function () {
    this.tabIndex = this.value || 0;
  },
}
</script>

<style scoped>
.header_bar {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
          align-items: center;
  /* height: 87px; */
  padding: 8px 14px;
  /* margin-bottom: 14px; */
  background-color: #fff;
  box-sizing: border-box;
}
.header_tabs {
  -webkit-box-flex: 1;
  -webkit-flex: 1 0;
  -ms-flex: 1 0;
  flex: 1 0;
}
.header_tab {
  display: inline-block;
  position: relative;
  padding: 6px 18px;
  font-size: 13px;
  margin-right: 20px;
  -webkit-border-radius: 2px;
          border-radius: 2px;
  background-color: #efeff4;
  color: #333;
  cursor: pointer;
  -webkit-transition: all 0.2s ease-in-out;
  -o-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
}
.header_tab__active {
  background-color: #42a1ff;
  color: #fff;
}
</style>
