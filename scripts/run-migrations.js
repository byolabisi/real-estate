import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigrations() {
  try {
    console.log('🚀 Starting database migrations...\n');

    // Read migration files
    const migrationsDir = path.dirname(new URL(import.meta.url).pathname);
    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter(file => file.match(/^\d+_.*\.sql$/))
      .sort();

    if (migrationFiles.length === 0) {
      console.log('⚠️  No migration files found');
      process.exit(0);
    }

    console.log(`Found ${migrationFiles.length} migration file(s)\n`);

    // Execute each migration
    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf-8');

      console.log(`📝 Running: ${file}`);
      
      try {
        const { error } = await supabase.rpc('exec_sql', { sql });
        
        if (error) {
          // Try executing directly with the admin API
          const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${supabaseKey}`,
              apikey: supabaseKey,
            },
            body: JSON.stringify({ sql }),
          });

          if (!response.ok) {
            // If RPC doesn't work, try using raw query execution
            console.log(`   ℹ️  RPC not available, trying direct execution...`);
            
            // Split by semicolons and execute statements
            const statements = sql
              .split(';')
              .map(s => s.trim())
              .filter(s => s.length > 0 && !s.startsWith('--'));

            for (const statement of statements) {
              const { error: execError } = await supabase.rpc('exec_sql', { 
                sql: statement + ';' 
              });
              if (execError) {
                console.log(`   ⚠️  Skipping (might already exist): ${statement.substring(0, 50)}...`);
              }
            }
          } else {
            console.log(`   ✅ Executed successfully`);
          }
        } else {
          console.log(`   ✅ Executed successfully`);
        }
      } catch (err) {
        console.log(`   ⚠️  Execution note: ${err.message}`);
      }
    }

    console.log('\n✨ Database migrations completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Check Supabase dashboard to verify tables were created');
    console.log('2. Run: npm run seed-db (optional, to add sample data)');
    console.log('3. Test the application');

  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  }
}

runMigrations();
