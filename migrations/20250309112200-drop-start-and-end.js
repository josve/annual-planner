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
  // Drop the start_date and end_date columns from the events table.
  var dropColumnsSql = "ALTER TABLE events DROP COLUMN start_date, DROP COLUMN end_date;";
  db.runSql(dropColumnsSql, callback);
};

exports.down = function(db, callback) {
  // Re-add the start_date column (as DATE NOT NULL)
  var addStartDateSql = "ALTER TABLE events ADD COLUMN start_date DATE NOT NULL;";
  db.runSql(addStartDateSql, function(err) {
    if (err) return callback(err);
    // Re-add the end_date column (as DATE, allowing NULL with a default of NULL)
    var addEndDateSql = "ALTER TABLE events ADD COLUMN end_date DATE DEFAULT NULL;";
    db.runSql(addEndDateSql, callback);
  });
};

exports._meta = {
  "version": 1
};