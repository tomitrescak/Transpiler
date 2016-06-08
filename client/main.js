import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { parseTree, transpile } from './dist/Java2ts';

import './main.html';

Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.result = new ReactiveVar("Compilation Result");
});

Template.hello.helpers({
  result() {
    return Template.instance().result.get();
  },
});

Template.hello.events({
  'click .pegjs'(event, instance) {
    var source = document.getElementById('source').value;
    // increment the counter when button is clicked
    console.log(parseTree(source));
    instance.result.set(JSON.stringify(parseTree(source), null, 2));
  },
  'click .typescript'(event, instance) {
    var source = document.getElementById('source').value;
    // increment the counter when button is clicked
    console.log(parseTree(source));
    instance.result.set(transpile(source).text);
  },
});
