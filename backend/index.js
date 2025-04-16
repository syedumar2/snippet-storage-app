const express = require('express')
const jwt = require("jsonwebtoken");
const cors = require('cors');

//prisma client import
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt"); //bcrypt for password hashing

const app = express()
const port = 3001

const path = require("path");
const fs = require("fs");

//prisma client init
const prisma = new PrismaClient();

const SECRET_KEY = "mysecretkey"
const UPLOAD_DIR = path.join(__dirname, "uploads"); //Ensures compatibility across different operating systems
const SALT_ROUNDS = 10; //encrypt pswrd 10 times


app.use(cors());
app.listen(port, () => {
    console.log(`File sharing system app listening on port ${port}`)
})



app.use(express.json()); // must for parsing json 


// auth middleware
const authToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1]; //Fetches the Authorization header from the incoming request.
    //splits header val at space [1] accesses 2nd elem after split ie key
    if (!token) {
        return res.status(401).send("Acces Denied");
    }
    jwt.verify(token, SECRET_KEY, (err, user) => { //verifies token against secret key
        if (err) return res.status(403).send("Invalid token"); //if verified decoded user data willl be avail in user
        req.user = user;
        next();
    });
};

//Signup function
app.post("/signup", async (req, res) => {  //returns a JWT token if authentication is successful
    const { username, password } = req.body; //json data inputted in req body 
    if (!username && !password) {
        res.status(400).send("username and password required");
    }

    const existinguser = await prisma.user.findUnique({
        where: {
            username,
        }
    });
    if (existinguser) {
        return res.status(400).send("user already exists");
    }
    else {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const user = await prisma.user.create({
            data: { //data is a method name
                username,
                password: hashedPassword,
            },
        });
        res.status(201).json({ msg: "User Created", user });
    }


});
//log in func
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: {
                username,
            },
        });
        
        if (!user) {
            res.status(401).send("Invalid Credentials");
        }
        const pswrd = await bcrypt.compare(password, user.password);

        if (!pswrd) {
            res.status(401).send("Invalid Credentials");
        }
        const token = jwt.sign({ username }, SECRET_KEY, {
            expiresIn: "8h",
        });
        res.json({ token });

    }
    catch (error) {
        console.error(error);

        res.status(500).send("Internal Server Error");

    }
});



//testing token
app.get('/testing', authToken, (req, res) => {
    res.send('Hello World!')
})

//File sharing system crud 

//create
app.post('/files/create', authToken, async (req, res) => {
    const { filename, content } = req.body;
    const username = req.user.username; //token?
    try {
        const user = await prisma.user.findUnique({
            where: {
                username,
            },
        });
        console.log(user)
        if (user) { //check if user exists 1st if
            if (filename && content) { //then file and content inserted 2nd if
                const file = await prisma.file.create({ //create file
                    data: {
                        filename,
                        content,
                        userId: user.id,
                    },
                }); //end of const file
                console.log(file)
                res.status(201).json(file); //return it to user
            } //end of 2nd if
            else {
                res.status(404).send("Filename and content required");
            } // end of else


            //end of 1st if
        } else {
            res.status(404).send("User not found ")
        }

    }//end of try

    catch (error) {
        console.error(error);

        res.status(500).send("Internal Server Error");

    }

});

app.get('/files', authToken, async (req, res) => {
    const username = req.user.username;
    try {
        const user = await prisma.user.findUnique({
            where: {
                username,
            },
        });
        if (!user) { //check if user exists 1st if
            return res.status(404).send("User not found");
        }
        const files = await prisma.file.findMany({
            where: {
                userId: user.id,
            },
        })
        if (!files) {
            return res.status(404).send(`No files under ${username} found`);
        }
        res.status(201).json(files);

    }//end of try

    catch (error) {
        console.error(error);

        res.status(500).send("Internal Server Error");

    }

}); //list all files


//read
app.get('/read/:id', authToken, async (req, res) => {
    const id = parseInt(req.params.id);
    const username = req.user.username;
    try {
        // Fetch user
        const user = await prisma.user.findUnique({
            where: { username },
        });

        if (!user) {
            return res.status(404).send("User not found");
        }
        console.log(id);
        const file = await prisma.file.findFirst({ //find unique only works for primary key/unique key
            where: {
                id,
                userId: user.id,
            },
        });
        if (!file) {
            return res.status(404).send("File not found");
        }
        res.status(201).json(file);
        console.log(file);

    }//end of try

    catch (error) {
        console.error(error);

        res.status(500).send("Internal Server Error");

    }


});

//delete
app.delete('/delete/:id', authToken, async (req, res) => {
    const { id } = parseInt(req.params);
    const username = req.user.username;

    try {
        // Fetch user
        const user = await prisma.user.findUnique({
            where: { username },
        });

        if (!user) {
            return res.status(404).send("User not found");
        }

        const file = await prisma.file.findFirst({ //find unique only works for primary key/unique key
            where: {
                id,
                userId: user.id,
            },
        });
        if (!file) {
            return res.status(404).send("File not found");
        }
        const deletedFile = await prisma.file.delete({
            where: { id: file.id },
        });
        return res.status(200).json({
            message: "File deleted successfully",
            deleted: file,  // Now it includes the deleted file details
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});


// update

app.put('/update/:id', authToken, async (req, res) => {
    const id = parseInt(req.params.id);
    const { filename, content } = req.body;
    const username = req.user.username;
    if (isNaN(id)) {
        return res.status(400).send("Invalid file ID");
    }
    if (!filename && !content) {
        return res.status(400).send("At least one field (filename or content) is required");
    }

    try {
        // Fetch user
        const user = await prisma.user.findUnique({
            where: { username },
        });

        if (!user) {
            return res.status(404).send("User not found");
        }

        if (!content) {
            return res.status(400).send("Content is required");
        }
        if (!filename) {
            return res.status(400).send("Title is required");
        }

        // Update file only if it belongs to the user
        const file = await prisma.file.update({
            where: {
                id: id,
                userId: user.id
            },
            data: {
                filename: filename || undefined, // Prevent overwriting with empty string
                content: content || undefined // Prevent overwriting with empty string
            }
        });
        console.log(file);

        if (!file) {
            return res.status(404).send("File not found or does not belong to user");
        }

        res.status(200).json({ message: "File updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});


//--------------------------------------------------------------------------------------------

///delete user request
app.delete("/user/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const userExists = await prisma.user.findUnique({
            where: { id }
        });

        if (!userExists) {
            return res.status(404).json({ message: "User not found" });
        }

        // Use transaction to delete both user and files atomically
        await prisma.$transaction([
            prisma.file.deleteMany({
                where: { userId: id }
            }),
            prisma.user.delete({
                where: { id }
            })
        ]);

        res.send("User and its files have been deleted");

    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});



//update user request
app.put("/user/:id", async (req, res) => {
    const id = parseInt(req.params.id); //retrieve id
    const { username, password } = req.body; //and uname and pswrd
    try {
        // Check if the user exists
        const user = await prisma.user.findFirst({
            where: { id },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Hash the password before updating
        const hashedPassword = password ? await bcrypt.hash(password, SALT_ROUNDS) : user.password;
        //password ? checks if pswrd is provided in req.body    //user.pswrd if no new pswrd provided keeps existing pswrd in db
        const updateduser = await prisma.user.update({ //if it exists update its details
            where: { id },
            data: {
                username,
                password: hashedPassword,
            },
        });
        return res.status(200).json({
            message: "Username and password updated", //return updated username and pswrd for corr id
            updated: updateduser,
        });


    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});




app.get("/user", authToken, async (req, res) => {
    try {
        const username = req.user?.username;  // Use optional chaining to avoid runtime errors

        if (!username) {
            return res.status(400).send("Username is missing");
        }

        const user = await prisma.user.findUnique({
            where: { username }
        });

        if (!user) {
            return res.status(404).send("User not found");
        }

        return res.status(200).json(user);

    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
});
