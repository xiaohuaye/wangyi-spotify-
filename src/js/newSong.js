{
  let view = {
    el: '.newSong',
    template:`新建歌曲`,
    render(data){
      $(this.el).html(this.template)
    }
  }
  let model = {}
  let controller = {
    view : null,
    model : null, 
    init(view,model){
      this.view = view
      this.model = model
      this.view.render(this.model.data)
      this.active()
      window.eventhub.on('new' ,(data)=>{
        this.active()
      })
      window.eventhub.on('select',(data)=>{
        this.deactive()
      })
      $(this.view.el).on('click',()=>{
        window.eventhub.emit('new')
      })
    },
    active(){
      $(this.view.el).addClass('active')
    },
    deactive(){
      $(this.view.el).removeClass('active')
    }
  }
  controller.init(view,model)
}