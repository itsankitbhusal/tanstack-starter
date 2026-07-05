export const convertFileToBase64 = (
  file: File,
  stripPrefix = true,
): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      if (stripPrefix) {
        resolve(result.split(',')[1]);
      } else {
        resolve(result);
      }
    };
    reader.onerror = (error) => reject(error);
  });
