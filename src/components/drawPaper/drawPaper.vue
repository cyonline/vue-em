<template>
  <div class="pic-draw-area">
    <img class="draw-img" :src="imgSrc" />
  </div>
</template>
<script>
import DrawArea from './drawPaper'
export default {
  name: "pic-draw-area",
  data: function() {
    return {
      drawAreas: [],
      drawArea: null,
      drawImg: null,
      drawImgPotisionParent: null
    };
  },
  props: {
    data: {
      type: Array,
      default: []
    },
    imgSrc: {
      type: String
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    data: function() {
      this.reset();
      this.handleInitData();
    },
    disabled: function(value) {
      if (value) {
        this.$el.removeEventListener("mousedown", this.handleMousedown, false);
      } else {
        this.$el.addEventListener("mousedown", this.handleMousedown, false);
      }
    }
  },
  methods: {
    reset: function() {
      this.drawAreas.forEach(function(drawArea) {
        drawArea.remove();
      });
      this.drawAreas = [];
    },
    handleInitData: function() {
      if (this.data && this.data.length) {
        var _this = this;
        this.data.forEach(function(item) {
          var axisData = JSON.parse(item.AxisData || "{}");
          var drawArea = new DrawArea(
            _this.$el,
            { disabled: _this.disabled },
            _this.handleDrwaAreaClick,
            _this.handleDeleteDrwaArea
          );
          _this.drawAreas.push(drawArea);
          drawArea.init();
          drawArea.setDragBoxStyle({
            width: axisData.se.x - axisData.nw.x + "px",
            height: axisData.se.y - axisData.nw.y + "px",
            translateX: axisData.nw.x + "px",
            translateY: axisData.nw.y + "px"
          });
          drawArea.setDrawArea(item.CheckPartName, item.CheckPartId);
        });
      }
    },
    preventDefault: function(e) {
      e = e || window.event;
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        return false;
      }
    },

    handleMousedown: function(e) {
      e = e || window.event;
      if (e.stopPropagation) {
        e.stopPropagation();
      } else {
        e.cancelBubble = true;
      }
      console.info('e',e)
      if (e.button === 0) {
        var boundingClientRect = this.drawImg.getBoundingClientRect();
        this.startPos = {
          x: e.clientX - this.drawImg.clientLeft - boundingClientRect.left,
          y: e.clientY - this.drawImg.clientTop - boundingClientRect.top
        };
        this.$el.addEventListener("mousemove", this.handleMousemove, false);
      }
    },
    handleMousemove: function(e) {
      document.body.addEventListener("mouseup", this.handleMouseup, false);
      e = e || window.event;
      var boundingClientRect = this.drawImg.getBoundingClientRect();
      var x = e.clientX - this.drawImg.clientLeft - boundingClientRect.left;
      var y = e.clientY - this.drawImg.clientTop - boundingClientRect.top;
      var offset_x = x - this.startPos.x;
      var offset_y = y - this.startPos.y;
      if (!this.drawArea) {
        this.drawArea = new DrawArea(
          this.$el,
          { disabled: false },
          this.handleDrwaAreaClick,
          this.handleDeleteDrwaArea
        );
        this.drawAreas.push(this.drawArea);
        this.drawArea.init();
      }

      this.drawArea.setDragBoxStyle({
        width: Math.abs(offset_x) + "px",
        height: Math.abs(offset_y) + "px",
        translateX: this.startPos.x > x ? x + "px" : this.startPos.x + "px",
        translateY: this.startPos.y > y ? y + "px" : this.startPos.y + "px"
      });
    },
    handleMouseup: function() {
      this.$el.removeEventListener("mousemove", this.handleMousemove, false);
      document.body.removeEventListener("mouseup", this.handleMouseup, false);
      this.drawArea = null;
    },
    handleDrwaAreaClick: function(drawArea) {
      this.$emit("draw-area-click", drawArea);
    },
    handleDeleteDrwaArea: function(drawAreaInstance) {
      this.drawAreas = this.drawAreas.filter(function(drawArea) {
        return drawArea.dragBoxId !== drawAreaInstance.dragBoxId;
      });
    }
  },
  mounted() {
    this.reset();
    this.handleInitData();
    if (!this.disabled) {
      this.$el.addEventListener("mousedown", this.handleMousedown, false);
    }
    this.drawImg = this.$el.querySelector(".draw-img");
    document.body.addEventListener("contextmenu", this.preventDefault, false);
    this.drawImg.addEventListener("dragstart", this.preventDefault, false);
    this.drawImg.addEventListener("contextmenu", this.preventDefault, false);
  },
  destroyed: function() {
    this.$el.removeEventListener("mousedown", this.handleMousedown, false);
    this.$el.removeEventListener("mousemove", this.handleMousemove, false);
    document.body.removeEventListener("mouseup", this.handleMouseup, false);
    this.drawImg.removeEventListener("dragstart", this.preventDefault, false);
    this.drawImg.removeEventListener("contextmenu", this.preventDefault, false);
    document.body.removeEventListener(
      "contextmenu",
      this.preventDefault,
      false
    );
    this.drawImg = null;
  }
};
</script>
