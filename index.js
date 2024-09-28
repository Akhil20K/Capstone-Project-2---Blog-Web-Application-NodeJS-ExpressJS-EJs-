import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";

const app = express();
const port = 8080;

var blogs = [];

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: true }));

Date.prototype.date = function() {
    var mm = this.getMonth() + 1;
    var dd = this.getDate();
    return [(dd>9 ? '' : '0') + dd, (mm>9 ? '' : '0') + mm, this.getFullYear()].join('-');
};

app.get("/", (req, res) => {
    res.render("index.ejs", {blogs: blogs});
});

app.get("/post", (req, res) => {
    res.render("Partials/post.ejs");
})

app.get("/edit", (req, res) => {
    res.render("Partials/edit.ejs", {blogs: blogs});
})


app.post("/submit", (req, res) => {
    var newBlog = {
        id: blogs.length,
        name: req.body.name,
        topic: req.body.topic,
        content: req.body.content,
        date: new Date().date(),
        title: req.body.title,
    }
    blogs.push(newBlog);
    res.redirect("/");
})

app.get("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const blog = blogs.find((x) => x.id === id);
    res.render("Partials/blog.ejs", {blog : blog});
})

app.get("/edit/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const blog = blogs.find((x) => x.id === id);
    console.log(blog);
    res.render("Partials/edit_blog.ejs", {blog: blog});
})

app.patch("/edit/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const original_blog = blogs.find(blog => blog.id === id);
    const updated_blog = {
        id: id,
        name: req.body.name || original_blog.name,
        topic: req.body.topic || original_blog.topic,
        content: req.body.content || original_blog.content,
        date: new Date().date(),
        title: req.body.title || original_blog.title, 
    };
    const index = blogs.findIndex(x => x.id === id);
    console.log(index);
    blogs[index] = updated_blog;
    res.redirect("/");
})

app.delete("/delete/:id", (req, res) => {
    console.log(blogs);
    const id = parseInt(req.params.id);
    const index = blogs.findIndex((x) => x.id === id);
    if(index > -1){
        blogs.splice(index, 1);
        console.log('Deleted Successfully');
    }
    else{
        console.log('Not Found');
    }
    res.redirect("/");
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
