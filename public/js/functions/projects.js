const PROJECT_LIMIT_PER_QUERY = 20;

const statusColors = {
  active: 'rgb(57, 129, 29)',
  upcoming: 'rgb(130, 170, 235)',
  ended: 'rgb(255, 22, 3)'
};
const languageColors = {
  en: 'rgb(57, 129, 29)',
  tr: 'rgb(130, 170, 235)',
  ru: 'rgb(255, 22, 3)'
};
const popularityColors = {
  high: 'rgb(57, 129, 29)',
  medium: 'rgb(255, 215, 0)',
  low: 'rgb(255, 22, 3)'
};

function getProjectLinkIconDOM(link) {
  if (link == 'web') {
    const iconSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    iconSVG.setAttributeNS(null, 'viewBox', '0 0 512 512');
    iconSVG.setAttributeNS(null, 'fill', 'rgb(10, 10, 20)');

    const iconSVGPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    iconSVGPath.setAttributeNS(null, 'd', 'M352 256C352 278.2 350.8 299.6 348.7 320H163.3C161.2 299.6 159.1 278.2 159.1 256C159.1 233.8 161.2 212.4 163.3 192H348.7C350.8 212.4 352 233.8 352 256zM503.9 192C509.2 212.5 512 233.9 512 256C512 278.1 509.2 299.5 503.9 320H380.8C382.9 299.4 384 277.1 384 256C384 234 382.9 212.6 380.8 192H503.9zM493.4 160H376.7C366.7 96.14 346.9 42.62 321.4 8.442C399.8 29.09 463.4 85.94 493.4 160zM344.3 160H167.7C173.8 123.6 183.2 91.38 194.7 65.35C205.2 41.74 216.9 24.61 228.2 13.81C239.4 3.178 248.7 0 256 0C263.3 0 272.6 3.178 283.8 13.81C295.1 24.61 306.8 41.74 317.3 65.35C328.8 91.38 338.2 123.6 344.3 160H344.3zM18.61 160C48.59 85.94 112.2 29.09 190.6 8.442C165.1 42.62 145.3 96.14 135.3 160H18.61zM131.2 192C129.1 212.6 127.1 234 127.1 256C127.1 277.1 129.1 299.4 131.2 320H8.065C2.8 299.5 0 278.1 0 256C0 233.9 2.8 212.5 8.065 192H131.2zM194.7 446.6C183.2 420.6 173.8 388.4 167.7 352H344.3C338.2 388.4 328.8 420.6 317.3 446.6C306.8 470.3 295.1 487.4 283.8 498.2C272.6 508.8 263.3 512 255.1 512C248.7 512 239.4 508.8 228.2 498.2C216.9 487.4 205.2 470.3 194.7 446.6H194.7zM190.6 503.6C112.2 482.9 48.59 426.1 18.61 352H135.3C145.3 415.9 165.1 469.4 190.6 503.6V503.6zM321.4 503.6C346.9 469.4 366.7 415.9 376.7 352H493.4C463.4 426.1 399.8 482.9 321.4 503.6V503.6z');
    iconSVG.appendChild(iconSVGPath);

    return iconSVG;
  } else if (link == 'github') {
    const iconSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    iconSVG.setAttributeNS(null, 'viewBox', '0 0 496 512');
    iconSVG.setAttributeNS(null, 'fill', 'rgb(10, 10, 20)');

    const iconSVGPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    iconSVGPath.setAttributeNS(null, 'd', 'M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z');
    iconSVG.appendChild(iconSVGPath);

    return iconSVG;
  } else if (link == 'telegram') {
    const iconSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    iconSVG.setAttributeNS(null, 'viewBox', '0 0 496 512');
    iconSVG.setAttributeNS(null, 'fill', 'rgb(10, 10, 20)');

    const iconSVGPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    iconSVGPath.setAttributeNS(null, 'd', 'M248,8C111.033,8,0,119.033,0,256S111.033,504,248,504,496,392.967,496,256,384.967,8,248,8ZM362.952,176.66c-3.732,39.215-19.881,134.378-28.1,178.3-3.476,18.584-10.322,24.816-16.948,25.425-14.4,1.326-25.338-9.517-39.287-18.661-21.827-14.308-34.158-23.215-55.346-37.177-24.485-16.135-8.612-25,5.342-39.5,3.652-3.793,67.107-61.51,68.335-66.746.153-.655.3-3.1-1.154-4.384s-3.59-.849-5.135-.5q-3.283.746-104.608,69.142-14.845,10.194-26.894,9.934c-8.855-.191-25.888-5.006-38.551-9.123-15.531-5.048-27.875-7.717-26.8-16.291q.84-6.7,18.45-13.7,108.446-47.248,144.628-62.3c68.872-28.647,83.183-33.623,92.511-33.789,2.052-.034,6.639.474,9.61,2.885a10.452,10.452,0,0,1,3.53,6.716A43.765,43.765,0,0,1,362.952,176.66Z');
    iconSVG.appendChild(iconSVGPath);

    return iconSVG;
  } else if (link == 'medium') {
    const iconSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    iconSVG.setAttributeNS(null, 'viewBox', '0 0 448 512');
    iconSVG.setAttributeNS(null, 'fill', 'rgb(10, 10, 20)');

    const iconSVGPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    iconSVGPath.setAttributeNS(null, 'd', 'M448 64.01v384c0 17.67-14.31 32-32 32s-32-14.33-32-32V169.7l-133.4 200.1c-11.88 17.81-41.38 17.81-53.25 0L64 169.7v278.3c0 17.67-14.31 32-32 32s-32-14.33-32-32v-384c0-14.09 9.219-26.55 22.72-30.63c13.47-4.156 28.09 1.141 35.91 12.88L224 294.3l165.4-248.1c7.812-11.73 22.47-17.03 35.91-12.88C438.8 37.47 448 49.92 448 64.01z');
    iconSVG.appendChild(iconSVGPath);

    return iconSVG;
  } else if (link == 'twitter') {
    const iconSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    iconSVG.setAttributeNS(null, 'viewBox', '0 0 512 512');
    iconSVG.setAttributeNS(null, 'fill', 'rgb(10, 10, 20)');

    const iconSVGPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    iconSVGPath.setAttributeNS(null, 'd', 'M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z');
    iconSVG.appendChild(iconSVGPath);

    return iconSVG;
  } else if (link == 'instagram') {
    const iconSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    iconSVG.setAttributeNS(null, 'viewBox', '0 0 448 512');
    iconSVG.setAttributeNS(null, 'fill', 'rgb(10, 10, 20)');

    const iconSVGPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    iconSVGPath.setAttributeNS(null, 'd', 'M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z');
    iconSVG.appendChild(iconSVGPath);

    return iconSVG;
  } else if (link == 'gitbook') {
    const iconSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    iconSVG.setAttributeNS(null, 'viewBox', '0 0 400 500');
    iconSVG.setAttributeNS(null, 'fill', 'rgb(10, 10, 20)');

    const iconSVGPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    iconSVGPath.setAttributeNS(null, 'd', 'M308.374 408.042C318.591 408.042 327.786 416.246 327.786 427.526C327.786 437.78 319.612 447.009 308.374 447.009C298.157 447.009 288.962 438.805 288.962 427.526C288.962 416.246 298.157 408.042 308.374 408.042ZM608.744 289.093C598.527 289.093 589.332 280.89 589.332 269.61C589.332 259.356 597.505 250.127 608.744 250.127C618.96 250.127 628.155 258.331 628.155 269.61C628.155 279.865 618.96 289.093 608.744 289.093ZM608.744 210.136C576.05 210.136 549.487 236.797 549.487 269.61C549.487 275.763 550.509 281.916 552.552 288.068L357.414 392.661C346.176 376.254 327.786 367.026 308.374 367.026C285.897 367.026 265.464 380.356 255.247 399.839L79.521 307.551C61.131 297.297 46.8277 267.56 48.8711 238.848C49.8927 224.492 55.0011 213.212 62.1527 209.111C67.261 206.034 72.3694 207.06 79.521 210.136C126.518 234.746 279.767 315.754 285.897 318.831C296.114 322.932 301.222 324.983 318.591 316.78L633.263 152.712C638.372 150.661 643.48 146.56 643.48 139.382C643.48 130.153 634.285 126.051 634.285 126.051C615.895 117.848 588.31 104.517 561.747 92.2123C504.534 65.5513 439.147 34.7886 410.541 19.4073C386.021 6.07681 365.587 17.3565 362.522 19.4073C232.771 85.0343 53.9794 173.221 43.7627 179.373C26.3944 189.627 15.1561 211.161 14.1345 237.822C12.0911 279.865 33.5461 323.958 64.196 339.339L250.139 435.729C254.226 464.441 279.767 487 308.374 487C341.067 487 366.609 461.364 367.631 428.551L571.964 317.805C582.18 326.009 595.462 330.11 608.744 330.11C641.437 330.11 668 303.449 668 270.636C668 236.797 641.437 210.136 608.744 210.136Z');
    iconSVG.appendChild(iconSVGPath);

    return iconSVG;
  } else if (link == 'docs') {
    const iconSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    iconSVG.setAttributeNS(null, 'viewBox', '0 0 384 512');
    iconSVG.setAttributeNS(null, 'fill', 'rgb(10, 10, 20)');

    const iconSVGPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    iconSVGPath.setAttributeNS(null, 'd', 'M224 128L224 0H48C21.49 0 0 21.49 0 48v416C0 490.5 21.49 512 48 512h288c26.51 0 48-21.49 48-48V160h-127.1C238.3 160 224 145.7 224 128zM281.5 240h23.37c7.717 0 13.43 7.18 11.69 14.7l-42.46 184C272.9 444.1 268 448 262.5 448h-29.26c-5.426 0-10.18-3.641-11.59-8.883L192 329.1l-29.61 109.1C160.1 444.4 156.2 448 150.8 448H121.5c-5.588 0-10.44-3.859-11.69-9.305l-42.46-184C65.66 247.2 71.37 240 79.08 240h23.37c5.588 0 10.44 3.859 11.69 9.301L137.8 352L165.6 248.9C167 243.6 171.8 240 177.2 240h29.61c5.426 0 10.18 3.641 11.59 8.883L246.2 352l23.7-102.7C271.1 243.9 275.1 240 281.5 240zM256 0v128h128L256 0z');
    iconSVG.appendChild(iconSVGPath);

    return iconSVG;
  } else if (link == 'explorer') {
    const iconSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    iconSVG.setAttributeNS(null, 'viewBox', '0 0 448 512');
    iconSVG.setAttributeNS(null, 'fill', 'rgb(10, 10, 20)');

    const iconSVGPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    iconSVGPath.setAttributeNS(null, 'd', 'M384 32C419.3 32 448 60.65 448 96V416C448 451.3 419.3 480 384 480H64C28.65 480 0 451.3 0 416V96C0 60.65 28.65 32 64 32H384zM128 224C110.3 224 96 238.3 96 256V352C96 369.7 110.3 384 128 384C145.7 384 160 369.7 160 352V256C160 238.3 145.7 224 128 224zM192 352C192 369.7 206.3 384 224 384C241.7 384 256 369.7 256 352V160C256 142.3 241.7 128 224 128C206.3 128 192 142.3 192 160V352zM320 288C302.3 288 288 302.3 288 320V352C288 369.7 302.3 384 320 384C337.7 384 352 369.7 352 352V320C352 302.3 337.7 288 320 288z');
    iconSVG.appendChild(iconSVGPath);

    return iconSVG;
  } else {
    const iconSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    iconSVG.setAttributeNS(null, 'viewBox', '0 0 640 512');
    iconSVG.setAttributeNS(null, 'fill', 'rgb(10, 10, 20)');

    const iconSVGPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    iconSVGPath.setAttributeNS(null, 'd', 'M172.5 131.1C228.1 75.51 320.5 75.51 376.1 131.1C426.1 181.1 433.5 260.8 392.4 318.3L391.3 319.9C381 334.2 361 337.6 346.7 327.3C332.3 317 328.9 297 339.2 282.7L340.3 281.1C363.2 249 359.6 205.1 331.7 177.2C300.3 145.8 249.2 145.8 217.7 177.2L105.5 289.5C73.99 320.1 73.99 372 105.5 403.5C133.3 431.4 177.3 435 209.3 412.1L210.9 410.1C225.3 400.7 245.3 404 255.5 418.4C265.8 432.8 262.5 452.8 248.1 463.1L246.5 464.2C188.1 505.3 110.2 498.7 60.21 448.8C3.741 392.3 3.741 300.7 60.21 244.3L172.5 131.1zM467.5 380C411 436.5 319.5 436.5 263 380C213 330 206.5 251.2 247.6 193.7L248.7 192.1C258.1 177.8 278.1 174.4 293.3 184.7C307.7 194.1 311.1 214.1 300.8 229.3L299.7 230.9C276.8 262.1 280.4 306.9 308.3 334.8C339.7 366.2 390.8 366.2 422.3 334.8L534.5 222.5C566 191 566 139.1 534.5 108.5C506.7 80.63 462.7 76.99 430.7 99.9L429.1 101C414.7 111.3 394.7 107.1 384.5 93.58C374.2 79.2 377.5 59.21 391.9 48.94L393.5 47.82C451 6.731 529.8 13.25 579.8 63.24C636.3 119.7 636.3 211.3 579.8 267.7L467.5 380z');
    iconSVG.appendChild(iconSVGPath);

    return iconSVG;
  }
}

let is_admin = false;
let language = null;
let isUploadFistCall = true;
let isUploadingFinished = false;
let projects = [];
let projectIds = [];

function uploadProjects() {
  if (isUploadingFinished)
    return;

  const filters = {
    language,
    limit: PROJECT_LIMIT_PER_QUERY,
    nin_id_list: projectIds
  };

  if (!is_admin)
    filters.is_active = true;

  serverRequest('/projects/filter', 'POST', filters, res => {
    if (!res.success) {
      if (isUploadFistCall && document.querySelector('.projects-wrapper'))
        document.querySelector('.projects-wrapper').innerHTML = 'Upload Error. Please try again later.';
      isUploadingFinished = true;

      return createConfirm({
        title: 'An unexpected error occured',
        text: 'An unexpected error occured while loading the projects. Please try again later or contact our team. Thank you for your understanding.',
        accept: 'Close'
      }, res => { return; });
    }

    if (isUploadFistCall) {
      isUploadFistCall = false;

      if (document.querySelector('.projects-wrapper')) {
        if (res.projects && res.projects.length) {
          document.querySelector('.projects-wrapper').style.alingItems = 'initial';
          document.querySelector('.projects-wrapper').style.justifyContent = 'initial';
          document.querySelector('.projects-wrapper').innerHTML = '';
        } else {
          document.querySelector('.projects-wrapper').innerHTML = 'No projects found.';
        }
      }
    }

    for (let i = 0; i < res.projects.length; i++) {
      projects.push(res.projects[i]);
      projectIds.push(res.projects[i]._id.toString());

      if (typeof createProject == 'function'){
        createProject(res.projects[i]);
      }if (typeof createSearchProject == 'function')
        createSearchProject(res.projects[i]);
    }

    if (res.projects && res.projects.length)
      uploadProjects();
    else
      isUploadingFinished  = true;
  });
}

window.addEventListener('load', () => {
  if (document.getElementById('language'))
    language = document.getElementById('language').value;
  if (document.getElementById('is-admin'))
    is_admin = true;
  uploadProjects();
});
