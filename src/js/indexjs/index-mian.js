var taggle = false;
var time;
var pageNumber;
var listId
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
      this.bindEvent()
      this.play()
    },
    touchPhone() {
      // var vConsole = new VConsole();
      // console.log('Hello world');
      $("body").on("touchstart", ".site-song", this.handleStart);
      $("body").on("touchend", ".site-song", this.handleEnd);
    },
    bindEvent(){
      $("body").on("click", ".site-songlist", e => {
        for (let i = 0; i < 3; i++) {
          let string = $("section")[i].className.split(" ");
          if (string[1] === "active") {
            pageNumber = i;
            break;
          }
        }
        $("section").removeClass("active");
        let section = $("section");
        $(section[3]).addClass("active");
        listId = e.currentTarget.attributes[1].nodeValue;
        songlistDetail()
      });
      $("body").on("click", ".site-song", e => {
        let hash = {
          songId: e.currentTarget.attributes[1].value,
          className: e.currentTarget.attributes[2].value
        };
        localStorage.setItem("wangyimusic", JSON.stringify(hash));
        let url = `./player.html?className=${hash["className"]}&&songId=${
          hash["songId"]
        }`;
        this.writeSongToPlayer();
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
                  () => {
                    $(".like-selec>.dislike")
                      .addClass("active")
                      .siblings()
                      .removeClass("active");
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
    },
    play() {
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
    
  };
  controller.init(view, model);
}














