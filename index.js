const express = require('express');
const app = express();
const port = 3000;

const expressLayouts = require('express-ejs-layouts');
const { redirect } = require('express/lib/response');
const res = require('express/lib/response');

var moment = require('moment');

const methodOverride = require('method-override');
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');
app.use(expressLayouts);

const mysql = require('mysql');

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "ayumiwedding",
    multipleStatements: true
});

app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

app.listen(port, (req, res) => {
    console.log(`Apps running on http://localhost:${port}`);
});

app.get('/', (req, res) => {
    res.render('index', {
        title: 'Dashboard',
        layout: 'layouts/dashboard'
    });
});

app.delete('/hapus', (req, res) => {
    const sql = `DELETE FROM data_clients WHERE id = ${req.body.id}`;
    con.query(sql, (err, result) => {
        if(err){
            res.send("gagal");
        }else{
            res.redirect('/invitation');
        }
    });
});

app.put('/status', (req, res) => {
    const sql = `UPDATE data_clients SET status = ${req.body.status} WHERE id = ${req.body.id}`;
    con.query(sql, (err, result) => {
        if(err){
            res.send("Gagal");
        }else{
            res.redirect('/invitation');
        }
    });
});

app.put('/update', (req, res) => {
    const sql = `UPDATE data_clients SET url = '${req.body.url}', nama_pria = '${req.body.nama_pria}', urutan_pria = '${req.body.urutan_pria}', nama_bapak_pria = '${req.body.nama_bapak_pria}', nama_ibu_pria = '${req.body.nama_ibu_pria}', nama_wanita = '${req.body.nama_wanita}', urutan_wanita = '${req.body.urutan_wanita}', nama_bapak_wanita = '${req.body.nama_bapak_wanita}', nama_ibu_wanita = '${req.body.nama_ibu_wanita}', akad_tanggal = '${req.body.akad_tanggal}', akad_waktu = '${req.body.akad_waktu}', akad_tempat = '${req.body.akad_tempat}', resepsi_tanggal = '${req.body.resepsi_tanggal}', resepsi_waktu = '${req.body.resepsi_waktu}', resepsi_tempat = '${req.body.resepsi_tempat}', lokasi_google_maps = '${req.body.lokasi_google_maps}', status = '${req.body.status}' WHERE id = ${req.body.id}`;
    con.query(sql, (err, result) => {
        if(err){
            res.send(err);
        }else{
            res.redirect('/invitation');
        }
    });
});

app.get('/registrasi', (req, res) => {
    res.render('tambah', {
        title: 'Tambah Data Baru',
        layout: 'layouts/dashboard'
    });
});

app.post('/tambah', (req, res) => {
    const sql = `INSERT INTO data_clients (id, url, nama_pria, urutan_pria, nama_bapak_pria, nama_ibu_pria, nama_wanita, urutan_wanita, nama_bapak_wanita, nama_ibu_wanita, akad_tanggal, akad_waktu, akad_tempat, resepsi_tanggal, resepsi_waktu, resepsi_tempat, lokasi_google_maps, status) VALUES (NULL, '${req.body.url}', '${req.body.nama_pria}', '${req.body.urutan_pria}', '${req.body.nama_bapak_pria}', '${req.body.nama_ibu_pria}', '${req.body.nama_wanita}', '${req.body.urutan_wanita}', '${req.body.nama_bapak_wanita}', '${req.body.nama_ibu_wanita}', '${req.body.akad_tanggal}', '${req.body.akad_waktu}', '${req.body.akad_tempat}', '${req.body.resepsi_tanggal}', '${req.body.resepsi_waktu}', '${req.body.resepsi_tempat}', '${req.body.lokasi_google_maps}', '${req.body.status}')`;
    con.query(sql, (err, result) => {
        if(err){
            res.send(req.body);
        }else{
            res.redirect('/invitation');
        }
    });
});

app.get('/invitation', (req, res) => {
    const sql = [
        `SELECT * FROM data_clients`,
        `SELECT * FROM data_clients WHERE status = 1`,
        `SELECT * FROM data_clients WHERE status = 0`,
    ];
    con.query(sql.join(';'), (err, result) => {
        res.render('invitation', {
            title: 'Daftar Undangan',
            layout: 'layouts/dashboard',
            contacts: result[0],    
            aktif: result[1],
            tidakAktif: result[2]
        });
    });
});

app.get('/detail/:id', (req, res) => {
    const sql = `SELECT * FROM data_clients WHERE id = "${req.params.id}"`;
    con.query(sql, (err, result) => {
        res.render('detail', {
            title: 'Detail Data',
            layout: 'layouts/dashboard',
            content: result[0],
            moment
        });
    });
});

app.get('/wedding/:url', (req, res) => {
    const sql = `SELECT * FROM data_clients WHERE url = "${req.params.url}" AND status = 1`;
    con.query(sql, (err, result) => { 
        res.render('wedding', {
            layout: 'layouts/blanko',
            content: result
        });
    });
});