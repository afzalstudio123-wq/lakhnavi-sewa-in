import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const DATA_DIR = path.join(__dirname, '..', 'data');

// Helper functions for reading/writing mock files
const readData = (filename: string): any[] => {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
};

const writeData = (filename: string, data: any[]): void => {
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
};

// 1. Auth APIs
app.post('/api/auth/login', (req, res) => {
  const { phone, role } = req.body;
  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  // Generate a mock 4-digit OTP
  const mockOtp = Math.floor(1000 + Math.random() * 9000).toString();
  
  // Return message and the OTP (so client can show in a toast for the prototype)
  res.json({
    message: 'OTP sent successfully (Simulated)',
    otp: mockOtp,
    phone,
    role
  });
});

app.post('/api/auth/verify-otp', (req, res) => {
  const { phone, role, otp } = req.body;
  if (!phone || !otp) {
    return res.status(400).json({ error: 'Phone and OTP are required' });
  }

  // Determine user identity
  if (role === 'PROVIDER') {
    const providers = readData('providers.json');
    let provider = providers.find(p => p.phone === phone);
    if (!provider) {
      // Auto-register mock provider
      provider = {
        id: `prov_${Date.now()}`,
        name: 'New Partner',
        phone,
        role: 'PROVIDER',
        category: 'Home Repairs & Maintenance',
        rating: 5.0,
        experience_years: 1,
        bio_en: 'Registered as a partner.',
        bio_hi: 'पार्टनर के रूप में पंजीकृत।',
        locality: 'Hazratganj, Lucknow',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
        status: 'PENDING'
      };
      providers.push(provider);
      writeData('providers.json', providers);
    }
    return res.json({ user: provider, token: 'mock-jwt-token' });
  } else {
    const users = readData('users.json');
    let user = users.find(u => u.phone === phone);
    if (!user) {
      // Auto-register customer
      user = {
        id: `usr_${Date.now()}`,
        name: 'Guest User',
        email: '',
        phone,
        role: 'CUSTOMER',
        locality: 'Hazratganj, Lucknow',
        wishlist: [],
        created_at: new Date().toISOString()
      };
      users.push(user);
      writeData('users.json', users);
    }
    return res.json({ user, token: 'mock-jwt-token' });
  }
});

// 2. Services APIs
app.get('/api/services', (req, res) => {
  const { category, search, locality } = req.query;
  let services = readData('services.json');

  if (category) {
    services = services.filter(s => s.category.toLowerCase() === (category as string).toLowerCase());
  }

  if (search) {
    const query = (search as string).toLowerCase();
    services = services.filter(s => 
      s.title_en.toLowerCase().includes(query) || 
      s.title_hi.includes(query) ||
      s.description_en.toLowerCase().includes(query) ||
      s.description_hi.includes(query)
    );
  }

  if (locality) {
    const loc = (locality as string).toLowerCase();
    services = services.filter(s => s.locality.toLowerCase().includes(loc));
  }

  res.json(services);
});

app.get('/api/services/:id', (req, res) => {
  const services = readData('services.json');
  const service = services.find(s => s.id === req.params.id);
  if (!service) {
    return res.status(404).json({ error: 'Service not found' });
  }

  const providers = readData('providers.json');
  const provider = providers.find(p => p.id === service.provider_id);

  res.json({
    ...service,
    provider
  });
});

// 3. Bookings APIs
app.get('/api/bookings', (req, res) => {
  const { customer_id, provider_id } = req.query;
  let bookings = readData('bookings.json');

  if (customer_id) {
    bookings = bookings.filter(b => b.customer_id === customer_id);
  }
  if (provider_id) {
    bookings = bookings.filter(b => b.provider_id === provider_id);
  }

  // Populate service details
  const services = readData('services.json');
  const providers = readData('providers.json');
  const users = readData('users.json');

  const populated = bookings.map(b => {
    const service = services.find(s => s.id === b.service_id);
    const provider = providers.find(p => p.id === b.provider_id);
    const customer = users.find(u => u.id === b.customer_id) || { name: 'New Guest', phone: 'N/A' };
    return {
      ...b,
      service,
      provider,
      customer
    };
  });

  res.json(populated.reverse()); // Show newest bookings first
});

app.post('/api/bookings', (req, res) => {
  const { customer_id, provider_id, service_id, scheduled_date, scheduled_time, address, total_amount } = req.body;
  
  if (!customer_id || !provider_id || !service_id || !scheduled_date || !scheduled_time || !address) {
    return res.status(400).json({ error: 'Missing required booking fields' });
  }

  const bookings = readData('bookings.json');
  const newBooking = {
    id: `bk_${Math.floor(100 + Math.random() * 900)}`,
    customer_id,
    provider_id,
    service_id,
    scheduled_date,
    scheduled_time,
    address,
    status: 'PENDING',
    total_amount: total_amount || 500,
    created_at: new Date().toISOString()
  };

  bookings.push(newBooking);
  writeData('bookings.json', bookings);

  res.status(201).json(newBooking);
});

app.patch('/api/bookings/:id', (req, res) => {
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  const bookings = readData('bookings.json');
  const index = bookings.findIndex(b => b.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  bookings[index].status = status;
  writeData('bookings.json', bookings);

  res.json(bookings[index]);
});

// 4. Provider list (For Admin verification panel)
app.get('/api/providers', (req, res) => {
  const { status } = req.query;
  let providers = readData('providers.json');
  if (status) {
    providers = providers.filter(p => p.status === status);
  }
  res.json(providers);
});

app.patch('/api/providers/:id', (req, res) => {
  const { status } = req.body;
  const providers = readData('providers.json');
  const index = providers.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Provider not found' });
  }

  providers[index].status = status;
  writeData('providers.json', providers);
  res.json(providers[index]);
});

// 5. Admin Analytics mock details
app.get('/api/analytics', (req, res) => {
  const bookings = readData('bookings.json');
  const providers = readData('providers.json');
  const users = readData('users.json');
  const services = readData('services.json');

  // Compute stats
  const totalRevenue = bookings
    .filter(b => b.status === 'COMPLETED')
    .reduce((sum, b) => sum + b.total_amount, 0);

  const stats = {
    totalRevenue,
    bookingsCount: bookings.length,
    completedBookings: bookings.filter(b => b.status === 'COMPLETED').length,
    pendingBookings: bookings.filter(b => b.status === 'PENDING').length,
    confirmedBookings: bookings.filter(b => b.status === 'CONFIRMED').length,
    cancelledBookings: bookings.filter(b => b.status === 'CANCELLED').length,
    providersCount: providers.length,
    pendingProviders: providers.filter(p => p.status === 'PENDING').length,
    customersCount: users.length,
    servicesCount: services.length,
    recentBookings: bookings.slice(-5).reverse(),
    categoriesOverview: [
      { name: 'Beauty & Grooming', count: providers.filter(p => p.category === 'Beauty & Grooming').length },
      { name: 'Home Repairs & Maintenance', count: providers.filter(p => p.category === 'Home Repairs & Maintenance').length },
      { name: 'Cleaning & Pest Control', count: providers.filter(p => p.category === 'Cleaning & Pest Control').length },
      { name: 'Native Smart Products', count: providers.filter(p => p.category === 'Native Smart Products').length },
      { name: 'Indian Labours', count: providers.filter(p => p.category === 'Indian Labours').length },
      { name: 'Contractors & Builders', count: providers.filter(p => p.category === 'Contractors & Builders').length },
    ]
  };

  res.json(stats);
});

// Start Server
app.listen(PORT, () => {
  console.log(`Mock Server is running on port ${PORT}`);
});
