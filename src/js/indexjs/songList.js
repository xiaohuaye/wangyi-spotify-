{
  let view = {
    el: "#songList",
    template: `
    <div class="topNarBar">
      <span class="topNarBar-art active">艺术家</span>
      <span class="topNarBar-albums">专辑</span>
      <span class="topNarBar-likeSong">喜欢的歌</span>
    </div>
    <div class="art-page active">
      <ul>
        <li class="site-songlist" data-songListId="zl67974fca6770">
          <img src="http://abc.xiaohuaye.xyz/20161209164303152140.jpg" alt="">
          <span>林俊杰</span>
        </li>
        <li class="site-songlist" data-songListId="zl859b4e4b8c26">
          <img src="http://abc.xiaohuaye.xyz/4140d2c8-2f68-4825-8718-fdbc80282693.jpg" alt="">
          <span>薛之谦</span>
        </li>
        <li class="site-songlist" data-songListId="zl521d97f3">
          <img src="http://abc.xiaohuaye.xyz/8c1a694ba72143a7a1199c09469f4f2f.jpeg" alt="">
          <span>初音</span>
        </li>
        <li class="site-songlist" data-songListId="zl5b5971d559ff">
          <img src="http://abc.xiaohuaye.xyz/T001R300x300M000001pWERg3vFgg8.jpg" alt="">
          <span>孙燕姿</span>
        </li>
        <li class="site-songlist" data-songListId="zl90937d2b68cb">
          <img src="http://abc.xiaohuaye.xyz/www.nwlg.net_2014531815.jpg" alt="">
          <span>邓紫棋</span>
        </li>
      </ul>
    </div>
    <div class="albums-page">
      <ul>
        <li class="site-songlist" data-songListId="zl7fa4661f">
            <img src="http://abc.xiaohuaye.xyz/T001R300x300M000001XVWeA0mSQ0W.jpg" alt="">
            <span>群星演唱</span>
        </li>
      </ul>
    </div>
    <div class="likeSong-page active"><ul></ul></div>
    `,
    render(targetID, template) {
      $(targetID).html(template);
    },
    renderSource(songlists){
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
    }
  };
  let model = {
    data: {},
    getLikeSong(){
      let query = new AV.Query("Like");
      return query.find()
    }
  };
  let controller = {
    init(view, model) {
      this.view = view,
      this.model = model,
      this.view.render(this.view.el, this.view.template);
      this.bindEvent()
    },
    bindEvent() {
      $(".songList>.topNarBar>span").on("click", e => {
        let index = $(e.currentTarget).index();
        let div = $(".songList>div")[index + 1];
        $(div)
          .addClass("active")
          .siblings()
          .removeClass("active");
        if (index === 2) {
          this.render();
        }
      });
      $(".songList>.topNarBar>span").on("click", e => {
        $(e.currentTarget)
          .addClass("active")
          .siblings()
          .removeClass("active");
      });
    },
    render() {
      this.model.getLikeSong()
      .then(
        songlists => {
          this.view.renderSource(songlists)
        },
        error => {
          console.log(error);
        }
      );
    }
  };
  controller.init(view, model);
}
