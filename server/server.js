import express from "express";
import bodyParser from "body-parser";
import mysql from "mysql";
import cors from "cors";
require("date-format-lite");

const port = 9000;
let app = express();

let db = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'P@ssw0rdMoodle',
	database: 'airhub'
});
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/data", function (req, res) {
	db.query("SELECT * FROM gantt_tasks", function (err, rows) {
		if (err) console.log(err);
		db.query("SELECT * FROM gantt_links", function (err, links) {
			if (err) console.log(err);

			for (var i = 0; i < rows.length; i++) {
				rows[i].start_date = rows[i].start_date.format("DD-MM-YYYY");
				rows[i].open = true;
			}


			res.send({ data: rows, links: { links: links } });
		});
	});
});


app.post("/data/task", function (req, res) {
    console.log(req.body)
	var task = _getTask(req.body);

	db.query("INSERT INTO gantt_tasks(text, start_date, duration, progress, parent,roomid) VALUES (?,?,?,?,?,?)",
		[task.text, task.start_date, task.duration, task.progress, task.parent, task.roomid],
		function (err, result) {
			_sendResponse(res, "inserted", result ? result.insertId : null, err);
		});
});

app.put("/data/task/:id", function (req, res) {
	var sid = req.params.id,
		task = _getTask(req.body);


	db.query("UPDATE gantt_tasks SET text = ?, start_date = ?, duration = ?, progress = ?, parent = ? WHERE id = ?",
		[task.text, task.start_date, task.duration, task.progress, task.parent, sid],
		function (err, result) {
			_sendResponse(res, "updated", null, err);
		});
});

app.delete("/data/task/:id", function (req, res) {
	var sid = req.params.id;
	db.query("DELETE FROM gantt_tasks WHERE id = ?", [sid],
		function (err, result) {
			_sendResponse(res, "deleted", null, err);
		});
});

app.post("/data/link", function (req, res) {
	var link = _getLink(req.body);

	db.query("INSERT INTO gantt_links(source, target, type) VALUES (?,?,?)",
		[link.source, link.target, link.type],
		function (err, result) {
			_sendResponse(res, "inserted", result ? result.insertId : null, err);
		});
});

app.put("/data/link/:id", function (req, res) {
	var sid = req.params.id,
		link = _getLink(req.body);

	db.query("UPDATE gantt_links SET source = ?, target = ?, type = ? WHERE id = ?",
		[link.source, link.target, link.type, sid],
		function (err, result) {
			_sendResponse(res, "updated", null, err);
		});
});

app.delete("/data/link/:id", function (req, res) {
	var sid = req.params.id;
	db.query("DELETE FROM gantt_links WHERE id = ?", [sid],
		function (err, result) {
			_sendResponse(res, "deleted", null, err);
		});
});

function _getTask(data) {
	return {
		text: data.text,
		start_date: data.start_date.date("YYYY-MM-DD"),
		duration: data.duration,
		progress: data.progress || 0,
		parent: data.parent,
        roomid: data.roomid
	};
}

function _getLink(data) {
	return {
		source: data.source,
		target: data.target,
		type: data.type
	};
}


function _sendResponse(res, action, tid, error) {
	if (error) {
		console.log(error);
		action = "error";
	}

	var result = {
		action: action
	};
	if (tid !== undefined && tid !== null)
		result.tid = tid;

	res.send(result);
}


app.listen(port, function () {
	console.log("Server is running on port " + port + "...");
});