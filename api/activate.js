const crypto = require('crypto');

let activationDatabase = {};
const validActivationCodes = [
    "GAME-1234-5678-9012",
    "GAME-ABCD-EFGH-IJKL",
    "GAME-2024-ACTV-CODE"
];

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: '只支持POST请求' });
    }
    
    try {
        const { activation_code, machine_id } = req.body;
        
        if (!activation_code || !machine_id) {
            return res.status(400).json({ success: false, error: '缺少参数' });
        }
        
        // 验证激活码格式
        if (!/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(activation_code)) {
            return res.status(400).json({ success: false, error: '格式错误' });
        }
        
        // 检查激活码是否有效
        if (!validActivationCodes.includes(activation_code)) {
            return res.status(400).json({ success: false, error: '激活码无效' });
        }
        
        const dbKey = `${activation_code}|${machine_id}`;
        
        // 检查是否已激活
        if (activationDatabase[dbKey]) {
            return res.json({ success: true, message: '已激活', license: activationDatabase[dbKey] });
        }
        
        // 检查是否被其他设备使用
        const isUsed = Object.keys(activationDatabase).some(key => 
            key.startsWith(activation_code + '|')
        );
        if (isUsed) {
            return res.status(400).json({ success: false, error: '激活码已使用' });
        }
        
        // 生成许可证
        const license = {
            code: activation_code,
            device: machine_id,
            time: new Date().toISOString(),
            expiry: '2099-12-31'
        };
        
        const licenseStr = JSON.stringify(license);
        const encrypted = Buffer.from(licenseStr).toString('base64');
        
        // 保存记录
        activationDatabase[dbKey] = encrypted;
        
        return res.json({ 
            success: true, 
            message: '激活成功',
            license: encrypted 
        });
        
    } catch (error) {
        return res.status(500).json({ success: false, error: '服务器错误' });
    }
};
