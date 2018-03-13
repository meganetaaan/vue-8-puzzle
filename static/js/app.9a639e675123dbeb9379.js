webpackJsonp([0],{NHnr:function(t,i,e){"use strict";Object.defineProperty(i,"__esModule",{value:!0});var s=e("7+uW"),o=e("wh8N"),n=e.n(o);const h=0;var a;!function(t){t.Above="Above",t.Below="Below",t.Left="Left",t.Right="Right"}(a||(a={}));var r=class{constructor(t){if(this.dy=t.length,this.dx=t[0].length,this.dy<2||this.dx<2)throw new Error("cannot initialize with the array which has less than 2 col/rows");this.blocks=new Array(this.dx*this.dy);let i=0;for(let e=0;e<this.dy;e++)for(let s=0;s<this.dx;s++)this.blocks[i]=t[e][s],t[e][s]===h&&(this.blankpos=i),i++}row(t){return Math.ceil(t/this.dx)}col(t){return t%this.dx===h?this.dx:t%this.dx}dimensions(){return{x:this.dx,y:this.dy}}checkInRange(...t){for(let i of t)if(null==this.blocks[i])throw new Error(`Index ${i} not in range [0 .. ${this.blocks.length-1}]`)}direction(t,i){if(this.checkInRange(t,i),this.row(i+1)===this.row(t+1)){if(i%this.dx==t%this.dx-1)return a.Left;if(i%this.dx==t%this.dx+1)return a.Right}return i===t+this.dx?a.Below:i===t-this.dx?a.Above:null}hamming(){let t=0;for(let i=0,e=1,s=this.blocks.length;i<s;i++,e++)this.blocks[i]!==h&&this.blocks[i]!==e&&t++;return t}manhattan(){let t=0;for(let i=0,e=this.blocks.length;i<e;i++)this.blocks[i]!==h&&(t+=Math.abs(this.row(this.blocks[i])-this.row(i+1))+Math.abs(this.col(this.blocks[i])-this.col(i+1)));return t}isGoal(){for(let t=0,i=this.blocks.length;t<i;t++)if(this.blocks[t]!==h&&this.blocks[t]!==t+1)return!1;return!0}swap(t,i,e){if(this.checkInRange(i,e),this.blocks[i]!==h&&this.blocks[e]!==h)throw new Error("cannot swap non-space block");return[t[i],t[e]]=[t[e],t[i]],this.blankpos=t[i]===h?i:e,this}swapAbove(t){return this.swap(this.blocks,t,t-this.dx)}swapBelow(t){return this.swap(this.blocks,t,t+this.dx)}swapLeft(t){return this.swap(this.blocks,t,t-1)}swapRight(t){return this.swap(this.blocks,t,t+1)}slide(t){switch(this.checkInRange(t),this.direction(t,this.blankpos)){case a.Above:return this.swapAbove(t);case a.Below:return this.swapBelow(t);case a.Left:return this.swapLeft(t);case a.Right:return this.swapRight(t);default:return this}}toArray2D(){let t=0;const i=[];for(let e=0;e<this.dy;e++){const e=[];for(let i=0;i<this.dx;i++,t++)e.push(this.blocks[t]);i.push(e)}return i}},l=e("y1vT"),c=e.n(l),d=function(t,i){for(var e=t*i,s=[],o=0;o<e;o++)s.push(o);!function(t){for(var i=t.length-1;i>0;i--){var e=Math.floor(Math.random()*(i+1)),s=t[i];t[i]=t[e],t[e]=s}}(s);for(var n=[],h=0;h<i;h++){for(var a=[],r=0;r<t;r++)a.push(s[t*h+r]);n.push(a)}return n},u={name:"PuzzleBoard",data:function(){return{blocks:this.board.blocks,isGoal:!1,manhattan:null,hamming:null,width:0,height:0,vidSrc:n.a,targetSrc:this.src,dx:this.board.dx,dy:this.board.dx}},props:{board:{type:r,default:function(){var t=d(3,3);return new r(t)}},src:{type:String},showNumber:{type:Boolean,default:!0},autoResize:{type:Boolean,default:!1}},computed:{cellWidth:function(){return this.width/this.dx},cellHeight:function(){return this.height/this.dy}},mounted:function(){var t=this;this.onResize(),window.addEventListener("resize",c()(this.onResize.bind(this),300)),this._lastRender=Date.now();this.$nextTick(function i(){var e=Date.now();if(t.$refs.sourceImg&&e-t._lastRender>33){t._lastRender=e;var s=t.$refs.sourceImg,o=Math.min(s.videoWidth/t.dx,s.videoHeight/t.dy),n=(s.videoWidth-o*t.dx)/2,h=(s.videoHeight-o*t.dy)/2,a=t.$refs["puzzle-canvas"],r=a.getContext("2d"),l=o*t.dx,c=o*t.dy,d=t.width,u=t.height;r.drawImage(s,n,h,l,c,d,0,d,u),t._shouldClear&&r.clearRect(0,0,t.width,t.height);for(var f=0,b=t.blocks.length;f<b;f++){var p=t.blocks[f];if(0!==p){var g=t.board.row(p),w=t.board.col(p),v=t.cellWidth,k=t.cellHeight,m=v*(w-1)+d,x=k*(g-1),y=v,z=k,R=(t.board.row(f+1)-1)*t.cellHeight,C=(t.board.col(f+1)-1)*t.cellWidth;r.drawImage(a,m,x,y,z,C,R,v,k)}}}requestAnimationFrame(i)})},watch:{board:function(){console.log(),this.blocks=this.board.blocks,this.dx=this.board.dx,this.dy=this.board.dy},blocks:function(){this.isGoal=this.board.isGoal(),this.manhattan=this.board.manhattan(),this.hamming=this.board.hamming(),this.clearCanvas(),this.$emit("change",{blocks:this.blocks,isGoal:this.isGoal,distance:this.manhattan})},isGoal:function(){this.isGoal&&this.$emit("finish")}},methods:{getImageStyle:function(t,i){var e=this.board.col(t)-1,s=this.board.row(t)-1,o=this.cellWidth*e,n=this.cellHeight*s;return{position:"absolute",margin:0,padding:0,width:this.width+"px",height:this.height+"px",transform:"translate(-"+o+"px, -"+n+"px"}},getBlockStyle:function(t,i){var e=0===t,s=(this.board.row(i+1)-1)*this.cellHeight,o=(this.board.col(i+1)-1)*this.cellWidth;return{userSelect:"none",display:e||this.isGoal?"none":"inherit",textAlign:"left",fontSize:"2em",boxSizing:"border-box",border:e?"":"1px solid black",backgroundColor:e?"":"#FFF",position:"absolute",left:o+"px",top:s+"px",height:this.cellHeight+"px",width:this.cellWidth+"px",overflow:"hidden"}},getCanvasStyle:function(){return{left:this.isGoal?"-100%":0}},getSourceStyle:function(){return{position:"absolute",display:this.isGoal?"block":"none",top:0,left:0}},clearCanvas:function(){this._shouldClear=!0},slide:function(t){this.board.slide(t),s.a.set(this,"blocks",this.board.blocks.concat())},onClick:function(t){var i=Math.floor(t.offsetX/this.cellWidth),e=Math.floor(t.offsetY/this.cellHeight)*this.dx+i;this.$refs.sourceImg.currentTime<.01&&this.$refs.sourceImg.play(),this.slide(e)},onClickBoard:function(){this.$el.focus()},onResize:function(){var t=Math.min(this.$el.offsetWidth,this.$el.offsetHeight),i=t,e=t;this.autoResize&&(this.width=i,this.height=e)},onKeyUp:function(t){var i=this.board.blankpos,e=this.blocks.length;switch(t.keyCode){case 37:i+1<e&&this.slide(i+1);break;case 38:i+this.dx<e&&this.slide(i+this.dx);break;case 39:i-1>=0&&this.slide(i-1);break;case 40:i-this.dx>=0&&this.slide(i-this.dx)}}}},f={render:function(){var t=this,i=t.$createElement,e=t._self._c||i;return e("div",{staticClass:"puzzle-board",attrs:{tabindex:"-1"},on:{keyup:function(i){i.preventDefault(),t.onKeyUp(i)},click:t.onClickBoard}},[e("canvas",{ref:"puzzle-canvas",staticClass:"puzzle-canvas",style:t.getCanvasStyle(),attrs:{width:2*t.width,height:t.height},on:{click:function(t){t.preventDefault()},mousedown:function(t){t.preventDefault()},mouseup:function(i){i.preventDefault(),t.onClick(i)},touchend:function(i){i.preventDefault(),t.onClick(i)}}}),t._v(" "),e("video",{ref:"sourceImg",style:t.getSourceStyle(),attrs:{autoplay:"",loop:"",muted:"",width:t.width,height:t.height,src:t.vidSrc},domProps:{muted:!0}},[t._v("No video")])])},staticRenderFns:[]};var b=e("VU/8")(u,f,!1,function(t){e("P8lf")},"data-v-13bfbf8a",null).exports,p=e("xkHn"),g=e.n(p),w={name:"App",components:{PuzzleBoard:b},data:function(){return{imgSrc:g.a,distance:null,isGoal:!1,autoResize:!0}},methods:{onPuzzleBoardFinish:function(){this.isGoal=!0},onPuzzleBoardChange:function(t){this.distance=t.distance}}},v={render:function(){var t=this,i=t.$createElement,e=t._self._c||i;return e("div",{attrs:{id:"app"}},[e("div",{staticClass:"header"},[t._v("\n    Vue-8-Puzzle\n    "),e("div",{staticClass:"status"},[t._v("\n      (Distance: "+t._s(t.distance)+")\n      "),t.isGoal?e("div",[t._v("\n        finish!!\n      ")]):t._e()])]),t._v(" "),e("div",{staticClass:"container"},[e("puzzle-board",{attrs:{src:t.imgSrc,autoResize:t.autoResize},on:{change:t.onPuzzleBoardChange,finish:t.onPuzzleBoardFinish}})],1)])},staticRenderFns:[]};var k=e("VU/8")(w,v,!1,function(t){e("fP7/")},null,null).exports;s.a.config.productionTip=!1,new s.a({el:"#app",components:{App:k},template:"<App/>"})},P8lf:function(t,i){},"fP7/":function(t,i){},wh8N:function(t,i,e){t.exports=e.p+"static/media/cat.ae00415.webm"},xkHn:function(t,i,e){t.exports=e.p+"static/img/robot.ca73761.jpg"}},["NHnr"]);
//# sourceMappingURL=app.9a639e675123dbeb9379.js.map