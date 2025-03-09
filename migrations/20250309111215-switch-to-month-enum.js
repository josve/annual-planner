'use strict';

var dbm;
var type;
var seed;

exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, callback) {
  // Step 1: Add the event_month column as an ENUM via raw SQL
  var addColumnSql = "ALTER TABLE events ADD COLUMN event_month ENUM('January','February','March','April','May','June','July','August','September','October','November','December') NULL;";
  db.runSql(addColumnSql, function(err) {
    if (err) return callback(err);

    // Step 2: Populate event_month with the month name extracted from start_date
    var updateSql = "UPDATE events SET event_month = MONTHNAME(start_date);";
    db.runSql(updateSql, callback);
  });
};

exports.down = function(db, callback) {
  // Reverse the migration by dropping the event_month column
  var dropColumnSql = "ALTER TABLE events DROP COLUMN event_month;";
  db.runSql(dropColumnSql, callback);
};

exports._meta = {
  "version": 1
};