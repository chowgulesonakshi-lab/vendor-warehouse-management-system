require("dotenv").config();

const app = require("./app");
const stockInRoutes = require("./routes/stockInRoutes");
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});