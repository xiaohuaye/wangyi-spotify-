// var vConsole = new VConsole();
// console.log('Hello world');
var isloop = true;
var theRequest = new Object();
var imgURLreplace;
var name;
var singerName;
var songURL;
var like;
var ObjectName
var listName
var totalTime
var currentTime
var taggle = false;
var hashlocalStorage = JSON.parse(localStorage.getItem("wangyimusic"));
function timeStyle(time) {
  let min = parseInt(time / 60, 10);
  let sec = parseInt(time % 60, 10);
  if (time <= 600) {
    min = "0" + min;
  }
  if (sec < 10) {
    sec = "0" + sec;
  }
  let Time = min + ":" + sec;
  return Time;
}
function playAndPause() {
  let audio = $("audio");
  if (!taggle) {
    audio[0].play();
    taggle = true;
    $(".player .zanting").addClass("active");
    $(".player .bofang").removeClass("active");
    $(".pan .light").addClass("active");
    $(".point").removeClass("close");
  } else {
    audio[0].pause();
    taggle = false;
    $(".player .bofang").addClass("active");
    $(".player .zanting").removeClass("active");
    $(".pan .light").removeClass("active");
    $(".point").addClass("close");
  }
}
{
  let view = {};
  let model = {
    data: {},
    spliceURL() {
      let url = location.search;
      if (url.indexOf("?") != -1) {
        let str = url.substr(1);
        strs = str.split("&&");
        for (var i = 0; i < strs.length; i++) {
          theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
        }
      }
    },
    getImgURL() {
      let queryimgURL = new AV.Query(theRequest.className);
      queryimgURL.startsWith("imgURL", "http");
      return queryimgURL.find();
    },
    getOneSongdetail() {
      let query = new AV.Query(theRequest.className);
      return query.get(theRequest.songId);
    },
    getSongClassName() {
      let query = new AV.Query(theRequest.className);
      return query.get(theRequest.songId);
    },
    getAllsongList(){
      let Query = new AV.Query("AllSongLists");
      return Query.find()
    },
    isLike() {
      let query1 = new AV.Query("Like");
      query1.equalTo("url", songURL);
      return query1.find();
    }
  };
  let controller = {
    init(view, model) {
      (this.view = view), (this.model = model), this.bindEvent();
      this.model.spliceURL();
      this.RenderimgURL();
      this.RenderSong()
      this.songInfo()
    },
    bindEvent() {
      $("audio").on("loadedmetadata", () => {
        let audio = $("audio");
        totalTime = audio[0].duration;
        currentTime = audio[0].currentTime;
        setInterval(()=>{
          currentTime = audio[0].currentTime;
        },1000)
        setTimeout(()=>{
          $('#player .loading').removeClass('active')
          playermodel()
        },1000)
      }),
      $($("body audio")[0]).on("ended", () => {
        if (!isloop) {
          $("audio")[0].currentTime = 0;
          $("#pause").click();
        }
      });
    },
    RenderimgURL() {
      if (theRequest.className !== "zl65b06b4c535566f2") {
        this.model.getImgURL().then(imgURL => {
          imgURLreplace = imgURL[0].attributes.imgURL;
          $(".background img").attr("src", imgURLreplace);
          panmodel()
        });
      } else if (theRequest.className === "zl65b06b4c535566f2") {
        this.model.getOneSongdetail().then(imgURL => {
          imgURLreplace = imgURL.attributes.imgURL;
          $(".background img").attr("src", imgURLreplace);
          panmodel()
        });
      } else {
        $(".background img").attr("src", "../../pic/1.jpg");
      }
    },
    RenderSong() {
      this.model.getSongClassName().then(
        todo => {
          name = todo.attributes.name.split(".mp");
          songURL = todo.attributes.url;
          $("audio").attr("src", todo.attributes.url);
          singerName = todo.attributes.singer;
          songmodel()
          this.model.isLike().then(song => {
            if (song.length !== 0) {
              like = true;
            } else {
              like = false;
            }
          });
        },
        function(error) {
          console.log(error);
        }
      );
    },
    songInfo(){
      this.model.getAllsongList()
      .then(e => {
        e.map(songlistName => {
          ObjectName = songlistName.attributes.ObjectName;
          listName = songlistName.attributes.songListName;
        });
      });
    },
  };
  controller.init(view, model);
}