import { connectToMongo, closeConnection } from '../config/mongoConnection.js';
import { users, services, orders, equipment, checkouts } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';

// Sample Firebase UIDs (in real app, these would come from Firebase Auth)
const FIREBASE_UIDS = {
  staff1: 'firebase_staff_001',
  student1: 'firebase_student_001',
  student2: 'firebase_student_002',
  student3: 'firebase_student_003'
};

async function seedDatabase() {
  try {
    await connectToMongo();
    console.log('🌱 Starting database seed...\n');

    // Clear existing data
    const usersCollection = await users();
    const servicesCollection = await services();
    const ordersCollection = await orders();
    const equipmentCollection = await equipment();
    const checkoutsCollection = await checkouts();

    await usersCollection.deleteMany({});
    await servicesCollection.deleteMany({});
    await ordersCollection.deleteMany({});
    await equipmentCollection.deleteMany({});
    await checkoutsCollection.deleteMany({});

    console.log(' Cleared existing data\n');

    // ==================== SEED USERS ====================
    console.log(' Seeding users...');
    
    const usersData = [
      {
        firebaseUid: FIREBASE_UIDS.staff1,
        email: 'kbyrne3@stevens.edu',
        name: 'Kevin Byrne',
        role: 'staff',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      },
      {
        firebaseUid: FIREBASE_UIDS.student1,
        email: 'jsmith@stevens.edu',
        name: 'John Smith',
        role: 'student',
        createdAt: new Date('2024-09-01'),
        updatedAt: new Date('2024-09-01')
      },
      {
        firebaseUid: FIREBASE_UIDS.student2,
        email: 'mjohnson@stevens.edu',
        name: 'Mary Johnson',
        role: 'student',
        createdAt: new Date('2024-09-03'),
        updatedAt: new Date('2024-09-03')
      },
      {
        firebaseUid: FIREBASE_UIDS.student3,
        email: 'dwilliams@stevens.edu',
        name: 'David Williams',
        role: 'student',
        createdAt: new Date('2024-09-05'),
        updatedAt: new Date('2024-09-05')
      }
    ];

    const insertedUsers = await usersCollection.insertMany(usersData);
    const userIds = Object.values(insertedUsers.insertedIds);
    console.log(` Created ${userIds.length} users\n`);

    // ==================== SEED SERVICES ====================
    console.log(' Seeding services...');
    
    const servicesData = [
      // 3D Printing
      {
        name: 'PLA 3D Print',
        category: '3D Printing',
        type: 'material',
        status: 'available',
        description: 'Standard PLA filament 3D printing. Available in multiple colors.',
        priceType: 'per_unit',
        basePrice: 0,
        pricePerUnit: 0.10,
        unitLabel: 'gram',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'ABS 3D Print',
        category: '3D Printing',
        type: 'material',
        status: 'available',
        description: 'Durable ABS filament for heat-resistant parts.',
        priceType: 'per_unit',
        basePrice: 0,
        pricePerUnit: 0.15,
        unitLabel: 'gram',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'PETG 3D Print',
        category: '3D Printing',
        type: 'material',
        status: 'available',
        description: 'Strong and flexible PETG filament.',
        priceType: 'per_unit',
        basePrice: 0,
        pricePerUnit: 0.12,
        unitLabel: 'gram',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Laser Cutting
      {
        name: 'Acrylic Laser Cut',
        category: 'Laser Cutting',
        type: 'material',
        status: 'available',
        description: '1/8" clear acrylic laser cutting.',
        priceType: 'per_unit',
        basePrice: 5.00,
        pricePerUnit: 0.50,
        unitLabel: 'square inch',
        laserMetadata: {
          thickness: '1/8"',
          material: 'acrylic',
          colors: ['clear', 'black', 'white', 'red', 'blue']
        },
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Wood Laser Cut',
        category: 'Laser Cutting',
        type: 'material',
        status: 'available',
        description: '1/4" plywood laser cutting and engraving.',
        priceType: 'per_unit',
        basePrice: 3.00,
        pricePerUnit: 0.30,
        unitLabel: 'square inch',
        laserMetadata: {
          thickness: '1/4"',
          material: 'plywood'
        },
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Services
      {
        name: 'PCB Fabrication',
        category: 'Electronics',
        type: 'service',
        status: 'available',
        description: 'Custom PCB fabrication service. 2-layer boards.',
        priceType: 'fixed',
        basePrice: 25.00,
        pricePerUnit: 0,
        unitLabel: 'board',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Consultation',
        category: 'Support',
        type: 'service',
        status: 'available',
        description: 'One-on-one consultation with lab staff.',
        priceType: 'fixed',
        basePrice: 0,
        pricePerUnit: 0,
        unitLabel: 'hour',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const insertedServices = await servicesCollection.insertMany(servicesData);
    const serviceIds = Object.values(insertedServices.insertedIds);
    console.log(` Created ${serviceIds.length} services\n`);

    // ==================== SEED EQUIPMENT ====================
    console.log(' Seeding equipment...');
    
    const equipmentData = [
      {
        name: 'Prusa i3 MK3S+ 3D Printer',
        category: '3D Printing',
        location: 'Fab Lab - Station 1',
        status: 'available',
        requiresTraining: true,
        notes: 'Max print size: 250x210x210mm',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Creality Ender 3 V2',
        category: '3D Printing',
        location: 'Fab Lab - Station 2',
        status: 'available',
        requiresTraining: true,
        notes: 'Max print size: 220x220x250mm',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Epilog Laser Cutter',
        category: 'Laser Cutting',
        location: 'Fab Lab - Laser Room',
        status: 'available',
        requiresTraining: true,
        notes: 'Bed size: 24x18 inches. Staff supervision required.',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Soldering Station - Hakko FX888D',
        category: 'Electronics',
        location: 'Fab Lab - Electronics Bench',
        status: 'checked_out',
        requiresTraining: false,
        notes: 'Temperature adjustable soldering iron',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Digital Oscilloscope',
        category: 'Electronics',
        location: 'Fab Lab - Electronics Bench',
        status: 'available',
        requiresTraining: true,
        notes: '100MHz, 4 channels',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Heat Gun',
        category: 'General Tools',
        location: 'Fab Lab - Tool Wall',
        status: 'available',
        requiresTraining: false,
        notes: 'Variable temperature control',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Dremel Rotary Tool',
        category: 'General Tools',
        location: 'Fab Lab - Station 3',
        status: 'maintenance',
        requiresTraining: false,
        notes: 'Motor needs replacement - out of service',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const insertedEquipment = await equipmentCollection.insertMany(equipmentData);
    const equipmentIds = Object.values(insertedEquipment.insertedIds);
    console.log(` Created ${equipmentIds.length} equipment items\n`);

    // ==================== SEED ORDERS ====================
    console.log(' Seeding orders...');
    
    const ordersData = [
      {
        orderNumber: 'FAB-241201-1420-X7K9',
        firebaseUid: FIREBASE_UIDS.student1,
        userId: userIds[1],
        items: [
          {
            serviceId: serviceIds[0], // PLA 3D Print
            serviceName: 'PLA 3D Print',
            quantity: 250,
            unitPrice: 0.10,
            lineTotal: 25.00
          }
        ],
        files: ['robot_arm.stl'],
        totalPrice: 25.00,
        status: 'completed',
        notes: 'Red filament please',
        createdAt: new Date('2024-12-01T14:20:00'),
        updatedAt: new Date('2024-12-03T10:15:00')
      },
      {
        orderNumber: 'FAB-241205-0930-B2M4',
        firebaseUid: FIREBASE_UIDS.student2,
        userId: userIds[2],
        items: [
          {
            serviceId: serviceIds[3], // Acrylic Laser Cut
            serviceName: 'Acrylic Laser Cut',
            quantity: 48,
            unitPrice: 0.50,
            lineTotal: 29.00
          }
        ],
        files: ['project_box.svg'],
        totalPrice: 29.00,
        status: 'in-progress',
        notes: 'Clear acrylic, need by Friday',
        createdAt: new Date('2024-12-05T09:30:00'),
        updatedAt: new Date('2024-12-05T14:22:00')
      },
      {
        orderNumber: 'FAB-241210-1615-P9L3',
        firebaseUid: FIREBASE_UIDS.student3,
        userId: userIds[3],
        items: [
          {
            serviceId: serviceIds[1], // ABS 3D Print
            serviceName: 'ABS 3D Print',
            quantity: 180,
            unitPrice: 0.15,
            lineTotal: 27.00
          },
          {
            serviceId: serviceIds[5], // PCB Fabrication
            serviceName: 'PCB Fabrication',
            quantity: 1,
            unitPrice: 25.00,
            lineTotal: 25.00
          }
        ],
        files: ['drone_frame.stl', 'flight_controller.kicad_pcb'],
        totalPrice: 52.00,
        status: 'submitted',
        notes: 'Final project for CS555 - need by Dec 20',
        createdAt: new Date('2024-12-10T16:15:00'),
        updatedAt: new Date('2024-12-10T16:15:00')
      },
      {
        orderNumber: 'FAB-241212-1045-T5N8',
        firebaseUid: FIREBASE_UIDS.student1,
        userId: userIds[1],
        items: [
          {
            serviceId: serviceIds[4], // Wood Laser Cut
            serviceName: 'Wood Laser Cut',
            quantity: 96,
            unitPrice: 0.30,
            lineTotal: 31.80
          }
        ],
        files: ['picture_frame.svg'],
        totalPrice: 31.80,
        status: 'submitted',
        notes: 'Christmas gift',
        createdAt: new Date('2024-12-12T10:45:00'),
        updatedAt: new Date('2024-12-12T10:45:00')
      }
    ];

    await ordersCollection.insertMany(ordersData);
    console.log(` Created ${ordersData.length} orders\n`);

    // ==================== SEED CHECKOUTS ====================
    console.log('Seeding checkouts...');
    
    const checkoutsData = [
      // Approved checkout (student has equipment)
      {
        equipmentId: equipmentIds[3], // Soldering Station (status: checked_out)
        firebaseUid: FIREBASE_UIDS.student2,
        requestDate: new Date('2024-12-08T09:00:00'),
        checkoutDate: new Date('2024-12-08T10:30:00'),
        dueDate: new Date('2024-12-15T17:00:00'),
        returnedDate: null,
        status: 'approved',
        notes: 'Need for PCB soldering project',
        createdAt: new Date('2024-12-08T09:00:00'),
        updatedAt: new Date('2024-12-08T10:30:00')
      },
      // Pending checkout
      {
        equipmentId: equipmentIds[4], // Oscilloscope
        firebaseUid: FIREBASE_UIDS.student3,
        requestDate: new Date('2024-12-12T14:00:00'),
        checkoutDate: null,
        dueDate: new Date('2024-12-18T17:00:00'),
        returnedDate: null,
        status: 'pending',
        notes: 'Need for signal analysis lab',
        createdAt: new Date('2024-12-12T14:00:00'),
        updatedAt: new Date('2024-12-12T14:00:00')
      },
      // Another pending checkout for same equipment
      {
        equipmentId: equipmentIds[4], // Oscilloscope
        firebaseUid: FIREBASE_UIDS.student1,
        requestDate: new Date('2024-12-13T10:00:00'),
        checkoutDate: null,
        dueDate: new Date('2024-12-20T17:00:00'),
        returnedDate: null,
        status: 'pending',
        notes: 'Final project debugging',
        createdAt: new Date('2024-12-13T10:00:00'),
        updatedAt: new Date('2024-12-13T10:00:00')
      },
      // Returned checkout (past)
      {
        equipmentId: equipmentIds[5], // Heat Gun
        firebaseUid: FIREBASE_UIDS.student1,
        requestDate: new Date('2024-11-20T11:00:00'),
        checkoutDate: new Date('2024-11-20T13:00:00'),
        dueDate: new Date('2024-11-25T17:00:00'),
        returnedDate: new Date('2024-11-24T15:30:00'),
        status: 'returned',
        notes: 'Heat shrink tubing',
        createdAt: new Date('2024-11-20T11:00:00'),
        updatedAt: new Date('2024-11-24T15:30:00')
      },
      // Denied checkout
      {
        equipmentId: equipmentIds[6], // Dremel (status: maintenance)
        firebaseUid: FIREBASE_UIDS.student2,
        requestDate: new Date('2024-12-11T10:00:00'),
        checkoutDate: null,
        dueDate: new Date('2024-12-16T17:00:00'),
        returnedDate: null,
        status: 'denied',
        denialReason: 'Equipment is now under maintenance',
        notes: 'Need for cutting project',
        createdAt: new Date('2024-12-11T10:00:00'),
        updatedAt: new Date('2024-12-11T11:30:00')
      }
    ];

    await checkoutsCollection.insertMany(checkoutsData);
    console.log(` Created ${checkoutsData.length} checkouts\n`);

    // ==================== SUMMARY ====================
    console.log(' Seed completed successfully!\n');
    console.log(' Summary:');
    console.log(`   Users: ${usersData.length} (1 staff, 3 students)`);
    console.log(`   Services: ${servicesData.length} (3D printing, laser cutting, etc.)`);
    console.log(`   Equipment: ${equipmentData.length} (3 available, 1 checked out, 1 maintenance)`);
    console.log(`   Orders: ${ordersData.length} (2 submitted, 1 in-progress, 1 completed)`);
    console.log(`   Checkouts: ${checkoutsData.length} (2 pending, 1 approved, 1 returned, 1 denied)\n`);
    
    console.log(' Test Credentials (Firebase UIDs):');
    console.log('   Staff:    kbyrne3@stevens.edu');
    console.log('   Student1: jsmith@stevens.edu');
    console.log('   Student2: mjohnson@stevens.edu');
    console.log('   Student3: dwilliams@stevens.edu\n');
    
    console.log(' Note: You\'ll need to create these users in Firebase Auth');
    console.log('   with the same emails to test the full flow.\n');

  } catch (error) {
    console.error(' Seed failed:', error);
    process.exit(1);
  } finally {
    await closeConnection();
  }
}

// Run the seed
seedDatabase();