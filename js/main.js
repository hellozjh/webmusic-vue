//子组件必须在根组件前面
// var leftbotton = {
//   template:"<div @click="former()"></div>"
// }
//不要用两层监听器，有延迟
var bottomVue = new Vue({
  // 接管name=app标签的内容
  el: '#bottomMusicBlock',
  data () {
    return {
      songs,
      songId: "",
      playButtonShow: true,
      songname: "",
      artist: "",
      currentTime: "",
      totalTime: "",
      currentTimeDisp: "00:00",
      totalTimeDisp: "00:00",
      changeProgress: "",
      progressBarGo: "",
      progressBarHead:"",
      volumeBarHead:"",
      volumeShow: false,
      volumeData: "50px",
      model: "order",
      modelOneShow: true,
      modelTwoShow: false,
      modelThreeShow: false,
      listShow: false,
      listDeleteShow: false,
      listisActive: null,
      listDeleteCount: 0
    }
  },
  //引入组件app
  components: {
  },
  methods: {
    play () {
      this.$refs.audio.play();
      this.playButtonShow = false;
    },
    pause () {
      this.$refs.audio.pause();
      this.playButtonShow = true;
    },
    PrefixZero(num, n) {
      return (Array(n).join(0) + num).slice(-n);
    },
    getDuration() {
       this.totalTime = this.$refs.audio.duration;
       this.totalTimeDisp  = this.PrefixZero(Math.floor(this.totalTime/60),2) +":" + this.PrefixZero(parseInt(this.totalTime%60),2);
    },
    updateTime(e) {
      this.currentTime = e.target.currentTime;  //获取audio当前播放时间
      this.currentTimeDisp = this.PrefixZero(Math.floor(this.currentTime/60),2) +":" + this.PrefixZero(parseInt(this.currentTime%60),2);
      this.progressBarGo = this.currentTime/this.totalTime*100*5/6+'%';
      this.progressBarHead = this.currentTime/this.totalTime*500-10+'px';
    },
    prevSong () {
      this.songId--;
      if (this.songId==0) {
        this.songId = this.songs.length;
      }    
    },
    nextSong () {
      if (this.model == "order") {
        this.songId++;
        if (this.songId==this.songs.length+1) {
          this.songId = 1;
        }
      } else if (this.model == "random") {
        do {
          var songIdchange = 1+ Math.round((this.songs.length-1) * Math.random());
        } while (this.songId == songIdchange)
        this.songId = songIdchange;
      }      
    },
    skip (e) {
      this.changeProgress=(event.offsetX)/500;
    },
    dragBarHead (e) {
      var disx = event.clientX - event.target.offsetLeft;
      var _this=this
      document.onmousemove = function (e){
        var left = event.clientX - disx;
        if (left<-10) {
          left = -10;
        } else if (left>490){
          left = 490;
        }
        _this.progressBarHead=left+'px';
        var audio =document.getElementsByTagName("audio")[0];
        _this.currentTime = (left+10)/500*_this.totalTime;
        audio.currentTime=_this.currentTime;
        _this.progressBarGo = _this.currentTime/_this.totalTime*100*5/6+'%'; 
        _this.progressBarHead = _this.currentTime/_this.totalTime*500-10+'px';
      }
      document.onmouseup = function(){
        document.onmousemove = document.onmouseup = null;
      }
    },
    volume () {
      this.volumeShow = !this.volumeShow;
    },
    volumeAdd (e) {
      var audio =document.getElementsByTagName("audio")[0];
      audio.volume = 1-event.offsetY/100;
      this.volumeData = this.volumeBarHead = audio.volume*100+'px'

    },
    volumeDown (e) {
      var audio =document.getElementsByTagName("audio")[0];
      audio.volume = (parseInt(this.volumeData)-event.offsetY)/100;
      this.volumeData = this.volumeBarHead = audio.volume*100+'px';
    },
    dragVolumeHead (e) {
      var disy = event.clientY - event.target.offsetTop;
      var _this=this;
      document.onmousemove = function (e){
        var top= event.clientY - disy;
        if (top<9) {
          top = 9;
        } else if (top>100){
          top = 100;
        }
        _this.volumeBarHead = 100-top + 'px';
        _this.volumeData = 100-top + 'px';
        var audio =document.getElementsByTagName("audio")[0];
        audio.volume = parseFloat(_this.volumeData)/100;
      }
      document.onmouseup = function(){
        document.onmousemove = document.onmouseup = null;
      }
    },
    changeModelOne () {
      this.modelOneShow = false;
      this.modelTwoShow = true;
      this.$refs.audio.loop = true;
    },
    changeModelTwo () {
      this.modelTwoShow = false;
      this.modelThreeShow = true;
      this.$refs.audio.loop = false;
      this.model = "random";
    },
    changeModelThree () {
      this.modelThreeShow = false;
      this.modelOneShow = true;
      this.model = "order";
    },
    listSong () {
      this.listShow = !this.listShow;
      if (this.volumeShow) {
        this.volumeShow=!this.volumeShow;
      }
    },
    listPick (index) {
      this.songId = index + 1;
    },
    listDelete (index) {
      this.songs.splice(index, 1);
      if (this.songId-this.listDeleteCount == index + 1) {
        if (this.songId - this.listDeleteCount == this.songs.length + 1) {
          if (this.songs.length == 0) {
            this.songname = this.artist =  "^";
            this.currentTimeDisp = this.totalTimeDisp = "00:00";
          } else {
            this.songId = 1;
          } 
        }
        var audio = document.getElementsByTagName("audio")[0];
        this.songname = this.songs[this.songId-this.listDeleteCount-1].title;
        this.artist = this.songs[this.songId-this.listDeleteCount-1].artist;
        audio.src = this.songs[this.songId-this.listDeleteCount-1].src;
        this.progressBarGo = 0;
        if (this.playButtonShow == false) {
          this.$refs.audio.play();                   
        } 
      } else if (this.songId > index + 1) {
        this.listDeleteCount++
      }
    },
    mouseEnterList (index) {
      this.listisActive = index;;
    },
    mouseLeaveList () {
      this.listisActive = null;
    },
    closeShow () {
      this.volumeShow = false;
      this.listShow = false;
    }
  },
  mounted () {
    var audio = document.getElementsByTagName("audio")[0];
    audio.volume=parseInt(this.volumeData)/100;
    this.songId = 2;
  },
  watch: {
    songId(val) {
      var audio = document.getElementsByTagName("audio")[0];
      this.songname = this.songs[this.songId-1].title;
      this.artist = this.songs[this.songId-1].artist;
      audio.src = this.songs[this.songId-1].src;
      this.progressBarGo = 0;
      if (this.playButtonShow == false) {
        this.$refs.audio.play();                   
      }
    },
    changeProgress(val) {
      var audio =document.getElementsByTagName("audio")[0];
      this.currentTime = this.changeProgress*this.totalTime;
      audio.currentTime= this.currentTime;
      this.progressBarGo = this.currentTime/this.totalTime*100*5/6+'%'; 
      this.progressBarHead = this.currentTime/this.totalTime*500-10+'px';
    }
  }
})

function closeShow () {
  document.getElementById("musicList").style.display = "none";
  document.getElementById("volumeBlock").style.display = "none";
}
