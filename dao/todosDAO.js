const mysql = require('mysql2/promise');
const dbconfig = require('../config/database.js');
const pool = mysql.createPool(dbconfig);

exports.getTodos = async () => {
  try {
    const connection = await pool.getConnection(async conn => conn);
    try {
      const rows = await connection.query(
        `SELECT id, title, IF(completed, 'true', 'false') as completed FROM Todo`
      );
      connection.release();
      return rows;
    } catch (err) {
      connection.release();
      return 'Query Error';
    }
  } catch (error) {
    console.error(error);
  }
};

exports.getTodo = async id => {
  try {
    const connection = await pool.getConnection(async conn => conn);
    try {
      const [rows] = await connection.query('SELECT * FROM Todo WHERE id = (?)', [id]);
      connection.release();
      return rows;
    } catch (err) {
      connection.release();
      return 'Query Error';
    }
  } catch (error) {
    console.error(error);
  }
};

exports.createTodo = async ({ title, completed = false } = {}) => {
  try {
    const connection = await pool.getConnection(async conn => conn);
    try {
      const [rows] = await connection.query('INSERT INTO Todo(title, completed) values (?, ?)', [
        title,
        completed
      ]);
      connection.release();
      return rows;
    } catch (err) {
      connection.release();
      return 'Query Error';
    }
  } catch (error) {
    console.error(error);
  }
};

exports.removeTodo = async id => {
  try {
    const connection = await pool.getConnection(async conn => conn);
    try {
      const [rows] = await connection.query('DELETE FROM Todo WHERE id=(?) LIMIT 1', [id]);
      connection.release();
      return rows;
    } catch (err) {
      connection.release();
      return 'Query Error';
    }
  } catch (error) {
    console.error(error);
  }
};

exports.updateTodo = async ({ id, title }) => {
  try {
    const connection = await pool.getConnection(async conn => conn);
    try {
      const [rows] = await connection.query('UPDATE Todo SET title = (?) WHERE id = (?)', [
        title,
        id
      ]);
      connection.release();
      return rows;
    } catch (err) {
      connection.release();
      return 'Query Error';
    }
  } catch (error) {
    console.error(error);
  }
};

exports.toggleTodo = async id => {
  try {
    const connection = await pool.getConnection(async conn => conn);
    try {
      const [
        rows
      ] = await connection.query(
        'UPDATE Todo SET completed = not (SELECT completed FROM(Select completed as no from Todo WHERE id=(?)) as TodoCompleted) WHERE id=(?)',
        [id, id]
      );
      connection.release();
      return rows;
    } catch (err) {
      connection.release();
      return 'Query Error';
    }
  } catch (error) {
    console.error(error);
  }
};
