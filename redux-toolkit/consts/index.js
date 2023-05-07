export default {
    url         : 'https://team-connect.treasuredeal.com/api/v1/',
    illusionUrl : 'https://api.iwtxconnect.com/api/v1/',
};

export const googleMapsApi = 'AIzaSyB3sg_A_7wWVDFQKd8BJ5yjHSHUFO0Kl78'

//Allowable formats
export const IMAGE_FORMATS = ['jpg', 'jpeg', 'jfif', 'pjpeg', 'pjp', 'png','apng','webp','bmp','ico', 'cur'];
export const VIDEO_FORMATS = ['mp4', 'webm', 'ogg'];

export const convertIndexToSerial = (index,currentPage=1,perPage=6) => {
    return ((index+1) + ((currentPage-1) * perPage))
}