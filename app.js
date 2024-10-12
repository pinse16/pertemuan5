const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')

const app = express();
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pemweb5'
});

connection.connect((err) =>{
    if(err){
        console.error("Terjadi kesalahan dalam kondeksi ke MySQL:", err.stack);
        return;
    }
    console.log("Koneksi MySQL berhasil dengan id" + connection.threadId)
});

app.set('view engine', 'ejs');

// untuk routing creat, read, update, delete

app.get('/', (req, res) =>{
    const query = 'SELECT * FROM users';
    connection.query(query, (err, results) => {
        res.render('index',{users: results});
    });
});


//creat
app.post('/add', (req, res) => {
    const {name, email, phone} = req.body;
    const query = 'INSERT INTO users (name, email, phone) VALUES (?,?,?)';
    connection.query(query, [name, email, phone], (err, results) =>{
        if(err) throw err;
        res.redirect('/');
    });
});

//update

app.get('/edit/:id', function(req, res) {
    let userId = req.params.id;
    
    // Ambil data user dari database berdasarkan id
    connection.query('SELECT * FROM users WHERE id = ?', [userId], function(err, result) {
        if (err) {
            return res.status(500).send('Database Error');
        }
        if (result.length > 0) {
            // Kirim data user ke view jika ditemukan
            res.render('edit', { user: result[0] });
        } else {
            res.status(404).send('User not found');
        }
    });
});



app.post('/update/:id', (req, res) => {
    const {name, email, phone} = req.body;
    const query = 'UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?';
    connection.query(query, [name, email, phone, req.params.id], (err, result) => {
        if(err) throw err;
        res.redirect('/');
    });
});

// hapus
app.get('/delete/:id', (req, res) =>{
    const query = 'DELETE FROM users WHERE id = ?';
    connection.query(query, [req.params.id], (err, result) => {
        if(err) throw err;
        res.redirect('/');
    });
});




app.listen(3000,() =>{
    console.log("Server berjalan di port 3000, buka web melalui http://localhost:3000")
})