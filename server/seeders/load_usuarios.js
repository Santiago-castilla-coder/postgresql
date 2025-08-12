/*se encarga de cargar los usuarios a la base de datos*/
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { pool } from "../conexion_db.js"

export async function cargarUsuariosAlaBaseDeDatos() {
    const rutaArchivo = path.resolve('server/data/01_usuarios.csv');
    const usuarios = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(rutaArchivo)
            .pipe(csv())
            .on("data", (fila) => {
                usuarios.push([
                    fila.id_usuario,
                    fila.nombre_completo.trim(),
                    fila.identificacion,
                    fila.correo,
                    fila.telefono
                ]);
            })
            .on('end', async () => {
                try {
                    // PostgreSQL uses $1, $2, etc. for parameterized queries
                    const sql = `
                        INSERT INTO usuarios (
                            id_usuario,
                            nombre,
                            identificacion,
                            correo,
                            telefono
                        ) 
                        VALUES ($1, $2, $3, $4, $5)
                    `;

                    // PostgreSQL needs to execute each insert separately
                    for (const usuario of usuarios) {
                        await pool.query(sql, usuario);
                    }

                    console.log(`✅ Se insertaron ${usuarios.length} usuarios.`);
                    resolve();
                } catch (error) {
                    console.error('❌ Error al insertar usuarios:', error.message);
                    reject(error);
                }
            })
            .on('error', (err) => {
                console.error('❌ Error al leer el archivo CSV de usuarios:', err.message);
                reject(err);
            });
    });
}