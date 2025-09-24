import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // --- Master Data ---
  await prisma.role.createMany({
    data: [
      { roleName: 'Admin' },
      { roleName: 'Planner' },
      { roleName: 'Chemist' },
      { roleName: 'QC' },
      { roleName: 'QA' },
      { roleName: 'Operator' },
    ],
    skipDuplicates: true,
  });

  const [adminRole, plannerRole, chemistRole, qcRole, qaRole, operatorRole] = await Promise.all([
    prisma.role.findUnique({ where: { roleName: 'Admin' } }),
    prisma.role.findUnique({ where: { roleName: 'Planner' } }),
    prisma.role.findUnique({ where: { roleName: 'Chemist' } }),
    prisma.role.findUnique({ where: { roleName: 'QC' } }),
    prisma.role.findUnique({ where: { roleName: 'QA' } }),
    prisma.role.findUnique({ where: { roleName: 'Operator' } }),
  ]);

  await prisma.user.createMany({
    data: [
      { username: 'admin', fullName: 'System Admin', passwordHash: 'admin123', roleId: adminRole?.id!, isActive: true },
      { username: 'planner1', fullName: 'John Planner', passwordHash: 'planner123', roleId: plannerRole?.id!, isActive: true },
      { username: 'chemist1', fullName: 'Alice Chemist', passwordHash: 'chemist123', roleId: chemistRole?.id!, isActive: true },
      { username: 'qc1', fullName: 'Bob QC', passwordHash: 'qc123', roleId: qcRole?.id!, isActive: true },
      { username: 'qa1', fullName: 'Carol QA', passwordHash: 'qa123', roleId: qaRole?.id!, isActive: true },
      { username: 'operator1', fullName: 'Dave Operator', passwordHash: 'operator123', roleId: operatorRole?.id!, isActive: true },
      { username: 'operator2', fullName: 'Eve Operator', passwordHash: 'operator123', roleId: operatorRole?.id!, isActive: true },
    ],
    skipDuplicates: true,
  });

  await prisma.supplier.createMany({
    data: [
      { supplierName: 'Global Chemicals' },
      { supplierName: 'Metals Inc.' },
      { supplierName: 'Polymer Solutions' },
    ],
    skipDuplicates: true,
  });
  
  const [supplier1, supplier2, supplier3] = await Promise.all([
    prisma.supplier.findFirst({ where: { supplierName: 'Global Chemicals' } }),
    prisma.supplier.findFirst({ where: { supplierName: 'Metals Inc.' } }),
    prisma.supplier.findFirst({ where: { supplierName: 'Polymer Solutions' } }),
  ]);

  await prisma.material.createMany({
    data: [
      { materialCode: 'MAT001', materialName: 'Steel Bar', supplierId: supplier2?.id, specs: { grade: 'A36', length: '6m', temperature: 'ambient' } },
      { materialCode: 'MAT002', materialName: 'Aluminium Sheet', supplierId: supplier2?.id, specs: { thickness: '2mm', size: '1x2m', grade: '6061' } },
      { materialCode: 'MAT003', materialName: 'Plastic Resin ABS', supplierId: supplier1?.id, specs: { type: 'ABS', color: 'White', mfi: '20' } },
      { materialCode: 'MAT004', materialName: 'Plastic Resin PP', supplierId: supplier3?.id, specs: { type: 'PP', color: 'Natural', mfi: '12' } },
      { materialCode: 'MAT005', materialName: 'Carbon Black', supplierId: supplier1?.id, specs: { type: 'N330', particle_size: '28nm' } },
    ],
    skipDuplicates: true,
  });
  
  const [mat1, mat2, mat3, mat4, mat5] = await Promise.all([
    prisma.material.findUnique({ where: { materialCode: 'MAT001' } }),
    prisma.material.findUnique({ where: { materialCode: 'MAT002' } }),
    prisma.material.findUnique({ where: { materialCode: 'MAT003' } }),
    prisma.material.findUnique({ where: { materialCode: 'MAT004' } }),
    prisma.material.findUnique({ where: { materialCode: 'MAT005' } }),
  ]);

  await prisma.product.createMany({
    data: [
      { productCode: 'PROD001', productName: 'Widget A' },
      { productCode: 'PROD002', productName: 'Gadget B' },
      { productCode: 'PROD003', productName: 'Component C' },
    ],
    skipDuplicates: true,
  });
  
  const [prod1, prod2, prod3] = await Promise.all([
    prisma.product.findUnique({ where: { productCode: 'PROD001' } }),
    prisma.product.findUnique({ where: { productCode: 'PROD002' } }),
    prisma.product.findUnique({ where: { productCode: 'PROD003' } }),
  ]);

  await prisma.machine.createMany({
    data: [
      { machineCode: 'MC001', name: 'Injection Molder #1', department: 'Molding', status: 'Available', location: 'Plant 1 - Section A' },
      { machineCode: 'MC002', name: 'Press Machine #1', department: 'Stamping', status: 'Available', location: 'Plant 1 - Section B' },
      { machineCode: 'MC003', name: 'Injection Molder #2', department: 'Molding', status: 'Available', location: 'Plant 1 - Section A' },
    ],
    skipDuplicates: true,
  });
  
  const [machine1, machine2, machine3] = await Promise.all([
    prisma.machine.findUnique({ where: { machineCode: 'MC001' } }),
    prisma.machine.findUnique({ where: { machineCode: 'MC002' } }),
    prisma.machine.findUnique({ where: { machineCode: 'MC003' } }),
  ]);

  // Create Tools
  await prisma.tool.createMany({
    data: [
      { machineId: machine1?.id!, identifier: 'TOOL001', code: 'T-001', name: 'Injection Tool A', type: 'Injection', lifeLimit: 100000, totalCycles: 0, status: 'Available' },
      { machineId: machine2?.id!, identifier: 'TOOL002', code: 'T-002', name: 'Press Tool B', type: 'Press', lifeLimit: 50000, totalCycles: 0, status: 'Available' },
      { machineId: machine3?.id!, identifier: 'TOOL003', code: 'T-003', name: 'Injection Tool C', type: 'Injection', lifeLimit: 80000, totalCycles: 0, status: 'Available' },
    ],
    skipDuplicates: true,
  });

  // Create Moulds
  await prisma.mould.createMany({
    data: [
      { machineId: machine1?.id!, identifier: 'MOULD001', code: 'M-001', name: 'Widget A Mould', type: 'Injection', cavityCount: 2, lifeLimit: 500000, totalCycles: 0, status: 'Available' },
      { machineId: machine2?.id!, identifier: 'MOULD002', code: 'M-002', name: 'Gadget B Die', type: 'Stamping', cavityCount: 1, lifeLimit: 200000, totalCycles: 0, status: 'Available' },
      { machineId: machine3?.id!, identifier: 'MOULD003', code: 'M-003', name: 'Component C Mould', type: 'Injection', cavityCount: 4, lifeLimit: 300000, totalCycles: 0, status: 'Available' },
    ],
    skipDuplicates: true,
  });

  const [tool1, tool2, tool3] = await Promise.all([
    prisma.tool.findUnique({ where: { identifier: 'TOOL001' } }),
    prisma.tool.findUnique({ where: { identifier: 'TOOL002' } }),
    prisma.tool.findUnique({ where: { identifier: 'TOOL003' } }),
  ]);

  const [mould1, mould2, mould3] = await Promise.all([
    prisma.mould.findUnique({ where: { identifier: 'MOULD001' } }),
    prisma.mould.findUnique({ where: { identifier: 'MOULD002' } }),
    prisma.mould.findUnique({ where: { identifier: 'MOULD003' } }),
  ]);

  // --- Transactional Data ---
  // BOM
  await prisma.bom.createMany({
    data: [
      { productId: prod1?.id!, revision: 'A', isDefault: true },
      { productId: prod2?.id!, revision: 'A', isDefault: true },
      { productId: prod3?.id!, revision: 'A', isDefault: true },
      { productId: prod1?.id!, revision: 'B', isDefault: false },
    ],
    skipDuplicates: true,
  });
  
  const [bom1, bom2, bom3, bom1B] = await Promise.all([
    prisma.bom.findFirst({ where: { productId: prod1?.id!, revision: 'A' } }),
    prisma.bom.findFirst({ where: { productId: prod2?.id!, revision: 'A' } }),
    prisma.bom.findFirst({ where: { productId: prod3?.id!, revision: 'A' } }),
    prisma.bom.findFirst({ where: { productId: prod1?.id!, revision: 'B' } }),
  ]);

  await prisma.bomItem.createMany({
    data: [
      // BOM for Widget A (Rev A)
      { bomId: bom1?.id!, materialId: mat1?.id!, quantity: 10.5, unitOfMeasure: 'kg' },
      { bomId: bom1?.id!, materialId: mat3?.id!, quantity: 5.2, unitOfMeasure: 'kg' },
      { bomId: bom1?.id!, materialId: mat5?.id!, quantity: 0.1, unitOfMeasure: 'kg' },
      
      // BOM for Gadget B
      { bomId: bom2?.id!, materialId: mat2?.id!, quantity: 8.0, unitOfMeasure: 'pcs' },
      { bomId: bom2?.id!, materialId: mat4?.id!, quantity: 2.5, unitOfMeasure: 'kg' },
      
      // BOM for Component C
      { bomId: bom3?.id!, materialId: mat3?.id!, quantity: 15.0, unitOfMeasure: 'kg' },
      { bomId: bom3?.id!, materialId: mat5?.id!, quantity: 0.5, unitOfMeasure: 'kg' },
      
      // BOM for Widget A (Rev B) - Updated formula
      { bomId: bom1B?.id!, materialId: mat1?.id!, quantity: 12.0, unitOfMeasure: 'kg' },
      { bomId: bom1B?.id!, materialId: mat3?.id!, quantity: 4.8, unitOfMeasure: 'kg' },
      { bomId: bom1B?.id!, materialId: mat5?.id!, quantity: 0.2, unitOfMeasure: 'kg' },
    ],
    skipDuplicates: true,
  });

  // MaterialBatch
  await prisma.materialBatch.createMany({
    data: [
      { materialId: mat1?.id!, batchNo: 'BATCH001', qtyReceived: 100.0, qtyAvailable: 80.5, receivedDate: new Date('2025-09-01'), expiryDate: new Date('2026-09-01') },
      { materialId: mat2?.id!, batchNo: 'BATCH002', qtyReceived: 50.0, qtyAvailable: 50.0, receivedDate: new Date('2025-09-10'), expiryDate: new Date('2026-09-10') },
      { materialId: mat3?.id!, batchNo: 'BATCH003', qtyReceived: 200.0, qtyAvailable: 180.0, receivedDate: new Date('2025-09-05'), expiryDate: new Date('2026-09-05') },
      { materialId: mat4?.id!, batchNo: 'BATCH004', qtyReceived: 150.0, qtyAvailable: 150.0, receivedDate: new Date('2025-09-12'), expiryDate: new Date('2026-09-12') },
      { materialId: mat5?.id!, batchNo: 'BATCH005', qtyReceived: 25.0, qtyAvailable: 24.5, receivedDate: new Date('2025-09-08'), expiryDate: new Date('2026-09-08') },
    ],
    skipDuplicates: true,
  });
  
  const [batch1, batch2, batch3, batch4, batch5] = await Promise.all([
    prisma.materialBatch.findUnique({ where: { batchNo: 'BATCH001' } }),
    prisma.materialBatch.findUnique({ where: { batchNo: 'BATCH002' } }),
    prisma.materialBatch.findUnique({ where: { batchNo: 'BATCH003' } }),
    prisma.materialBatch.findUnique({ where: { batchNo: 'BATCH004' } }),
    prisma.materialBatch.findUnique({ where: { batchNo: 'BATCH005' } }),
  ]);

  // WorkOrder
  const planner = await prisma.user.findUnique({ where: { username: 'planner1' } });
  await prisma.workOrder.createMany({
    data: [
      { workOrderNo: 'WO001', productId: prod1?.id!, bomId: bom1?.id!, qtyPlanned: 100, startDate: new Date('2025-09-20'), endDate: new Date('2025-09-25'), plannerId: planner?.id!, status: 'Planned' },
      { workOrderNo: 'WO002', productId: prod2?.id!, bomId: bom2?.id!, qtyPlanned: 50, startDate: new Date('2025-09-22'), endDate: new Date('2025-09-26'), plannerId: planner?.id!, status: 'InProgress' },
      { workOrderNo: 'WO003', productId: prod3?.id!, bomId: bom3?.id!, qtyPlanned: 200, startDate: new Date('2025-09-25'), endDate: new Date('2025-09-30'), plannerId: planner?.id!, status: 'Planned' },
    ],
    skipDuplicates: true,
  });
  
  const [wo1, wo2, wo3] = await Promise.all([
    prisma.workOrder.findUnique({ where: { workOrderNo: 'WO001' } }),
    prisma.workOrder.findUnique({ where: { workOrderNo: 'WO002' } }),
    prisma.workOrder.findUnique({ where: { workOrderNo: 'WO003' } }),
  ]);

  // CompoundingOrder
  const chemist = await prisma.user.findUnique({ where: { username: 'chemist1' } });
  const qcUser = await prisma.user.findUnique({ where: { username: 'qc1' } });
  const qaUser = await prisma.user.findUnique({ where: { username: 'qa1' } });

  await prisma.compoundingOrder.create({
    data: {
      workOrderId: wo1?.id!,
      chemistId: chemist?.id!,
      qcId: qcUser?.id!,
      qaId: qaUser?.id!,
      status: 'QAApproved',
    },
  });

  await prisma.compoundingOrder.create({
    data: {
      workOrderId: wo2?.id!,
      chemistId: chemist?.id!,
      qcId: qcUser?.id!,
      status: 'QCVerified',
    },
  });
  
  const [compOrder1, compOrder2] = await Promise.all([
    prisma.compoundingOrder.findFirst({ where: { workOrderId: wo1?.id! } }),
    prisma.compoundingOrder.findFirst({ where: { workOrderId: wo2?.id! } }),
  ]);

  // CompoundingMaterialLine
  await prisma.compoundingMaterialLine.createMany({
    data: [
      // Compounding for WO001
      { compoundingId: compOrder1?.id!, materialId: mat1?.id!, requiredQty: 10.5, actualQty: 10.6, materialBatchId: batch1?.id! },
      { compoundingId: compOrder1?.id!, materialId: mat3?.id!, requiredQty: 5.2, actualQty: 5.2, materialBatchId: batch3?.id! },
      { compoundingId: compOrder1?.id!, materialId: mat5?.id!, requiredQty: 0.1, actualQty: 0.1, materialBatchId: batch5?.id! },
      
      // Compounding for WO002
      { compoundingId: compOrder2?.id!, materialId: mat2?.id!, requiredQty: 8.0, actualQty: 8.0, materialBatchId: batch2?.id! },
      { compoundingId: compOrder2?.id!, materialId: mat4?.id!, requiredQty: 2.5, actualQty: 2.5, materialBatchId: batch4?.id! },
    ],
    skipDuplicates: true,
  });

  // ProductionBatch
  await prisma.productionBatch.create({
    data: {
      workOrderId: wo1?.id!,
      machineId: machine1?.id!,
      toolId: tool1?.id!,
      mouldId: mould1?.id!,
      batchNo: 'PRODBATCH001',
      startTime: new Date('2025-09-21T08:00:00'),
      endTime: new Date('2025-09-21T16:00:00'),
      qtyGood: 95,
      qtyReject: 5,
      status: 'Completed',
    },
  });

  await prisma.productionBatch.create({
    data: {
      workOrderId: wo2?.id!,
      machineId: machine2?.id!,
      toolId: tool2?.id!,
      mouldId: mould2?.id!,
      batchNo: 'PRODBATCH002',
      startTime: new Date('2025-09-22T08:00:00'),
      endTime: null,
      qtyGood: 30,
      qtyReject: 2,
      status: 'InProgress',
    },
  });

  const [prodBatch1, prodBatch2] = await Promise.all([
    prisma.productionBatch.findUnique({ where: { batchNo: 'PRODBATCH001' } }),
    prisma.productionBatch.findUnique({ where: { batchNo: 'PRODBATCH002' } }),
  ]);

  // ProductionRecord
  const [operator1, operator2] = await Promise.all([
    prisma.user.findUnique({ where: { username: 'operator1' } }),
    prisma.user.findUnique({ where: { username: 'operator2' } }),
  ]);

  await prisma.productionRecord.createMany({
    data: [
      {
        productionBatchId: prodBatch1?.id!,
        operatorId: operator1?.id!,
        taskStart: new Date('2025-09-21T08:00:00'),
        taskEnd: new Date('2025-09-21T16:00:00'),
        qtyProcessed: 100,
      },
      {
        productionBatchId: prodBatch2?.id!,
        operatorId: operator2?.id!,
        taskStart: new Date('2025-09-22T08:00:00'),
        taskEnd: null,
        qtyProcessed: 32,
      },
    ],
    skipDuplicates: true,
  });

  // ProductionMaterialConsumption
  await prisma.productionMaterialConsumption.createMany({
    data: [
      {
        productionBatchId: prodBatch1?.id!,
        materialBatchId: batch1?.id!,
        qtyConsumed: 10.6,
        consumedAt: new Date('2025-09-21T16:00:00'),
      },
      {
        productionBatchId: prodBatch1?.id!,
        materialBatchId: batch3?.id!,
        qtyConsumed: 5.2,
        consumedAt: new Date('2025-09-21T16:00:00'),
      },
      {
        productionBatchId: prodBatch2?.id!,
        materialBatchId: batch2?.id!,
        qtyConsumed: 8.0,
        consumedAt: new Date('2025-09-22T12:00:00'),
      },
    ],
    skipDuplicates: true,
  });

  // DowntimeEvent
  await prisma.downtimeEvent.createMany({
    data: [
      {
        machineId: machine1?.id!,
        productionBatchId: prodBatch1?.id!,
        startTime: new Date('2025-09-21T10:00:00'),
        endTime: new Date('2025-09-21T10:30:00'),
        category: 'Planned',
        cause: 'Routine maintenance',
        reportedBy: operator1?.id!,
      },
      {
        machineId: machine2?.id!,
        productionBatchId: prodBatch2?.id!,
        startTime: new Date('2025-09-22T14:00:00'),
        endTime: null,
        category: 'Unplanned',
        cause: 'Material jam',
        reportedBy: operator2?.id!,
      },
    ],
    skipDuplicates: true,
  });

  // QcRecord
  const qc = await prisma.user.findUnique({ where: { username: 'qc1' } });
  await prisma.qcRecord.createMany({
    data: [
      {
        productionBatchId: prodBatch1?.id!,
        inspectorId: qc?.id!,
        qcType: 'IPQC',
        checkedAt: new Date('2025-09-21T12:00:00'),
        result: 'Pass',
        remarks: 'In-process check - all parameters within spec',
      },
      {
        productionBatchId: prodBatch1?.id!,
        inspectorId: qc?.id!,
        qcType: 'OQC',
        checkedAt: new Date('2025-09-21T17:00:00'),
        result: 'Pass',
        remarks: 'Final inspection completed successfully',
      },
      {
        productionBatchId: prodBatch2?.id!,
        inspectorId: qc?.id!,
        qcType: 'IPQC',
        checkedAt: new Date('2025-09-22T11:00:00'),
        result: 'Fail',
        remarks: 'Dimension out of tolerance',
      },
    ],
    skipDuplicates: true,
  });

  const [qcRec1, qcRec2, qcRec3] = await Promise.all([
    prisma.qcRecord.findFirst({ where: { productionBatchId: prodBatch1?.id!, qcType: 'IPQC' } }),
    prisma.qcRecord.findFirst({ where: { productionBatchId: prodBatch1?.id!, qcType: 'OQC' } }),
    prisma.qcRecord.findFirst({ where: { productionBatchId: prodBatch2?.id! } }),
  ]);

  // QcTestParameter
  await prisma.qcTestParameter.createMany({
    data: [
      {
        qcId: qcRec1?.id!,
        parameterName: 'Length',
        expectedValue: '100mm ± 0.5mm',
        actualValue: '100.2mm',
        status: 'Pass',
      },
      {
        qcId: qcRec1?.id!,
        parameterName: 'Weight',
        expectedValue: '50g ± 2g',
        actualValue: '51g',
        status: 'Pass',
      },
      {
        qcId: qcRec2?.id!,
        parameterName: 'Surface Finish',
        expectedValue: 'Smooth',
        actualValue: 'Smooth',
        status: 'Pass',
      },
      {
        qcId: qcRec3?.id!,
        parameterName: 'Width',
        expectedValue: '50mm ± 0.3mm',
        actualValue: '50.8mm',
        status: 'Fail',
      },
    ],
    skipDuplicates: true,
  });

  // RejectScrap
  await prisma.rejectScrap.createMany({
    data: [
      {
        productionBatchId: prodBatch1?.id!,
        qcId: qcRec1?.id!,
        reason: 'Short shot',
        quantity: 3,
        disposition: 'Rework',
      },
      {
        productionBatchId: prodBatch1?.id!,
        qcId: qcRec2?.id!,
        reason: 'Flash',
        quantity: 2,
        disposition: 'Scrap',
      },
      {
        productionBatchId: prodBatch2?.id!,
        qcId: qcRec3?.id!,
        reason: 'Dimension out of tolerance',
        quantity: 2,
        disposition: 'Rework',
      },
    ],
    skipDuplicates: true,
  });

  // PackingRecord
  const qa = await prisma.user.findUnique({ where: { username: 'qa1' } });
  await prisma.packingRecord.createMany({
    data: [
      {
        productionBatchId: prodBatch1?.id!,
        packedById: qa?.id!,
        packageType: 'Cardboard Box',
        qtyPacked: 90,
        packedAt: new Date('2025-09-21T18:00:00'),
      },
      {
        productionBatchId: prodBatch1?.id!,
        packedById: qa?.id!,
        packageType: 'Cardboard Box',
        qtyPacked: 5,
        packedAt: new Date('2025-09-21T18:30:00'),
      },
    ],
    skipDuplicates: true,
  });

  console.log('🌱 Seeding completed successfully!');
  console.log('📊 Created:');
  console.log('  - 6 Roles');
  console.log('  - 7 Users');
  console.log('  - 3 Suppliers');
  console.log('  - 5 Materials with batches');
  console.log('  - 3 Products with BOMs');
  console.log('  - 3 Machines');
  console.log('  - 3 Tools and 3 Moulds');
  console.log('  - 3 Work Orders');
  console.log('  - 2 Compounding Orders');
  console.log('  - 2 Production Batches');
  console.log('  - QC Records, Test Parameters, and Reject Scraps');
  console.log('  - Packing Records');
}

main()
  .then(() => console.log('✅ Database seeding completed'))
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });