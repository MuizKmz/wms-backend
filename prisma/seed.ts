import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clean existing data (in correct order due to foreign keys)
  await prisma.auditLog.deleteMany();
  await prisma.shipment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.receivingItem.deleteMany();
  await prisma.receiving.deleteMany();
  await prisma.epc.deleteMany();
  await prisma.corpCode.deleteMany(); // NEW: Clean corp codes
  await prisma.productCertificate.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.section.deleteMany();
  await prisma.rack.deleteMany();
  await prisma.warehouse.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();

  console.log('🗑️  Cleared existing data');

  // Seed Roles
  const adminRole = await prisma.role.create({
    data: {
      name: 'Admin',
      permissions: {
        users: ['create', 'read', 'update', 'delete'],
        warehouses: ['create', 'read', 'update', 'delete'],
        products: ['create', 'read', 'update', 'delete'],
        orders: ['create', 'read', 'update', 'delete'],
        inventory: ['create', 'read', 'update', 'delete'],
      },
    },
  });

  const managerRole = await prisma.role.create({
    data: {
      name: 'Warehouse Manager',
      permissions: {
        warehouses: ['read', 'update'],
        products: ['read', 'update'],
        orders: ['create', 'read', 'update'],
        inventory: ['read', 'update'],
      },
    },
  });

  const operatorRole = await prisma.role.create({
    data: {
      name: 'Warehouse Operator',
      permissions: {
        products: ['read'],
        orders: ['read'],
        inventory: ['read', 'update'],
        receiving: ['create', 'read'],
      },
    },
  });

  console.log('✅ Roles created');

  // Seed Users
  const adminUser = await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@warehouse.com',
      passwordHash: 'password123', // In production, use proper hashing
      fullName: 'System Administrator',
      phone: '+60123456789',
      roleId: adminRole.id,
      language: 'en',
    },
  });

  const managerUser = await prisma.user.create({
    data: {
      username: 'manager1',
      email: 'manager@warehouse.com',
      passwordHash: 'password123',
      fullName: 'John Manager',
      phone: '+60123456790',
      roleId: managerRole.id,
      language: 'en',
    },
  });

  const operatorUser = await prisma.user.create({
    data: {
      username: 'operator1',
      email: 'operator@warehouse.com',
      passwordHash: 'password123',
      fullName: 'Jane Operator',
      phone: '+60123456791',
      roleId: operatorRole.id,
      language: 'en',
    },
  });

  console.log('✅ Users created (password: password123)');

  // Seed Warehouses
  const mainWarehouse = await prisma.warehouse.create({
    data: {
      warehouseCode: 'WH-001',
      name: 'Main Warehouse Johor',
      address: 'Jalan Industri 1, Senai Industrial Park, 81400 Senai, Johor',
      manager: 'John Manager',
      contactPhone: '+60712345678',
      email: 'mainwh@warehouse.com',
      status: 'Active',
      remark: 'Primary warehouse facility',
    },
  });

  const secondaryWarehouse = await prisma.warehouse.create({
    data: {
      warehouseCode: 'WH-002',
      name: 'Secondary Warehouse JB',
      address: 'Jalan Perniagaan 5, Taman Perindustrian, 81100 Johor Bahru',
      manager: 'Sarah Lee',
      contactPhone: '+60712345679',
      email: 'secondarywh@warehouse.com',
      status: 'Active',
    },
  });

  console.log('✅ Warehouses created');

  // Seed Racks
  const rack1 = await prisma.rack.create({
    data: {
      warehouseId: mainWarehouse.id,
      rackCode: 'R-A-001',
      rackName: 'Rack A1',
      rackType: 'Heavy Duty',
      capacity: 1000,
      status: 'Active',
    },
  });

  const rack2 = await prisma.rack.create({
    data: {
      warehouseId: mainWarehouse.id,
      rackCode: 'R-A-002',
      rackName: 'Rack A2',
      rackType: 'Heavy Duty',
      capacity: 1000,
      status: 'Active',
    },
  });

  const rack3 = await prisma.rack.create({
    data: {
      warehouseId: secondaryWarehouse.id,
      rackCode: 'R-B-001',
      rackName: 'Rack B1',
      rackType: 'Standard',
      capacity: 500,
      status: 'Active',
    },
  });

  console.log('✅ Racks created');

  // Seed Sections
  const section1 = await prisma.section.create({
    data: {
      warehouseId: mainWarehouse.id,
      rackId: rack1.id,
      sectionCode: 'S-A001-01',
      sectionName: 'Section A1-01',
      capacity: 100,
      status: 'Active',
    },
  });

  const section2 = await prisma.section.create({
    data: {
      warehouseId: mainWarehouse.id,
      rackId: rack1.id,
      sectionCode: 'S-A001-02',
      sectionName: 'Section A1-02',
      capacity: 100,
      status: 'Active',
    },
  });

  const section3 = await prisma.section.create({
    data: {
      warehouseId: mainWarehouse.id,
      rackId: rack2.id,
      sectionCode: 'S-A002-01',
      sectionName: 'Section A2-01',
      capacity: 100,
      status: 'Active',
    },
  });

  const section4 = await prisma.section.create({
    data: {
      warehouseId: secondaryWarehouse.id,
      rackId: rack3.id,
      sectionCode: 'S-B001-01',
      sectionName: 'Section B1-01',
      capacity: 50,
      status: 'Active',
    },
  });

  console.log('✅ Sections created');

  // Seed Suppliers
  const supplier1 = await prisma.supplier.create({
    data: {
      supplierCode: 'SUP-001',
      supplierName: 'Tech Components Sdn Bhd',
      manager: 'Ahmad Rahman',
      contactPhone: '+60312345678',
      email: 'contact@techcomponents.com.my',
      status: 'Active',
    },
  });

  const supplier2 = await prisma.supplier.create({
    data: {
      supplierCode: 'SUP-002',
      supplierName: 'Global Electronics Supply',
      manager: 'David Tan',
      contactPhone: '+60312345679',
      email: 'sales@globalelec.com',
      status: 'Active',
    },
  });

  console.log('✅ Suppliers created');

  // Seed Customers
  const customer1 = await prisma.customer.create({
    data: {
      customerCode: 'CUS-001',
      customerName: 'ABC Manufacturing Sdn Bhd',
      contactPerson: 'Michael Wong',
      phone: '+60387654321',
      email: 'procurement@abcmfg.com.my',
      address: 'No. 123, Jalan Industri, Taman Perindustrian',
      city: 'Shah Alam',
      status: 'Active',
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      customerCode: 'CUS-002',
      customerName: 'XYZ Retail Sdn Bhd',
      contactPerson: 'Lisa Lim',
      phone: '+60387654322',
      email: 'orders@xyzretail.com',
      address: 'Lot 45, Jalan Perniagaan, Taman Sentosa',
      city: 'Johor Bahru',
      status: 'Active',
    },
  });

  console.log('✅ Customers created');

  // Seed Categories
  const electronicsCategory = await prisma.category.create({
    data: {
      categoryCode: 'CAT-ELEC',
      name: 'Electronics',
      level: 1,
      storageRequirements: 'Climate controlled, humidity < 60%',
      status: 'Active',
    },
  });

  const componentsCategory = await prisma.category.create({
    data: {
      categoryCode: 'CAT-COMP',
      name: 'Electronic Components',
      parentCategoryId: electronicsCategory.id,
      level: 2,
      storageRequirements: 'Dry storage, ESD protection',
      status: 'Active',
    },
  });

  const rawMaterialsCategory = await prisma.category.create({
    data: {
      categoryCode: 'CAT-RAW',
      name: 'Raw Materials',
      level: 1,
      storageRequirements: 'Standard warehouse conditions',
      status: 'Active',
    },
  });

  console.log('✅ Categories created');

  // NEW: Seed Corp Codes (must be 4 hex characters)
  const corpCodeMain = await prisma.corpCode.create({
    data: {
      code: 'AA00',
      label: 'Main Office',
    },
  });

  const corpCodeBranch = await prisma.corpCode.create({
    data: {
      code: 'BB01',
      label: 'Branch Office JB',
    },
  });

  const corpCodeWarehouse = await prisma.corpCode.create({
    data: {
      code: 'CC02',
      label: 'Warehouse Facility',
    },
  });

  console.log('✅ Corp Codes created');

  // Seed Products with SKU codes (must be 8 hex characters for EPC generation)
  const product1 = await prisma.product.create({
    data: {
      skuCode: '12345678', // 8 hex chars
      productCode: 'PROD-001',
      name: 'Resistor 10K Ohm 1/4W',
      categoryId: componentsCategory.id,
      supplierId: supplier1.id,
      status: 'Active',
      remarks: 'Standard tolerance ±5%',
    },
  });

  const product2 = await prisma.product.create({
    data: {
      skuCode: 'ABCDEF01', // 8 hex chars
      productCode: 'PROD-002',
      name: 'Capacitor 100uF 16V',
      categoryId: componentsCategory.id,
      supplierId: supplier1.id,
      status: 'Active',
      remarks: 'Electrolytic capacitor',
    },
  });

  const product3 = await prisma.product.create({
    data: {
      skuCode: '9876FEDC', // 8 hex chars
      productCode: 'PROD-003',
      name: 'Microcontroller ATmega328P',
      categoryId: componentsCategory.id,
      supplierId: supplier2.id,
      status: 'Active',
      remarks: 'Arduino compatible MCU',
    },
  });

  console.log('✅ Products created');

  // Seed Product Certificates
  await prisma.productCertificate.create({
    data: {
      productId: product3.id,
      certificateName: 'RoHS Compliance Certificate',
      certificateFileUrl: '/certificates/rohs-atmega328p.pdf',
    },
  });

  await prisma.productCertificate.create({
    data: {
      productId: product3.id,
      certificateName: 'CE Certificate',
      certificateFileUrl: '/certificates/ce-atmega328p.pdf',
    },
  });

  console.log('✅ Product certificates created');

  // NEW: Seed EPCs with proper format and corp code relations
  // Format: corpCode(4) + skuCode(8) + date(DDMMYY - 6) + serialNumber(6) = 24 chars
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yy = String(today.getFullYear()).slice(-2);
  const dateStr = `${dd}${mm}${yy}`;

  const epcStatuses = ['RECEIVED', 'DELIVERED', 'INBOUND', 'GENERATED', 'RECEIVED', 'INBOUND', 'GENERATED', 'DELIVERED', 'GENERATED', 'RECEIVED'];
  const epcProducts = [product1, product2, product3, product1, product2, product3, product1, product2, product3, product1];
  const epcCorpCodes = [corpCodeMain, corpCodeMain, corpCodeBranch, corpCodeWarehouse, corpCodeMain, corpCodeBranch, corpCodeWarehouse, corpCodeMain, corpCodeBranch, corpCodeWarehouse];
  
  for (let i = 0; i < 10; i++) {
    const product = epcProducts[i];
    const corpCode = epcCorpCodes[i];
    const serialNumber = String(i + 1).padStart(6, '0'); // 000001, 000002, etc.
    const epcCode = `${corpCode.code}${product.skuCode}${dateStr}${serialNumber}`;
    
    await prisma.epc.create({
      data: {
        epcCode,
        productId: product.id,
        corpCodeId: corpCode.id,
        batchName: `Batch ${String(Math.floor(i / 3) + 1).padStart(2, '0')} 2024`,
        batchNumber: (i % 3) + 1, // 1, 2, 3, 1, 2, 3, ...
        status: epcStatuses[i] as any,
      },
    });
  }

  console.log('✅ EPCs created (10 records with proper format and corp codes)');

  // Seed Receivings
  const receiving1 = await prisma.receiving.create({
    data: {
      receivingCode: 'RCV-2024-001',
      doNumber: 'DO-SUP001-2024-001',
      warehouseId: mainWarehouse.id,
      supplierId: supplier1.id,
      receivingDate: new Date('2024-01-15'),
      receivedBy: 'Jane Operator',
      remarks: 'All items in good condition',
      createdBy: operatorUser.id,
    },
  });

  const receiving2 = await prisma.receiving.create({
    data: {
      receivingCode: 'RCV-2024-002',
      doNumber: 'DO-SUP002-2024-001',
      warehouseId: mainWarehouse.id,
      supplierId: supplier2.id,
      receivingDate: new Date('2024-01-20'),
      receivedBy: 'Jane Operator',
      remarks: 'Partial delivery - 2 items pending',
      createdBy: operatorUser.id,
    },
  });

  console.log('✅ Receivings created');

  // Seed Receiving Items
  await prisma.receivingItem.create({
    data: {
      receivingId: receiving1.id,
      productId: product1.id,
      quantity: 5000,
      unit: 'pcs',
    },
  });

  await prisma.receivingItem.create({
    data: {
      receivingId: receiving1.id,
      productId: product2.id,
      quantity: 3000,
      unit: 'pcs',
    },
  });

  await prisma.receivingItem.create({
    data: {
      receivingId: receiving2.id,
      productId: product3.id,
      quantity: 500,
      unit: 'pcs',
    },
  });

  console.log('✅ Receiving items created');

  // Seed Inventory
  await prisma.inventory.create({
    data: {
      productId: product1.id,
      warehouseId: mainWarehouse.id,
      rackId: rack1.id,
      sectionId: section1.id,
      quantity: 4500,
      lastUpdatedAt: new Date(),
    },
  });

  await prisma.inventory.create({
    data: {
      productId: product2.id,
      warehouseId: mainWarehouse.id,
      rackId: rack1.id,
      sectionId: section2.id,
      quantity: 2800,
      lastUpdatedAt: new Date(),
    },
  });

  await prisma.inventory.create({
    data: {
      productId: product3.id,
      warehouseId: mainWarehouse.id,
      rackId: rack2.id,
      sectionId: section3.id,
      quantity: 450,
      lastUpdatedAt: new Date(),
    },
  });

  console.log('✅ Inventory created');

  // Seed Orders (Purchase Orders and Delivery Orders)
  const purchaseOrder = await prisma.order.create({
    data: {
      orderType: 'PO',
      orderNo: 'PO-2024-001',
      supplierId: supplier1.id,
      picName: 'John Manager',
      status: 'Confirmed',
      estimatedDeliveryTime: new Date('2024-02-15'),
      remarks: 'Urgent order for production',
      createdBy: managerUser.id,
    },
  });

  const deliveryOrder1 = await prisma.order.create({
    data: {
      orderType: 'DO',
      orderNo: 'DO-2024-001',
      customerId: customer1.id,
      picName: 'Jane Operator',
      status: 'Processing',
      estimatedDeliveryTime: new Date('2024-02-01'),
      remarks: 'Standard delivery',
      createdBy: operatorUser.id,
    },
  });

  const deliveryOrder2 = await prisma.order.create({
    data: {
      orderType: 'DO',
      orderNo: 'DO-2024-002',
      customerId: customer2.id,
      picName: 'Jane Operator',
      status: 'Shipped',
      estimatedDeliveryTime: new Date('2024-01-25'),
      remarks: 'Express delivery',
      createdBy: operatorUser.id,
    },
  });

  console.log('✅ Orders created');

  // Seed Order Items
  await prisma.orderItem.create({
    data: {
      orderId: purchaseOrder.id,
      productId: product1.id,
      quantity: 10000,
      status: 'Pending',
    },
  });

  await prisma.orderItem.create({
    data: {
      orderId: deliveryOrder1.id,
      productId: product1.id,
      quantity: 500,
      status: 'Allocated',
    },
  });

  await prisma.orderItem.create({
    data: {
      orderId: deliveryOrder1.id,
      productId: product2.id,
      quantity: 200,
      status: 'Allocated',
    },
  });

  await prisma.orderItem.create({
    data: {
      orderId: deliveryOrder2.id,
      productId: product3.id,
      quantity: 50,
      status: 'Shipped',
    },
  });

  console.log('✅ Order items created');

  // Seed Shipments
  await prisma.shipment.create({
    data: {
      trackingCode: 'TRK-2024-001',
      orderId: deliveryOrder2.id,
      carrier: 'DHL Express',
      shippingDate: new Date('2024-01-22'),
      estimatedDeliveryDate: new Date('2024-01-25'),
      destination: 'Lot 45, Jalan Perniagaan, Taman Sentosa, Johor Bahru',
      state: 'In Transit',
      remark: 'Priority delivery',
    },
  });

  await prisma.shipment.create({
    data: {
      trackingCode: 'TRK-2024-002',
      orderId: deliveryOrder1.id,
      carrier: 'Pos Malaysia',
      shippingDate: new Date('2024-01-28'),
      estimatedDeliveryDate: new Date('2024-02-01'),
      destination: 'No. 123, Jalan Industri, Taman Perindustrian, Shah Alam',
      state: 'Preparing',
      remark: 'Standard shipping',
    },
  });

  console.log('✅ Shipments created');

  // Seed Audit Logs
  await prisma.auditLog.create({
    data: {
      userId: operatorUser.id,
      action: 'CREATE',
      tableName: 'receivings',
      rowId: receiving1.id,
      diff: {
        created: {
          receivingCode: 'RCV-2024-001',
          doNumber: 'DO-SUP001-2024-001',
        },
      },
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: managerUser.id,
      action: 'UPDATE',
      tableName: 'orders',
      rowId: deliveryOrder2.id,
      diff: {
        before: { status: 'Processing' },
        after: { status: 'Shipped' },
      },
    },
  });

  console.log('✅ Audit logs created');

  console.log('');
  console.log('🎉 Seeding completed successfully!');
  console.log('');
  console.log('📊 Summary:');
  console.log('   - 3 Roles');
  console.log('   - 3 Users (admin, manager1, operator1)');
  console.log('   - 2 Warehouses');
  console.log('   - 3 Racks');
  console.log('   - 4 Sections');
  console.log('   - 2 Suppliers');
  console.log('   - 2 Customers');
  console.log('   - 3 Categories');
  console.log('   - 3 Corp Codes (AA00, BB01, CC02)');
  console.log('   - 3 Products (with 8-hex SKU codes)');
  console.log('   - 10 EPCs (format: corpCode+skuCode+date+serial, mixed statuses)');
  console.log('   - 2 Receivings');
  console.log('   - 3 Receiving Items');
  console.log('   - 3 Orders (1 PO, 2 DO)');
  console.log('   - 4 Order Items');
  console.log('   - 3 Inventory records');
  console.log('   - 2 Shipments');
  console.log('   - 2 Audit Logs');
  console.log('');
  console.log('🔑 Login credentials:');
  console.log('   Admin: admin@warehouse.com / password123');
  console.log('   Manager: manager@warehouse.com / password123');
  console.log('   Operator: operator@warehouse.com / password123');
  console.log('');
  console.log('📦 Sample EPC Format:');
  console.log(`   Example: AA00${product1.skuCode}${dateStr}000001`);
  console.log('   - Corp Code: AA00 (4 chars)');
  console.log('   - SKU Code: 12345678 (8 chars)');
  console.log(`   - Date: ${dateStr} (DDMMYY - 6 chars)`);
  console.log('   - Serial: 000001 (6 chars)');
  console.log('   Total: 24 characters');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });