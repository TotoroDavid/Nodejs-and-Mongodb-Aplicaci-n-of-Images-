const { Router } = require('express')
const router = Router()
const path = require('path')
const { unlink } = require('fs-extra')

const Image = require('../models/image')

//see all the images
router.get('/', async(req, res) => {
    const images = await Image.find()
    console.log(images)
    res.render('index', { images })
})

//check the upload format
router.get('/upload', (req, res) => {
    res.render('upload');
})

//upload a image
router.post('/upload', async(req, res) => {
    const image = new Image();
    image.title = req.body.title;
    image.description = req.body.description;
    image.filename = req.file.filename;
    image.path = '/img/uploads/' + req.file.filename;
    image.originalname = req.file.originalname;
    image.mimetype = req.file.mimetype;
    image.size = req.file.size;

    await image.save();
    res.redirect('/')
});

//check the profile image 
router.get('/image/:id', async(req, res) => {
    const { id } = req.params
    const image = await Image.findById(id)
    res.render('profile', { image })
})

//delete image
router.get('/image/:id/delete', async(req, res) => {
    const { id } = req.params
    const image = await Image.findByIdAndDelete(id)
    await unlink(path.resolve('./src/public' + image.path))
    res.redirect('/')
})


module.exports = router