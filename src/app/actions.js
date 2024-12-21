'use server'
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function uploadFile(formData) {
    const file = formData.get('file')

    const fileBuffer = await file.arrayBuffer();

    let mime = file.type; 
    let encoding = 'base64'; 
    let base64Data = Buffer.from(fileBuffer).toString('base64');
    let fileUri = 'data:' + mime + ';' + encoding + ',' + base64Data;

  try {
    
    const uploadToCloudinary = () => {
      return new Promise((resolve, reject) => {

          let result = cloudinary.uploader.upload(fileUri, {
            // a partir de Junio 2024 cloudinary usa dynamic folders
            // en este caso es recomendable usar propiedad asset_folder
            invalidate: true, public_id: file.name, asset_folder: 'samples/landscapes'
          })
            .then((result) => {
              console.log(result);
              resolve(result);
            })
            .catch((error) => {
              console.log(error);
              reject(error);
            });
      });
    };

    const result = await uploadToCloudinary();
    
    let imageUrl = result.secure_url;

    return { type: 'success', message: 'Archivo subido' }
 
  } catch (error) {
    return { type: 'error', message: error.message }
  }
}


