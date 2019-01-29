var taggle = false;
var time;
var pageNumber;
var topSonglistDetail;
{
  let view = {};
  let model = {
    data: {
      hashlocalStorage:null,
      currentSongName:null,
      currentSongSinger:null,
      currentSongURL:null,
      currentSongAURL:null

    },
    getSongDetail(className,songId){
      let query = new AV.Query(className);
       return query.get(songId)
    },
    equalToURL(url){
      let query = new AV.Query("Like");
      query.equalTo("url", url);
      return query.find()
    }
  };
  let controller = {
    init(view, model) {
      this.view = view;
      this.model = model;
      this.writeSongToPlayer();//从本地获取上一次歌曲的信息
      this.touchPhone() //设置触摸效果
    },
    touchPhone() {
      // var vConsole = new VConsole();
      // console.log('Hello world');
      $("body").on("touchstart", ".site-song", this.handleStart);
      $("body").on("touchend", ".site-song", this.handleEnd);
    },
    handleStart(e) {
      $(e.currentTarget)
        .addClass("active")
        .siblings()
        .removeClass("active");
    },
    handleEnd(e) {
      $(e.currentTarget).removeClass("active");
    },
    writeSongToPlayer() {
      let Local = localStorage.getItem("wangyimusic");
      if (Local) {
        this.model.data.hashlocalStorage = JSON.parse(
          localStorage.getItem("wangyimusic") || ""
        );
        this.model.getSongDetail(this.model.data.hashlocalStorage["className"],
        this.model.data.hashlocalStorage["songId"])
          .then(song => {
            this.model.currentSongName = song.attributes.name.split(".mp");
            this.model.currentSongSinger = song.attributes.singer;
            this.model.currentSongURL = song.attributes.url;
            this.model.currentSongAURL = `./player.html?className=${
              this.model.data.hashlocalStorage["className"]
            }&&songId=${this.model.data.hashlocalStorage["songId"]}`;
            $(".player-index>span").text(`${this.model.currentSongName[0]}--${this.model.currentSongSinger}`);
            $(".player audio").attr("src", this.model.currentSongURL);
            $(".player a").attr("href", this.model.currentSongAURL);
          })
          .then(() => {
            if (this.model.currentSongName) {
              this.model.equalToURL(this.model.currentSongURL)
              .then(song => {
                if (song.length !== 0) {
                  $(".like-selec>.like")
                    .addClass("active")
                    .siblings()
                    .removeClass("active");
                } else {
                  $(".like-selec>.dislike")
                    .addClass("active")
                    .siblings()
                    .removeClass("active");
                }
              });
            }
          });
      }
    }
  };
  controller.init(view, model);
}

$(".songlist-detail").on("scroll", e => {
  topSonglistDetailChange = $(".songlist-detail #songlist-d-img").offset();
  if (topSonglistDetail.top >= topSonglistDetailChange.top + 10) {
    $(".songlist-detail nav").css("background-color", "#191911");
  } else {
    $(".songlist-detail nav").css("background-color", "rgba(0,0,0,0.2)");
  }
});

$(".songlist-detail>nav>.back").on("click", e => {
  $("section").removeClass("active");
  let section = $("section");
  $(section[pageNumber]).addClass("active");
});


//点击菜单栏
$(".menu>div").on("click", e => {
  $(e.currentTarget)
    .addClass("active")
    .siblings()
    .removeClass("active");
  let index = $(".menu>div").index(e.currentTarget);
  let page = $("section");
  if (index === 1) {
    let topSearch;
    let topForm;
    $(".search").on("scroll", () => {
      topForm = $(".search .mark--1").offset().top;
      topSearch = $(".search h2").offset().top;
      if (topForm > topSearch) {
        setTimeout(() => {
          $(".search h1").addClass("active");
          $(".search .top-search").addClass("active");
        }, 500);
      } else {
        setTimeout(() => {
          $(".search h1").removeClass("active");
          $(".search .top-search").removeClass("active");
        }, 500);
      }
    });
    $("form input").on("focus", () => {
      $("footer").css("visibility", "hidden");
    });
    $(".search").on("scroll", () => {
      $("form input").blur();
    });
    $("form input").on("blur", () => {
      $("footer").css("visibility", "visible");
    });
  }
  $(page[index])
    .addClass("active")
    .siblings()
    .removeClass("active");
  $(".class-recommend").removeClass("hidden");
  $("#search-result").empty();
});

$(".songList>.topNarBar>span").on("click", e => {
  $(e.currentTarget)
    .addClass("active")
    .siblings()
    .removeClass("active");
});

play();
//全局的歌单被点击时，触发

$("body").on("click", ".site-songlist", e => {
  for (let i = 0; i < 3; i++) {
    let string = $("section")[i].className.split(" ");
    if (string[1] === "active") {
      pageNumber = i;
      break;
    }
  }
  $(".help").on("click", () => {
    $(".inf").addClass("active");
    $(".inf").on("click", () => {
      $(".inf").removeClass("active");
    });
  });
  $("section").removeClass("active");
  let section = $("section");
  $(section[3]).addClass("active");
  topSonglistDetail = $(".songlist-detail #songlist-d-img").offset();
  let listId = e.currentTarget.attributes[1].nodeValue;
  if (listId) {
    let query = new AV.Query(listId);
    query.find().then(
      songlists => {
        let lidom = songlists.map(songlist => {
          if (songlist.attributes.url) {
            let name = songlist.attributes.name.split(".mp");
            let $li = $('<li class="site-song"></li>').attr({
              "data-song-id": songlist.id,
              "data-songlistName": listId
            });
            let $span1 = $("<span></span>").text(name[0]);
            let $span2 = $("<span></span>").text(songlist.attributes.singer);
            $($li)
              .append($span1)
              .append($span2);
            return $li;
          } else if (songlist.attributes.listName) {
            let h1 = $("<h1></h1>").text(songlist.attributes.listName);
            let imgURL = songlist.attributes.imgURL;
            let imgtag = $("<img />").attr("src", imgURL);
            $(".title")
              .empty()
              .append(h1);
            $("#songlist-d-img")
              .empty()
              .append(imgtag);
          }
        });
        $(".songlist-detail>ul").empty();
        lidom.map(song => {
          $(".songlist-detail>ul").append(song);
        });
      },
      error => {
        console.log(error);
      }
    );
  }
});
//全局的歌被点击时触发

//搜索
$(".search form").on("submit", e => {
  e.preventDefault();
  $(".class-recommend").addClass("hidden");
  $("#search-result").empty();
  let value = $(".search input")[0].value;
  hash = ["name", "singer"];
  for (i = 0; i < hash.length; i++) {
    search(hash[i], value);
  }
});
$(".songList>.topNarBar>span").on("click", e => {
  let index = $(e.currentTarget).index();
  let div = $(".songList>div")[index + 1];
  $(div)
    .addClass("active")
    .siblings()
    .removeClass("active");
  if (index === 2) {
    render();
  }
});

$("#like").on("click", () => {
  let text = $(".player-index>span").text();
  if (text) {
    let hashlocalStorage = JSON.parse(localStorage.getItem("wangyimusic"));
    let url = $(".player audio").attr("src");
    let query1 = new AV.Query("Like");
    query1.equalTo("url", url);
    query1.find().then(
      song => {
        if (song.length === 0) {
          let query = new AV.Query(hashlocalStorage["className"]);
          query.get(hashlocalStorage["songId"]).then(
            song => {
              let Like = AV.Object.extend("Like");
              let like = new Like();
              like.set("listName", "like");
              like.set("name", song.attributes.name);
              like.set("singer", song.attributes.singer);
              like.set("url", song.attributes.url);
              like.save().then(
                song => {
                  $(".like-selec>.like")
                    .addClass("active")
                    .siblings()
                    .removeClass("active");
                  render();
                },
                error => {
                  console.error(error);
                }
              );
            },
            error => {
              console.log(error);
            }
          );
        } else {
          let todo = AV.Object.createWithoutData("Like", song[0].id);
          todo.destroy().then(
            success => {
              $(".like-selec>.dislike")
                .addClass("active")
                .siblings()
                .removeClass("active");
              console.log(success);
              render();
            },
            error => {
              console.log(error);
            }
          );
        }
      },
      error => {
        console.log(error);
      }
    );
  }
});

function render() {
  let query5 = new AV.Query("Like");
  query5.find().then(
    songlists => {
      let lidom = songlists.map(songlist => {
        if (songlist.attributes.url) {
          let name = songlist.attributes.name.split(".mp");
          let $li = $('<li class="site-song"></li>').attr({
            "data-song-id": songlist.id,
            "data-songlistName": "Like"
          });
          let $span1 = $("<span></span>").text(name[0]);
          let $span2 = $("<span></span>").text(songlist.attributes.singer);
          $($li)
            .append($span1)
            .append($span2);
          return $li;
        }
      });
      $(".likeSong-page>ul").empty();
      lidom.map(song => {
        $(".likeSong-page>ul").append(song);
      });
    },
    error => {
      console.log(error);
    }
  );
}

$("body").on("click", ".site-song", e => {
  let hash = {
    songId: e.currentTarget.attributes[1].value,
    className: e.currentTarget.attributes[2].value
  };
  localStorage.setItem("wangyimusic", JSON.stringify(hash));
  let url = `./player.html?className=${hash["className"]}&&songId=${
    hash["songId"]
  }`;
  writeSongToPlayer();
  let audio = $("audio");
  if (!taggle) {
    setTimeout(() => {
      $("#footer-play").click();
      audio[0].play();
    }, 2000);
  } else {
    setTimeout(() => {
      audio[0].play();
    }, 2000);
  }
});

function search(className, value) {
  var query = new AV.Query("AllSongLists");
  query.find().then(songlists => {
    //歌单列表
    songlists.map(songlist => {
      //每一个歌单
      let ObjectName = songlist.attributes.ObjectName;
      let query1 = new AV.Query(ObjectName); //查找每个歌单
      query1.contains(className, value);
      return query1.find().then(
        //在歌单里面查找对应的歌
        songs => {
          if (songs.length !== 0) {
            //如果找到
            songs.map(song => {
              let name = song.attributes.name.split(".mp"); //name[0]就是歌名
              let $li = $('<li class="site-song"></li>').attr({
                "data-song-id": song.id,
                "data-songlistName": song.attributes.listName
              });
              let $span1 = $("<span></span>").text(name[0]);
              let $span2 = $("<span></span>").text(song.attributes.singer);
              $($li)
                .append($span1)
                .append($span2);
              $("#search-result").append($li);
            });
          }
        }
      );
    });
  });
}

function play() {
  $("#footer-play").on("click", () => {
    let aWidth = $(".player-index").width();
    let sWidth = $(".player-index>span").width();
    if ($(".player audio").attr("src")) {
      if (time) {
        clearInterval(time);
        $(".player-index>span").css("display", `none`);
        setTimeout(() => {
          $(".player-index>span").css("display", "inline");
          $(".player-index>span").css("margin-left", `0px`);
        }, 100);
      }
      let audio = $("audio");
      if (!taggle) {
        audio[0].play();
        taggle = true;
        $("#footer-play>.pause")
          .addClass("active")
          .siblings()
          .removeClass("active");
        if (aWidth < sWidth) {
          let n = 0;
          time = setInterval(() => {
            $(".player-index>span").css("margin-left", `${n}px`);
            if (-n / 2 > sWidth) {
              $(".player-index>span").css("display", "none");
              n = sWidth;
              setTimeout(() => {
                $(".player-index>span").css("display", "inline");
              }, 100);
            } else {
              n = n - 3;
            }
          }, 100);
        }
      } else {
        audio[0].pause();
        taggle = false;
        $("#footer-play>.start")
          .addClass("active")
          .siblings()
          .removeClass("active");
      }
    }
  });
}


