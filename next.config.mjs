import * as path from 'path';
import { fileURLToPath } from 'url';
import { withPayload } from '@payloadcms/next/withPayload';

const rootFileName = fileURLToPath(import.meta.url);
const rootDirName = path.dirname(rootFileName);

/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: [path.resolve(rootDirName, 'src/styles')],
  },
};

export default withPayload(nextConfig, {
  devBundleServerPackages: false,
});
