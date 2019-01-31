{
  let view = {
    el: "#search",
    template: `
    <div class="top-search">
        <h1>Search</h1>
        <form>
          <span></span><svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-search"></use>
          </svg></span>
          <input type="text" placeholder="请输入艺术家，歌名">
        </form>
        <div class="mark--1"></div>
    </div>
    <div class="class-recommend">
      <h2>浏览全部</h2>
      <ul>
        <li class="site-songlist" data-songListId="zl53e45178" style="background: linear-gradient(135deg, rgba(14,59,50,1) 0%, rgba(52,153,84,1) 100%);">
          <span>古典</span>
        </li>
        <li class="site-songlist" data-songListId="zl4f24611f" style="background: linear-gradient(135deg, rgba(92,5,51,1) 0%, rgba(184,106,70,1) 100%);">
          <span>伤感</span>
        </li>
        <li class="site-songlist" data-songListId="zl53e45178" style="background: linear-gradient(135deg, rgba(5,20,92,1) 0%, rgba(105,116,219,1) 100%);">
          <span>流行乐</span>
        </li>
        <li class="site-songlist" data-songListId="zl75355b50821e66f2" style="background: linear-gradient(135deg, rgba(128,36,120,1) 0%, rgba(215,104,217,1) 100%);">
            <span>电子舞曲</span>
        </li>
      </ul>
    </div>
    <ul id="search-result" class="search-result"></ul>
    `,
    render(targetID, template) {
      $(targetID).html(template);
    },
    renderSource(song) {
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
    }
  };
  let model = {
    data: {},
    getAllSongList() {
      var query = new AV.Query("AllSongLists");
      return query.find();
    },
    getSonglist(ObjectName, className, value) {
      let query1 = new AV.Query(ObjectName); //查找每个歌单
      query1.contains(className, value);
      return query1.find();
    }
  };
  let controller = {
    init(view, model) {
      (this.view = view),
        (this.model = model),
        this.view.render(this.view.el, this.view.template);
      this.bindEvent();
    },
    bindEvent() {
      $(".search form").on("submit", e => {
        e.preventDefault();
        $(".class-recommend").addClass("hidden");
        $("#search-result").empty();
        let value = $(".search input")[0].value;
        hash = ["name", "singer"];
        for (i = 0; i < hash.length; i++) {
          this.search(hash[i], value);
        }
      });
    },
    search(className, value) {
      this.model.getAllSongList().then(songlists => {
        //歌单列表
        songlists.map(songlist => {
          //每一个歌单
          let ObjectName = songlist.attributes.ObjectName;
          this.model.getSonglist(ObjectName, className, value).then(
            //在歌单里面查找对应的歌
            songs => {
              if (songs.length !== 0) {
                //如果找到
                songs.map(song => {
                  this.view.renderSource(song)
                });
              }
            }
          );
        });
      });
    }
  };
  controller.init(view, model);
}
