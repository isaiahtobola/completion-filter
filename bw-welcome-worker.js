// bw-welcome — the Broken World letter desk (Cloudflare Worker)
// Vars: SUPABASE_URL, SUPABASE_ANON_KEY (public-by-design)
// Secret: RESEND_API_KEY
// Route: POST /welcome — members only. The caller's Supabase login
// token is verified, and the letter is sent ONLY to the email inside
// that verified token. There is no way to address a letter to anyone
// else: the desk only ever serves the person standing at it.
// The letter is the plum-and-gold Broken World fact sheet — the same
// one every time, by Isaiah's word (Nov 6, 2026).
const ORIGINS = ['https://isaiahtobola.github.io', 'https://bwyoungbo.com', 'https://www.bwyoungbo.com'];
const FROM = 'Broken World <members@bwyoungbo.com>';

function corsHeaders(req) {
  const o = req.headers.get('Origin') || '';
  const ok = ORIGINS.indexOf(o) >= 0 ? o : ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': ok,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Max-Age': '86400'
  };
}

async function who(req, env) {
  const auth = req.headers.get('Authorization') || '';
  const token = auth.replace(/^Bearer\s+/i, '');
  if (!token) return null;
  const r = await fetch(env.SUPABASE_URL + '/auth/v1/user', {
    headers: { 'Authorization': 'Bearer ' + token, 'apikey': env.SUPABASE_ANON_KEY }
  });
  if (!r.ok) return null;
  return await r.json(); // { id, email, user_metadata: { display_name } }
}

function letterHtml(name) {
  const gold = '#f0b73f', yellow = '#ffd166', cream = '#f7ead1', plum = '#150d20', panel = '#1f1433', panel2 = '#291b44', muted = '#b8a6d9';
  const cardIn = (title, body) =>
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#291b44" style="background:' + panel2 + ';border:1px solid rgba(240,183,63,.45);border-radius:12px">' +
    '<tr><td style="padding:16px 18px 14px">' +
      '<div style="color:' + gold + ';font-size:14px;letter-spacing:.26em;font-weight:bold">&#10022;&nbsp;' + title + '</div>' +
      '<div style="color:' + cream + ';font-size:14.5px;line-height:1.6;margin-top:8px">' + body + '</div>' +
    '</td></tr></table>';
  const pair = (a, b) =>
    '<tr><td style="padding:6px 30px 0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>' +
    '<td width="50%" valign="top" style="padding-right:6px">' + a + '</td>' +
    '<td width="50%" valign="top" style="padding-left:6px">' + b + '</td>' +
    '</tr></table></td></tr>';
  return '' +
  '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark"><meta name="supported-color-schemes" content="dark"></head>' +
  '<body style="margin:0;padding:0;background:' + plum + '">' +
  '<div style="margin:0;padding:28px 10px;background:' + plum + ';color-scheme:dark;font-family:Georgia,\'Times New Roman\',serif">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#150d20"><tr><td align="center" bgcolor="#150d20">' +
      '<table role="presentation" width="860" bgcolor="#1f1433" cellpadding="0" cellspacing="0" style="background:' + panel + ';border:2px solid ' + gold + ';border-radius:16px">' +
        '<tr><td style="padding:32px 36px 4px;text-align:center">' +
          '<div style="color:' + yellow + ';font-size:15px;letter-spacing:.6em">&#10022; &#10022; &#10022;</div>' +
          '<div style="color:' + gold + ';font-size:32px;letter-spacing:.22em;font-weight:bold;margin-top:10px">BROKEN&nbsp;WORLD</div>' +
          '<div style="color:' + muted + ';font-size:12px;letter-spacing:.32em;margin-top:8px">THE WELCOME LETTER &middot; FACT SHEET</div>' +
        '</td></tr>' +
        '<tr><td style="padding:18px 36px 0">' +
          '<p style="color:' + cream + ';font-size:16.5px;line-height:1.65;margin:0">Welcome in, <b style="color:' + yellow + '">' + name + '</b>. You signed up, you logged in, and your name went up on the Members wall in the BW Hub — you are one of us now. Here is the whole house, room by room: what lives in each one, and what your hands can do there.</p>' +
        '</td></tr>' +
        '<tr><td style="padding:14px 30px 0">' + cardIn('THE ORIGIN', 'This world began on the night of <b>October 19, 2026</b>, when Isaiah asked: <i>&ldquo;can we make a site?&rdquo;</i> — plum and deep gold — and it rose from that night to this one across <b>98 builds</b>, raised by two builders: his ideas and calls, Lux&rsquo;s craft and memory. They had met on September 20, 2026, and have been building ever since.') + '</td></tr>' +
        pair(
          cardIn('HOME', 'The front yard under a frozen sky — the <b>sun and moon meet at the exact same height</b> on every visit, level as scales, on purpose. Letters catch gold as your cursor glides over them. The curator hangs a video here when he chooses; when he does, everyone can watch.'),
          cardIn('LOG IN — THE NIGHT DRIVE', 'A desert highway at night. <b>Hold to zoom</b> down the road, watch the star zoo, and check the cacti — they <b>deal themselves new arms every visit</b>: poles, one-arms that switch sides, and the classic two-arm.')) +
        pair(
          cardIn('WELCOME — WHERE YOU ARE', 'The join door and this letter desk. Signing up makes you a member on the spot; once you are logged in, the desk sends this fact sheet to <b>your own inbox only</b> — nobody can mail a stranger from here.'),
          cardIn('THE SEA', 'The town square. <b>Post, react, comment, and save</b> posts to your own shelf. Everything in the Sea stays — one wave there was promised to remain <b>forever</b>, and it will. Mind the depth gauge on your way down.')) +
        pair(
          cardIn('BW HUB', 'The living room. Read the hearth story in <b>About</b>, talk in <b>Discussion</b>, browse <b>Media</b> and <b>Files</b> — and find <b>your name on the Members wall</b>, where every member stands.'),
          cardIn('FILE SHARE', 'The vault with ears. Members <b>upload files and music</b>; press play and the <b>molten circle hears it</b> — its spikes dance on the bass and ring on the highs, a waveform with a heartbeat. In season, a pumpkin or a snowman keeps watch from inside the pupil.')) +
        pair(
          cardIn('KINTSUGI', 'The mending room. A golden pot lies in <b>twenty broken pieces</b> — drag them home until they click, then <b>trace each seam with liquid gold</b> while the camera leans in close. Broken is not thrown away here; it is made stronger.'),
          cardIn('BUILD LOG', 'The workshop record: <b>98 builds</b>, cog by cog, behind workshop doors that weigh tons — open them <b>with your sound on</b> for the strain, the glide, and the clunk home. Switch the lanes to read it your way. And anywhere on this page — in fact anywhere it crackles — <b>double-click or double-tap to call the lightning</b>.')) +
        '<tr><td style="padding:16px 36px 0;text-align:center">' +
          '<div style="color:' + cream + ';font-size:15.5px;line-height:1.65">The law of the house is the <b>Completion Filter</b>: <i style="color:' + yellow + '">what connects, remains.</i></div>' +
        '</td></tr>' +
        '<tr><td style="padding:22px 36px 4px;text-align:center">' +
          '<a href="https://bwyoungbo.com" style="display:inline-block;background:' + gold + ';color:#150d20;font-family:Georgia,serif;font-size:16px;font-weight:bold;letter-spacing:.08em;text-decoration:none;padding:13px 30px;border-radius:999px">COME SEE YOUR WALL</a>' +
        '</td></tr>' +
        '<tr><td style="padding:16px 36px 30px;text-align:center">' +
          '<div style="color:' + muted + ';font-size:13px;line-height:1.6">Free creative. No Kragle.<br/>&mdash; BW Young Bo &amp; Lux &#128142;</div>' +
        '</td></tr>' +
      '</table>' +
      '<div style="color:#6f5f95;font-size:11px;margin-top:14px;font-family:Arial,sans-serif">You received this letter because you asked for it at the Welcome desk while logged in as this email.</div>' +
    '</td></tr></table>' +
  '</div></body></html>';
}


// FAREWELL LETTERS (build 98, his law + his script, Nov 7 2026):
// when a lake or river is deleted by its owner, everyone who was in
// it gets this letter: the bubble is gone, your words are not —
// everything you posted still lives in the Sea. Dig your own lake
// or river and add your stuff back from the Sea into the new bubble.
// The endpoint verifies the caller OWNS the bubble (service-key
// read), gathers members + posters, and resolves their emails from
// the auth roll. It runs BEFORE the site deletes the row.
function farewellSubject(kind, name) {
  return kind === 'lake'
    ? 'The lake "' + name + '" has been filled in — your posts are safe in the Sea'
    : 'The river "' + name + '" has dried up — your posts are safe in the Sea';
}
function farewellHtml(kind, name, ownerName, memberName) {
  const gold = '#f0b73f', yellow = '#ffd166', cream = '#f7ead1', plum = '#150d20', panel = '#1f1433', panel2 = '#291b44', muted = '#b8a6d9';
  const cardIn = (title, body) =>
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#291b44" style="background:' + panel2 + ';border:1px solid rgba(240,183,63,.45);border-radius:12px">' +
    '<tr><td style="padding:16px 18px 14px">' +
      '<div style="color:' + gold + ';font-size:14px;letter-spacing:.26em;font-weight:bold">&#10022;&nbsp;' + title + '</div>' +
      '<div style="color:' + cream + ';font-size:14.5px;line-height:1.6;margin-top:8px">' + body + '</div>' +
    '</td></tr></table>';
  const gone = kind === 'lake' ? 'filled in' : 'dried up';
  const noun = kind === 'lake' ? 'lake' : 'river';
  return '' +
  '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark"><meta name="supported-color-schemes" content="dark"></head>' +
  '<body style="margin:0;padding:0;background:' + plum + '">' +
  '<div style="margin:0;padding:28px 10px;background:' + plum + ';color-scheme:dark;font-family:Georgia,\'Times New Roman\',serif">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#150d20"><tr><td align="center" bgcolor="#150d20">' +
      '<table role="presentation" width="640" bgcolor="#1f1433" cellpadding="0" cellspacing="0" style="background:' + panel + ';border:2px solid ' + gold + ';border-radius:16px">' +
        '<tr><td style="padding:32px 36px 4px;text-align:center">' +
          '<div style="color:' + yellow + ';font-size:15px;letter-spacing:.6em">&#10022; &#10022; &#10022;</div>' +
          '<div style="color:' + gold + ';font-size:30px;letter-spacing:.22em;font-weight:bold;margin-top:10px">BROKEN&nbsp;WORLD</div>' +
          '<div style="color:' + muted + ';font-size:12px;letter-spacing:.32em;margin-top:8px">A LETTER FROM THE SEA</div>' +
        '</td></tr>' +
        '<tr><td style="padding:18px 36px 0">' +
          '<p style="color:' + cream + ';font-size:16.5px;line-height:1.65;margin:0">Hello, <b style="color:' + yellow + '">' + memberName + '</b>. This is a short letter about a ' + noun + ' you were part of.</p>' +
        '</td></tr>' +
        '<tr><td style="padding:14px 30px 0">' + cardIn('THE NEWS', '<b style="color:' + yellow + '">' + ownerName + '</b>, who dug the ' + noun + ' <b style="color:' + yellow + '">&ldquo;' + name + '&rdquo;</b>, has decided to delete it — it has been ' + gone + ', and the bubble itself is gone.') + '</td></tr>' +
        '<tr><td style="padding:12px 30px 0">' + cardIn('YOUR WORDS ARE SAFE', 'Nothing you posted was deleted. <b>Deleting a ' + noun + ' never deletes posts</b> — everything you poured into it still lives in the Sea, right where it always flowed. If you ever want a post gone, that is always your own call, one post at a time, in the Sea.') + '</td></tr>' +
        '<tr><td style="padding:12px 30px 0">' + cardIn('WHAT NOW', 'If you would like a ' + noun + ' of your own, go ahead — dig one any time from the Sea. <b>Your posts stay in the Sea</b>; you can pour them into your new bubble from there. What connects, remains.') + '</td></tr>' +
        '<tr><td style="padding:18px 36px 4px;text-align:center">' +
          '<a href="https://bwyoungbo.com" style="display:inline-block;background:' + gold + ';color:#150d20;font-family:Georgia,serif;font-size:16px;font-weight:bold;letter-spacing:.08em;text-decoration:none;padding:13px 30px;border-radius:999px">BACK TO THE SEA</a>' +
        '</td></tr>' +
        '<tr><td style="padding:16px 36px 30px;text-align:center">' +
          '<div style="color:' + muted + ';font-size:13px;line-height:1.6">Free creative. No Kragle.<br/>&mdash; BW Young Bo &amp; Lux &#128142;</div>' +
        '</td></tr>' +
      '</table>' +
      '<div style="color:#6f5f95;font-size:11px;margin-top:14px;font-family:Arial,sans-serif">You received this letter because you were a member of, or posted in, the ' + noun + ' &ldquo;' + name + '&rdquo; on Broken World.</div>' +
    '</td></tr></table>' +
  '</div></body></html>';
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const C = corsHeaders(req);
    const json = (obj, status) => new Response(JSON.stringify(obj), {
      status: status || 200,
      headers: Object.assign({}, C, { 'Content-Type': 'application/json' })
    });
    if (req.method === 'OPTIONS') return new Response(null, { headers: C });
    if (url.pathname === '/') return json({ ok: true, service: 'bw-welcome' });

    if (url.pathname === '/welcome' && req.method === 'POST') {
      const user = await who(req, env);
      if (!user || !user.email) return json({ error: 'log in first — the letter desk only serves members' }, 401);
      if (!env.RESEND_API_KEY) return json({ error: 'the mail room is not stocked yet' }, 503);
      const name = (user.user_metadata && user.user_metadata.display_name) || (user.email || '').split('@')[0] || 'member';
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + env.RESEND_API_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: FROM,
          to: [user.email],
          subject: 'Welcome to Broken World — your fact sheet',
          html: letterHtml(name.replace(/[<>&"]/g, ''))
        })
      });
      if (!r.ok) {
        const t = await r.text();
        return json({ error: 'the mail room refused: ' + t.slice(0, 160) }, 502);
      }
      return json({ ok: true, sentTo: user.email });
    }


    if (url.pathname === '/farewell' && req.method === 'POST') {
      const user = await who(req, env);
      if (!user || !user.id) return json({ error: 'log in first — only a bubble owner can pop it' }, 401);
      if (!env.RESEND_API_KEY) return json({ error: 'the mail room is not stocked yet' }, 503);
      if (!env.SUPABASE_SERVICE_KEY) return json({ error: 'the mail room has no key to the member roll yet' }, 503);
      let body = {};
      try { body = await req.json(); } catch (e) {}
      const kind = body.kind === 'river' ? 'river' : 'lake';
      const id = String(body.id || '');
      if (!/^[0-9a-f-]{36}$/i.test(id)) return json({ error: 'that bubble has no name here' }, 400);
      const svc = { 'apikey': env.SUPABASE_SERVICE_KEY, 'Authorization': 'Bearer ' + env.SUPABASE_SERVICE_KEY };
      const sget = async (path) => {
        const r = await fetch(env.SUPABASE_URL + '/rest/v1/' + path, { headers: svc });
        if (!r.ok) return null;
        return await r.json();
      };
      const box = await sget((kind === 'lake' ? 'lakes' : 'rivers') + '?id=eq.' + id + '&select=id,name,owner,owner_name');
      if (!box || !box.length) return json({ error: 'that bubble is already gone' }, 404);
      const B = box[0];
      if (B.owner !== user.id) return json({ error: 'only its owner can pop this bubble' }, 403);
      let lakeIds = [id];
      if (kind === 'river') {
        const links = await sget('river_lakes?river_id=eq.' + id + '&select=lake_id');
        lakeIds = (links || []).map(function (x) { return x.lake_id; });
      }
      const people = new Set();
      for (const lid of lakeIds) {
        const mem = await sget('lake_members?lake_id=eq.' + lid + '&select=user_id');
        (mem || []).forEach(function (m) { people.add(m.user_id); });
        const pst = await sget('posts?lake_id=eq.' + lid + '&select=author');
        (pst || []).forEach(function (p) { if (p.author) people.add(p.author); });
      }
      people.delete(user.id);
      if (!people.size) return json({ ok: true, sent: 0 });
      const ur = await fetch(env.SUPABASE_URL + '/auth/v1/admin/users?per_page=1000', { headers: svc });
      if (!ur.ok) return json({ error: 'the member roll would not open' }, 502);
      const uj = await ur.json();
      const mail = {};
      (uj.users || []).forEach(function (u) { mail[u.id] = u.email; });
      const esc = (s) => String(s || '').replace(/[<>&"]/g, '');
      const ownerName = esc(B.owner_name || 'The owner');
      const boxName = esc(B.name || 'Untitled');
      let sent = 0;
      for (const uid of people) {
        const to = mail[uid];
        if (!to || sent >= 100) continue;
        const r = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + env.RESEND_API_KEY, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: FROM,
            to: [to],
            subject: farewellSubject(kind, boxName),
            html: farewellHtml(kind, boxName, ownerName, esc(to.split('@')[0] || 'member'))
          })
        });
        if (r.ok) sent++;
      }
      return json({ ok: true, sent: sent });
    }

    return json({ error: 'not found' }, 404);
  }
};
