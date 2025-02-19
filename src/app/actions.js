'use server'
import { v2 as cloudinary } from 'cloudinary';
import path from 'node:path'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});




export async function uploadFile(prevState, formData) {
  const file = formData.get('file')
  const fileBuffer = await file.arrayBuffer();

  let mime = file.type;
  let encoding = 'base64';
  let base64Data = Buffer.from(fileBuffer).toString('base64');
  let fileUri = 'data:' + mime + ';' + encoding + ',' + base64Data;

  const uploadToCloudinary = () => {
    return new Promise((resolve, reject) => {

      // a partir de Junio 2024 cloudinary usa dynamic folders
      // en este caso es recomendable usar propiedad asset_folder
      let result = cloudinary.uploader.upload(
        fileUri,
        { asset_folder: 'galeria', public_id: path.parse(file.name).name, invalidate: true }
      )
        .then((result) => resolve(result))
        .catch((error) => reject(error));
    });
  };


  try {
    const result = await uploadToCloudinary();
    // let imageUrl = result.secure_url;

    return { success: 'Archivo subido' }
  } catch (error) {
    return { error: error.message }
  }
}


