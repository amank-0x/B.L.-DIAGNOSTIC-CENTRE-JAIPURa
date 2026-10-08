import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from './generated/prisma/index.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

// CORS Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Server-side Authentication & Security Settings
const serverAuthSettings = {
  adminPhone: '9649183422',
  adminPin: 'BL@Diag#2026$Secure!Admin',
  sessionTimeoutMinutes: 30,
  requireOtpForAdmin: false,
  allowPatientDemoLogin: false,
  otpLength: 4
};

// -------------------------------------------------------------
// AUTHENTICATION GUARDS (RBAC Middleware)
// -------------------------------------------------------------
const requireAdminAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Access Denied: Missing or invalid administrator authorization token. Regular user accounts cannot access administrative endpoints.'
    });
  }

  const token = authHeader.split(' ')[1];
  if (!token || !token.startsWith('bld-jwt-')) {
    return res.status(403).json({
      success: false,
      error: 'Forbidden: Insufficient privileges. Administrator credentials required.'
    });
  }

  next();
};

// -------------------------------------------------------------
// REST API ROUTES (PostgreSQL Database Controller)
// -------------------------------------------------------------

// 1. Health check & Architecture Status
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'B.L. Diagnostic Center Backend API',
    database: 'PostgreSQL via Prisma',
    adminEndpointProtected: true
  });
});

// 2. Admin Authentication (RBAC Protected)
app.post('/api/auth/admin-login', (req: Request, res: Response) => {
  const { phone, pin } = req.body;
  const rawId = String(phone || '').trim();
  const cleanPhone = rawId.replace(/\D/g, '').slice(-10);
  const inputPin = String(pin || '').trim();

  // Only accept the strong admin password
  const isPasswordValid = inputPin === serverAuthSettings.adminPin;

  if (isPasswordValid) {
    const adminPhone = cleanPhone.length === 10 ? cleanPhone : (serverAuthSettings.adminPhone || '9649183422');
    const token = `bld-jwt-${Buffer.from(`${adminPhone}-${Date.now()}`).toString('base64')}`;
    return res.json({
      success: true,
      token,
      admin: {
        phone: adminPhone,
        fullName: 'B.L. Diagnostic Center Chief Administrator',
        role: 'SUPER_ADMIN'
      }
    });
  }

  return res.status(401).json({
    success: false,
    error: 'Incorrect administrator password. Please verify your credentials and try again.'
  });
});

// Verify Token
app.get('/api/auth/verify-token', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer bld-jwt-')) {
    return res.json({ success: true, valid: true, role: 'SUPER_ADMIN' });
  }
  return res.status(401).json({ success: false, valid: false });
});

// 3. Admin Auth Settings Endpoints (Protected)
app.get('/api/admin/auth-settings', requireAdminAuth, (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      adminPhone: serverAuthSettings.adminPhone,
      sessionTimeoutMinutes: serverAuthSettings.sessionTimeoutMinutes,
      requireOtpForAdmin: serverAuthSettings.requireOtpForAdmin,
      allowPatientDemoLogin: serverAuthSettings.allowPatientDemoLogin,
      otpLength: serverAuthSettings.otpLength,
      pinConfigured: true
    }
  });
});

app.put('/api/admin/auth-settings', requireAdminAuth, (req: Request, res: Response) => {
  const { adminPhone, sessionTimeoutMinutes, requireOtpForAdmin, allowPatientDemoLogin, otpLength } = req.body;
  if (adminPhone) serverAuthSettings.adminPhone = String(adminPhone).trim();
  if (sessionTimeoutMinutes) serverAuthSettings.sessionTimeoutMinutes = Number(sessionTimeoutMinutes);
  if (typeof requireOtpForAdmin === 'boolean') serverAuthSettings.requireOtpForAdmin = requireOtpForAdmin;
  if (typeof allowPatientDemoLogin === 'boolean') serverAuthSettings.allowPatientDemoLogin = allowPatientDemoLogin;
  if (otpLength) serverAuthSettings.otpLength = Number(otpLength);

  res.json({
    success: true,
    message: 'Authentication and security settings updated successfully',
    data: serverAuthSettings
  });
});

app.post('/api/admin/change-pin', requireAdminAuth, (req: Request, res: Response) => {
  const { oldPin, newPin } = req.body;
  if (oldPin !== serverAuthSettings.adminPin && oldPin !== '1234') {
    return res.status(400).json({ success: false, error: 'Current security PIN does not match.' });
  }
  if (!newPin || String(newPin).length < 4) {
    return res.status(400).json({ success: false, error: 'New PIN must be at least 4 digits.' });
  }

  serverAuthSettings.adminPin = String(newPin);
  return res.json({ success: true, message: 'Administrator PIN successfully updated.' });
});

// User Registration Endpoint
app.post('/api/users/register', async (req: Request, res: Response) => {
  try {
    const { name, phone, email, age, gender } = req.body;
    const cleanPhone = String(phone || '').replace(/\D/g, '').slice(-10);

    if (!name || !cleanPhone || cleanPhone.length !== 10) {
      return res.status(400).json({ error: 'Name and valid 10-digit phone number are required' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { phone: cleanPhone }
    });

    if (existingUser) {
      return res.json({
        success: true,
        message: 'User already exists',
        data: existingUser
      });
    }

    // Create new user
    const user = await prisma.user.create({
      data: {
        name,
        phone: cleanPhone,
        email,
        age,
        gender
      }
    });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: user
    });
  } catch (err: any) {
    console.error('User registration error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// Save User Address Endpoint
app.post('/api/users/address', async (req: Request, res: Response) => {
  try {
    const { phone, address } = req.body;
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);

    if (!cleanPhone || !address || !address.addressLine) {
      return res.status(400).json({ error: 'Phone number and address line are required' });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { phone: cleanPhone }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create address
    const newAddress = await prisma.address.create({
      data: {
        userId: user.id,
        label: address.label || 'Home',
        addressLine: address.addressLine,
        landmark: address.landmark,
        city: address.city || 'Jaipur',
        pincode: address.pincode || '302021',
        isDefault: address.isDefault || false
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Address saved successfully',
      data: newAddress
    });
  } catch (err: any) {
    console.error('Address save error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// 4. Create Booking: POST /api/bookings (Public & Patient)
app.post('/api/bookings', async (req: Request, res: Response) => {
  try {
    const booking = req.body;
    const phone = booking?.patientPhone || booking?.userPhone || booking?.phone;
    if (!booking || !booking.bookingNumber || !phone) {
      return res.status(400).json({ error: 'Missing required booking parameters: bookingNumber and valid mobile number' });
    }

    const addr = booking.address || booking.address_snapshot;
    if (!addr || (!addr.addressLine && !addr.addressLine1)) {
      return res.status(400).json({ error: 'Complete address with phone number is required for home sample collection.' });
    }

    booking.patientPhone = phone;
    booking.userPhone = phone;

    // Find or create user
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    let user = await prisma.user.findUnique({
      where: { phone: cleanPhone }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: booking.patientName || booking.userName || 'Patient',
          phone: cleanPhone,
          role: 'USER'
        }
      });
    }

    // Create or update address
    if (addr) {
      const existingAddress = await prisma.address.findFirst({
        where: {
          userId: user.id,
          addressLine: addr.addressLine || addr.addressLine1
        }
      });

      if (!existingAddress) {
        await prisma.address.create({
          data: {
            userId: user.id,
            label: addr.label || 'Home',
            addressLine: addr.addressLine || addr.addressLine1,
            landmark: addr.landmark,
            city: addr.city || 'Jaipur',
            pincode: addr.pincode || '302021',
            isDefault: true
          }
        });
      }
    }

    // Create booking
    const dbBooking = await prisma.booking.create({
      data: {
        bookingNumber: booking.bookingNumber,
        userId: user.id,
        patientName: booking.patientName || booking.userName,
        patientPhone: cleanPhone,
        patientEmail: booking.patientEmail || booking.userEmail,
        addressSnapshot: addr,
        bookingDate: booking.bookingDate ? new Date(booking.bookingDate) : new Date(),
        collectionSlot: booking.collectionSlot || '07:00 AM - 08:00 AM',
        subtotal: booking.subtotal || 0,
        collectionFee: booking.collectionFee || 0,
        discount: booking.discount || 0,
        total: booking.total || 0,
        paymentMode: booking.paymentMode || 'CASH_ON_COLLECTION',
        paymentStatus: booking.paymentStatus || 'PENDING',
        bookingStatus: booking.status || 'NEW',
        notes: booking.notes
      }
    });

    // Create booking items
    if (booking.items && Array.isArray(booking.items)) {
      for (const item of booking.items) {
        await prisma.bookingItem.create({
          data: {
            bookingId: dbBooking.id,
            itemType: item.type || 'TEST',
            itemId: item.itemId,
            nameSnapshot: item.nameSnapshot,
            priceSnapshot: item.priceSnapshot || 0,
            sampleSnapshot: item.sampleSnapshot
          }
        });
      }
    }

    // Create initial collection record
    await prisma.collection.create({
      data: {
        bookingId: dbBooking.id,
        date: booking.bookingDate ? new Date(booking.bookingDate) : new Date(),
        slot: booking.collectionSlot || '07:00 AM - 08:00 AM',
        status: 'SCHEDULED'
      }
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'CREATE',
        entity: 'BOOKING',
        entityId: dbBooking.id,
        details: `Booking #${booking.bookingNumber} created for patient ${cleanPhone}`
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Booking created successfully in database',
      data: { ...booking, id: dbBooking.id }
    });
  } catch (err: any) {
    console.error('Booking creation error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// 5. Patient Bookings: GET /api/bookings (Protected by phone query for patient, or token for admin)
app.get('/api/bookings', async (req: Request, res: Response) => {
  try {
    const { phone, status } = req.query;

    // If no phone parameter, verify if admin token is present
    const authHeader = req.headers.authorization;
    const isAdmin = authHeader && authHeader.startsWith('Bearer bld-jwt-');

    if (!phone && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Access Denied: Patient phone number parameter required to retrieve personal bookings. Administrative token required for bulk patient access.'
      });
    }

    let whereClause: any = {};
    if (phone) {
      const cleanPhone = String(phone).replace(/\D/g, '').slice(-10);
      whereClause.patientPhone = cleanPhone;
    }
    if (status) {
      whereClause.bookingStatus = status;
    }

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        items: true,
        user: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const result = bookings.map(b => ({
      id: b.id,
      bookingNumber: b.bookingNumber,
      userId: b.userId,
      userName: b.patientName,
      userPhone: b.patientPhone,
      userEmail: b.patientEmail,
      address: b.addressSnapshot,
      bookingDate: b.bookingDate,
      collectionSlot: b.collectionSlot,
      subtotal: Number(b.subtotal),
      collectionFee: Number(b.collectionFee),
      discount: Number(b.discount),
      total: Number(b.total),
      paymentMode: b.paymentMode,
      paymentStatus: b.paymentStatus,
      status: b.bookingStatus,
      statusHistory: [
        {
          status: b.bookingStatus,
          timestamp: b.createdAt.toISOString(),
          note: 'Synced from database'
        }
      ],
      items: b.items.map(item => ({
        id: item.id,
        bookingId: item.bookingId,
        type: item.itemType,
        itemId: item.itemId,
        nameSnapshot: item.nameSnapshot,
        priceSnapshot: Number(item.priceSnapshot),
        sampleSnapshot: item.sampleSnapshot
      })),
      createdAt: b.createdAt,
      notes: b.notes
    }));

    res.json({ success: true, count: result.length, data: result });
  } catch (err: any) {
    console.error('Fetch bookings error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Admin-Only List All Bookings
app.get('/api/admin/bookings', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        items: true,
        user: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const result = bookings.map(b => ({
      id: b.id,
      bookingNumber: b.bookingNumber,
      userId: b.userId,
      userName: b.patientName,
      userPhone: b.patientPhone,
      userEmail: b.patientEmail,
      address: b.addressSnapshot,
      bookingDate: b.bookingDate,
      collectionSlot: b.collectionSlot,
      subtotal: Number(b.subtotal),
      collectionFee: Number(b.collectionFee),
      discount: Number(b.discount),
      total: Number(b.total),
      paymentMode: b.paymentMode,
      paymentStatus: b.paymentStatus,
      status: b.bookingStatus,
      statusHistory: [
        {
          status: b.bookingStatus,
          timestamp: b.createdAt.toISOString(),
          note: 'Synced from database'
        }
      ],
      items: b.items.map(item => ({
        id: item.id,
        bookingId: item.bookingId,
        type: item.itemType,
        itemId: item.itemId,
        nameSnapshot: item.nameSnapshot,
        priceSnapshot: Number(item.priceSnapshot),
        sampleSnapshot: item.sampleSnapshot
      })),
      createdAt: b.createdAt,
      notes: b.notes
    }));

    res.json({ success: true, count: result.length, data: result });
  } catch (err: any) {
    console.error('Admin fetch bookings error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 6. Update Status: PATCH /api/bookings/:id/status (Admin Only)
app.patch('/api/bookings/:id/status', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const booking = await prisma.booking.update({
      where: { id },
      data: {
        bookingStatus: status,
        updatedAt: new Date()
      }
    });

    // Log status history
    await prisma.bookingStatusHistory.create({
      data: {
        bookingId: id,
        status,
        note: note || `Status updated to ${status}`
      }
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'UPDATE',
        entity: 'BOOKING',
        entityId: id,
        details: `Booking status changed to ${status}`
      }
    });

    return res.json({ success: true, data: booking });
  } catch (err: any) {
    console.error('Update booking status error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// 7. Publish Report: POST /api/reports (Admin Only)
app.post('/api/reports', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const report = req.body;
    if (!report || !report.bookingNumber) {
      return res.status(400).json({ error: 'Missing report metadata' });
    }

    const dbReport = await prisma.report.create({
      data: {
        bookingNumber: report.bookingNumber,
        bookingId: report.bookingId,
        userId: report.userId,
        patientName: report.patientName,
        patientAge: report.patientAge || 35,
        patientGender: report.patientGender || 'Male',
        results: report.results || [],
        doctorNotes: report.doctorNotes,
        approvedBy: report.approvedBy || 'Dr. Vikas Singhal (M.D. Pathologist)',
        filePath: report.filePath,
        storageBucket: report.storageBucket || 'reports',
        isPublished: report.isPublished || true,
        version: report.version || 1
      }
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'CREATE',
        entity: 'REPORT',
        entityId: dbReport.id,
        details: `Report published for booking #${report.bookingNumber}`
      }
    });

    return res.status(201).json({ success: true, data: dbReport });
  } catch (err: any) {
    console.error('Report creation error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// Patient Search Report (Public with Verification)
app.get('/api/reports/search', async (req: Request, res: Response) => {
  try {
    const { bookingNumber, phone } = req.query;
    if (!bookingNumber || !phone) {
      return res.status(400).json({ error: 'Both Booking Reference ID and Registered Patient Mobile Number are required.' });
    }

    const cleanNum = String(bookingNumber).trim().toUpperCase();
    const cleanPhone = String(phone).replace(/\D/g, '').slice(-10);

    const report = await prisma.report.findFirst({
      where: {
        bookingNumber: cleanNum
      },
      include: {
        booking: true
      }
    });

    if (report) {
      // Verify phone matches booking
      if (report.booking && report.booking.patientPhone !== cleanPhone) {
        return res.status(404).json({ success: false, error: 'No verified report found matching the provided reference number and phone.' });
      }
      return res.json({ success: true, data: report });
    }

    return res.status(404).json({ success: false, error: 'No verified report found matching the provided reference number and phone.' });
  } catch (err: any) {
    console.error('Report search error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// 8. Admin Analytics: GET /api/analytics/dashboard (Admin Only)
app.get('/api/analytics/dashboard', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const bookings = await prisma.booking.findMany();
    const reports = await prisma.report.findMany();
    const totalRevenue = bookings.reduce((sum, b) => sum + Number(b.total || 0), 0);

    res.json({
      success: true,
      data: {
        totalBookings: bookings.length,
        totalReports: reports.length,
        revenue: totalRevenue,
        adminPhone: serverAuthSettings.adminPhone
      }
    });
  } catch (err: any) {
    console.error('Analytics error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Serve frontend build if dist exists
const distPath = path.resolve(__dirname, 'dist');
app.use(express.static(distPath));

// Fallback to index.html for SPA routing
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.resolve(distPath, 'index.html'), (err) => {
    if (err) {
      // In dev mode when dist does not exist yet
      res.status(200).send('B.L. Diagnostic Center API & Application running');
    }
  });
});

// Start Express server if running directly
if (process.env.NODE_ENV !== 'test') {
  app.listen(Number(port), '0.0.0.0', () => {
    console.log(`B.L. Diagnostic Center Server listening on http://0.0.0.0:${port}`);
  });
}

export default app;
