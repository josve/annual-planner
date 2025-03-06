'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};


// The `up` function applies the migration.
exports.up = function(db) {
  return db.createTable('users', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
      notNull: true
    },
    name: {
      type: 'varchar',
      length: 255,
      notNull: true
    },
    email: {
      type: 'varchar',
      length: 255,
      notNull: true,
      unique: true
    },
    is_active: {
      type: 'boolean',
      notNull: false,
      defaultValue: true
    },
    created_at: {
      type: 'datetime',
      notNull: true,
      defaultValue: new String('CURRENT_TIMESTAMP')
    },
    updated_at: {
      type: 'datetime',
      notNull: true,
      defaultValue: new String('CURRENT_TIMESTAMP'),
      onUpdate: new String('CURRENT_TIMESTAMP')
    },
    last_login: {
      type: 'datetime',
      notNull: false
    }
  });
};

// The `down` function reverts the migration.
exports.down = function(db) {
  return db.dropTable('users');
};


exports._meta = {
  "version": 1
};
