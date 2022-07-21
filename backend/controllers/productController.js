// Get All Product
exports.getAllProducts = (req, res) => {
    res.status(200).json({
        success: true,
        message: "getAllProducts route is working",
    });
};