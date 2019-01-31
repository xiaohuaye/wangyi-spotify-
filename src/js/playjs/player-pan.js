function panmodel(){
  let view = {
    el: "#pan",
    template: `
    <img class="out" src="../pic/disc-ip6.png" alt="">
    <img class="light" src="../pic/disc_light-ip6.png" alt="">
    <img class="default"  src="../pic/disc_default.png" alt="">
    `,
    render(targetID, template) {
      $(targetID).html(template);
      $(".pan .default").attr("src", imgURLreplace);
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
      $("#pan .light").on("click", () => {
        playAndPause();
      });
    }
  };
  controller.init(view, model);
}
  

