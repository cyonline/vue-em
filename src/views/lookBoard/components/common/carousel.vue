<template>
    <!-- <div class="carousel" @mouseenter="clearInterval(timerAuto)" @mouseleave="autoPlay"> -->
    <div class="carousel">
        <div class="banner" :style="{width:imgList.length*mainWidth+'px'}">
            <span v-for="(item,index) in imgList" :key="index" :style="{width:mainWidth+'px'}">
                <img v-if="item[props.imgUrl]" :src="item[props.imgUrl]" :alt="item[props.imgUrl]">
                <div class="title">{{item[props.title]}}</div>
            </span>
        </div>
        
        <span class="nodata" v-if="list.length==0">暂无数据</span>
        <div class="button" v-if="imgList.length>2">
            <span class="pre" @click="pre"><i class="iconfont icon-arrow-down"></i></span>
            <span class="next" @click="next"><i class="iconfont icon-arrow-down"></i></span>
        </div>
    </div>
</template>
<script>
export default {
    name:'carousel',
    data:function(){
        return {
            imgList:[],
            mainWidth: 0,
            curIndex:0,
            timer:null,
            timerAuto:null,
        }
    },
    props:{
        list:{
            type:Array,
            required:true,
            default:function() {
                return []
            },
        },
        props:{
            type:Object,
            required:false,
            default:function () {
                return {imgUrl:'imgUrl'}
            }
        }
    },
    methods:{
        pre:function(){
            var bannerDom = document.querySelector('.banner');
            var _this = this
            this.curIndex--;
            if(this.curIndex==-1){
                bannerDom.style.transition = 'none';
                this.curIndex = this.imgList.length-1;
                bannerDom.style.marginLeft = - (this.mainWidth*this.curIndex)+'px'
                setTimeout(function(){
                    _this.curIndex--;
                    bannerDom.style.transition = 'all 0.3s linear'
                    bannerDom.style.marginLeft = -_this.mainWidth*_this.curIndex+'px';
                },0)
            }else{
                bannerDom.style.marginLeft = -this.mainWidth*this.curIndex+'px';
            }
            // console.info(this.curIndex,bannerDom.style.marginLeft)
            
        },
        next:function(){
            var bannerDom = document.querySelector('.banner');
            var _this = this;
            this.curIndex++;
            // console.info(this.curIndex);
            if(this.curIndex == this.imgList.length){
                this.curIndex=1;
                bannerDom.style.transition = 'none';
                bannerDom.style.marginLeft = 0;
                setTimeout(function(){
                    bannerDom.style.transition = 'all 0.3s linear'
                    bannerDom.style.marginLeft = -_this.mainWidth*_this.curIndex+'px';
                },0)
            }else{
                bannerDom.style.marginLeft = -this.mainWidth*this.curIndex+'px';
            }
            // console.info(bannerDom.style.marginLeft,this.curIndex)
        },
        init:function(){
            // console.info('img',this.list)
            this.curIndex = 0;
            var bannerDom = document.querySelector('.banner');
            bannerDom.style.marginLeft = 0;
            bannerDom.style.transition = 'none'
            this.imgList = this.list.slice();
            if(this.list.length>0){
                
                this.imgList.push(this.imgList[0]);
            }
            this.mainWidth = document.querySelector('.carousel').clientWidth;
            bannerDom.style.transition = 'all 0.3s linear'
        },
        throttle:function(handler,delay){
            if(this.timer){
                window.clearTimeout(this.timer);
            }
            this.timer = setTimeout(handler,delay)
        },
        autoPlay:function(){
            window.clearInterval(this.timerAuto);
            if(this.imgList.length>2){
                this.timerAuto = setInterval(this.next,4000)
            }
        }
    },
    mounted:function() {
        // this.init();
        // var _this = this;
        // window.onresize = function(){
        //     _this.throttle(_this.init,1000)
        // }
        // this.autoPlay()
    },
    watch:{
        list:function(n,o){
            // this.init();
            // this.autoPlay()
        }
    }
}
</script>
<style scoped>
    .carousel{
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
    }
    .carousel .banner{
        /* width: 100%; */
        height: 100%;
        transition:all 0.3s linear;
    }
    .carousel .banner>span{
        display: inline-block;
        width: 100%;
        height: 100%;
    }
    .carousel .banner img{
        width: 100%;
        height: 100%;
    }
    .carousel .banner .title{
        position: absolute;
        top:0;
        width: 100%;
        height: 40px;
        line-height: 40px;
        padding-left:20px;
        color:#fff;
        background:rgba(0, 0, 0, 0.3);
        font-weight: bold;
    }
    .pre{
        width: 40px;
        height: 90px;
        background:#11111166;
        color:#eee;
        text-align:center;
        line-height: 90px;
        position: absolute;
        left:0;
        top: 50%;
        transform: translateY(-45px);
        border-top-right-radius: 3px;
        border-bottom-right-radius: 3px;
        cursor: pointer;
    }
    .pre .icon-arrow-down{
        display: inline-block;
        transform: rotate(90deg)
    }
    .next{
        width: 40px;
        height: 90px;
        background:#11111166;
        color:#eee;
        text-align:center;
        line-height: 90px;
        position: absolute;
        right:0;
        top: 50%;
        transform: translateY(-45px);
        border-top-left-radius: 3px;
        border-bottom-left-radius: 3px;
        cursor: pointer;
    }
    .next .icon-arrow-down{
        display: inline-block;
        transform: rotate(-90deg)
    }
    .nodata{
        width: 100%;
        height: 100%;
        text-align: center;
        position: relative;
        top: 40%;
    }
</style>