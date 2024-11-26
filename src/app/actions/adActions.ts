'use server';



export async function createAd(formData: FormData) {
  const {files, location, ...data} = Object.fromEntries(formData);
  return true;
}

