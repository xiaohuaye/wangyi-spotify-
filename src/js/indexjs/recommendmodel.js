{
  let view = {
    el: "#recommend",
    template: `
    <h1>特别推荐</h1>
      <ul class="recommend-wrapper">
        <li class="site-songlist" data-songListId="zl7b2c36315c4a683c83b17f8e595663d0540d540d5355">
        </li>
        <li class="site-songlist" data-songListId="zl9cb84e9197f365484e0e753597f3">
        </li>
        <li class="site-songlist" data-songListId="zl90a34e9b8d855e26611f768482f165876b4c66f2">
        </li>
        <li class="site-songlist" data-songListId="zl5b899759768465e58bed6b4c">
        </li>
        <li class="site-songlist" data-songListId="zl57307403774096468ba15212">
        </li>
        <li class="site-songlist" data-songListId="zl572859166f026cca">
        </li>
      </ul>
    `,
    render(targetID, template) {
      $(targetID).html(template);
    },
    renderSource(){
      let hashSongList = $("#recommend .recommend-wrapper .site-songlist");
      for (let i = 0; i < hashSongList.length; i++) {
        let tag = $(hashSongList[i])[0];
        let className = $(hashSongList[i])[0].attributes[1].value;
        model.getImgURL(className)
        .then(img => {
          let name = img[0].attributes.listName;
          let spantag = $("<span></span>").text(name);
          let imgURL = img[0].attributes.imgURL;
          let imgtag = $("<img />").attr("src", imgURL);
          $(tag)
            .append(imgtag)
            .append(spantag);
        });
      }
    }
  };
  let model = {
    data: {},
    getImgURL(className){
      let query = new AV.Query(className);
        query.startsWith("imgURL", "http");
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
      $(".top .back").on("click", () => {
        window.history.back(-1);
      });
    },
    
  };
  controller.init(view, model);
}
