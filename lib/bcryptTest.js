const crypto = require('crypto');
crypto.createHash('sha512').update('비밀번호').digest('base64'); // 'dvfV6nyLRRt3NxKSlTHOkkEGgqW2HRtfu19Ou/psUXvwlebbXCboxIPmDYOFRIpqav2eUTBFuHaZri5x+usy1g=='
crypto.createHash('sha512').update('비밀번호').digest('base64'); // 위와 같은 결과

const hash = crypto.createHash('sha512').update('1111').digest('base64');
console.log(hash);

