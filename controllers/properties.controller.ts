import { Response, Request } from 'express';
import { propertieModel } from '../models/properties.model';
import { v4 as uuidv4 } from 'uuid';
import { unlinkSync, existsSync } from 'fs';
import { join } from 'path';

const getProperties = async (req: any, res: Response) => {
    const uid = req.uid;

    try {
        const properties = await propertieModel.find({ user: uid }).select('-user');

        res.json({
            ok: true,
            properties
        })
    } catch (error) {
        res.json({
            ok: false,
            msg: 'No se pudo obtener los anuncios'
        })
    }

}

const register = async (req: any, res: Response) => {

    const { nombre, moneda, precio, descripcion, amenidades, ubicacion } = req.body;

    const uid = req.uid;

    // Procesamos las imagenes
    const photos = req.files!.photos;

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
        const nombreArchivo = `${uuidv4()}.${extension}`;

        // Path donde guardar la imagen
        // const path = `./uploads/properties/${nombreArchivo}`;
        const path = join(__dirname, `../uploads/properties/${nombreArchivo}`);
        photos.mv(path, async function (err: any) {
            if (err) {
                return res.json({
                    ok: false,
                    msg: 'Ocurrió un error al subir la imagen'
                });
            }

            const propertie = new propertieModel({
                photos: [nombreArchivo],
                nombre,
                moneda,
                precio:precio*1,
                descripcion,
                amenidades: JSON.parse(amenidades),
                ubicacion,
                user: uid
            });

            await propertie.save();
            res.json({
                ok: true,
                propertie
            });
        });
    } else {
        const photosProperties = await uploadsPhotos(photos);
        const propertie = new propertieModel({
            photos: photosProperties,
            nombre,
            moneda,
            precio:precio*1,
            descripcion,
            amenidades: JSON.parse(amenidades),
            ubicacion,
            user: uid
        });

        await propertie.save();
        res.json({
            ok: true,
            propertie
        });
    }
}

const deleteAdd = async (req: any, res: Response) => {
    const idPropertie = req.params.id;

    if (!idPropertie) {
        return res.json({
            ok: false,
            msg: 'El id del anuncio es requerido'
        })
    }
    const anuncio = await propertieModel.findByIdAndDelete(idPropertie);

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

}

const deletePhoto = async (req: any, res: Response) => {
    const idAdd = req.params.idAdd;
    const namePhoto = req.body.namePhoto;

    try {
        await propertieModel.findOneAndUpdate(
            { _id: idAdd },
            { $pull: { photos: { $in: [namePhoto] } } },
            { multi: true }
        );

        deletePhotoFromFolder(namePhoto);

        res.json({ ok: true, msg: 'Foto eliminada' });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            ok: false,
            msg: 'Ocurrieron algunos errores'
        })
    }
}

const addPhoto = async (req: any, res: Response) => {
    const idAdd = req.params.idAdd;

    const photo = req.files!.photo;

    const nombreCortado = photo.name.split('.');
    const extension = nombreCortado[nombreCortado.length - 1];

    if (!validarExtensionValida(extension)) {
        return res.status(400).json({
            ok: false,
            msg: 'El tipo de archivo es inválido'
        });
    }

    // Generar nombre del archivo
    const nombreArchivo = `${uuidv4()}.${extension}`;

    // Path donde guardar la imagen
    // const path = `./uploads/properties/${nombreArchivo}`;
    const path = join(__dirname, `../uploads/properties/${nombreArchivo}`);

    const anuncio = await propertieModel.findById(idAdd);
    if (!anuncio) { return res.status(400).json({ ok: false, msg: 'No existe el anuncio' }) }

    if (anuncio.photos.length == 5) {
        return res.status(400).json({ ok: false, msg: 'Numero maximo de fotos alcanzado.' })
    }

    photo.mv(path, async function (err: any) {
        if (err) {
            return res.status(500).json({
                ok: true,
                msg: 'Ocurrio un error al subir la imagen'
            });
        }

        try {

            anuncio.photos.push(nombreArchivo);
            await anuncio.save();

            res.json({ ok: true, msg: 'Foto agregada',img:nombreArchivo });
        } catch (error) {
            res.status(500).json({ ok: false, msg: 'Ocurrio un error' })
        }

    });

}

const editAdd = async (req: any, res: Response) => {
    const idAdd = req.params.idAdd;

    const { nombre, moneda, precio, descripcion, amenidades, ubicacion } = req.body;

    try {
        const anuncio = await propertieModel.findById(idAdd);

        if (!anuncio) { return res.status(400).json({ ok: false, msg: 'No existe el anuncio' }) };

        anuncio.nombre = nombre;
        anuncio.moneda = moneda;
        anuncio.precio = precio*1;
        anuncio.descripcion = descripcion;
        anuncio.amenidades = amenidades;
        anuncio.ubicacion = ubicacion;

        await anuncio.save();

        res.json({ ok: true, propertie:anuncio });

    } catch (error) {
        res.status(500).json({ ok: false, msg: 'Ocurrió algun error' })
    }
}

const retornarImagen = (req: any, res: Response) => {

    const foto = req.params.name;

    const pathImg =  join(__dirname, `../uploads/properties/${foto}`);
    // const pathImg = `./uploads/properties/${foto}`;
    if (existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        const pathImg = join(__dirname, `../uploads/properties/noImg.jpg`);
        // const pathImg = `./uploads/properties/${foto}`;
        res.sendFile(pathImg)
    }
}



// Validar si la extension de archivo es válida
function validarExtensionValida(extension: string): boolean {
    return ['png', 'jpg', 'jpeg'].includes(extension.toLocaleLowerCase());
}

// Subir varias imagenes
function uploadsPhotos(photos: any[]) {
    return new Promise((resolve, reject) => {
        const photosProperties: string[] = [];
        photos.forEach(async (photo: any) => {
            const nombreCortado = photo.name.split('.');
            const extension = nombreCortado[nombreCortado.length - 1];

            // Generar nombre del archivo
            const nombreArchivo = `${uuidv4()}.${extension}`;

            // Path donde guardar la imagen
            // const path = `./uploads/properties/${nombreArchivo}`;
            const path = join(__dirname, `../uploads/properties/${nombreArchivo}`);
            photosProperties.push(nombreArchivo);
            await photo.mv(path, function (err: any) {
                if (err) {
                    reject('Algunas fotos no se pudieron subir');
                }
            });
        });
        resolve(photosProperties);
    });
}

function deletePhotoFromFolder(name: string) {
    const path = join(__dirname, `../uploads/properties/${name}`);
    if(existsSync(path)){
        unlinkSync(path);
    }
}

export { register, getProperties, deleteAdd, deletePhoto, addPhoto, editAdd, retornarImagen }