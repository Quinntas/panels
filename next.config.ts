import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    images: {
        domains: [],
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    experimental: {
        extensionAlias: {
            '.js': ['.tsx', '.ts', '.jsx', '.js'],
        },
        turbo: {
            resolveAlias: {
                /**
                 * Critical: prevents " ⨯ ./node_modules/canvas/build/Release/canvas.node
                 * Module parse failed: Unexpected character '�' (1:0)" error
                 */
                canvas: './empty-module.ts',
            },
        },
    },
};

export default nextConfig;
