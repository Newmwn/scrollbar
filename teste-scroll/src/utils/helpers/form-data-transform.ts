export class FormDataTransform {
  public static convertToFormData(obj, rootName = '', ignoreList = null): FormData {
    var formData = new FormData();
    function appendFormData(data, root) {
      if (!ignore(root)) {
        root = root || '';
        if (data instanceof File || data instanceof Blob) {
          formData.append(root, data);
        } else if (Array.isArray(data)) {
          for (var i = 0; i < data.length; i++) {
            appendFormData(data[i], root + '[' + i + ']');
          }
        } else if (typeof data === 'object' && data) {
          for (var key in data) {
            if (data.hasOwnProperty(key)) {
              if (root === '') {
                appendFormData(data[key], key);
              } else {
                appendFormData(data[key], root + '.' + key);
              }
            }
          }
        } else {
          if (data !== null && typeof data !== 'undefined') {
            formData.append(root, data);
          }
        }
      }
    }
    function ignore(root) {
      return (
        Array.isArray(ignoreList) &&
        ignoreList.some(function (x) {
          return x === root;
        })
      );
    }
    appendFormData(obj, rootName);
    return formData;
  }
}
