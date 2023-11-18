export function decodeBuffer(data) {
    const uint = new Uint8ClampedArray(data.data.data);
    const decoder = new TextDecoder('utf-8');
    const img = decoder.decode(uint);
    return "http://localhost:5000/api" + '/' + img;
  }
  
  export function isFileAnImage(file) {
    const imageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    return file && imageTypes.includes(file.type);
  }