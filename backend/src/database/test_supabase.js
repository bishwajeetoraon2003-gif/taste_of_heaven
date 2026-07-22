const dotenv = require('dotenv');
dotenv.config();

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ydntmqokhuzbiiymnnvu.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_IFtTkKghS_aT2OpSKElBPg_rMMcRaWX';

console.log('====================================================');
console.log('  TASTE OF HEAVEN - SUPABASE CONNECTION TEST SUITE  ');
console.log('====================================================');
console.log(`📍 Supabase URL: ${SUPABASE_URL}`);
console.log(`🔑 Key Prefix:   ${SUPABASE_KEY.substring(0, 15)}...`);
console.log('----------------------------------------------------');

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function runTests() {
  const report = {
    connection: false,
    read: false,
    write: false,
    update: false,
    delete: false,
    errors: []
  };

  try {
    // 1. TEST READ OPERATION
    console.log('\n[TEST 1/4] Testing READ operation on menu_items...');
    const { data: menuData, error: readError } = await supabase.from('menu_items').select('*').limit(5);

    if (readError) {
      console.error('❌ READ Failed:', readError.message);
      report.errors.push(`READ Error: ${readError.message} (${readError.code || 'NO_CODE'})`);
    } else {
      report.connection = true;
      report.read = true;
      console.log(`✅ READ Success! Retrieved ${menuData.length} item(s) from menu_items.`);
    }

    // 2. TEST WRITE OPERATION
    console.log('\n[TEST 2/4] Testing WRITE operation (Inserting test contact inquiry)...');
    const testInquiry = {
      name: 'Supabase Tester Bot',
      email: 'test@supabase-verify.com',
      phone: '+1 555 000 9999',
      message: 'Automated Supabase connection & write verification test.',
      status: 'unread'
    };

    const { data: insertData, error: writeError } = await supabase.from('contact_inquiries').insert([testInquiry]).select().single();

    if (writeError) {
      console.error('❌ WRITE Failed:', writeError.message);
      report.errors.push(`WRITE Error: ${writeError.message} (${writeError.code || 'NO_CODE'})`);
    } else {
      report.write = true;
      console.log(`✅ WRITE Success! Created contact inquiry ID: ${insertData.id}`);

      // 3. TEST UPDATE OPERATION
      console.log('\n[TEST 3/4] Testing UPDATE operation...');
      const { data: updateData, error: updateError } = await supabase
        .from('contact_inquiries')
        .update({ status: 'read' })
        .eq('id', insertData.id)
        .select()
        .single();

      if (updateError) {
        console.error('❌ UPDATE Failed:', updateError.message);
        report.errors.push(`UPDATE Error: ${updateError.message}`);
      } else {
        report.update = true;
        console.log(`✅ UPDATE Success! Inquiry ID ${updateData.id} status updated to '${updateData.status}'.`);
      }

      // 4. TEST DELETE OPERATION
      console.log('\n[TEST 4/4] Testing DELETE cleanup operation...');
      const { error: deleteError } = await supabase
        .from('contact_inquiries')
        .delete()
        .eq('id', insertData.id);

      if (deleteError) {
        console.error('❌ DELETE Failed:', deleteError.message);
        report.errors.push(`DELETE Error: ${deleteError.message}`);
      } else {
        report.delete = true;
        console.log(`✅ DELETE Success! Cleaned up test inquiry ID ${insertData.id}.`);
      }
    }
  } catch (err) {
    console.error('💥 Unexpected Test Exception:', err.message);
    report.errors.push(`Exception: ${err.message}`);
  }

  console.log('\n====================================================');
  console.log('                 FINAL TEST REPORT                  ');
  console.log('====================================================');
  console.log(`🔌 Database Connection: ${report.connection ? 'SUCCESS ✅' : 'FAILED ❌'}`);
  console.log(`📖 Read Operations:     ${report.read ? 'SUCCESS ✅' : 'FAILED ❌'}`);
  console.log(`✍️ Write Operations:    ${report.write ? 'SUCCESS ✅' : 'FAILED ❌'}`);
  console.log(`🔄 Update Operations:   ${report.update ? 'SUCCESS ✅' : 'FAILED ❌'}`);
  console.log(`🗑️ Delete Operations:   ${report.delete ? 'SUCCESS ✅' : 'FAILED ❌'}`);

  if (report.errors.length > 0) {
    console.log('\n⚠️ ERRORS DETECTED / REMEDIATION NEEDED:');
    report.errors.forEach((err, idx) => console.log(`   ${idx + 1}. ${err}`));
  } else {
    console.log('\n🎉 ALL TESTS PASSED PERFECTLY! YOUR SUPABASE CONNECTION IS 100% HEALTHY!');
  }
  console.log('====================================================\n');
}

runTests();
