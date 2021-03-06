import server.utils.utils as utils
from server.utils.errors import *
from server.utils.decorators import *
from server.utils.returnTypes import *
from resource import *

from server.models.group import Group


class GroupsController(ResourceController):
    def routes(self, d):
        d.connect(name="groupCreate", route="group", controller=self, action="create",
                  conditions=dict(method="POST"))
        d.connect(name="groupRead", route="group/:id", controller=self, action="read",
                  conditions=dict(method="GET"))
        d.connect(name="groups", route="groups", controller=self, action="groups",
                  conditions=dict(method="GET"))
        d.connect(name="groupInviteUsers", route="group/:id/inviteusers", controller=self, action="inviteUsers",
                  conditions=dict(method="POST"))
        d.connect(name="groupJoin", route="group/:id/join", controller=self, action="join",
                  conditions=dict(method="POST"))
        return d

    @jsonencode
    @loggedin
    def create(self):
        loggedInUser = helper.getLoggedInUser()
        jsonData = helper.getRequestBody()
        if jsonData != "":
            theData = json.loads(jsonData)
            theData['createdBy'] = loggedInUser
            return data(Group.create(theData))
        else:
            return error("No data for group.", NoDataError)
        pass

    @jsonencode
    @exists
    def read(self, id):
        # return only public groups
        theGroup = Group.read(id)
        return data(theGroup)

    @jsonencode
    @exists
    def info(self, id):
        # TODO: bulk call - David 12/13/2009
        # get member count
        # get admin count
        pass

    @jsonencode
    @exists
    def update(self, id):
        pass

    @jsonencode
    @exists
    def delete(self, id):
        pass

    @jsonencode
    def groups(self, start=None, end=None, limit=25):
        loggedInUser = helper.getLoggedInUser()
        return data(Group.groups(start, end, limit, userId=loggedInUser))

    @jsonencode
    @exists
    @loggedin
    def inviteUsers(self, id, users):
        from server.models.ssuser import SSUser
        loggedInUser = helper.getLoggedInUser()
        groupAdmin = SSUser.read(loggedInUser)
        theGroup = Group.read(id)
        if groupAdmin.isAdminOf(theGroup):
            db = core.connect()
            users = SSUser.all(db, keys=json.loads(users))
            for user in users:
                groupAdmin.inviteUser(theGroup, user)
            return data(theGroup)
        else:
            return error("Operation not permitted. You don't have permission to modify this group", PermissionError)

    @jsonencode
    @exists
    @loggedin
    def join(self, id):
        from server.models.ssuser import SSUser
        theGroup = Group.read(id)
        loggedInUser = helper.getLoggedInUser()
        theUser = SSUser.read(loggedInUser)
        if theUser.canJoin(theGroup):
            theUser.join(theGroup)
            return data(theGroup)
        else:
            return error("Operation not permitted. You don't have permission to join this group.", PermissionError)

    # leave
