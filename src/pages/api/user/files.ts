import config from 'lib/config';
import prisma from 'lib/prisma';
import { NextApiReq, NextApiRes, withDraconic } from 'middleware/withDraconic';

async function handler(req: NextApiReq, res: NextApiRes) {
  const user = await req.user();
  if (!user) return res.forbid('Unauthorized');
  if (req.method === 'GET') {
    let files = await prisma.file.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        fileName: true,
        origFileName: true,
        uploadedAt: true,
        mimetype: true,
        slug: true,
        views: true,
        deletionToken: true
      }
    });
    files.forEach(file => {
      const baseUrl = `http${config.core.secure ? 's' : ''}://${req.headers.host}/`;
      file.url = baseUrl + file.slug;
      file.rawUrl = baseUrl + 'r/' + file.fileName;
    });
    return res.json(files.sort((a, b) => a.id - b.id));
  } else {
    return res.forbid('Invalid method');
  }
}

export default withDraconic(handler);