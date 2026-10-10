import http from 'http';

function get(url) {
  return new Promise((resolve, reject) => {
    http
      .get(url, res => {
        let data = '';
        res.on('data', chunk => {
          data += chunk;
        });
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data,
          });
        });
      })
      .on('error', err => {
        reject(err);
      });
  });
}

function post(url, payload) {
  return new Promise((resolve, reject) => {
    const dataStr = JSON.stringify(payload);
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(dataStr),
      },
    };

    const req = http.request(options, res => {
      let data = '';
      res.on('data', chunk => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
        });
      });
    });

    req.on('error', err => {
      reject(err);
    });

    req.write(dataStr);
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting Full-Site & Backend Automated Testing...\n');
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ [FAIL] ${name}: ${err.message}`);
      failed++;
    }
  }

  // 1. Backend Ping & Health
  await test('Backend GET /ping returns 200 pong', async () => {
    const res = await get('http://localhost:5000/ping');
    if (res.statusCode !== 200 || !res.body.includes('pong')) {
      throw new Error(`Expected 200 pong, got ${res.statusCode}: ${res.body}`);
    }
  });

  await test('Backend GET /api/health returns 200 JSON with status', async () => {
    const res = await get('http://localhost:5000/api/health');
    if (res.statusCode !== 200) {
      throw new Error(`Expected 200, got ${res.statusCode}`);
    }
    const json = JSON.parse(res.body);
    if (!json.status && json.status !== 'healthy' && json.status !== 'ok') {
      throw new Error(`Unexpected health payload: ${res.body}`);
    }
  });

  // 2. Auth Endpoint Validation Safety (ensures no 500 unhandled errors)
  await test('Backend POST /api/auth/login handles empty body safely (400)', async () => {
    const res = await post('http://localhost:5000/api/auth/login', {});
    if (res.statusCode !== 400 && res.statusCode !== 422) {
      throw new Error(`Expected 400 validation error, got ${res.statusCode}`);
    }
  });

  await test('Backend POST /api/auth/register handles invalid payload safely (400)', async () => {
    const res = await post('http://localhost:5000/api/auth/register', { email: 'bad-email' });
    if (res.statusCode !== 400 && res.statusCode !== 422) {
      throw new Error(`Expected 400 validation error, got ${res.statusCode}`);
    }
  });

  // 3. Frontend Routes Testing (via Vite dev server http://localhost:3000)
  const routesToTest = [
    '/',
    '/login',
    '/signup',
    '/forgot-password',
    '/privacy',
    '/terms',
    '/contact',
    '/cookie-preferences',
    '/interview-questions',
    '/interview-questions/javascript',
    '/interview-questions/react',
    '/full-stack-interview-roadmap',
    '/dashboard',
    '/skills',
    '/interview/setup',
    '/career-roadmap',
    '/community',
    '/help',
  ];

  for (const route of routesToTest) {
    await test(`Frontend route GET ${route} returns 200 with HTML`, async () => {
      const res = await get(`http://localhost:3000${route}`);
      if (res.statusCode !== 200) {
        throw new Error(`Expected 200, got ${res.statusCode}`);
      }
      if (
        !res.body.includes('<div id="root">') &&
        !res.body.includes('<!DOCTYPE html>') &&
        !res.body.includes('<!doctype html>')
      ) {
        throw new Error(`Response does not contain valid HTML root container`);
      }
    });
  }

  // 4. Static assets & robots.txt / sitemap.xml
  await test('Frontend GET /robots.txt returns valid robots file', async () => {
    const res = await get('http://localhost:3000/robots.txt');
    if (res.statusCode !== 200 || !res.body.toLowerCase().includes('user-agent')) {
      throw new Error(`Robots.txt missing or invalid: ${res.statusCode}`);
    }
  });

  await test('Frontend GET /sitemap.xml returns valid XML sitemap', async () => {
    const res = await get('http://localhost:3000/sitemap.xml');
    if (res.statusCode !== 200 || !res.body.includes('<urlset')) {
      throw new Error(`Sitemap.xml missing or invalid: ${res.statusCode}`);
    }
  });

  console.log(`\n========================================`);
  console.log(`Results: ${passed} passed, ${failed} failed out of ${passed + failed} tests`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
