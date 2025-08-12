/*se encarga de cargar los libros a la base de datos*/
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { pool } from "../conexion_db.js"

export async function cargarLibrosAlaBaseDeDatos() {
    const rutaArchivo = path.resolve('server/data/02_libros.csv');
    const libros = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(rutaArchivo)
            .pipe(csv())
            .on("data", (fila) => {
                libros.push([
                    fila.isbn,
                    fila.titulo.trim(),
                    fila.anio_de_publicacion,
                    fila.autor
                ]);
            })
            .on('end', async () => {
                try {
                    const sql = `
                        INSERT INTO libros (
                            isbn,
                            titulo,
                            anio_de_publicacion,
                            autor
                        ) 
                        VALUES ($1, $2, $3, $4)
                    `;

                    // Insert records one by one
                    let insertedCount = 0;
                    for (const libro of libros) {
                        await pool.query(sql, libro);
                        insertedCount++;
                    }

                    console.log(`✅ Se insertaron ${insertedCount} libros.`);
                    resolve();
                } catch (error) {
                    console.error('❌ Error al insertar libros:', error.message);
                    reject(error);
                }
            })
            .on('error', (err) => {
                console.error('❌ Error al leer el archivo CSV de libros:', err.message);
                reject(err);
            });
    });
}