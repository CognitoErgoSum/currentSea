const express = require('express');
const debug = require('debug')('app:userAccountsRoutes');
const passport = require('passport');
const db = require('./db');
const { validateEmail, MD5 } = require('./validationHelperMethods/account');

const userAccountRouter = express.Router();


module.exports = function router() {
  // UserAccount Flows
  userAccountRouter.route('/')
    .get((req, res) => {
      // Render respective html, ejs, or pug
      res.send('Accounts');
      db.query('SELECT * FROM user_table where ut_user_id = "Test2" ', (err, results, fields) => {
        if (err) res.send(err);
        debug(results.length);
      });
    });

  userAccountRouter.route('/register')
    .post((req, res) => {
      const {
        username, firstName, lastName, emailID, password, confirmPassword,
      } = req.body;
      if (password === '') {
        res.status(401).json({ message: 'No password entered' });
      }
      if (password !== confirmPassword) {
        res.status(401).json({ message: 'Passwords do not match' });
      }
      if (!validateEmail(emailID)) {
        res.status(401).json({ message: 'Invalid email' });
      } else {
        db.query('SELECT ut_user_id FROM user_table WHERE ut_email=?', [emailID], (err, results, fields) => {
          if (results.length === 0) {
            db.query('SELECT ut_user_id FROM user_table WHERE ut_user_id=?', [username], (err, results2, fields) => {
              if (results2.length === 0) {
                db.query('INSERT INTO user_table (ut_user_id, ut_password, ut_first_name, ut_last_name, ut_email) VALUES (?, ?, ?, ?, ?)',
                  [username, MD5(username + password), firstName, lastName, emailID], (err, results3, fields) => {
                    res.status(201).send({ userID: username });
                  });
              } else {
                res.status(401).json({ message: 'Username already exists' });
              }
            });
          } else {
            res.status(401).json({ message: 'Email already exits' });
          }
        });
      }
    });

  userAccountRouter.route('/login')
    .post((req, res, next) => {
      passport.authenticate('local', (err, user, info) => {
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });
        req.login(user, (err) => {
          return res.status(200).json({ message: 'user authenticated' });
        });
      })(req, res, next);
    });

  userAccountRouter.route('/logout')
    .get((req, res) => {
    });

  userAccountRouter.route('/change_password')
    .post((req, res) => {
      const { id, password, newPassword } = req.body;
      db.query('SELECT * FROM user_table where ut_user_id=? or ut_email=?', [id, id], (err, results, fields) => {
        if (results.length !== 0) {
          const user = JSON.parse(JSON.stringify(results[0]));
          const { utUserId, utEmail, utPassword } = user;
          if ((id === utUserId || id === utEmail)
            && (MD5(utUserId + password) === utPassword)) {
            const { confirmPassword } = req.body;
            if (confirmPassword === newPassword) {
              db.query('UPDATE user_table SET ut_password = ? WHERE ut_password = ? AND ut_user_id = ?', [MD5(utUserId + newPassword),
              MD5(utUserId + password), utUserId], (results) => {
                debug(results);
              });
            } else {
              res.status(401).json({ message: 'Please ensure that your confirming password matches your new password.' });
            }
          } else {
            res.status(401).json({ message: 'Invalid id or password.' });
          }
        } else {
          res.status(401).json({ message: 'Id not found.' });
        }
      });
    });
    
  userAccountRouter.route('/loggedin').get((req, res) => {
    if (req.user) {
      res.status(200).json({ message: 'OK' });
    } else {
      res.status(200).json({ message: 'NOK' });
    }
  });
  return userAccountRouter;
};
