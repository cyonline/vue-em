var cryptUser = function (str)
{
    var password = "http://www.chinasapi.com";
    var passIndex = 0;
    var passLength = password.length;
    var num = 0;
    var byt = 0;
    var len = str.length;
    var resultStr = "";
    for (var i = 0; i < len; i++)
    {
        var code = str.charCodeAt(i);
        if (code >= 2048)
        {
            byt = (byt << 24) + (((code >> 12) | 0xe0) << 16) + ((((code & 0xfff) >> 6) | 0x80) << 8) + ((code & 0x3f) | 0x80);
            num += 24;
        }
        else if (code >= 128)
        {
            byt = (byt << 16) + (((code >> 6) | 0xc0) << 8) + ((code & 0x3f) | 0x80);
            num += 16;
        }
        else
        {
            num += 8;
            byt = (byt << 8) + code;
        }
        while (num >= 6)
        {
            var b = byt >> (num - 6);
            byt = byt - (b << (num - 6));
            num -= 6;
            b = (b + password.charCodeAt(passIndex++)) % 64;
            passIndex = passIndex % passLength;

            var code = (b <= 9) ? (b + 48) : ((b <= 35) ? (b + 55) : ((b <= 61) ? (b + 61) : ((b == 62) ? 44 : 95)));
            resultStr += String.fromCharCode(code);
        }
    }
    if (num > 0)
    {
        var b = byt << (6 - num);
        b = (b + password.charCodeAt(passIndex++)) % 64;
        passIndex = passIndex % passLength;

        resultStr += String.fromCharCode((b <= 9) ? (b + 48) : ((b <= 35) ? (b + 55) : ((b <= 61) ? (b + 61) : ((b == 62) ? 44 : 95))));
    }
    return resultStr;
}