const mysql = require('mysql2/promise');

async function updateScholarship() {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'sfs'
  });

  try {
    await connection.execute(
      `UPDATE scholarship SET 
        GWARequirement = 3.00, 
        Benefits = ?, 
        EligibilityRequirements = ?, 
        ApplicationProcess = ? 
       WHERE ScholarshipID = 7`,
      [
        JSON.stringify(["Full tuition coverage","Monthly allowance"]),
        JSON.stringify({"gwa":"3.0","courses":["All Programs"],"yearLevel":["2nd Year","3rd Year","4th Year"]}),
        JSON.stringify(["Submit application form","Submit proof of enrollment"])
      ]
    );
    console.log('✅ JUAN scholarship updated successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating scholarship:', error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

updateScholarship();
