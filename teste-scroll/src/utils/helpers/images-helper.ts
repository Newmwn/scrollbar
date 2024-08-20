import { Devkit } from '../devkit-config';

export class ImagesHelper {
  //static variable that has to be setted to the sanitizer
  static _sanitizer = null;

  static fileTypes = {
    pdf: ['.pdf'],
    excel: ['.xlsx', '.xlsm', '.xlsb', '.xltx', '.xltm', '.xls', '.xlt', '.xml', '.xlam', '.xla', '.xlw', '.xlr'],
    word: ['.docx', '.doc', '.docm', '.dot', '.dotm', '.dotx'],
    powerPoint: ['.pptx', '.pptm', '.ppt', '.potx', '.potm', '.pot', '.ppsx', '.ppsm', '.pps', '.ppam', '.ppa'],
    txt: ['.txt'],
    compressed: ['.rar', '.zip', '.7z', '.sitx', '.gz'],
    audio: [
      '.m4a',
      '.flac',
      '.mp3',
      '.wav',
      '.wma',
      '.aac',
      '.mid',
      '.alac',
      '.aiff',
      '.pcm',
      '.midi',
      '.mp2',
      '.oga',
      '.weba',
      '3gp_DOES_NOT_CONTAIN_VIDEO',
      '3gp2_DOES_NOT_CONTAIN_VIDEO',
    ],
    video: ['.avi', '.mp4', '.mpa', '.mpe', '.mpeg', '.ogv', '.webm', '.3gp', '.3gp2', '.mov', '.wmv', '.avchd', '.flv', '.mkv'],
    xd: ['.xd'],
    apk: ['.apk'],
    ps: ['.ps'],
    id: ['.id'],
    font: ['.eot', '.otf', '.ttf', '.woff', 'woff2'],
    code: ['.ts', '.python', '.asp', '.java', '.php', '.ruby', '.c', '.c++'],
    image: ['.gif', '.ico', '.jpeg', '.jpg', '.png', '.svg', '.tif', '.tiff', '.webp'],
  };

  /**
   * Get the formated size file
   * @param size size of the file
   * @param decimals
   * @returns
   */
  static getFormatedSize(size, decimals = 2) {
    let fileSizeFormatted = null;
    if (size === 0) {
      fileSizeFormatted = '0 bytes';
    } else {
      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ['bytes', 'kB', 'mB', 'gB', 'tB', 'pB', 'eB', 'zB', 'yB'];
      const i = Math.floor(Math.log(size) / Math.log(k));
      fileSizeFormatted = parseFloat((size / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];

      if (sizes[i] === 'mB' || i > 2) {
        let size = parseInt(fileSizeFormatted.split(' ')[0]);
        if (size > 300 || i > 2) {
          fileSizeFormatted = null;
        }
      }
    }
    return fileSizeFormatted;
  }

  /**
   * Function that transforms the base64 image string to an image to be used as src
   * @param data image base64 string
   * @param extension image extension
   * @returns image
   */
  static convertImage(data: string, extension: string) {
    let base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;

    if (base64regex.test(data)) {
      let byte = this.base64ToArrayBuffer(data);
      let parsedExtension = extension.split('.').splice(-1);
      const type = this.getMimeType(parsedExtension);
      const blob = new Blob([byte], { type: type });
      return ImagesHelper._sanitizer.sanitize(URL.createObjectURL(blob)) as string;
    } else {
      return data ?? null;
    }
  }

  /**
   * Function that performs the convertion of data64 string to an UInt array
   * @param params base64 data
   * @returns UIntArray
   */
  static base64ToArrayBuffer(params) {
    let binaryString = window.atob(params);
    let binaryLength = binaryString.length;
    let bytes = new Uint8Array(binaryLength);
    for (let i = 0; i < binaryLength; i++) {
      let ascii = binaryString.charCodeAt(i);
      bytes[i] = ascii;
    }
    return bytes;
  }

  /**
   * Converts a file type to his mime correspondent
   * @param type file type
   * @returns mime type
   */
  static getMimeType = type =>
    ({
      'aac': 'audio/aac',
      'abw': 'application/x-abiword',
      'ai': 'application/postscript',
      'arc': 'application/octet-stream',
      'avi': 'video/x-msvideo',
      'azw': 'application/vnd.amazon.ebook',
      'bin': 'application/octet-stream',
      'bz': 'application/x-bzip',
      'bz2': 'application/x-bzip2',
      'csh': 'application/x-csh',
      'css': 'text/css',
      'csv': 'text/csv',
      'doc': 'application/msword',
      'dll': 'application/octet-stream',
      'eot': 'application/vnd.ms-fontobject',
      'epub': 'application/epub+zip',
      'gif': 'image/gif',
      'htm': 'text/html',
      'html': 'text/html',
      'ico': 'image/x-icon',
      'ics': 'text/calendar',
      'jar': 'application/java-archive',
      'jpeg': 'image/jpeg',
      'jpg': 'image/jpeg',
      'js': 'application/javascript',
      'json': 'application/json',
      'mid': 'audio/midi',
      'midi': 'audio/midi',
      'mp2': 'audio/mpeg',
      'mp3': 'audio/mpeg',
      'mp4': 'video/mp4',
      'mpa': 'video/mpeg',
      'mpe': 'video/mpeg',
      'mpeg': 'video/mpeg',
      'mpkg': 'application/vnd.apple.installer+xml',
      'odp': 'application/vnd.oasis.opendocument.presentation',
      'ods': 'application/vnd.oasis.opendocument.spreadsheet',
      'odt': 'application/vnd.oasis.opendocument.text',
      'oga': 'audio/ogg',
      'ogv': 'video/ogg',
      'ogx': 'application/ogg',
      'otf': 'font/otf',
      'png': 'image/png',
      'pdf': 'application/pdf',
      'ppt': 'application/vnd.ms-powerpoint',
      'rar': 'application/x-rar-compressed',
      'rtf': 'application/rtf',
      'sh': 'application/x-sh',
      'svg': 'image/svg+xml',
      'swf': 'application/x-shockwave-flash',
      'tar': 'application/x-tar',
      'tif': 'image/tiff',
      'tiff': 'image/tiff',
      'ts': 'application/typescript',
      'ttf': 'font/ttf',
      'txt': 'text/plain',
      'vsd': 'application/vnd.visio',
      'wav': 'audio/x-wav',
      'weba': 'audio/webm',
      'webm': 'video/webm',
      'webp': 'image/webp',
      'woff': 'font/woff',
      'woff2': 'font/woff2',
      'xhtml': 'application/xhtml+xml',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.ms-excel',
      'xlsx_OLD': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'xml': 'application/xml',
      'xul': 'application/vnd.mozilla.xul+xml',
      'zip': 'application/zip',
      '3gp': 'video/3gpp',
      '3gp_DOES_NOT_CONTAIN_VIDEO': 'audio/3gpp',
      '3gp2': 'video/3gpp2',
      '3gp2_DOES_NOT_CONTAIN_VIDEO': 'audio/3gpp2',
      '7z': 'application/x-7z-compressed',
    }[type] || 'blob');

  /**
   * Fize Size Valiton
   * Validates if the file doesn't have a bigger size than the max size
   *
   */
  static fileSizeValidation(bytes = 0, maxFileSize = 300, maxFileSizeUnit = 'mB') {
    if (bytes === 0) return false;

    const sizes = ['bytes', 'kB', 'mB', 'gB', 'tB', 'pB', 'eB', 'zB', 'yB'];
    const maxFileSizeIndex = sizes.findIndex(size => size === maxFileSizeUnit);
    const maxBytes = maxFileSize * Math.pow(1024, maxFileSizeIndex);

    return bytes <= maxBytes;
  }

  /**
   * Returns the corresponding file icon based on the file extension.
   *
   * @param {string} extension - The file extension.
   * @return {string} The corresponding file icon class.
   */
  static getCorrespondentFileIcon(extension: string) {
    // Return early if extension is empty
    if (!extension) return;

    // Convert extension to lowercase for consistency
    extension = extension.toLowerCase();

    // Check each file type category and return the corresponding icon class if the extension matches
    if (this.fileTypes.pdf.includes(extension)) return '.pdf_extension';
    if (this.fileTypes.excel.includes(extension)) return '.icon_excel_extension';
    if (this.fileTypes.word.includes(extension)) return '.word_extension';
    if (this.fileTypes.powerPoint.includes(extension)) return '.power_point_extension';
    if (this.fileTypes.txt.includes(extension)) return '.icon_txt_extension';
    if (this.fileTypes.compressed.includes(extension)) return '.icon_compressed_extensions';
    if (this.fileTypes.audio.includes(extension)) return '.icon_audio_extensions';
    if (this.fileTypes.video.includes(extension)) return '.icon_video_extensions';
    if (this.fileTypes.xd.includes(extension)) return '.icon_xd_extension';
    if (this.fileTypes.apk.includes(extension)) return '.icon_apk_extension';
    if (this.fileTypes.ps.includes(extension)) return '.icon_photoshop_extension';
    if (this.fileTypes.id.includes(extension)) return '.icon_id_extension';
    if (this.fileTypes.font.includes(extension)) return '.icon_font_extensions';
    if (this.fileTypes.code.includes(extension)) return '.icon_code_extensions';

    return '.icon_other_extensions';
  }

  /**
   * This method will get the image path from the Devkit configuration. If the image does not exist, it will fallback to the default image path.
   * This method returns a promise. The promise resolves with the image path if the image is found, and the fallback image path if the image is not found.
   *
   * @param {string} path - The path of the image.
   * @param {string} fallback - The path of the fallback image.
   * @return {Promise<string>} - A promise that resolves with the image path or the fallback image path.
   */
  static getImageOrFallback = (path, fallback) => {
    const devkitConfig = Devkit.getValues();
    path = `${devkitConfig?.imagePath}${path}`;
    fallback = `${devkitConfig?.defaultImagePath}${fallback}`;
    return new Promise(resolve => {
      const img = new Image();
      img.src = path;
      img.onload = () => resolve(path);
      img.onerror = () => resolve(fallback);
    });
  };

  /**
   * Makes an request with the bearer token to get an image via bearer token authentication
   * @param src The source of the image
   * @returns The source of the image
   */
  static getImageViaAuthentication = async (src: string): Promise<string> => {
    return await new Promise<string>((resolve: any) => {
      const token = localStorage.getItem('token');

      const xhr = new XMLHttpRequest();
      xhr.open('GET', src, true);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.responseType = 'blob';

      xhr.onreadystatechange = async () => {
        try {
          //Do not explicitly handle errors, those should be
          //visible via console output in the browser.
          if (xhr.readyState === 4 && xhr.status === 200) {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve(ImagesHelper._sanitizer.sanitize(reader.result as string));
            };
            reader.readAsDataURL(xhr.response);
          } else if (xhr.readyState === 4 && xhr.status !== 200) {
            resolve(src);
          }
        } catch {
          resolve(src);
        }
      };

      xhr.send(null);
    });
  };
}
