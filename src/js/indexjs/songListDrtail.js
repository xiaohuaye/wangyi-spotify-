function songlistDetail(){
  let view = {
    el: "#songlist-detail",
    template: `
    <div class="inf">
      <p>有问题请联系我，我的qq：908347816，也可发邮箱908347816@qq.com</p>
      <p>点击任意地方返回</p>
      </div>
    <nav>
      <span class="back">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-tubiaozhizuomoban-"></use>
      </svg></span>
      <span class="help">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-help"></use>
      </svg>
    </span>
    </nav>
    <div id="songlist-d-img" class="songlist-d-img">
    </div>
    <div class="title"></div>
    <ul></ul>
    `,
    render(targetID, template) {
      $(targetID).html(template);
    },
    renderSource(){
      if (listId) {
        model.getListId(listId)
        .then(
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
                $("#songlist-detail .title")
                  .empty()
                  .append(h1);
                $("#songlist-detail #songlist-d-img")
                  .empty()
                  .append(imgtag);
              }
            });
            $("#songlist-detail ul").empty();
            lidom.map(song => {
              $("#songlist-detail ul").append(song);
            });
          },
          error => {
            console.log(error);
          }
        );
      }else{
        console.log('id')
      }
    }
  };
  let model = {
    data: {
      topSonglistDetail:null,
    },
    getListId(className){
      let query = new AV.Query(className);
        return query.find()
    }
  };
  let controller = {
    init(view, model) {
      this.view = view,
      this.model = model,
      this.view.render(this.view.el, this.view.template);
      this.getTopSonglistDetail()
      this.view.renderSource()
      this.bindEvent()
    },
    getTopSonglistDetail(){
      this.model.data.topSonglistDetail = $(".songlist-detail #songlist-d-img").offset();
    },
    bindEvent() {
      $(".help").on("click", () => {
        $(".inf").addClass("active");
        $(".inf").on("click", () => {
          $(".inf").removeClass("active");
        });
      });
      $(".songlist-detail").on("scroll", e => {
        let topSonglistDetailChange = $(".songlist-detail #songlist-d-img").offset();
        if (this.model.data.topSonglistDetail.top >= topSonglistDetailChange.top + 10) {
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
    },
    
  };
  controller.init(view, model);
}
