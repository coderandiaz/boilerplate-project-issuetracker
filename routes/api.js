'use strict';
const { v1: uuidv1 } = require('uuid');

module.exports = function (app) {

  const data = [];
  
  function filteringCustom(item, possibleFilters, project) {
    const open = possibleFilters.open;
    const assigned_to = possibleFilters.assigned_to
    const issue_title = possibleFilters.issue_title;
    const issue_text = possibleFilters.issue_text;
    const created_on = possibleFilters.created_on;
    const updated_on = possibleFilters.updated_on;
    const created_by = possibleFilters.created_by;
    const status_text = possibleFilters.status_text;

    let filteringCriteria = item.project == project;
    if (open) {
      filteringCriteria = filteringCriteria && item.open == open;
    }
    if (assigned_to) {
      filteringCriteria = filteringCriteria && item.assigned_to == assigned_to;
    }
    if (issue_title) {
      filteringCriteria = filteringCriteria && item.issue_title == issue_title;
    }
    if (issue_text) {
      filteringCriteria = filteringCriteria && item.issue_text == issue_text;
    }
    if (created_on) {
      filteringCriteria = filteringCriteria && item.created_on == created_on;
    }
    if (updated_on) {
      filteringCriteria = filteringCriteria && item.updated_on == updated_on;
    }
    if (created_by) {
      filteringCriteria = filteringCriteria && item.created_by == created_by;
    }
    if (status_text) {
      filteringCriteria = filteringCriteria && item.status_text == status_text;
    }
    return filteringCriteria
  }

  app.route('/api/issues/:project').get(function (req, res){
      const project = req.params.project;
      res.send(
        data.filter((item) => filteringCustom(item, req.query, project))
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
        return
      }

      const issue_title = req.body.issue_title;
      const issue_text = req.body.issue_text;
      const created_by = req.body.created_by;
      const assigned_to = req.body.assigned_to;
      const status_text = req.body.status_text;
      const closing = req.body.open;

      if (!issue_title && !issue_text && !created_by && !assigned_to && !status_text && !closing) {
        res.send({ error: 'no update field(s) sent', '_id': _id });
        return
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

      if(closing) {
        item["open"] = false;
      }

      item["updated_on"] = new Date();
      data[item["index"]] = item;
      res.send({ result: 'successfully updated', '_id': _id });
    } catch (e) {
      // TODO: NEXT STEP IS TO PRINT THE ERRORS FROM CATCH AND FIGURE OUT WHY ITS NOT WORKING.
      console.log(e)
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
