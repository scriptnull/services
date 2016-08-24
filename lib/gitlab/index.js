/*jshint globalstrict:true, trailing:false, unused:true, node:true */
"use strict";

var parse = function(headers, body) {
  console.log('mylog headers ' + JSON.stringify(headers));
  console.log('mylog body ' + JSON.stringify(body));

  if(body.object_kind == 'issue') {
    return parse_issue(body);
  } else if(body.object_kind == 'merge_request') {
    return parse_merge_request(body);
  } else if (body.object_kind == 'note') {
    return parse_note(body);
  } else {
    return parse_push(body);
  }
};

var parse_push = function(body) {
  var message = 'GitLab | '+ body.user_name +' pushed ';

  if(body.total_commits_count) {
    message = message + body.total_commits_count +' commits ';
  }

  message = message + 'to '+ body.repository.name;

  return {
    message: message,
    icon: 'logo',
    errorLevel: 'normal'
  }
};

var parse_merge_request = function(body) {
  var attributes = body.object_attributes;
  if(attributes.created_at != attributes.updated_at) {
    var message = 'GitLab | Merge request [\\#'+ attributes.iid +' '+ attributes.title +'] updated';
  } else {
    var message = 'GitLab | Merge request [\\#'+ attributes.iid +' '+ attributes.title +'] created';
  }

  return {
    message: message,
    icon: 'logo',
    errorLevel: 'normal'
  }
};

var parse_issue = function(body) {
  var attributes = body.object_attributes;

  if(attributes.created_at != attributes.updated_at) {
    var message = 'GitLab | Issue [\\#'+ attributes.iid +' '+ attributes.title +'] updated.';
  } else {
    var message = 'GitLab | Issue [\\#'+ attributes.iid +' '+ attributes.title +'] opened.';
  }
  return {
    message: message,
    icon: "logo",
    errorLevel: 'normal'
  }
};

var parse_note = function (body) {
  var user = body.user;
  var repository = body.repository;
  var attributes = body.object_attributes;
  var issue = body.issue;

  var message = user.username + ' commented on [#' + issue.iid + ' ' + issue.title + '](' + attributes.url + ')' +
    ' in [' + repository.name + '](' + repository.homepage + ')';

  return {
    message: message,
    icon: 'logo',
    errorLevel: 'normal'
  }
}

module.exports = {
  apiVersion: 1,
  name: 'GitLab',
  parse: parse
};
