{
  let view = {
    el: "#model-songLists",
    template: `
    <div id="creatList"><button>111</button></div>
        <div class="AllsongList-list"></div>
        <form class="flexwindow">
          <h3>新建歌单</h3>
          <input type="text" placeholder="请输入歌单名称" />
          <input type="submit" value="提交" />
          <button class="cancel">取消</button>
        </form>
    `,
    render(data) {
      let $el = $(this.el);
      $el.html(this.template);
    }
  };
  let model = {
    data:{}
  };
  let controller = {
    init(view, model) {
      this.view = view,
      this.model = model,
      this.view.render()
      this.bindEvent()
    },
    bindEvent() {
      $(this.view.el)
        .on("click", "button",() => {
          this.flexBoxShow()
          $(this.view.el).on("click",".cancel", () => {
            this.flexBoxHidden()
          });
          $(this.view.el).one("submit",".flexwindow", e => {
            e.preventDefault();
            let listName = $(this.view.el).find(".flexwindow input[type=text]").val();
            if(listName !== ''){
              let objectName = "";
              for (let i = 0; i < listName.length; i++) {
                objectName += listName.charCodeAt(i).toString(16);
              }
              let Todo = AV.Object.extend(`zl${objectName}`);
              // 新建一个 Todo 对象
              let todo = new Todo();
              todo.set("listName", `${listName}`);
              todo.save().then(
                (todo)=> {
                  // 成功保存之后，执行其他逻辑.
                  console.log("New object created with objectId: " + todo.id);
                  alert("创建歌单成功");
                  this.addSongList(objectName, listName);
                  this.flexBoxShow()
                },
                (error)=> {
                  // 异常处理
                  console.error(
                    "Failed to create new object, with error message: " +
                      error.message
                  );
                  alert("创建歌单失败");
                  this.flexBoxHidden()
                }
              );
            }else{
              console.log('歌单名不能为空')
            }
          });
        });
    },
    addSongList(objectName, listName) {
      let AllSongLists = AV.Object.extend("allSongLists");
      // 新建一个 Todo 对象
      let allSongLists = new AllSongLists();
      //创建歌单列表
      //
      allSongLists.set("ObjectName", `zl${objectName}`);
      allSongLists.set("songListName", `${listName}`);
      allSongLists.save().then(
        function(allSongLists) {
          // 成功保存之后，执行其他逻辑.
          console.log("New object created with objectId: " + allSongLists.id);
          alert("创建歌单名录成功");
          $(".flexwindow").removeClass("show");
        },
        function(error) {
          // 异常处理
          console.error(
            "Failed to create new object, with error message: " +
              error.message
          );
          alert("创建歌单名录失败");
        }
      );
    },
    flexBoxShow(){
      $(this.view.el).find(".flexwindow").addClass("show");
    },
    flexBoxHidden(){
      $(this.view.el).find(".flexwindow").removeClass("show");
    }
  };
  controller.init(view, model);
}
