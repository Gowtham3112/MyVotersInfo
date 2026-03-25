// upload controller

const uploadImage = ( req, res) => {
    try {
        if( !req.file) {
            return res.status(400).json({ message: 'No file uploaded'});
        }

        const protocol = req.protocol;
        const host = req.get("host");
        const imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

        return res.status(200).json({
            message: 'Image uploaded successfully',
            url: imageUrl,
        });
    }catch (error) {
        return res.status(500).json({ message: 'Upload failed', error: error.message});
    }
};

module.exports = { uploadImage};