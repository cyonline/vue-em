function DrawArea(el, option, initCallback, deleteCallback) {
    this.el = el || document.body;
    this.option = option;
    this.initCallback = initCallback;
    this.deleteCallback = deleteCallback;
    this.dragBoxId = null;
    this.dragBox = null;
    this.deleteIcon = null;
    this.drawAreaName = '';
    this.drawAreaId = '';
    this.dragBoxPos = {
        width: '0px',
        height: '0px',
        translateX: '0px', 
        translateY: '0px',
    };
    this.dragBoxDotsPos = {
        ne: null,
        se: null,
        sw: null,
        nw: null,
    };
    
    this.startMoveDom = null;
    this.startPos = {
        x: 0,
        y: 0,
    }
}

DrawArea.prototype.init = function() {
    if (!this.dragBox) {
        this.dragBoxId = 'dragBox_' + guid();
        this.dragBox = document.createElement('div');
        this.dragBox.className = this.option.disabled ? 'draw-area disabledCursor' : 'draw-area';
        var className = this.option.disabled ? 'disabledCursor' : '';
        var str = '';

        if (!this.option.disabled) {
            str += '<span class="drag-area-delete el-icon-close delete-icon"></span>';
        }

        str += '<span class="drag-area-content ' + className + '" data-action="drag-area"></span>' +
            '<span class="drag-area-all all ' + className + '" data-action="drag-area"></span>' +
            '<span class="drag-area-line line-n ' + className + '" data-action="line-n"></span>' +
            '<span class="drag-area-line line-e ' + className + '" data-action="line-e"></span>' +
            '<span class="drag-area-line line-s ' + className + '" data-action="line-s"></span>' +
            '<span class="drag-area-line line-w ' + className + '" data-action="line-w"></span>' +
            '<span class="drag-area-dot dot-n ' + className + '" data-action="dot-n"></span>' +
            '<span class="drag-area-dot dot-e ' + className + '" data-action="dot-e"></span>' +
            '<span class="drag-area-dot dot-s ' + className + '" data-action="dot-s"></span>' +
            '<span class="drag-area-dot dot-w ' + className + '" data-action="dot-w"></span>' +
            '<span class="drag-area-dot dot-ne ' + className + '" data-action="dot-ne"></span>' +
            '<span class="drag-area-dot dot-se ' + className + '" data-action="dot-se"></span>' +
            '<span class="drag-area-dot dot-sw ' + className + '" data-action="dot-sw"></span>' +
            '<span class="drag-area-dot dot-nw ' + className + '" data-action="dot-nw"></span>';

        this.dragBox.innerHTML = str;
        this.el.appendChild(this.dragBox);
        this.dragBox._drwa_area_instance_ = this;
        
        if (!this.option.disabled) {
            this.deleteIcon = this.dragBox.querySelector('.drag-area-delete');
            this.deleteIcon._drwa_area_instance_ = this;
            this.deleteIcon.addEventListener('click', this.handleDeleteClick, false)
        }
    }

    this.dragBox.addEventListener('contextmenu', this.preventDefault, false)
    this.dragBox.addEventListener('mousedown', this.handleMousedown, false)
}

DrawArea.prototype.preventDefault = function(e) {
    console.log(e.target)
    e = e || window.event;
    if (e.preventDefault) {
        e.preventDefault();
    } else {
        return false;
    }
}

DrawArea.prototype.setDragBoxStyle = function(style) {
    if (this.dragBox) {
        if (style) {
            this.dragBoxPos.width = style.width;
            this.dragBoxPos.height = style.height;
            this.dragBoxPos.translateX = style.translateX;
            this.dragBoxPos.translateY = style.translateY;
        }
        this.dragBox.style.width = this.dragBoxPos.width;
        this.dragBox.style.height = this.dragBoxPos.height;
        this.dragBox.style.transform = 'translateX(' + this.dragBoxPos.translateX + ')' + ' ' + 'translateY(' + this.dragBoxPos.translateY + ')';

        this.dragBoxDotsPos.nw = { x: parseInt(this.dragBoxPos.translateX), y: parseInt(this.dragBoxPos.translateY) }
        this.dragBoxDotsPos.ne = { x: parseInt(this.dragBoxPos.translateX) + parseInt(this.dragBoxPos.width), y: parseInt(this.dragBoxPos.translateY) }
        this.dragBoxDotsPos.sw = { x: parseInt(this.dragBoxPos.translateX), y: parseInt(this.dragBoxPos.translateY)  + parseInt(this.dragBoxPos.height) }
        this.dragBoxDotsPos.se = { x: parseInt(this.dragBoxPos.translateX) + parseInt(this.dragBoxPos.width), y: parseInt(this.dragBoxPos.translateY) + parseInt(this.dragBoxPos.height)  }

    }
}

DrawArea.prototype.handleMousedown = function (e) {
    e = e || window.event;
    if (e.stopPropagation) {
        e.stopPropagation();
    } else {
        e.cancelBubble = true;
    }

    var drwaAreaInstance = this._drwa_area_instance_;

    if (drwaAreaInstance.option.disabled) {
        return ;
    }

    if (e.button === 0) {
        drwaAreaInstance.startMoveDom = e.target || e.srcElement;
        drwaAreaInstance.startPos = { x: e.clientX, y: e.clientY };
        drwaAreaInstance.el._drwa_area_instance_ = drwaAreaInstance;
        drwaAreaInstance.el.addEventListener('mousemove', drwaAreaInstance.handleMousemove, false);
    } else if (e.button === 2){
        var dragBoxAll = drwaAreaInstance.dragBox.querySelector('.drag-area-all');
        dragBoxAll.classList.add('active');
        drwaAreaInstance.initCallback(drwaAreaInstance);
    }
}

DrawArea.prototype.handleMousemove = function (e) {
    var drwaAreaInstance = this._drwa_area_instance_;
    if (drwaAreaInstance) {
        document.body._drwa_area_instance_ = drwaAreaInstance;
        document.body.addEventListener('mouseup', drwaAreaInstance.handleMouseup, false)
        e = e || window.event;
        var x = e.clientX;
        var y = e.clientY;
        
        var offset_x = x - drwaAreaInstance.startPos.x;
        var offset_y = y - drwaAreaInstance.startPos.y;
        drwaAreaInstance.startPos.x = x;
        drwaAreaInstance.startPos.y = y;

        var dataAction = drwaAreaInstance.startMoveDom.getAttribute('data-action');
        if (dataAction === 'line-n' || dataAction === 'dot-n') {
            if (parseInt(drwaAreaInstance.dragBoxPos.height) - offset_y > 0) {
                drwaAreaInstance.dragBoxPos.height = parseInt(drwaAreaInstance.dragBoxPos.height) - offset_y + 'px';
                drwaAreaInstance.dragBoxPos.translateY = parseInt(drwaAreaInstance.dragBoxPos.translateY) + offset_y + 'px';
            }
        }

        if (dataAction === 'line-s' || dataAction === 'dot-s') {
            drwaAreaInstance.dragBoxPos.height = Math.abs(parseInt(drwaAreaInstance.dragBoxPos.height) + offset_y) + 'px';
            
        }

        if (dataAction === 'line-w' || dataAction === 'dot-w') {
            if (parseInt(drwaAreaInstance.dragBoxPos.width) - offset_x > 0) {
                drwaAreaInstance.dragBoxPos.width = parseInt(drwaAreaInstance.dragBoxPos.width) - offset_x + 'px';
                drwaAreaInstance.dragBoxPos.translateX = parseInt(drwaAreaInstance.dragBoxPos.translateX) + offset_x + 'px';
            }
        }

        if (dataAction === 'line-e' || dataAction === 'dot-e') {
            drwaAreaInstance.dragBoxPos.width = Math.abs(parseInt(drwaAreaInstance.dragBoxPos.width) + offset_x) + 'px';
        }
        
        if (dataAction === 'dot-se') {
            drwaAreaInstance.dragBoxPos.width = Math.abs(parseInt(drwaAreaInstance.dragBoxPos.width) + offset_x) + 'px';
            drwaAreaInstance.dragBoxPos.height = Math.abs(parseInt(drwaAreaInstance.dragBoxPos.height) + offset_y) + 'px';
        }

        if (dataAction === 'dot-ne') {
            drwaAreaInstance.dragBoxPos.width = Math.abs(parseInt(drwaAreaInstance.dragBoxPos.width) + offset_x) + 'px';
            drwaAreaInstance.dragBoxPos.height = Math.abs(parseInt(drwaAreaInstance.dragBoxPos.height) - offset_y) + 'px';
            drwaAreaInstance.dragBoxPos.translateY = Math.abs(parseInt(drwaAreaInstance.dragBoxPos.translateY) + offset_y) + 'px';
        }

        if (dataAction === 'dot-sw') {
            drwaAreaInstance.dragBoxPos.width = Math.abs(parseInt(drwaAreaInstance.dragBoxPos.width) - offset_x) + 'px';
            drwaAreaInstance.dragBoxPos.height = Math.abs(parseInt(drwaAreaInstance.dragBoxPos.height) + offset_y) + 'px';
            drwaAreaInstance.dragBoxPos.translateX = Math.abs(parseInt(drwaAreaInstance.dragBoxPos.translateX) + offset_x) + 'px';
        }

        if (dataAction === 'dot-nw') {
            drwaAreaInstance.dragBoxPos.width = Math.abs(parseInt(drwaAreaInstance.dragBoxPos.width) - offset_x) + 'px';
            drwaAreaInstance.dragBoxPos.height = Math.abs(parseInt(drwaAreaInstance.dragBoxPos.height) - offset_y) + 'px';
            drwaAreaInstance.dragBoxPos.translateX = Math.abs(parseInt(drwaAreaInstance.dragBoxPos.translateX) + offset_x) + 'px';
            drwaAreaInstance.dragBoxPos.translateY = Math.abs(parseInt(drwaAreaInstance.dragBoxPos.translateY) + offset_y) + 'px';
        }
        
        if (dataAction === 'drag-area') {
            drwaAreaInstance.dragBoxPos.translateX = Math.abs(parseInt(drwaAreaInstance.dragBoxPos.translateX) + offset_x) + 'px';
            drwaAreaInstance.dragBoxPos.translateY = Math.abs(parseInt(drwaAreaInstance.dragBoxPos.translateY) + offset_y) + 'px';
        }
        
        drwaAreaInstance.setDragBoxStyle();
    }
}

DrawArea.prototype.handleMouseup = function (e) {
    var drwaAreaInstance = this._drwa_area_instance_;
    if (drwaAreaInstance) {
        drwaAreaInstance.el.removeEventListener('mousemove', drwaAreaInstance.handleMousemove, false)
        drwaAreaInstance.el._drwa_area_instance_ = null;
        document.body.removeEventListener('mouseup', drwaAreaInstance.handleMouseup, false)
        document.body._drwa_area_instance_ = null;
        drwaAreaInstance.startMoveDom = null;
    }
}

DrawArea.prototype.setDrawArea = function(name, id) {
    if (name && id) {
        this.drawAreaName = name;
        this.drawAreaId = id;
        var dragBoxAll = this.dragBox.querySelector('.drag-area-content');
        dragBoxAll.innerHTML = '<span class="drawing-part-name-wrap">' + name + '</span>';
        if (dragBoxAll.classList.contains('active')) {
            dragBoxAll.classList.remove('active');
        }
    }
}

DrawArea.prototype.handleDeleteClick = function(e) {
    e = e || window.event;
    if (e.stopPropagation) {
        e.preventDefault();
    } else {
        e.cancelBubble = true;
    }
    var drwaAreaInstance = this._drwa_area_instance_; 
    drwaAreaInstance.remove();
    drwaAreaInstance.deleteCallback(drwaAreaInstance);
}

DrawArea.prototype.remove = function (e) {
    if (this.deleteIcon) {
        this.deleteIcon.removeEventListener('click', this.handleDeleteClick, false)
    }
    this.dragBox.removeEventListener('contextmenu', this.preventDefault, false)
    this.dragBox.removeEventListener('mousedown', this.handleMousedown, false)
    this.el.removeEventListener('mousemove', this.handleMousemove, false)
    document.body.removeEventListener('mouseup', this.handleMouseup, false)
    this.el.removeChild(this.dragBox)
    this.dragBox = null
    this.drawAreaName = '';
    this.drawAreaId = '';
}


Vue.component("pic-draw-area",{
    template: '<div class="pic-draw-area">' +
    '<img class="draw-img" :src="imgSrc" />' +
    '</div>',
    props: {
        data: {
            type: Array,
            default: [],
        },
        imgSrc: {
            type: String,
        },
        disabled: {
            type: Boolean,
            default: false,
        }
    },
    data: function () {
        return {
            drawAreas: [],
            drawArea: null,
            drawImg: null,
            drawImgPotisionParent: null,
        }
    },
    watch: {
        data: function() {
            this.reset();
            this.handleInitData();
        },
        disabled: function(value) {
            if (value) {
                this.$el.removeEventListener('mousedown', this.handleMousedown, false);
            } else {
                this.$el.addEventListener('mousedown', this.handleMousedown, false);
            }
        }
    },
    mounted: function() {
        this.reset();
        this.handleInitData();
        if (!this.disabled) {
            this.$el.addEventListener('mousedown', this.handleMousedown, false);
        }
        this.drawImg = this.$el.querySelector('.draw-img');
        document.body.addEventListener('contextmenu', this.preventDefault, false);
        this.drawImg.addEventListener('dragstart', this.preventDefault, false);
        this.drawImg.addEventListener('contextmenu', this.preventDefault, false);
    },
    destroyed: function () {
        this.$el.removeEventListener('mousedown', this.handleMousedown, false);
        this.$el.removeEventListener('mousemove', this.handleMousemove, false);
        document.body.removeEventListener('mouseup', this.handleMouseup, false);
        this.drawImg.removeEventListener('dragstart', this.preventDefault, false);
        this.drawImg.removeEventListener('contextmenu', this.preventDefault, false);
        document.body.removeEventListener('contextmenu', this.preventDefault, false);
        this.drawImg = null;
    },
    methods:{
        reset: function() {
            this.drawAreas.forEach(function(drawArea) {
                drawArea.remove();
            })
            this.drawAreas = [];
        },
        handleInitData: function() {
            if (this.data && this.data.length) {
                var _this = this;
                this.data.forEach(function(item) {
                    var axisData = JSON.parse(item.AxisData || '{}')
                    var drawArea = new DrawArea(_this.$el, { disabled: _this.disabled }, _this.handleDrwaAreaClick, _this.handleDeleteDrwaArea);
                    _this.drawAreas.push(drawArea)
                    drawArea.init();
                    drawArea.setDragBoxStyle({
                        width: axisData.se.x - axisData.nw.x + 'px',
                        height: axisData.se.y - axisData.nw.y + 'px',
                        translateX: axisData.nw.x + 'px',
                        translateY: axisData.nw.y + 'px' 
                    })
                    drawArea.setDrawArea(item.CheckPartName, item.CheckPartId);
                })
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
            if (e.button === 0) {
                var boundingClientRect = this.drawImg.getBoundingClientRect();
                this.startPos = { x: e.clientX - this.drawImg.clientLeft - boundingClientRect.left, y: e.clientY - this.drawImg.clientTop - boundingClientRect.top };
                this.$el.addEventListener('mousemove', this.handleMousemove, false);
            }
        },
        handleMousemove: function(e) {
            document.body.addEventListener('mouseup', this.handleMouseup, false);
            e = e || window.event;
            var boundingClientRect = this.drawImg.getBoundingClientRect();
            var x = e.clientX - this.drawImg.clientLeft - boundingClientRect.left;
            var y = e.clientY - this.drawImg.clientTop - boundingClientRect.top;
            var offset_x = x - this.startPos.x;
            var offset_y = y - this.startPos.y;
            if (!this.drawArea) {
                this.drawArea = new DrawArea(this.$el, { disabled: false }, this.handleDrwaAreaClick, this.handleDeleteDrwaArea);
                this.drawAreas.push(this.drawArea)
                this.drawArea.init();
            }

            this.drawArea.setDragBoxStyle({
                width: Math.abs(offset_x) + 'px',
                height: Math.abs(offset_y) + 'px',
                translateX: this.startPos.x > x ? x + 'px' : this.startPos.x + 'px',
                translateY: this.startPos.y > y ? y + 'px' : this.startPos.y + 'px'
            })
        },
        handleMouseup: function() {
            this.$el.removeEventListener('mousemove', this.handleMousemove, false);
            document.body.removeEventListener('mouseup', this.handleMouseup, false);
            this.drawArea = null;
        },
        handleDrwaAreaClick: function(drawArea) {
            this.$emit('draw-area-click', drawArea)
        },
        handleDeleteDrwaArea: function(drawAreaInstance) {
            this.drawAreas = this.drawAreas.filter(function(drawArea) {
                return drawArea.dragBoxId !== drawAreaInstance.dragBoxId;
            })
        }
    }
})

