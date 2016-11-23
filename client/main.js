import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

//นำเข้า Resolutions เข้ามาในระบบ
import { Resolutions } from '../imports/api/resolutions.js';
import './main.html';

Meteor.subscribe("resolutions");
Template.body.helpers({
  resolutions() {
    if (Session.get('hideFinished')){
      return Resolutions.find({checked: {$ne: true}}, { sort: { createdAt: -1  }});
    }else{
      //เอา Resolutions เข้ามา find()
      return Resolutions.find({}, { sort: { createdAt: -1  } });
    }
  },
  hideFinished() {
    return Session.get('hideFinished');
  }
});

Template.body.events({
  'submit .new-resolution' (event){
    event.preventDefault();

    const target = event.target;
    const title = target.title.value;

    Meteor.call("addResolution", title);

    target.title.value = '';
    return false;
  },
  'change .hide-finished' (event){
    Session.set('hideFinished', event.target.checked);
  }
});
Template.resolution.helpers({
  isOwner(){
    return this.owner === Meteor.userId();
  }
});

Template.resolution.events({
  'click .toggle-checked' (){
    Meteor.call("updateResolution", this._id, !this.checked);
  },
  'click .delete' (){
    Meteor.call("deleteResolution", this._id);
  },
  'click .toggle-private' (){
    Meteor.call("setPrivate", this._id, !this.private);
  },
});


Accounts.ui.config({
  passwordSignupFields: "EMAIL_ONLY"
});
