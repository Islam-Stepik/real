"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var db_1 = require("./scripts/db");
var database = new db_1.db(); // Import Datenbank-Klasse
// Zusätzliche Libraries =================//
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var mysql = require('mysql');
var moment = require('moment');
// =======================================//
var app = express(); // Webframework Express.js
var loggedIn = false; // Admin - Login-Status
var userloggedIn = false; // User - Login-Status
var userloginID; // ID des momentan eingeloggten Users
var IDkontowahl = null; // Auswahl User auf 'timesheets'-Seite
var monthChoice; // Auswahl des Zeitkonto-Monats
var yearChoice; // Auswahl des Zeitkonto-Jahres
var monthTotalDays;
var todayDate = moment().format('DD.MM.YYYY'); // akt. Datum
var todayTime = moment().format('HH:mm:ss'); // akt. Zeit
// Datenbank-Verbindung ===========================//
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'zeiterfassung',
    multipleStatements: true,
    debug: false
});
//==================================================//
// let logger = function logger(req, res, next) {
//     console.log('Server arbeitet...');
//     next();
//
// }
//
// app.use(logger);
// Einstellungen Webframework ==========================//
// View Engine:
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// Body-Parser Middleware:
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Static Path:
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static('public'));
//=====================================================//
//VVVVVVVVVVVVVVVVVVVVVVVVV
////// USER-Routen /////////
//VVVVVVVVVVVVVVVVVVVVVVVVV
// GET - Aufrufe User =============================
app.get('/', function (req, res) {
    userloggedIn = false;
    res.redirect('/index.ejs');
});
app.get('/index.ejs', function (req, res) {
    userloggedIn = false;
    res.render('index');
});
app.get('/userpage.ejs', function (req, res) {
    var tag = moment().format('YYYY-MM-DD');
    if (userloggedIn) {
        var sql = 'SELECT vorname FROM userdaten WHERE ID = ?; ' + // 0 Begrüßung
            'SELECT * FROM zeitkonten WHERE userID = ? AND tag = ? ; ' + // 1 Anmeldebutton
            'SELECT * FROM zeitkonten WHERE userID = ? AND tag = ? ' + // 2 Abmeldebutton/Logoutzeit
            'AND logout IS NOT NULL; ' + // 2
            'SELECT *, DATE_FORMAT(tag, "%d.%m.%Y") AS dertag FROM zeitkonten ' + // 3 letzter Arbeitstag
            'WHERE userID = ? ORDER BY tag desc LIMIT 1; ' + // 3
            'SELECT * FROM zeitkonten WHERE userID = ? AND TAG = ? ;' + // 4 heutige Loginzeit
            'SELECT *, DATE_FORMAT(tag, "%d.%m.%Y") AS vergessen FROM zeitkonten ' + // 5 Logout vergessen
            'WHERE userID = ? AND tag != ? AND logout IS NULL ;'; // 5
        try {
            // Datenbank-Queries (für Nummern siehe SQL-Variable)
            var query = connection.query(sql, [userloginID, userloginID, tag, userloginID, tag, userloginID,
                userloginID, tag, userloginID, tag], function f(error, results) {
                res.render('userpage', {
                    dataname: results[0],
                    datalogin: results[1],
                    datalogout: results[2],
                    dataworkday: results[3],
                    dataLoginHeute: results[4],
                    dataKeinLogout: results[5]
                });
            });
        }
        catch (e) {
            console.log('Fehler');
        }
    }
    else {
        res.redirect('index.ejs');
    }
});
// POST-Aufrufe User ================================
// LOGIN:
app.post('/index.ejs', function (req, res) {
    var username = req.body.user;
    var pw = req.body.pw;
    var sql = 'SELECT ID FROM userdaten WHERE username = ? AND passwort = ? ';
    var query = connection.query(sql, [username, pw], function f(error, results) {
        try {
            if (results[0].ID > 0) {
                userloginID = results[0].ID;
                userloggedIn = true;
                res.redirect('/userpage.ejs');
            }
        }
        catch (e) {
            console.log('falscher login');
            res.redirect('/index.ejs');
        }
    });
});

app.post('/userpage.ejs', function (req, res) {
    if (req.body.loginButton) {
        database.newWorkDay(connection, userloginID);
        res.redirect('/index.ejs');
    }
    else if (req.body.logoutButton) {
        database.endWorkDay(connection, userloginID);
        res.redirect('/index.ejs');
    }
    else {
        res.redirect('/index.ejs');
    }
});
//VVVVVVVVVVVVVVVVVVVVVVVVVVV
/////// ADMIN-Routen ////////
//VVVVVVVVVVVVVVVVVVVVVVVVVVV
// GET-Aufrufe Admin =============================================
app.get('/admin.ejs', function (req, res) {
    loggedIn = false;
    res.render('admin');
});
app.get('/overview.ejs', function (req, res) {
    if (loggedIn) {
        res.render('overview');
    }
    else {
        res.redirect('/admin.ejs');
    }
});
app.get('/users.ejs', function (req, res) {
    if (loggedIn) {
        var sql = 'select * from positionen; select * from standorte';
        var query = connection.query(sql, function (err, results) {
            if (err)
                throw err;
            res.render('users', {
                dataPos: results[0],
                dataLoc: results[1]
            });
        });
    }
    else {
        res.redirect('/admin.ejs');
    }
});

app.get('/usersAnlegen.ejs', function (req, res) {
    if (loggedIn) {
        var sql = 'select * from positionen; select * from standorte';
        var query = connection.query(sql, function (err, results) {
            if (err)
                throw err;
            res.render('usersAnlegen', {
                dataPos: results[0],
                dataLoc: results[1]
            });
        });
    }
    else {
        res.redirect('/admin.ejs');
    }
});


app.get('/usersBearbeiten.ejs', function (req, res) {
    if (loggedIn) {
        var sql = 'SELECT t1.*, t2.standort as standort, t3.position as position ' +
            'from userdaten as t1, standorte as t2, positionen as t3 ' +
            'where t2.ID = t1.standortID and t3.ID = t1.positionID ' +
            'order by t1.ID';
        var query = connection.query(sql, function (err, results) {
            if (err)
                throw err;
            res.render('usersBearbeiten', {
                userAll: results
            });
        });
    }
    else {
        res.redirect('/admin.ejs');
    }
});
app.get('/locations.ejs', function (req, res) {
    if (loggedIn) {
        var id = req.body.id;
        var sql = 'SELECT * FROM standorte; SELECT standort FROM standorte WHERE ID = ?';
        var query = connection.query(sql, [id], function (err, results) {
            if (err)
                throw err;
            res.render('locations', {
                location: results[0],
                getlocation: results[1]
            });
        });
    }
    else {
        res.redirect('/admin.ejs');
    }
});
app.get('/locationsAnlegen.ejs', function (req, res) {
    if (loggedIn) {
        res.render('locationsAnlegen');
    }
    else {
        res.redirect('/admin.ejs');
    }
});
app.get('/jobs.ejs', function (req, res) {
    if (loggedIn) {
        var id = req.body.id;
        var sql = 'SELECT * FROM positionen; SELECT position FROM positionen WHERE ID = ?';
        var query = connection.query(sql, [id], function (err, results) {
            if (err)
                throw err;
            res.render('jobs', {
                jobs: results[0],
                getjobs: results[1]
            });
        });
    }
    else {
        res.redirect('/admin.ejs');
    }
});
app.get('/timesheets.ejs', function (req, res) {
    if (loggedIn) {
        var sql = 'SELECT DISTINCT t1.userID, t2.vorname AS vorname, t2.nachname AS nachname ' +
            'FROM zeitkonten AS t1, userdaten as t2 ' +
            'WHERE t1.userID = t2.ID; ';
        var query = connection.query(sql, function (err, results) {
            if (err)
                throw err;
            res.render('timesheets', {
                kontousers: results
            });
        });
    }
    else {
        res.redirect('/admin.ejs');
    }
});
app.get('/months.ejs', function (req, res) {
    if (loggedIn) {
        var sql = 'SELECT DISTINCT DATE_FORMAT(tag, "%m") AS monat, DATE_FORMAT(tag, "%Y") AS jahr ' +
            'FROM zeitkonten WHERE userID = ? ORDER BY jahr DESC, monat DESC';
        var query = connection.query(sql, [IDkontowahl], function (err, results) {
            if (err)
                throw err;
            res.render('months', {
                kontomonths: results
            });
        });
    }
    else {
        res.redirect('/admin.ejs');
    }
});
app.get('/timesheetTable.ejs', function (req, res) {
    if (loggedIn) {
        var sql = 'SELECT DATE_FORMAT(tag, "%d.%m.%Y") AS datum, login, logout, ' +
            '(TIME_TO_SEC(TIMEDIFF(logout, login ))) AS arbeitssekunden ' +
            'FROM zeitkonten WHERE userID = ? AND MONTH(tag) = ? AND YEAR(tag) = ? ' +
            'ORDER BY DAY(tag); ' +
            'SELECT DAY(LAST_DAY(tag)) AS tage FROM zeitkonten ' +
            'WHERE userID = ? AND MONTH (tag) = ? AND YEAR (tag) = ? AND logout IS NOT NULL ' +
            'LIMIT 1; ';
        var query = connection.query(sql, [IDkontowahl, monthChoice, yearChoice, userloginID, monthChoice, yearChoice, userloginID], function (error, results) {
            if (error)
                throw error;
            res.render('timesheetTable', {
                data: results[0],
                days: results[1]
            });
        });
    }
    else {
        res.redirect('/admin.ejs');
    }
});
// POST - Aufrufe Admin ====================================
// LOGIN:
app.post('/admin.ejs', function (req, res) {
    var admin = req.body.admin;
    var pw = req.body.pw;
    var sql = 'SELECT ID FROM admin WHERE admin = ? AND passwort = ? ';
    var query = connection.query(sql, [admin, pw], function f(error, results) {
        try {
            if (results[0].ID > 0) {
                loggedIn = true;
                res.redirect('/overview.ejs');
            }
        }
        catch (e) {
            console.log('falscher login');
            res.redirect('/admin.ejs');
        }
    });
});
app.post('/locations.ejs', function (req, res) {
    if (loggedIn) {
        var standort = req.body.standortNeu;
        database.newLocation(connection, standort);
        res.redirect('/locations.ejs');
    }
    else {
        res.redirect('/admin.ejs');
    }
});
app.post('/jobs.ejs', function (req, res) {
    if (loggedIn) {
        var position = req.body.positionNeu;
        database.newPosition(connection, position);
        res.redirect('/jobs.ejs');
    }
    else {
        res.redirect('/admin.ejs');
    }
});
app.post('/users.ejs', function (req, res) {
    if (loggedIn) {
        var vorname = req.body.vorname;
        var nachname = req.body.nachname;
        var position = req.body.position;
        var standort = req.body.standort;
        var telefon = req.body.telefon;
        var mail = req.body.mail;
        var user = new Array(vorname, nachname, position, standort, telefon, mail);
        database.newUser(connection, user);
        res.redirect('/users.ejs');
    }
    else {
        res.redirect('/admin.ejs');
    }
});

app.post('/usersAnlegen.ejs', function (req, res) {
    if (loggedIn) {
        var vorname = req.body.vorname;
        var nachname = req.body.nachname;
        var position = req.body.position;
        var standort = req.body.standort;
        var telefon = req.body.telefon;
        var mail = req.body.mail;
        var user = new Array(vorname, nachname, position, standort, telefon, mail);
        database.newUser(connection, user);
        res.redirect('/usersAnlegen.ejs');
    }
    else {
        res.redirect('/admin.ejs');
    }
});

app.post('/timesheets.ejs', function (req, res) {
    if (req.body.userChoice != 'default') {
        IDkontowahl = req.body.userChoice;
        res.redirect('months.ejs');
    }
    else {
        res.redirect('timesheets.ejs');
    }
});
app.post('/months.ejs', function (req, res) {
    if (req.body.monthChoice != 'default') {
        var choice = req.body.monthChoice;
        monthChoice = choice.slice(0, 2);
        yearChoice = choice.slice(2, 6);
        res.redirect('timesheetTable.ejs');
    }
    else {
        res.redirect('months.ejs');
    }
});
// ==============================================================================//
//======= App Initialisierung ===================================================//
try {
    // NodeJS Server starten
    app.listen(666, function () {
        console.log('Demon erscheint auf Port 666 ...');
        console.log(todayDate + ' ' + todayTime + ' Hallo Meister!');
        // mit Datenbank verbinden
        try {
            connection.connect(function (err) {
                if (err)
                    throw err;
                console.log("Datenbankverbindung erfolgreich! *smile*");
            });
        }
        catch (e) {
            console.log('Datenbankverbindung gescheitert! *facepalm*');
        }
    });
}
catch (e) {
    console.log('Server konnte nicht gestartet werden. *cry*');
}
