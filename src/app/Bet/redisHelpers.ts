// src/lib/redisHelpers.ts
 // if you have node-redis types

export function withTimeout<T>(p: Promise<T>, ms: number, label = 'op'): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`${label} timeout after ${ms}ms`)), ms);
    p.then(v => { clearTimeout(t); resolve(v); }, e => { clearTimeout(t); reject(e); });
  });
}

// Detect node-redis v4 style
function isNodeRedisV4(client: any) {
  return typeof client.eval === 'function' && client.eval.length === 2; // (script, { keys, arguments })
}

export async function evalScript(
  client: any,
  script: string,
  keys: string[],
  args: string[],
  timeoutMs = 600
): Promise<any> {
  if (isNodeRedisV4(client)) {
    // node-redis v4 fast path
    try {
      // Try evalSha first (cache)
      const sha = await withTimeout(client.scriptLoad(script), timeoutMs, 'scriptLoad');
      return await withTimeout(client.evalSha(sha, { keys, arguments: args }), timeoutMs, 'evalSha');
    } catch {
      // Fallback to direct eval
      return await withTimeout(client.eval(script, { keys, arguments: args }), timeoutMs, 'eval');
    }
  }

  // ioredis-style fallback
  try {
    // try evalsha; if NOSCRIPT, load then evalsha
    try {
      return await withTimeout(client.evalsha(scriptSHA(script), keys.length, ...keys, ...args), timeoutMs, 'evalsha');
    } catch (e: any) {
      if (!String(e?.message || '').includes('NOSCRIPT')) throw e;
    }
    const sha = await withTimeout(client.script('LOAD', script), timeoutMs, 'script LOAD');
    return await withTimeout(client.evalsha(sha, keys.length, ...keys, ...args), timeoutMs, 'evalsha2');
  } catch {
    // Absolute last resort: eval(script, numKeys, ...)
    return await withTimeout(client.eval(script, keys.length, ...keys, ...args), timeoutMs, 'evalCompat');
  }
}

// quick sha1
function scriptSHA(s: string) {
  const crypto = require('crypto');
  return crypto.createHash('sha1').update(s).digest('hex');
}
