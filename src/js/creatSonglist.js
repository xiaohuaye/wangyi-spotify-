{
  let view = {
    el: "#model-songLists",
    template: `
    <div id="creatList"><button>创建歌单</button></div>
    <ul id="AllsongList-list" class="AllsongList-list"></ul>
    <div class="flexwindow">
        <form class="form-AllsongList">
          <h3>新建歌单</h3>
          <input type="text" placeholder="请输入歌单名称" />
          <input type="submit" value="提交" />
        </form>
        <button class="cancel">取消</button>
    </div>
    `,
    render(targetID, template) {
      $(targetID).html(template);
    },
    updataAllsongList(list) {
      $(this.el)
        .find("#AllsongList-list")
        .empty();
      list.map(domli => {
        $(this.el)
          .find("#AllsongList-list")
          .append(domli);
      });
    },
    clearActive() {
      $(this.el)
        .find(".active")
        .removeClass("active");
    },
    activeItem(item) {
      let $li = $(item);
      $li
        .addClass("active")
        .siblings(".active")
        .removeClass("active");
    }
  };
  let model = {
    data: {},
    fetch() {
      let query = new AV.Query("AllSongLists");
      return query.find();
    }
  };
  let controller = {
    init(view, model) {
      this.view = view,
      this.model = model,
      this.view.render(this.view.el, this.view.template);
      this.bindEvent(), this.renderAllSongList();
    },
    bindEvent() {
      $(this.view.el).on("click", "button", () => {
        this.flexBoxShow();
        $(this.view.el).on("click", ".cancel", () => {
          this.flexBoxHidden();
        });
        $(this.view.el).one("submit", ".form-AllsongList", e => {
          e.preventDefault();
          let listName = $(this.view.el)
            .find(".flexwindow input[type=text]")
            .val();
          if (listName !== "") {
            let objectName = "";
            for (let i = 0; i < listName.length; i++) {
              objectName += listName.charCodeAt(i).toString(16);
            }
            let ObjectName = `zl${objectName}`;
            var Song = AV.Object.extend(ObjectName);
            var song = new Song();
            song.set('listName',listName)
            song.save().then(
              () => {
                console.log("创建成功");
              },
              error => {
                console.log(error);
              }
            );
            this.addSongList(ObjectName, listName);
          } else {
            console.log("歌单名不能为空");
          }
        });
      });
      ////
      $(this.view.el).on("click", "li", e => {
        this.view.activeItem(e.currentTarget);
        let songlistId = e.target.dataset.songlistId;
        this.model.data.songlistId = songlistId
        this.eventhub()
      });
    },
    addSongList(ObjectName, listName) {
      var AllSongLists = AV.Object.extend("AllSongLists");
      var allSongLists = new AllSongLists();
      allSongLists.set("ObjectName", ObjectName);
      allSongLists.set("songListName", `${listName}`);
      return allSongLists.save().then(
        allSongLists => {
          // 成功保存之后，执行其他逻辑.
          console.log("New object created with objectId: " + allSongLists.id);
          alert("创建歌单名录成功");
          $(".flexwindow").removeClass("show");
          this.renderAllSongList();
        },
        function(error) {
          // 异常处理
          console.error(
            "Failed to create new object, with error message: " + error.message
          );
          alert("创建歌单名录失败");
        }
      );
    },
    renderAllSongList() {
      this.model.fetch().then(songListNames => {
        let list = songListNames.map(songListName => {
          let $li = $("<li></li>")
            .text(songListName.attributes.songListName)
            .attr("data-songList-id", songListName.attributes.ObjectName);
          return $li;
        });
        this.view.updataAllsongList(list);
      });
    },
    eventhub(){
        window.eventhub.emit("selectSongList", this.model.data.songlistId);
        console.log("我发布了selectSongList")
    },
    flexBoxShow() {
      $(this.view.el)
        .find(".flexwindow")
        .addClass("show");
    },
    flexBoxHidden() {
      $(this.view.el)
        .find(".flexwindow")
        .removeClass("show");
    }
  };
  controller.init(view, model);
}
