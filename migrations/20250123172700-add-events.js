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
  return db.createTable('events', {
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
        name: 'events_wheel_fk',
        table: 'annual_wheels',
        rules: {
          onDelete: 'CASCADE', // Deleting a wheel deletes its events
          onUpdate: 'CASCADE'
        },
        mapping: 'id'
      }
    },
    category_id: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'events_category_fk',
        table: 'categories',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        mapping: 'id'
      }
    },
    name: {
      type: 'varchar',
      length: 255,
      notNull: true
    },
    start_date: {
      type: 'date',
      notNull: true
    },
    end_date: {
      type: 'date',
      notNull: false,
      defaultValue: null
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
exports.down = function(db) {
  return db.dropTable('events');
};


exports._meta = {
  "version": 1
};
