var bodyParser      = require("body-parser"),
    methodOverride  = require("method-override"),
    mongoose        = require("mongoose"),
    express         = require("express"),
    app             = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost/restful_todo_app");

const port = process.env.PORT || 3000

var todoSchema = new mongoose.Schema({
    thing: String,
    done: {type: Boolean, default: false},
    created: {type: Date, default: Date.now}
});

var Todo = mongoose.model("Todo", todoSchema);

app.get("/", function(req, res){
    res.redirect("/todos");
})

app.get("/todos", function(req, res){
    Todo.find({}, function(err, todos){
        if (err){
            console.log(err);
        } else {
            res.render("index", {todos:todos});
        }
    });
});

app.get("/todos/new", function(req, res){
    res.render("new");
});

app.post("/todos", function(req, res){
    Todo.create(req.body.todo, function(err, newTodo){
        if (err){
            console.log(err);
            res.render("new");
        } else {
            res.redirect("/todos");
        }
    })
})

app.get("/todos/:id", function(req, res){
    Todo.findById(req.params.id, function(err, foundTodo){
        if (err){
            console.log(err);
            res.send("Site not found");
        } else (
            res.render("show", {todo: foundTodo}));
    });
})

app.get("/todos/:id/edit", function(req, res){
    Todo.findById(req.params.id, function(err, foundTodo){
        if (err){
            console.log(err);
            res.send("Site not found");
        } else {
            res.render("edit", {todo: foundTodo});
        }
    });
});

app.put("/todos/:id", function(req, res){
    Todo.findByIdAndUpdate(req.params.id, req.body.todo, function(err, updatedTodo){
        if (err){
            console.log(err);
            res.redirect("/todos");
        } else {
            res.redirect("/todos/" + req.params.id);
        }
    });
});

// DELETE
app.delete("/todos/:id", function(req, res){
    Todo.findByIdAndRemove(req.params.id, function(err){
       if (err){
           res.redirect("/todos");
       } else {
           res.redirect("/todos");
       }
    });
});

app.listen(port, function(){
    console.log("Serving Todo App..");
});