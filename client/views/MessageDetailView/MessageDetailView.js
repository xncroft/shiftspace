// ==Builder==
// @uiclass
// @package           ShiftSpaceUI
// @dependencies      SSView
// ==/Builder==

var MessageDetailView = new Class({

  Extends: SSView,
  name: "MessageDetailView",

  initialize: function(el, options)
  {
    this.parent(el, options);

    SSAddObserver(this, 'onShowMessage', this.showMessage.bind(this));
    SSAddObserver(this, 'onHideMessage', this['close'].bind(this));
  },


  showMessage: function(message)
  {
    switch(message.meta)
    {
      case 'comment':
        this.MessageBodyMultiView.showViewByName("CommentSubView");
        break;
      case 'invite':
        this.MessageBodyMultiView.showViewByName("InviteSubView");
        break;
      default:
        break;
    }
    this.open();
  },


  'open': function()
  {
    this.delegate().show();
    this.multiView().showViewByName(this.name);
  },


  'close': function()
  {
    this.delegate().hide();
  },
  

  attachEvents: function()
  {
    this.MDVJoinGroup.addEvent("click", function(evt) {
      var p = SSJoinGroup(this.currentMessage().content._id);
      p.realize();
    }.bind(this));

    this.MDVGroupDetails.addEvent("click", function(evt) {
      //SSPostNotification("onShowGroup", SSGroupInfo(this.currentMessage().content._id));
    }.bind(this));
  },


  awake: function()
  {
    this.mapOutletsToThis();
    this.attachEvents();
  },


  currentMessage: function()
  {
    return this.__currentMessage;
  },
  
  
  setCurrentmessage: function(currentMessage)
  {
    this.__currentMessage = currentMessage;
  }

});