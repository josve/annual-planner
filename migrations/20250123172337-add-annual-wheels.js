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
  return db.createTable('annual_wheels', {
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
    description: {
      type: 'text',
      notNull: false
    },
    user_id: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'annual_wheels_user_fk',
        table: 'users',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    },
    year: {
      type: 'int',
      notNull: true
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
  return db.dropTable('annual_wheels');
};

exports._meta = {
  "version": 1
};
