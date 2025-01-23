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
exports.up = function(db, callback) {
  db.createTable('categories', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
      notNull: true
    },
    wheel_id: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'categories_wheel_fk',
        table: 'annual_wheels',
        rules: {
          onDelete: 'CASCADE', // Deleting a wheel deletes its categories
          onUpdate: 'CASCADE'
        },
        mapping: 'id'
      }
    },
    name: {
      type: 'varchar',
      length: 100,
      notNull: true
      // Unique constraint per wheel will be handled separately
    },
    default_color: {
      type: 'varchar',
      length: 7,
      notNull: true,
      defaultValue: '#000000' // Default to black if not specified
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
  }, callback);
};

/**
 * Reverse the migration.
 */
exports.down = function(db, callback) {
   db.dropTable('categories', callback);
};

exports._meta = {
  "version": 1
};
