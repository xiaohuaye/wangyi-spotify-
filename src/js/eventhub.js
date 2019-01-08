window.eventhub = {
  events: {},
  //发布
  emit(eventName, data) {
    for (let key in this.events) {
      if (key === eventName) {
        let fnlist = this.events[key];
        fnlist.map(fn => {
          return fn(data);
        });
      }
    }
  },
  //订阅
  on(eventName, fn) {
    if (this.events[eventName] === undefined) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(fn);
  }
};
