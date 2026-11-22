// OneAll — AI Installation page: prompt builder and copy buttons.
// Without this file the page still shows a working WordPress prompt and the full platform table.
(() => {
  const GUIDE = 'https://docs.oneall.com/ai/install.md';

  const SERVICES = {
    login: { name: 'Social Login', label: 'One-click sign-in' },
    sso: { name: 'Single Sign-On (SSO)', label: 'One sign-in for all your sites' },
    share: { name: 'Social Sharing', label: 'Share buttons' },
  };

  // How the assistant installs each product on each platform. Only official OneAll packages.
  const PLATFORMS = {
    wordpress: {
      name: 'WordPress',
      login: 'the official OneAll Social Login plugin from WordPress.org (oa-social-login)',
      sso: 'the official OneAll Single Sign-On plugin from WordPress.org (single-sign-on-sso)',
      share: 'the official OneAll Social Sharing Icons plugin from WordPress.org (social-sharing-icons). It needs only my API subdomain, not the keys',
      how: 'Use WP-CLI if you can reach my server. If not, guide me through Plugins → Add New.',
    },
    drupal: {
      name: 'Drupal',
      login: 'the official OneAll Social Login module for my Drupal version (7, 8 or 9) from drupal.org or github.com/oneall/social-login-drupal',
      sso: 'the official OneAll Single Sign-On module from drupal.org/project/single_sign_on (Drupal 7 or 8)',
      how: 'Check my Drupal version first. Use Composer or Drush if you can reach my server. If not, guide me through Extend → Install new module.',
      note: { sso: 'Single sign-on is available for Drupal 7 and 8.' },
    },
    joomla: {
      name: 'Joomla!',
      login: 'the official OneAll Social Login package for my Joomla version (1.5 to 4) from github.com/oneall/social-login-joomla',
      how: 'Check my Joomla version first, then install the matching package in Extensions → Install.',
    },
    magento: {
      name: 'Magento',
      login: 'the official OneAll Social Login extension for Magento 1 (github.com/oneall/social-login-magento)',
      sso: 'the official OneAll Single Sign-On extension for Magento 1 (github.com/oneall/single-sign-on-magento)',
      how: 'Install it with Magento Connect, then clear the cache.',
      note: { all: 'The OneAll extensions are for Magento 1. On Magento 2, choose “My own code”.' },
    },
    prestashop: {
      name: 'PrestaShop',
      login: 'the official OneAll Social Login module for my PrestaShop version (1.4 to 1.7) from github.com/oneall/social-login-prestashop',
      how: 'Check my PrestaShop version first, then upload the matching module in Modules.',
    },
    opencart: {
      name: 'OpenCart',
      login: 'the official OneAll Social Login extension for my OpenCart version (1.5 to 4) from the OpenCart marketplace',
      sso: 'the official OneAll Single Sign-On extension for my OpenCart version (2 or 3)',
      how: 'Check my OpenCart version first, then add it with Extensions → Installer.',
      note: { sso: 'Single sign-on is available for OpenCart 2 and 3.' },
    },
    zencart: {
      name: 'Zen Cart',
      login: 'the official OneAll Social Login add-on for Zen Cart 1.5 (github.com/oneall/social-login-zencart)',
      how: 'Copy the files to my store, run the included oneallsociallogin_install.php once, then delete it.',
    },
    whmcs: {
      name: 'WHMCS',
      login: 'the official OneAll Social Login module from the WHMCS Marketplace',
      how: 'Upload it to my WHMCS installation, then activate it in Addon Modules.',
    },
    phpbb: {
      name: 'phpBB',
      login: 'the official OneAll Social Login extension for my phpBB version (3.0 to 3.3) from github.com/oneall/social-login-phpbb',
      sso: 'the official OneAll Single Sign-On extension for phpBB 3.3.5 or newer',
      share: 'the official OneAll Social Sharing extension for phpBB 3.1 or 3.2',
      how: 'Check my phpBB version first, copy the extension to ext/, then enable it in the admin panel.',
      note: { sso: 'Single sign-on needs phpBB 3.3.5 or newer.', share: 'Share buttons are available for phpBB 3.1 and 3.2.' },
    },
    vbulletin: {
      name: 'vBulletin',
      login: 'the official OneAll Social Login product for my vBulletin version (4 or 5) from github.com/oneall/social-login-vbulletin',
      how: 'Upload the files, then import the product XML in the admin panel.',
    },
    smf: {
      name: 'Simple Machines Forum',
      login: 'the official OneAll Social Login mod for my SMF version from the Simple Machines mod site',
      how: 'Install it with the Package Manager.',
    },
    mybb: {
      name: 'MyBB',
      login: 'the official OneAll Social Login plugin for MyBB 1.6 or 1.8 from the MyBB mods site',
      how: 'Upload the files, then activate it in Configuration → Plugins.',
    },
    vanilla: {
      name: 'Vanilla Forums',
      login: 'the official OneAll Social Login addon from the Vanilla addons directory',
      how: 'Upload it to my plugins folder, then enable it in Dashboard → Addons.',
    },
    plesk: {
      name: 'Plesk',
      login: 'the Social Auth extension from the Plesk extensions catalog (made by a OneAll partner)',
      how: 'Install it from Extensions in my Plesk panel.',
    },
    custom: {
      name: 'custom',
      custom: true,
      login: true, sso: true, share: true,
    },
    mobile: {
      name: 'mobile app',
      mobile: true,
      login: true,
      note: { all: 'Your API keys stay on your server. The app only receives a sign-in token.' },
    },
  };

  const svcInputs = [...document.querySelectorAll('input[name="svc"]')];
  const platInputs = [...document.querySelectorAll('input[name="plat"]')];
  const out = document.getElementById('pbtext');
  const title = document.getElementById('pbtitle');
  const note = document.getElementById('pbnote');
  const goClaude = document.getElementById('go-claude');
  const goChatGPT = document.getElementById('go-chatgpt');
  if (!out || !svcInputs.length || !platInputs.length) return;

  const rules = [
    'When you need my OneAll account, I will sign in myself.',
    'Never show my private API key in this chat. Save it with `npx oneall env pull`, or let me paste it into the settings.',
    'Ask before you change my live site, DNS records or existing user accounts. Never change my nameservers.',
  ];

  function build(svcKey, platKey) {
    const svc = SERVICES[svcKey];
    const p = PLATFORMS[platKey];
    const lines = [];

    if (p.custom) {
      lines.push(`Add OneAll ${svc.name} to my website's own code.`, '', `Follow the OneAll AI installation guide: ${GUIDE}`, '');
      lines.push('- Find out which language and framework my site uses. Work on a new Git branch.');
      if (svcKey === 'share') {
        lines.push('- Add the OneAll JavaScript library and the share buttons to my page templates. Share buttons need only my API subdomain.');
      } else {
        lines.push('- Add the OneAll JavaScript library to my sign-in page, plus a server-side callback that receives connection_token and checks it with the OneAll API (GET /connections/{token}.json). Use the OneAll kit for my language if there is one: PHP, Node.js or Python.');
        lines.push('- Store the OneAll user_token next to my user ID. Link a social account to an existing member only after they confirm it, never by email alone.');
      }
      if (svcKey === 'sso') lines.push('- Start the OneAll SSO session after sign-in, and end it on sign-out.');
    } else if (p.mobile) {
      lines.push(`Add OneAll ${svc.name} to my mobile app.`, '', `Follow the OneAll AI installation guide: ${GUIDE}`, '');
      lines.push('- Find out whether my app uses iOS, Android or Ionic/Cordova, and use the matching OneAll mobile kit from github.com/oneall.');
      lines.push('- Never put my API keys in the app. The app gets a connection_token, and my server checks it with the OneAll API.');
      lines.push('- Work on a new Git branch.');
    } else {
      lines.push(`Install OneAll ${svc.name} on my ${p.name} website.`, '', `Follow the OneAll AI installation guide: ${GUIDE}`, '');
      lines.push(`- Use ${p[svcKey]}. ${p.how}`);
    }
    rules.forEach((r) => lines.push(`- ${r}`));
    lines.push('- When you are done, test a real sign-in, run `npx oneall doctor` and tell me what you changed.');
    if (svcKey === 'share') lines[lines.length - 1] = '- When you are done, check that the buttons show on my pages, run `npx oneall doctor` and tell me what you changed.';
    return lines.join('\n');
  }

  const current = (inputs) => (inputs.find((i) => i.checked) || inputs[0]).value;

  function update() {
    const svcKey = current(svcInputs);
    // Platforms without this product cannot be chosen.
    platInputs.forEach((i) => { i.disabled = !PLATFORMS[i.value][svcKey]; });
    let platInput = platInputs.find((i) => i.checked && !i.disabled);
    if (!platInput) { platInput = platInputs.find((i) => !i.disabled); platInput.checked = true; }
    const platKey = platInput.value;
    const p = PLATFORMS[platKey];
    const text = build(svcKey, platKey);
    out.textContent = text;
    const platLabel = platInput.nextElementSibling.lastChild.textContent.trim();
    title.textContent = `Prompt · ${platLabel} · ${SERVICES[svcKey].label}`;
    let n = p.note && (p.note[svcKey] || p.note.all);
    if (svcKey === 'sso') n = `${n ? `${n} ` : ''}Single sign-on is included in plans for companies.`;
    const off = platInputs.filter((i) => i.disabled).length;
    note.textContent = n || (off ? `${SERVICES[svcKey].label} has official plugins for the platforms you can select. For anything else, choose “My own code”.` : '');
    const q = encodeURIComponent(text);
    goClaude.href = `https://claude.ai/new?q=${q}`;
    goChatGPT.href = `https://chatgpt.com/?q=${q}`;
  }

  [...svcInputs, ...platInputs].forEach((i) => i.addEventListener('change', update));
  update();

  // Copy buttons.
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const src = document.getElementById(btn.dataset.copy);
      if (!src) return;
      const text = src.textContent;
      let ok = false;
      try { await navigator.clipboard.writeText(text); ok = true; } catch {
        const ta = Object.assign(document.createElement('textarea'), { value: text });
        ta.style.cssText = 'position:fixed;opacity:0';
        document.body.append(ta); ta.select();
        try { ok = document.execCommand('copy'); } catch { ok = false; }
        ta.remove();
      }
      btn.textContent = ok ? 'Copied' : 'Press ⌘C';
      btn.classList.toggle('done', ok);
      clearTimeout(btn._t);
      btn._t = setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('done'); }, 1800);
    });
  });
})();
