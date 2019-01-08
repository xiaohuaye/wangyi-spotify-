{
  let view = {
    el: '#siteLoading',
    show(){
      $(this.el).addClass('active')
    },
    hide(){
      $(this.el).removeClass('active')
    }
  }
  let model = {}  
  let controller = {
    init(view,model){
      this.view = view
      this.model = model
      this.bindEventhub()
    },
    bindEventhub(){
      window.eventhub.on('beforeUpload',()=>{
        this.view.show()
      })
      window.eventhub.on('afterUpload',()=>{
        this.view.hide()
      })
    }
  }
  controller.init(view,model)
}