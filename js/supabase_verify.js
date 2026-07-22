/* ==========================================================================
   TASTE OF HEAVEN - BROWSER SUPABASE DIAGNOSTIC & VERIFICATION SUITE
   ========================================================================== */

(function() {
  'use strict';

  const SUPABASE_URL = 'https://ydntmqokhuzbiiymnnvu.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_IFtTkKghS_aT2OpSKElBPg_rMMcRaWX';

  console.log('%c[TASTE OF HEAVEN] Running Supabase Connection Verification...', 'color: #D4AF37; font-weight: bold; font-size: 14px;');

  window.verifySupabaseConnection = async function() {
    const results = {
      hostAvailable: false,
      apiKeyValid: false,
      tablesExist: false,
      readOperation: false,
      writeOperation: false,
      details: []
    };

    // 1. Check REST Endpoint Response
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/menu_items?select=*&limit=1`, {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      });

      results.hostAvailable = true;

      if (response.status === 200) {
        results.apiKeyValid = true;
        results.tablesExist = true;
        results.readOperation = true;
        const data = await response.json();
        results.details.push(`READ Success: Retrieved ${data.length} row(s) from 'menu_items' table.`);
      } else if (response.status === 401) {
        results.details.push(`API Key Warning (HTTP 401): Ensure 'anon' key JWT string is used if table RLS is enabled.`);
      } else if (response.status === 404 || response.status === 400) {
        results.apiKeyValid = true;
        results.details.push(`Table Warning (HTTP ${response.status}): 'menu_items' table may not be created yet. Please execute schema.sql in Supabase SQL Editor.`);
      } else {
        results.details.push(`HTTP Status ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      results.details.push(`Network Exception: ${err.message}`);
    }

    // 2. Test Write Operation on Contact Inquiries
    if (results.apiKeyValid) {
      try {
        const testPayload = {
          name: 'Browser Tester',
          email: 'test@tasteofheaven.com',
          message: 'Connection test message',
          status: 'unread'
        };

        const writeRes = await fetch(`${SUPABASE_URL}/rest/v1/contact_inquiries`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify(testPayload)
        });

        if (writeRes.ok || writeRes.status === 201) {
          results.writeOperation = true;
          const inserted = await writeRes.json();
          results.details.push(`WRITE Success: Created test entry in 'contact_inquiries' table.`);

          // Cleanup test entry
          if (inserted && inserted[0] && inserted[0].id) {
            await fetch(`${SUPABASE_URL}/rest/v1/contact_inquiries?id=eq.${inserted[0].id}`, {
              method: 'DELETE',
              headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
              }
            });
            results.details.push(`DELETE Success: Cleaned up test record.`);
          }
        } else {
          results.details.push(`WRITE Warning (HTTP ${writeRes.status}): Row Level Security (RLS) or missing table.`);
        }
      } catch (err) {
        results.details.push(`Write Exception: ${err.message}`);
      }
    }

    // Console Diagnostics Output
    console.log('%c================ SUPABASE DIAGNOSTIC REPORT ================\n', 'color: #D4AF37; font-weight: bold;');
    console.log(`📡 Supabase Host (ydntmqokhuzbiiymnnvu): ${results.hostAvailable ? 'ONLINE ✅' : 'OFFLINE ❌'}`);
    console.log(`🔑 API Key Authentication:            ${results.apiKeyValid ? 'ACCEPTED ✅' : 'NEEDS CHECK ⚠️'}`);
    console.log(`📖 Read Operations (SELECT):            ${results.readOperation ? 'WORKING ✅' : 'PENDING TABLE CREATION ⚠️'}`);
    console.log(`✍️ Write Operations (INSERT):           ${results.writeOperation ? 'WORKING ✅' : 'PENDING TABLE CREATION ⚠️'}`);
    console.log('\nDetailed Log:');
    results.details.forEach(d => console.log(` • ${d}`));
    console.log('%c============================================================', 'color: #D4AF37; font-weight: bold;');

    return results;
  };

  // Run automatically when loaded in browser
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      setTimeout(window.verifySupabaseConnection, 1000);
    });
  }
})();
