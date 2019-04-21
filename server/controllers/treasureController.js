module.exports ={
    dragonTreasure : async (req, res) => {
       const dbInstance = req.app.get("db");
       const result = await dbInstance.get_dragon_treasure([1])
       res.status(200).json(result)
    },
    getUserTreasure: async (req, res) => {
        const dbInstance = req.app.get("db");
        const result = await dbInstance.get_user_treasure([req.session.user.id])
        return res.status(200).json(result)
    },
    addUserTreasure: async (req, res) => {
        const {treasureURL} = req.body;
        const {id} = req.session.user;
        const dbInstance = req.app.get("db");
        const userTreasure = await dbInstance.add_user_treasure([treasureURL, id]);
        res.status(200).json(userTreasure)
    },
    getAllTreasure: async (req, res) => {
        const dbInstance = req.app.get("db")
        const result = await dbInstance.get_all_treasure()
        res.status(200).json(result)
    }
}