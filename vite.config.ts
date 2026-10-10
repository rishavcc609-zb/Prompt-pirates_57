import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

function roadmapApiPlugin(): Plugin {
  return {
    name: 'roadmap-api-plugin',
    configureServer(server) {
      server.middlewares.use('/api/roadmap/generate', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let body = '';
        req.on('data', (chunk: Buffer) => {
          body += chunk.toString();
        });

        req.on('end', async () => {
          try {
            const data = JSON.parse(body || '{}');
            const { jobTitle, industry, currentBackground, targetYears, timelineMonths, currentSkills, weeklyHours } = data;
            if (!jobTitle) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'jobTitle is required' }));
              return;
            }

            const { generateCareerRoadmapWithGemini } = await import('./server/geminiApi.ts');
            const roadmap = await generateCareerRoadmapWithGemini(jobTitle, {
              industry,
              timelineMonths: timelineMonths ? Number(timelineMonths) : undefined,
              currentSkills: Array.isArray(currentSkills) ? currentSkills : [],
              weeklyHours: weeklyHours ? Number(weeklyHours) : undefined,
            });

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ roadmap }));
          } catch (err: any) {
            console.error('Roadmap generation error:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err?.message || 'Failed to generate roadmap' }));
          }
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), roadmapApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
