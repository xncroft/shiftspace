// ==Builder==
// @uiclass
// @package           ShiftSpaceUI
// @dependencies      SSView
// ==/Builder==

var GroupsPane = new Class({

  Extends: SSView,
  name: "GroupsPane",


  initialize: function(el, options)
  {
    this.parent(el, options);

    SSAddObserver(this, "onUserLogin", this.onUserLogin.bind(this));
    SSAddObserver(this, "onUserJoin", this.onUserLogin.bind(this));
    SSAddObserver(this, "onAddUsers", this.onAddUsers.bind(this));
  },


  hide: function()
  {
    this.parent();
    this.__addUserMode = false;
    SSPostNotification("onGroupsPaneHide", this);
  },


  awake: function()
  {
    this.mapOutletsToThis();
    this.attachEvents();
  },


  handleRowClick: function(evt)
  {
    if(!evt.handled) SSPostNotification("onShowGroup", evt.data);
  },


  editGroup: function(sender, evt)
  {
    SSPostNotification("onEditGroup", evt.data);
  },
  

  attachEvents: function()
  {
    [this.GroupsListView, this.MyGroupsListView].each(function(lv) {
      lv.addEvent("onRowClick", this.handleRowClick.bind(this));
    }, this);
    this.GroupsTabView.addEvent("tabSelected", this.onTabSelect.bind(this));
  },


  onTabSelect: function(evt)
  {
    if(evt.tabIndex == 2 && !this.__addUserMode)
    {
      SSPostNotification("onCreateGroup", this);
    }
    else if(evt.tabIndex != 2)
    {
      this.__addUserMode = false;
      this.InviteUsersListView.element.removeClass("Invite");
      // TODO: warn user they are in add user mode - David
      SSPostNotification("onEditGroupHide", this);
    }
  },


  onUserLogin: function()
  {
    SSTableForName("Groups").addView(this.GroupsListView);
    SSTableForName("MyGroups").addView(this.MyGroupsListView);
    SSTableForName("Users").addView(this.InviteUsersListView);
  },


  onAddUsers: function(group)
  {
    this.__addUserMode = true;
    this.GroupsTabView.selectTab(2);
    this.InviteUsersListView.element.addClass("Invite");
  }
});