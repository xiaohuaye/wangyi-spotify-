function songmodel(){
  let view = {
    el: "#song",
    template: `
    <span class="songName"></span>
    <span class="singer"></span>
    `,
    render(targetID, template) {
      $(targetID).html(template);
      $(".song .songName").text(name[0]);
      $(".song .singer").text(singerName);
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
    },
    bindEvent() {
    }
  };
  controller.init(view, model);
}