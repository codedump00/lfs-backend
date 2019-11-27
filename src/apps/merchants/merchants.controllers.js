const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Merchant = require("./merchants.models");
const { upload, remove } = require("../../firebase/uploader");

const create = async (req, res) => {
    try {
        const stored = await Merchant.find({ name: req.body.name });
        if (stored.length > 0)
            return res.status(409).json({
                message: "Merchant creation failed. Merchant exists."
            });

        const merchant = Merchant({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            contact: req.body.contact,
            address: req.body.address,
            location: req.body.location,
            category: req.body.category,
            discount: req.body.discount,
            timestamp: Date.now(),
            hours: req.body.hours
        });
        await merchant.save();
        return res.status(201).json({
            message: "Merchant Created",
            merchant: merchant
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            message: "Error creating merchant!",
            error: err
        });
    }
};

const get = async (req, res) => {
    try {
        const page = req.params.page || 1;
        const result = 15;
        const merchants = await Merchant.find({})
            .skip(result * page - result)
            .limit(result);
        return res.status(200).send({
            result: merchants,
            count: await Merchant.estimatedDocumentCount()
        });
    } catch (err) {
        return res.status(500).json({
            error: "Illegal parameters!!"
        });
    }
};

const findByID = async (req, res) => {
    try {
        const merchant = await Merchant.findOne({ _id: req.params.id });
        return res.status(200).json({
            result: merchant
        });
    } catch (err) {
        return res.status(500).json({
            error: "Illegal parameters!!"
        });
    }
};

const category = async (req, res) => {
    try {
        const page = req.params.page || 1;
        const result = 15;
        const merchants = await Merchant.find({
            category: {
                $regex: RegExp(`${req.params.category}`),
                $options: "i"
            }
        })
            .skip(result * page - result)
            .limit(result);

        return res.status(200).json({
            result: merchants
        });
    } catch (e) {
        return res.status(400).json({
            error: "Merchants not found!"
        });
    }
};

const update = async (req, res) => {
    try {
        await Merchant.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });
        return res.status(200).json({
            message: "Merchant updated successfully."
        });
    } catch (err) {
        return res.status(500).json({
            error: "Error occured!!"
        });
    }
};

const del = async (req, res) => {
    try {
        await Merchant.deleteOne({ _id: req.params.id });
        return res.status(200).json({
            message: "Merchant deleted"
        });
    } catch (err) {
        return res.status(400).json({
            error: "Illegal action!!"
        });
    }
};

const imageUpload = async (req, res) => {
    // req.files is array of `photos` files
    // req.body will contain the text fields, if there were any
    try {
        const media = await upload(req.files);
        if (media.error)
            return res.status(400).json({
                error: "Image uploading failed."
            });
        await Merchant.findByIdAndUpdate(req.params.id, {
            media: media
        });
        return res.status(201).json({
            media: media
        });
    } catch (err) {
        return res.status(400).json({
            error: "Image uploading failed."
        });
    }
};

const updateImages = async (req, res) => {
    try {
        const media = await upload(req.files);
        if (media.error)
            return res.status(400).json({
                error: "Image uploading failed."
            });
        const merchant = await Merchant.findById(req.params.id, "media");
        media.names.push.apply(media.names, merchant.media.names);
        media.src.push.apply(media.src, merchant.media.src);
        await Merchant.findByIdAndUpdate(req.params.id, { media: media });
        return res.status(201).json({
            media: media
        });
    } catch (err) {
        return res.status(400).json({
            error: e
        });
    }
};

const deleteImages = async (req, res) => {
    try {
        //  await remove(req.params.image);
        const { newMedia } = Merchant.findById(req.params.id, "media");
        console.log(newMedia);
        const index = newMedia.names.indexOf(req.params.image);
        console.log(index);
        if (index > -1) {
            newMedia.names.splice(index, 1);
            const url = newMedia.src.find(each =>
                each.contains(req.params.image)
            );
            console.log(url);
            const urlIndex = newMedia.src.indexOf(url);
            console.log(urlIndex);
            if (urlIndex > -1) {
                newMedia.src.splice(urlIndex, 1);
                await Merchant.updateOne(
                    { _id: req.params.id },
                    { media: newMedia }
                );
                return res.status(200).json({
                    media: newMedia
                });
            }
        }
        return res.status(400).json({
            error: "Error"
        });
    } catch (err) {
        return res.status(400).json({
            error: err
        });
    }
};

module.exports = {
    create,
    get,
    findByID,
    update,
    delete: del,
    upload: imageUpload,
    category,
    updateImages,
    deleteImages
};
