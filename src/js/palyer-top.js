{
  let view = {
    el: "#top",
    template: `
    <span>
      <svg class="back icon" aria-hidden="true">
        <use xlink:href="#icon-tubiaozhizuomoban-"></use>
      </svg>
    </span>
    <span>
      <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-wangyiyunyinle-copy"></use>
      </svg>
    网易云音乐</span>
    `,
    render(targetID, template) {
      $(targetID).html(template);
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
      $(".top .back").on("click", () => {
        window.history.back(-1);
      });
    }
  };
  controller.init(view, model);
}
