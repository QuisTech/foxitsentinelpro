import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const currentDir = process.cwd();
  const apiDir = path.resolve(__dirname);
  
  let structure = {};
  
  try {
    structure['cwd'] = fs.readdirSync(currentDir);
    structure['api_dirname'] = fs.readdirSync(apiDir);
    structure['api_lib_check'] = fs.existsSync(path.join(apiDir, '_lib')) ? fs.readdirSync(path.join(apiDir, '_lib')) : 'No _lib found';
    structure['parent_of_api'] = fs.readdirSync(path.join(apiDir, '..'));
  } catch (e) {
    structure['error'] = e.message;
  }

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({
    message: "FS Debug",
    env: process.env.NODE_ENV,
    structure
  }, null, 2));
}
