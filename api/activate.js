// api/check.js - 最简单GET版本
let validCodes = [
    "12345678901234567890",
    "23456789012345678901",
    "34567890123456789012"
];
module.exports = async (req, res) => {
    // 允许所有访问
    res.setHeader('Access-Control-Allow-Origin', '*');
    // 从URL参数获取激活码
    const { code } = req.query; // GET请求用req.query
    if (!code || code.length !== 20) {
        return res.json({ ok: false, error: '需要20位激活码' });
    }
    // 检查激活码
    const index = validCodes.indexOf(code);
    if (index === -1) {
        return res.json({ ok: false, error: '激活码无效' });
    } else {
        // 删除已使用的激活码
        validCodes.splice(index, 1);
        return res.json({ ok: true, message: '激活成功' });
    }
};
