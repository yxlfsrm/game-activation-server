const fs = require('fs');
module.exports = async(req, res) = >
{
	res.setHeader('Access-Control-Allow-Origin', '*');
	const code = req.query.code;
	const sourceFile = process.cwd() + '/codes.txt';
	const packetFile = '/tmp/game.dat';
	let data = '';
	if (fs.existsSync(packetFile))
		data = fs.readFileSync(packetFile, 'utf8');
	else
		data = fs.readFileSync(sourceFile, 'utf8');
	const codes = data.split('\n').filter(c = >c.length == = 20);
	const idx = codes.indexOf(code);
	if (idx == = -1)
		return res.json(
						   {
  ok: false, error:	   '激活码无效'}
	);
	codes.splice(idx, 1);
	fs.writeFileSync(packetFile, codes.join('\n'));
	return res.json(
					   {
  ok:				   true}
	);
};