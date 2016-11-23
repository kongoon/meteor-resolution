import { Meteor } from 'meteor/meteor';
//เมื่อเพิ่มใน Client ต้องเพิ่มใน Server ด้วย
import { Resolutions } from '../imports/api/resolutions.js';

Meteor.startup(() => {
  // code to run on server at startup
});
Meteor.publish("resolutions", function(){
  return Resolutions.find({
    $or: [ //หรือ
      { private: {$ne: true}}, //not equal
      { owner: this.userId }
    ]
  }, {sort: {createdAt: -1}});
});

Meteor.methods({
  addResolution(title){
    Resolutions.insert({
      title: title, createdAt: new Date(), owner: Meteor.userId()
    });
  },
  updateResolution(_id, checked){
    var res = Resolutions.findOne(_id);
    if(res.owner !== Meteor.userId()){
      throw new Meteor.Error('not-authorized');
    }
    
    Resolutions.update(_id, {$set: {
      checked: checked
    }});
  },
  deleteResolution(_id){
    var res = Resolutions.findOne(_id);
    if(res.owner !== Meteor.userId()){
      throw new Meteor.Error('not-authorized');
    }

    Resolutions.remove(_id);
  },
  setPrivate(_id, private){
    var res = Resolutions.findOne(_id);
    if(res.owner !== Meteor.userId()){
      throw new Meteor.Error('not-authorized');
    }

    Resolutions.update(_id, {$set: {
      private: private
    }});
  }
});
