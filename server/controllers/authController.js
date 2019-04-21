const bcrypt = require("bcryptjs");

module.exports = {
    
    register : async (req, res) => {
        const {username ,password , isAdmin } = req.body;
        const dbInstance = req.app.get("db");
        const result = await dbInstance.get_user([username]);
        const existingUser = result[0];

        if(existingUser){
            return res.status(409).json("Username taken")
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const registeredUser = await dbInstance.register_user([isAdmin,username,hash]);
        const user = registeredUser[0];

        req.session.user = {
            isAdmin: user.is_admin,
            id: user.id,
            username: user.username
        }
        return res.status(201).json(req.session.user)
    
    },

    login: async (req,res) => {
        const {username, password} = req.body;
        const dbInstance = req.app.get("db");
        const foundUser = await dbInstance.get_user([username]);
        const user = foundUser[0];
        
        if(!user){
            return res.status(401).json("User not found. Please register as a new user before logging in.")
        }

        const isAuthenticated = bcrypt.compareSync(password, user.hash)
        if(isAuthenticated == false){
            return res.status(403).json("Incorrect password'")
        }else{
            req.session.user = { isAdmin: user.is_admin, id: user.id, username: user.username }
            res.status(200).json(req.session.user)
        }
    },
    logout:  (req, res) => {
        req.session.destroy();
        // return res.status(200).json(req.session)
        return res.sendStatus(200);
    }

}