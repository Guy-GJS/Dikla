#!/usr/bin/env node

/**
 * Environment Variables Validation Script
 * 
 * This script checks if all required environment variables are set
 * Run before deploying to catch configuration issues early
 * 
 * Usage: node scripts/check-env.js
 */

const requiredEnvVars = [
  {
    name: 'NEXT_PUBLIC_SUPABASE_URL',
    description: 'Supabase project URL',
    example: 'https://xxxxx.supabase.co',
    scope: 'public'
  },
  {
    name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    description: 'Supabase anonymous/public key',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    scope: 'public'
  },
  {
    name: 'SUPABASE_SERVICE_ROLE_KEY',
    description: 'Supabase service role key (admin access)',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    scope: 'secret'
  },
  {
    name: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    description: 'Stripe publishable key',
    example: 'pk_test_... or pk_live_...',
    scope: 'public'
  },
  {
    name: 'STRIPE_SECRET_KEY',
    description: 'Stripe secret key',
    example: 'sk_test_... or sk_live_...',
    scope: 'secret'
  },
  {
    name: 'STRIPE_WEBHOOK_SECRET',
    description: 'Stripe webhook signing secret',
    example: 'whsec_...',
    scope: 'secret'
  },
  {
    name: 'ADMIN_SECRET',
    description: 'Admin panel password',
    example: 'your-secure-password',
    scope: 'secret'
  },
  {
    name: 'NEXT_PUBLIC_SITE_URL',
    description: 'Your site URL',
    example: 'https://your-site.vercel.app',
    scope: 'public'
  }
];

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function checkEnvironmentVariables() {
  log('\n🔍 Checking Environment Variables...\n', 'bright');
  
  let allPresent = true;
  let hasSecurityIssues = false;
  const missing = [];
  const invalid = [];
  const warnings = [];

  requiredEnvVars.forEach(({ name, description, example, scope }) => {
    const value = process.env[name];
    
    if (!value) {
      allPresent = false;
      missing.push({ name, description, example });
      log(`❌ ${name}`, 'red');
      log(`   ${description}`, 'reset');
      return;
    }

    // Check for placeholder values
    if (value.includes('your-') || value.includes('xxxxx') || value.includes('here')) {
      invalid.push({ name, description });
      log(`⚠️  ${name}`, 'yellow');
      log(`   Still contains placeholder value`, 'yellow');
      hasSecurityIssues = true;
      return;
    }

    // Validate format
    if (name.includes('SUPABASE_URL') && !value.startsWith('https://')) {
      invalid.push({ name, description: 'Should start with https://' });
      log(`⚠️  ${name}`, 'yellow');
      log(`   Invalid URL format`, 'yellow');
      return;
    }

    if (name.includes('STRIPE_PUBLISHABLE_KEY') && !value.startsWith('pk_')) {
      invalid.push({ name, description: 'Should start with pk_test_ or pk_live_' });
      log(`⚠️  ${name}`, 'yellow');
      log(`   Invalid key format`, 'yellow');
      return;
    }

    if (name === 'STRIPE_SECRET_KEY' && !value.startsWith('sk_')) {
      invalid.push({ name, description: 'Should start with sk_test_ or sk_live_' });
      log(`⚠️  ${name}`, 'yellow');
      log(`   Invalid key format`, 'yellow');
      return;
    }

    if (name === 'STRIPE_WEBHOOK_SECRET' && !value.startsWith('whsec_')) {
      invalid.push({ name, description: 'Should start with whsec_' });
      log(`⚠️  ${name}`, 'yellow');
      log(`   Invalid key format`, 'yellow');
      return;
    }

    // Check Stripe key consistency (test vs live)
    if (name === 'STRIPE_SECRET_KEY') {
      const pubKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
      const isSecretTest = value.startsWith('sk_test_');
      const isPubTest = pubKey?.startsWith('pk_test_');
      
      if (isSecretTest !== isPubTest) {
        warnings.push({
          name: 'Stripe Keys Mismatch',
          description: 'Secret key and publishable key are using different modes (test vs live)'
        });
        log(`⚠️  Stripe Key Mismatch`, 'yellow');
        log(`   Secret and publishable keys should both be test or both be live`, 'yellow');
      }
    }

    // Security checks
    if (scope === 'secret' && value.length < 10) {
      warnings.push({
        name,
        description: 'Value seems too short for a secure secret'
      });
      log(`⚠️  ${name}`, 'yellow');
      log(`   Value seems too short`, 'yellow');
      hasSecurityIssues = true;
      return;
    }

    // All good
    log(`✅ ${name}`, 'green');
    if (scope === 'secret') {
      log(`   ${value.substring(0, 10)}...`, 'reset');
    } else {
      log(`   ${value}`, 'reset');
    }
  });

  log('\n' + '─'.repeat(60) + '\n', 'cyan');

  // Summary
  if (allPresent && invalid.length === 0 && warnings.length === 0) {
    log('✅ All environment variables are properly configured!', 'green');
    log('\n🚀 You\'re ready to deploy to Vercel!\n', 'bright');
    return true;
  }

  // Report issues
  if (missing.length > 0) {
    log('\n❌ Missing Environment Variables:\n', 'red');
    missing.forEach(({ name, description, example }) => {
      log(`${name}`, 'bright');
      log(`  Description: ${description}`, 'reset');
      log(`  Example: ${example}`, 'cyan');
      log('', 'reset');
    });
  }

  if (invalid.length > 0) {
    log('\n⚠️  Invalid Environment Variables:\n', 'yellow');
    invalid.forEach(({ name, description }) => {
      log(`${name}`, 'bright');
      log(`  Issue: ${description}`, 'reset');
      log('', 'reset');
    });
  }

  if (warnings.length > 0) {
    log('\n⚠️  Warnings:\n', 'yellow');
    warnings.forEach(({ name, description }) => {
      log(`${name}`, 'bright');
      log(`  ${description}`, 'reset');
      log('', 'reset');
    });
  }

  log('\n📚 For help setting up environment variables:', 'cyan');
  log('   See: env-setup-guide.md\n', 'cyan');

  return false;
}

// Additional checks
function performSecurityChecks() {
  log('\n🔒 Security Checks...\n', 'bright');

  const checks = [];

  // Check if we're exposing secrets in public vars
  const envKeys = Object.keys(process.env);
  envKeys.forEach(key => {
    if (key.startsWith('NEXT_PUBLIC_') && 
        (key.includes('SECRET') || key.includes('PRIVATE') || key.includes('SERVICE_ROLE'))) {
      checks.push({
        status: 'error',
        message: `${key} should NOT be a public variable (NEXT_PUBLIC_)`
      });
    }
  });

  // Check if we're in production with test keys
  const nodeEnv = process.env.NODE_ENV;
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  
  if (nodeEnv === 'production' && stripeKey?.startsWith('sk_test_')) {
    checks.push({
      status: 'warning',
      message: 'Using Stripe test keys in production environment'
    });
  }

  // Check SITE_URL protocol
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl && !siteUrl.startsWith('https://') && !siteUrl.includes('localhost')) {
    checks.push({
      status: 'warning',
      message: 'SITE_URL should use HTTPS in production'
    });
  }

  if (checks.length === 0) {
    log('✅ All security checks passed!', 'green');
  } else {
    checks.forEach(({ status, message }) => {
      if (status === 'error') {
        log(`❌ ${message}`, 'red');
      } else {
        log(`⚠️  ${message}`, 'yellow');
      }
    });
  }

  log('', 'reset');
}

// Main execution
function main() {
  log('╔══════════════════════════════════════════════════════════╗', 'cyan');
  log('║         Dikla/Pritti Environment Check                 ║', 'cyan');
  log('╚══════════════════════════════════════════════════════════╝', 'cyan');

  const isValid = checkEnvironmentVariables();
  performSecurityChecks();

  if (isValid) {
    process.exit(0);
  } else {
    log('❌ Fix the issues above before deploying.\n', 'red');
    process.exit(1);
  }
}

main();

