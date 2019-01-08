{
  let view = {
    el: ".page>main",
    init() {
      this.$el = $(this.el);
    },
    template: `
        <form class="form">
            <div class="row">
                <label for="">歌名<input name="name" type="text" value="__name__"></label>
            </div>
            <div class="row">
                <label for="">歌手<input name="singer" type="text" value="__singer__"></label>
            </div>
            <div class="row">
                <label for="">外链<input name="url" type="text" value="__url__"></label>
            </div>
            <div class="form-btn">
                <input type="submit" value="保存">
                <input type="reset" value="清空">
            </div>
        </form>`,
    render(data = {}) {
      let placeholders = ["name", "singer", "url", "id"];
      let html = this.template;
      placeholders.map(string => {
        html = html.replace(`__${string}__`, data[string] || "");
      });
      $(this.el).html(html);
      if (data.id) {
        $(this.el).prepend("<h1>编辑歌曲</h1>");
      } else {
        $(this.el).prepend("<h1>新建歌曲</h1>");
      }
    },
    reset() {
      this.render({});
    }
  };
  let model = {
    data: { name: "", singer: "", url: "", id: "" },
    updata(data){
      var song = AV.Object.createWithoutData(
        "song",
        this.data.id
      );
      song.set("name", data.name);
      song.set("url", data.url);
      song.set("singer", data.singer);
      return song.save().then(
        (response)=>{
          Object.assign(this.data,data)
          return response
        }
      )
    },
    create(data) {
      // 声明一个 Todo 类型
      var Song = AV.Object.extend("song");
      // 新建一个 Todo 对象
      var song = new Song();
      song.set("name", data.name);
      song.set("singer", data.singer);
      song.set("url", data.url);
      return song.save().then(
        newSong => {
          let { id, attributes } = newSong;
          Object.assign(this.data, { id, ...attributes });
        },
        error => {
          console.error(error);
        }
      );
    }
  };
  let controller = {
    view: null,
    model: null,
    init(view, model) {
      this.view = view;
      this.view.init();
      this.model = model;
      this.view.render(this.model.data);
      this.bindEvent();
      window.eventhub.on("select", data => {
        this.model.data = data;
        this.view.render(this.model.data);
      });
      window.eventhub.on("new", data => {
        if (this.model.data.id) {
          this.model.data = {
            name: "",
            url: "",
            id: "",
            singer: ""
          };
        } else {
          Object.assign(this.model.data, data);
        }
        this.view.render(this.model.data);
      });
    },
    create() {
      let need = "name singer url".split(" ");
      let data = {};
      need.map(string => {
        data[string] = this.view.$el.find(`input[name = "${string}"]`).val();
      });
      this.model.create(data).then(
        () => {
          // this.view.render(this.model.data)
          this.view.reset();
          let string = JSON.stringify(this.model.data);
          let object = JSON.parse(string);
          window.eventhub.emit("create", object);
        },
        error => {
          console.log(error);
        }
      );
    },
    updata() {
      let need = "name singer url".split(" ");
      let data = {};
      need.map(string => {
        data[string] = this.view.$el.find(`input[name = "${string}"]`).val();
      });
      this.model.updata(data).then(()=>{
        window.eventhub.emit('updata',JSON.parse(JSON.stringify(this.model.data)) )
      })
    },
    bindEvent() {
      this.view.$el.on("submit", "form", e => {
        e.preventDefault();
        if (this.model.data.id) {
          this.updata();
        } else {
          this.create();
        }
      });
    }
  };
  controller.init(view, model);
}
