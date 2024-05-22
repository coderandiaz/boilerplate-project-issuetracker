'use strict';
const { v1: uuidv1 } = require('uuid');

module.exports = function (app) {

  const data = [0, 1, 2, 3];
  

  app.route('/api/issues/:project').get(function (req, res){
      const project = req.params.project;
      const open = req.query.open;

      res.send(
        data.filter((item) => item.project == project && item.open == open)
      );
  })
    
  app.route('/api/issues/:project').post(function (req, res) {
    const project = req.params.project;
    const open = req.query.open;

    const issue_title = req.body.issue_title;
    const issue_text = req.body.issue_text;
    const created_by = req.body.created_by;

    const assigned_to = req.body.assigned_to;
    const status_text = req.body.status_text;

    if (!issue_title || !issue_text || !created_by) {
      res.send({ error: 'required field(s) missing' })
    }

    const newId = uuidv1();
    const newIssue = {
      "_id": newId,
      "project": project,
      "open": !open ? true : open,
      "issue_title": issue_title,
      "issue_text": issue_text,
      "created_by": created_by,
      "assigned_to": !assigned_to ? "" : assigned_to,
      "status_text": !status_text ? "" : status_text,
      "created_on": new Date(),
      "updated_on": new Date(),
      "index": data.length
    }
    data.push(newIssue);
    res.send(newIssue);
  });
    
  app.route('/api/issues/:project').put(function (req, res){
    let project = req.params.project;
    let _id = req.body._id;
    try {

      if (!_id) {
        res.send({ error: 'missing _id' })
      }

      const issue_title = req.body.issue_title;
      const issue_text = req.body.issue_text;
      const created_by = req.body.created_by;
      const assigned_to = req.body.assigned_to;
      const status_text = req.body.status_text;

      if (!issue_title && !issue_text && !created_by && !assigned_to && !status_text) {
        res.send({ error: 'no update field(s) sent', '_id': _id });
      }

      const item = data.filter((item) => {
        item._id == _id && item.project == project
      });

      if(issue_title) {
        item["issue_title"] = issue_title;
      }

      if(issue_text) {
        item["issue_text"] = issue_text;
      }

      if(created_by) {
        item["created_by"] = created_by;
      }

      if(assigned_to) {
        item["assigned_to"] = assigned_to;
      }

      if(status_text) {
        item["status_text"] = status_text;
      }

      item["updated_on"] = new Date();
      data[item["index"]] = item;
      res.send({ result: 'successfully updated', '_id': _id });
    } catch (e) {
      // TODO: NEXT STEP IS TO PRINT THE ERRORS FROM CATCH AND FIGURE OUT WHY ITS NOT WORKING.
      res.send({ error: 'could not update', '_id': _id })
    }
  })
    
  app.route('/api/issues/:project').delete(function (req, res){
    let project = req.params.project;
    let _id = req.body._id;
    try {
      if (!_id) {
        res.send({ error: 'missing _id'});
      }
      
      // Suppose we want to remove the item with index 2 ('cherry')
      let indexToRemove = items.findIndex(obj => obj._id === _id && obj.project == obj.project);

      items.splice(indexToRemove, 1);

      // Update indices for all items following the removed one
      for (let i = indexToRemove; i < items.length; i++) {
        items[i].index = i;
      }

      res.send({ result: 'successfully deleted', '_id': _id });
    } catch (e) {
      // TODO: NEXT STEP IS TO PRINT THE ERRORS FROM CATCH AND FIGURE OUT WHY ITS NOT WORKING.
      res.send({ error: 'could not delete', '_id': _id })
    }
  });
    
};
