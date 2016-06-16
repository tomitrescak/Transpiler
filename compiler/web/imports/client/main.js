// import { Meteor } from 'meteor/meteor';
// import React from 'react';
// import { render } from 'react-dom';
// import App from './modules/core/components/app';
//
// Meteor.startup(() => {
//   render(<App />, document.getElementById('render-target'));
// });
// import { Template } from 'meteor/templating';
// import { ReactiveVar } from 'meteor/reactive-var';
// //import { parseTree, transpile } from './dist/Java2ts';
// import './main.html';
//
// Template.hello.onCreated(function helloOnCreated() {
//   // counter starts at 0
//   this.result = new ReactiveVar("Compilation Result");
// });
//
// Template.hello.helpers({
//   result() {
//     return Template.instance().result.get();
//   },
// });
//
// Template.hello.events({
//   'click .pegjs'(event, instance) {
//     var source = document.getElementById('source').value;
//     // increment the counter when button is clicked
//     console.log(java2ts.parseTree(source));
//     instance.result.set(JSON.stringify(java2ts.parseTree(source), null, 2));
//   },
//   'click .typescript'(event, instance) {
//     var source = document.getElementById('source').value;
//     // increment the counter when button is clicked
//     console.log(java2ts.parseTree(source));
//     instance.result.set(java2ts.transpile(source).text);
//   },
//   'click .javascript'(event, instance) {
//     var source = document.getElementById('source').value;
//     // increment the counter when button is clicked
//     var ts = java2ts.transpile(source).text;
//     var js = ts2js.compileString(ts, null, null, function(err) { console.log(err) })
//     instance.result.set(js);
//   },
// });
