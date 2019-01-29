function playermodel(){
  let view = {
    el: "#player",
    template: `
    <div class="passBar">
        <span class="currentTime">00:00</span>
        <div class="pass-wrapper"><div class="pass"></div></div>
        <span class="totalTime">00:00</span>
      </div>
      <div class="contral">
        <span id="like" class="like-selec">
            <svg class="icon dislike active" aria-hidden="true">
              <use xlink:href="#icon-xihuan"></use>
            </svg>
            <svg class="icon like" aria-hidden="true">
                <use xlink:href="#icon-xihuan1"></use>
            </svg>
        </span>
        <span id="pause">
          <svg class="zanting icon" aria-hidden="true">
            <use xlink:href="#icon-zanting"></use>
          </svg>
          <svg class="bofang active icon" aria-hidden="true">
              <use xlink:href="#icon-bofang"></use>
          </svg>
        </span>
        <span id="loop">
          <svg class="danqu active icon" aria-hidden="true">
            <use xlink:href="#icon-danquxunhuan"></use>
          </svg>
        </span>
    </div>
    `,
    render(targetID, template) {
      $(targetID).html(template);
    }
  };
  let model = {
    data: {},
  };
  let controller = {
    init(view, model) {
      this.view = view,
      this.model = model,
      this.view.render(this.view.el, this.view.template);
      this.bindEvent()
      this.islike()
      this.totalTime()
      this.currentTime()
      this.passBar()
    },
    bindEvent() {
      $("#player #like").on("click", () => {
        let hashlocalStorage = JSON.parse(localStorage.getItem("wangyimusic"));
        let url = $("audio").attr("src");
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
      })

      $("#pause").on("click", () => {
        playAndPause();
      })

      $("#player #loop").on("click", () => {
        if (isloop) {
          let audio = $("audio")[0];
          $($(audio)[0]).removeAttr("loop");
          isloop = false;
          $(".danqu").removeClass("active");
        } else {
          let audio = $("audio")[0];
          $($(audio)[0]).attr("loop", "true");
          isloop = true;
          $(".danqu").addClass("active");
        }
      });
    },
    addOrMoveLike(){

    },
    islike(){
      if (like) {
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
    },
    totalTime(){
      $(".totalTime")
          .empty()
          .text(timeStyle(totalTime));
    },
    currentTime(){
      $(".currentTime")
            .empty()
            .text(timeStyle(currentTime));
    },
    passBar(){
      setInterval(() => {
        let pass = currentTime / totalTime;
        $(".player .pass").css("width", `${pass * 100}%`);
        this.currentTime()
      }, 1000);
    }
    
  };
  controller.init(view, model);
}