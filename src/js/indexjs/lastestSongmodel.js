{
  let view = {
    el: "#lastestSong",
    template: `
    <h1 class="title-new"></h1>
      <div class="lastestSong-wrapper">
        <ul></ul>
      </div>
    `,
    render(targetID, template) {
      $(targetID).html(template);
    },
    renderSource(){
      model.getSingleSongList()
      .then(
        songlists => {
          let lidom = songlists.map(songlist => {
            if (songlist.attributes.url) {
              let name = songlist.attributes.name.split(".mp");
              let $li = $('<li class="site-song"></li>').attr({
                "data-song-id": songlist.id,
                "data-songlistName": "zl65b06b4c535566f2"
              });
              let $img = $(`<img src=${songlist.attributes.imgURL}></img>`);
              let $span1 = $("<span></span>").text(name[0]);
              let $span2 = $("<span></span>").text(songlist.attributes.singer);
              $($li)
                .append($img)
                .append($span1)
                .append($span2);
              return $li;
            } else if (songlist.attributes.listName) {
              let h1 = $("<h1></h1>").text(songlist.attributes.listName);
              $(".title-new")
                .empty()
                .append(h1);
            }
          });
          $("#lastestSong .lastestSong-wrapper>ul").empty();
          lidom.map(song => {
            $("#lastestSong .lastestSong-wrapper>ul").append(song);
          });
        },
        error => {
          console.log(error);
        }
      );
    }
  };
  let model = {
    data: {},
    getSingleSongList(){
      let query = new AV.Query("zl65b06b4c535566f2");
      return query.find()
    }
  };
  let controller = {
    init(view, model) {
      this.view = view,
      this.model = model,
      this.view.render(this.view.el, this.view.template);
      this.bindEvent()
      this.view.renderSource()
    },
    bindEvent() {
      
    },
    
  };
  controller.init(view, model);
}
