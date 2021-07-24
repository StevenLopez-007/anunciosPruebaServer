import { UserModel } from '../models/user.model';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { generarJwt } from '../helpers/jwt.helper';

const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {

        const usuarioDB = await UserModel.findOne({ email });

        // Verificar email
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuairo con este E-mail'
            })
        }

        // Verificar contraseña
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña no válida'
            })
        }

        // Generar token
        const token = await generarJwt(usuarioDB.id);

        res.json({
            ok: true,
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

const register = async (req: Request, res: Response) => {
    const { userName, email, password } = req.body;

    try {

        const existeEmail = await UserModel.findOne({ email });

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                meg: 'El correo ya está registrado'
            });
        }

        const usuario = new UserModel({userName,email,password});

        // Encriptar Contraseña
        const salt = bcrypt.genSaltSync();

        usuario.password = bcrypt.hashSync(password, salt);

        // Guardar usuario
        await usuario.save();

        const token = await generarJwt(usuario.id);

        res.status(200).json({
            ok: true,
            usuario,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado '
        });
    }


}

export { login,register }