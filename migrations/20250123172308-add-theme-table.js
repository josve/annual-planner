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

/**
 * Apply the migration.
 */
exports.up = function(db) {
  return db.createTable('themes', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
      notNull: true
    },
    name: {
      type: 'varchar',
      length: 100,
      notNull: true,
      unique: true
    },
    description: {
      type: 'text',
      notNull: false
    },
    month_arc_color: {
      type: 'varchar',
      length: 7,
      notNull: true,
      defaultValue: '#53A045'
    },
    event_arc_color: {
      type: 'varchar',
      length: 7,
      notNull: true,
      defaultValue: '#F6E400'
    },
    label_color: {
      type: 'varchar',
      length: 7,
      notNull: true,
      defaultValue: '#000000'
    },
    background_color: {
      type: 'varchar',
      length: 7,
      notNull: true,
      defaultValue: '#FFFFFF'
    },
    category_colors: {
      type: 'json',
      notNull: false,
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
    }
  });
};

/**
 * Reverse the migration.
 */
exports.down = function(db) {
  return db.dropTable('themes');
};

exports._meta = {
  "version": 1
};
