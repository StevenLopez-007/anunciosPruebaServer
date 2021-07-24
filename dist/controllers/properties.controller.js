"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.retornarImagen = exports.editAdd = exports.addPhoto = exports.deletePhoto = exports.deleteAdd = exports.getProperties = exports.register = void 0;
const properties_model_1 = require("../models/properties.model");
const uuid_1 = require("uuid");
const fs_1 = require("fs");
const path_1 = require("path");
const getProperties = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const uid = req.uid;
    try {
        const properties = yield properties_model_1.propertieModel.find({ user: uid }).select('-user');
        res.json({
            ok: true,
            properties
        });
    }
    catch (error) {
        res.json({
            ok: false,
            msg: 'No se pudo obtener los anuncios'
        });
    }
});
exports.getProperties = getProperties;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombre, moneda, precio, descripcion, amenidades, ubicacion } = req.body;
    const uid = req.uid;
    // Procesamos las imagenes
    const photos = req.files.photos;
    // const nombreCortado = 
    if (!Array.isArray(photos)) {
        const nombreCortado = photos.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];
        if (!validarExtensionValida(extension)) {
            return res.status(400).json({
                ok: false,
                msg: 'El tipo de archivo es inválido'
            });
        }
        // Generar nombre del archivo
        const nombreArchivo = `${uuid_1.v4()}.${extension}`;
        // Path donde guardar la imagen
        // const path = `./uploads/properties/${nombreArchivo}`;
        const path = path_1.join(__dirname, `../uploads/properties/${nombreArchivo}`);
        photos.mv(path, function (err) {
            return __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    return res.json({
                        ok: false,
                        msg: 'Ocurrió un error al subir la imagen'
                    });
                }
                const propertie = new properties_model_1.propertieModel({
                    photos: [nombreArchivo],
                    nombre,
                    moneda,
                    precio,
                    descripcion,
                    amenidades: JSON.parse(amenidades),
                    ubicacion: JSON.parse(ubicacion),
                    user: uid
                });
                yield propertie.save();
                res.json({
                    ok: true,
                    propertie
                });
            });
        });
    }
    else {
        const photosProperties = yield uploadsPhotos(photos);
        const propertie = new properties_model_1.propertieModel({
            photos: photosProperties,
            nombre,
            moneda,
            precio,
            descripcion,
            amenidades: JSON.parse(amenidades),
            ubicacion: JSON.parse(ubicacion),
            user: uid
        });
        yield propertie.save();
        res.json({
            ok: true,
            propertie
        });
    }
});
exports.register = register;
const deleteAdd = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idPropertie = req.params.id;
    if (!idPropertie) {
        return res.json({
            ok: false,
            msg: 'El id del anuncio es requerido'
        });
    }
    const anuncio = yield properties_model_1.propertieModel.findByIdAndDelete(idPropertie);
    if (!anuncio) {
        return res.status(400).json({
            ok: false,
            msg: 'No existe el anuncio'
        });
    }
    anuncio.photos.forEach((photo) => {
        deletePhotoFromFolder(photo);
    });
    res.json({
        ok: true,
        msg: 'El anuncio fue eliminado con exito.'
    });
});
exports.deleteAdd = deleteAdd;
const deletePhoto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idAdd = req.params.idAdd;
    const namePhoto = req.body.namePhoto;
    try {
        yield properties_model_1.propertieModel.findOneAndUpdate({ _id: idAdd }, { $pull: { photos: { $in: [namePhoto] } } }, { multi: true });
        deletePhotoFromFolder(namePhoto);
        res.json({ ok: true, msg: 'Foto eliminada' });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            ok: false,
            msg: 'Ocurrieron algunos errores'
        });
    }
});
exports.deletePhoto = deletePhoto;
const addPhoto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idAdd = req.params.idAdd;
    const photo = req.files.photo;
    const nombreCortado = photo.name.split('.');
    const extension = nombreCortado[nombreCortado.length - 1];
    if (!validarExtensionValida(extension)) {
        return res.status(400).json({
            ok: false,
            msg: 'El tipo de archivo es inválido'
        });
    }
    // Generar nombre del archivo
    const nombreArchivo = `${uuid_1.v4()}.${extension}`;
    // Path donde guardar la imagen
    // const path = `./uploads/properties/${nombreArchivo}`;
    const path = path_1.join(__dirname, `../uploads/properties/${nombreArchivo}`);
    const anuncio = yield properties_model_1.propertieModel.findById(idAdd);
    if (!anuncio) {
        return res.status(400).json({ ok: false, msg: 'No existe el anuncio' });
    }
    if (anuncio.photos.length == 5) {
        return res.status(400).json({ ok: false, msg: 'Numero maximo de fotos alcanzado.' });
    }
    photo.mv(path, function (err) {
        return __awaiter(this, void 0, void 0, function* () {
            if (err) {
                return res.status(500).json({
                    ok: true,
                    msg: 'Ocurrio un error al subir la imagen'
                });
            }
            try {
                anuncio.photos.push(nombreArchivo);
                yield anuncio.save();
                res.json({ ok: true, msg: 'Foto agregada' });
            }
            catch (error) {
                res.status(500).json({ ok: false, msg: 'Ocurrio un error' });
            }
        });
    });
});
exports.addPhoto = addPhoto;
const editAdd = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idAdd = req.params.idAdd;
    const { nombre, moneda, precio, descripcion, amenidades, ubicacion } = req.body;
    try {
        const anuncio = yield properties_model_1.propertieModel.findById(idAdd);
        if (!anuncio) {
            return res.status(400).json({ ok: false, msg: 'No existe el anuncio' });
        }
        ;
        anuncio.nombre = nombre;
        anuncio.moneda = moneda;
        anuncio.precio = precio;
        anuncio.descripcion = descripcion;
        anuncio.amenidades = JSON.parse(amenidades);
        anuncio.ubicacion = JSON.parse(ubicacion);
        yield anuncio.save();
        res.json({ ok: true, msg: 'Anuncio actualizado' });
    }
    catch (error) {
        res.status(500).json({ ok: false, msg: 'Ocurrió algun error' });
    }
});
exports.editAdd = editAdd;
const retornarImagen = (req, res) => {
    const foto = req.params.name;
    const pathImg = path_1.join(__dirname, `../uploads/properties/${foto}`);
    console.log(path_1.join(__dirname, `../uploads/properties/${foto}`));
    if (fs_1.existsSync(pathImg)) {
        res.sendFile(pathImg);
    }
    else {
        const pathImg = path_1.join(__dirname, `../uploads/properties/noImg.jpg`);
        res.sendFile(pathImg);
    }
};
exports.retornarImagen = retornarImagen;
// Validar si la extension de archivo es válida
function validarExtensionValida(extension) {
    return ['png', 'jpg', 'jpeg'].includes(extension.toLocaleLowerCase());
}
// Subir varias imagenes
function uploadsPhotos(photos) {
    return new Promise((resolve, reject) => {
        const photosProperties = [];
        photos.forEach((photo) => __awaiter(this, void 0, void 0, function* () {
            const nombreCortado = photo.name.split('.');
            const extension = nombreCortado[nombreCortado.length - 1];
            // Generar nombre del archivo
            const nombreArchivo = `${uuid_1.v4()}.${extension}`;
            // Path donde guardar la imagen
            // const path = `./uploads/properties/${nombreArchivo}`;
            const path = path_1.join(__dirname, `../uploads/properties/${nombreArchivo}`);
            photosProperties.push(nombreArchivo);
            yield photo.mv(path, function (err) {
                if (err) {
                    reject('Algunas fotos no se pudieron subir');
                }
            });
        }));
        resolve(photosProperties);
    });
}
function deletePhotoFromFolder(name) {
    fs_1.unlinkSync(`./uploads/properties/${name}`);
}
