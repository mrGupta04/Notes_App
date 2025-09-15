const Tenant = require('../models/Tenant');
const User = require('../models/User');

const initDatabase = async () => {
  try {
    const tenants = [
      { slug: 'acme', name: 'Acme Corporation', subscription_plan: 'free' },
      { slug: 'globex', name: 'Globex Corporation', subscription_plan: 'free' }
    ];

    for (const tenantData of tenants) {
      let tenant = await Tenant.findOne({ slug: tenantData.slug });
      if (!tenant) {
        tenant = await Tenant.create(tenantData);
        console.log(`Created tenant: ${tenant.name}`);
      }

      let adminUser = await User.findOne({ email: `admin@${tenant.slug}.test` });
      if (!adminUser) {
        adminUser = new User({
          email: `admin@${tenant.slug}.test`,
          password: 'password',
          role: 'admin',
          tenant: tenant._id
        });
        await adminUser.save();
        console.log(`Created admin user: admin@${tenant.slug}.test`);
      }

      let memberUser = await User.findOne({ email: `user@${tenant.slug}.test` });
      if (!memberUser) {
        memberUser = new User({
          email: `user@${tenant.slug}.test`,
          password: 'password',
          role: 'member',
          tenant: tenant._id
        });
        await memberUser.save();
        console.log(`Created member user: user@${tenant.slug}.test`);
      }
    }

    console.log('Database initialization completed');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
};

module.exports = initDatabase;