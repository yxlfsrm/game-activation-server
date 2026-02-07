let validCodes = [
    "12345678901234567890",
    "23456789012345678901",
    "34567890123456789012"
];
module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { code } = req.query;
    const index = validCodes.indexOf(code);
    if (index === -1) {
        return res.json({ ok: false, error: '激活码无效' });
    } else {
        validCodes.splice(index, 1);
        return res.json({ ok: true, message: '激活成功' });
    }
};
