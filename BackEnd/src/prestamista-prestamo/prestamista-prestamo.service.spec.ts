import { Test, TestingModule } from '@nestjs/testing';
import { PrestamoEntity } from '../prestamo/prestamo.entity';
import { Repository } from 'typeorm';
import { PrestamistaEntity } from '../prestamista/prestamista.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { PrestamistaPrestamoService } from './prestamista-prestamo.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';


describe('PrestamistaPrestamoService', () => {
  let service: PrestamistaPrestamoService;
  let prestamistaRepository: Repository<PrestamistaEntity>;
  let prestamoRepository: Repository<PrestamoEntity>;
  let prestamista: PrestamistaEntity;
  let prestamosList: PrestamoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PrestamistaPrestamoService],
    }).compile();

    service = module.get<PrestamistaPrestamoService>(PrestamistaPrestamoService);
    prestamistaRepository = module.get<Repository<PrestamistaEntity>>(getRepositoryToken(PrestamistaEntity));
    prestamoRepository = module.get<Repository<PrestamoEntity>>(getRepositoryToken(PrestamoEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    prestamoRepository.clear();
    prestamistaRepository.clear();

    prestamosList = [];
    for (let i = 0; i < 5; i++) {
      const prestamo: PrestamoEntity = await prestamoRepository.save({
        nombre: faker.commerce.productName(),
        monto: parseFloat(faker.finance.amount({ dec: 0 })),
        interes: parseFloat(faker.finance.amount({ min: 1, max: 10, dec: 0 })),
        fechainicio: faker.date.recent(),
        fechafin: faker.date.future(),
        pagado: faker.datatype.boolean(),
      });
      prestamosList.push(prestamo);
    }

    prestamista = await prestamistaRepository.save({
      nombre: faker.name.fullName(),
      direccion: faker.address.streetAddress(),
      telefono: faker.phone.number(),
      correo: faker.internet.email(),
      foto: faker.image.avatar(),
      fondosTotales: parseFloat(faker.finance.amount({ min: 1000, max: 10000, dec: 0 })),
      saldo: parseFloat(faker.finance.amount({ min: 500, max: 5000, dec: 0 })),
      prestamos: prestamosList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addPrestamoPrestamista should add a prestamo to a prestamista', async () => {
    const newPrestamo: PrestamoEntity = await prestamoRepository.save({
      nombre: faker.commerce.productName(),
      monto: parseFloat(faker.finance.amount({ dec: 0 })),
      interes: parseFloat(faker.finance.amount({ min: 5, max: 10, dec: 0 })),
      fechainicio: faker.date.recent(),
      fechafin: faker.date.future(),
      pagado: faker.datatype.boolean(),
    });

    const newPrestamista: PrestamistaEntity = await prestamistaRepository.save({
      nombre: faker.name.fullName(),
      direccion: faker.address.streetAddress(),
      telefono: faker.phone.number(),
      correo: faker.internet.email(),
      foto: faker.image.avatar(),
      fondosTotales: parseFloat(faker.finance.amount({ min: 1000, max: 10000, dec: 0 })),
      saldo: parseFloat(faker.finance.amount({ min: 500, max: 5000, dec: 0 })),
    });

    const result: PrestamistaEntity = await service.addPrestamoPrestamista(newPrestamista.id, newPrestamo.id);

    expect(result.prestamos.length).toBe(1);
    expect(result.prestamos[0]).not.toBeNull();
    expect(result.prestamos[0].nombre).toBe(newPrestamo.nombre);
    expect(result.prestamos[0].monto).toBeCloseTo(newPrestamo.monto,2);
    expect(result.prestamos[0].interes).toBeCloseTo(newPrestamo.interes,2);
    expect(result.prestamos[0].fechainicio).toStrictEqual(newPrestamo.fechainicio);
    expect(result.prestamos[0].fechafin).toStrictEqual(newPrestamo.fechafin);
    expect(result.prestamos[0].pagado).toBe(newPrestamo.pagado);
  });

  it('addPrestamoPrestamista should throw an exception for an invalid prestamo', async () => {
    const newPrestamista: PrestamistaEntity = await prestamistaRepository.save({
      nombre: faker.name.fullName(),
      direccion: faker.address.streetAddress(),
      telefono: faker.phone.number(),
      correo: faker.internet.email(),
      foto: faker.image.avatar(),
      fondosTotales: parseFloat(faker.finance.amount({ min: 1000, max: 10000, dec: 0 })),
      saldo: parseFloat(faker.finance.amount({ min: 500, max: 5000, dec: 0 })),
    });

    await expect(() => service.addPrestamoPrestamista(newPrestamista.id, "0"))
      .rejects.toHaveProperty("message", "El préstamo con el id proporcionado no fue encontrado");
  });

  it('addPrestamoPrestamista should throw an exception for an invalid prestamista', async () => {
    const newPrestamo: PrestamoEntity = await prestamoRepository.save({
      nombre: faker.commerce.productName(),
      monto: parseFloat(faker.finance.amount({ dec: 0 })),
      interes: parseFloat(faker.finance.amount({ min: 5, max: 10, dec: 0 })),
      fechainicio: faker.date.recent(),
      fechafin: faker.date.future(),
      pagado: faker.datatype.boolean(),
    });

    await expect(() => service.addPrestamoPrestamista("0", newPrestamo.id))
      .rejects.toHaveProperty("message", "El prestamista con el id proporcionado no fue encontrado");
  });

  it('findPrestamoByPrestamistaIdPrestamoId should return a prestamo by prestamista', async () => {
    const prestamo: PrestamoEntity = prestamosList[0];
    const storedPrestamo: PrestamoEntity = await service.findPrestamoByPrestamistaIdPrestamoId(prestamista.id, prestamo.id);

    expect(storedPrestamo).not.toBeNull();
    expect(storedPrestamo.monto).toBeCloseTo(prestamo.monto,2);
    expect(storedPrestamo.interes).toBeCloseTo(prestamo.interes,2);
    expect(storedPrestamo.fechainicio).toStrictEqual(prestamo.fechainicio);
    expect(storedPrestamo.fechafin).toStrictEqual(prestamo.fechafin);
    expect(storedPrestamo.pagado).toBe(prestamo.pagado);
  });

  it('findPrestamoByPrestamistaIdPrestamoId should throw an exception for an invalid prestamo', async () => {
    await expect(() => service.findPrestamoByPrestamistaIdPrestamoId(prestamista.id, "0"))
      .rejects.toHaveProperty("message", "El préstamo con el id proporcionado no fue encontrado");
  });

  it('findPrestamoByPrestamistaIdPrestamoId should throw an exception for an invalid prestamista', async () => {
    const prestamo: PrestamoEntity = prestamosList[0];
    await expect(() => service.findPrestamoByPrestamistaIdPrestamoId("0", prestamo.id))
      .rejects.toHaveProperty("message", "El prestamista con el id proporcionado no fue encontrado");
  });

  it('findPrestamoByPrestamistaIdPrestamoId should throw an exception for a prestamo not associated to the prestamista', async () => {
    const newPrestamo: PrestamoEntity = await prestamoRepository.save({
      nombre: faker.commerce.productName(),
      monto: parseFloat(faker.finance.amount({  dec: 0 })),
      interes: parseFloat(faker.finance.amount({ min: 5, max: 10, dec: 0 })),
      fechainicio: faker.date.recent(),
      fechafin: faker.date.future(),
      pagado: faker.datatype.boolean(),
    });

    await expect(() => service.findPrestamoByPrestamistaIdPrestamoId(prestamista.id, newPrestamo.id))
      .rejects.toHaveProperty("message", "El préstamo con el id proporcionado no está asociado al prestamista");
  });

  it('findPrestamosByPrestamistaId should return prestamos by prestamista', async () => {
    const prestamos: PrestamoEntity[] = await service.findPrestamosByPrestamistaId(prestamista.id);
    expect(prestamos.length).toBe(5);
  });

  it('findPrestamosByPrestamistaId should throw an exception for an invalid prestamista', async () => {
    await expect(() => service.findPrestamosByPrestamistaId("0"))
      .rejects.toHaveProperty("message", "El prestamista con el id proporcionado no fue encontrado");
  });

  it('associatePrestamosPrestamista should update prestamos list for a prestamista', async () => {
    const newPrestamo: PrestamoEntity = await prestamoRepository.save({
      nombre: faker.commerce.productName(),
      monto: parseFloat(faker.finance.amount({  dec: 0 })),
      interes: parseFloat(faker.finance.amount({ min: 5, max: 10, dec: 0 })),
      fechainicio: faker.date.recent(),
      fechafin: faker.date.future(),
      pagado: faker.datatype.boolean(),
    });

    const updatedPrestamista: PrestamistaEntity = await service.associatePrestamosPrestamista(prestamista.id, [newPrestamo]);
    expect(updatedPrestamista.prestamos.length).toBe(1);
    expect(updatedPrestamista.prestamos[0].monto).toBe(newPrestamo.monto);
  });

  it('deletePrestamoPrestamista should remove a prestamo from a prestamista', async () => {
    const prestamo: PrestamoEntity = prestamosList[0];

    await service.deletePrestamoPrestamista(prestamista.id, prestamo.id);

    const storedPrestamista: PrestamistaEntity = await prestamistaRepository.findOne({
      where: { id: prestamista.id },
      relations: ["prestamos"],
    });
    const deletedPrestamo: PrestamoEntity = storedPrestamista.prestamos.find((p) => p.id === prestamo.id);

    expect(deletedPrestamo).toBeUndefined();
  });
});
