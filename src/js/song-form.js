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
      let placeholders = ["name", "singer", "url", "id","listName"];
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
    data: { name: "", singer: "", url: "", id: "" ,listName: ""},
    //歌曲编辑并保存
    updata(listName,data){
      var song = AV.Object.createWithoutData(
        listName,
        this.data.id
      );
      song.set("name", data.name);
      song.set("url", data.url);
      song.set("singer", data.singer);
      song.set('listName', listName)
      return song.save().then(
        (response)=>{
          Object.assign(this.data,response.attributes)
          this.data.id = response.id
          return response
        }
      )
    },
    //歌曲创建并保存,data.id === objectId
    create(listName,data) {
      var Song = AV.Object.extend(listName);
      var song = new Song();
      song.set("name", data.name);
      song.set("singer", data.singer);
      song.set("url", data.url);
      song.set("listName", listName)
      return song.save().then(
        newSong => {
          let { id, attributes } = newSong;
          //等同于{id: newSong.id , name: newSong.attributes.name ...} 
          Object.assign(this.data, { id, ...attributes });
          //将id复制到this.data
        },
        error => {
          console.error(error);
        }
      );
    },
    fetch(className){
      let query = new AV.Query(className);
      return query
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
      this.eventhub()
    },
    create() {
      let need = "name singer url".split(" ");
      let data = {};
      need.map(string => {
        data[string] = this.view.$el.find(`input[name = "${string}"]`).val();
      });
      console.log(Boolean(data.url && data.name))
      if(data.url && data.name){
          this.model.create(this.model.data.listName,data).then(
            () => {
              // this.view.render(this.model.data)
              this.view.reset();
              let string = JSON.stringify(this.model.data);
              let object = JSON.parse(string);
              window.eventhub.emit("create", object);
              console.log(this.model.data)
             this.model.data = {name: "", singer: "", url: "", id: "" ,listName: this.model.data.listName}      

            },
            error => {
              console.log(error);
            })
      }else{console.log("不能为空")}
    },
    updata() {
      let need = "name singer url".split(" ");
      let data = {};
      //替换脚本
      // let string1 = this.view.$el.find(`input[name = "url"]`).val()
      // string1 = string1.replace('pldcmrsc6.bkt.clouddn.com','abc.xiaohuaye.xyz')
      // console.log(string1)
      // this.view.$el.find(`input[name = "url"]`).val(string1)

      need.map(string => {
        data[string] = this.view.$el.find(`input[name = "${string}"]`).val();
      });
      if(data.url && data.name){
          this.model.updata(this.model.data.listName,data).then(()=>{
            window.eventhub.emit('updata',JSON.parse(JSON.stringify(this.model.data)) )
            this.view.reset()
            this.model.data = {name: "", singer: "", url: "", id: "" ,listName: this.model.data.listName}
          })
      }
                  
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
    },
    eventhub(){
      window.eventhub.on('selectSongList',(data)=>{
        this.model.data.listName = data
      })
      window.eventhub.on("select", data => {
        this.model.data = data;
        this.view.render(this.model.data);
      });
      window.eventhub.on("new", data => {
        let need = {}
        need.name = data.name.split('-')[1]
        need.singer = data.name.split('-')[0]
        need.url = data.url
        Object.assign(this.model.data, need);
        this.model.data.id = ""
        this.view.render(this.model.data);
      });
    }
    
  };
  controller.init(view, model);
}
