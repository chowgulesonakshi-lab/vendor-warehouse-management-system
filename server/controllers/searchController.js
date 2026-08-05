const searchService = require("../services/searchServices");


const globalSearch = async (req, res) => {

    try {

        const { q } = req.query;


        if (!q || q.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Search keyword is required"
            });
        }


        const results =
            await searchService.globalSearch(q);


        res.status(200).json({
            success: true,
            keyword: q,
            results
        });


    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


module.exports = {
    globalSearch
};