import * as fs from "fs";
import * as path from "path";

/**
 * Utilidades para manipulación de archivos JSON.
 */
export class FileUtils {
  /**
   * Escribe un archivo JSON en el directorio especificado.
   * 
   * @param {string} dirPath - Ruta base del directorio.
   * @param {string} dir - Subdirectorio dentro de la ruta base.
   * @param {string} fileName - Nombre del archivo (incluye extensión).
   * @param {unknown} data - Datos a escribir en el archivo.
   * @returns {Promise<void>} Una promesa que se resuelve cuando la operación se completa.
   */
  static async writeFile(
    dirPath: string,
    dir: string,
    fileName: string,
    data: unknown
  ): Promise<void> {
    const fullPath = path.join(dirPath, dir);
    await fs.promises.mkdir(fullPath, { recursive: true }); // Crear directorio si no existe
    await fs.promises.writeFile(
      path.join(fullPath, fileName),
      JSON.stringify(data, null, 2),
      "utf8"
    );
  }

  /**
   * Lee un archivo JSON desde el directorio especificado.
   * 
   * @param {string} dirPath - Ruta base del directorio.
   * @param {string} dir - Subdirectorio dentro de la ruta base.
   * @param {string} fileName - Nombre del archivo (incluye extensión).
   * @returns {Promise<T>} Una promesa que resuelve con el contenido del archivo como objeto JSON.
   * @template T Tipo esperado de los datos leídos.
   */
  static async readFile<T>(
    dirPath: string,
    dir: string,
    fileName: string
  ): Promise<T> {
    const filePath = path.join(dirPath, dir, fileName);
    const file = await fs.promises.readFile(filePath, "utf8");
    return JSON.parse(file) as T;
  }

  /**
   * Lee todos los archivos JSON desde un directorio especificado.
   * 
   * @param {string} dirPath - Ruta base del directorio.
   * @param {string} dir - Subdirectorio dentro de la ruta base.
   * @returns {Promise<T[]>} Una promesa que resuelve con un arreglo de objetos JSON.
   * @template T Tipo esperado de los datos en los archivos.
   */
  static async readFiles<T>(dirPath: string, dir: string): Promise<T[]> {
    const fullPath = path.join(dirPath, dir);
    const files = await fs.promises.readdir(fullPath);
    const data = await Promise.all(
      files.map(async (file) => {
        const content = await fs.promises.readFile(
          path.join(fullPath, file),
          "utf8"
        );
        return JSON.parse(content) as T;
      })
    );
    return data;
  }

  /**
   * Elimina un archivo si existe.
   * 
   * @param {string} filePath - Ruta completa del archivo a eliminar.
   * @returns {Promise<void>} Una promesa que se resuelve cuando la operación se completa.
   */
  static async deleteFileIfExists(filePath: string): Promise<void> {
    const exists = await fs.promises
      .access(filePath)
      .then(() => true)
      .catch(() => false);

    if (exists) {
      await fs.promises.unlink(filePath);
      console.log(`Archivo eliminado correctamente: ${filePath}`);
    }
  }
}
