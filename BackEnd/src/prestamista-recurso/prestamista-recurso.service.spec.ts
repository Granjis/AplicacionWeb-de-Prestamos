import { Test, TestingModule } from '@nestjs/testing';
import { RecursoEntity } from '../recurso/recurso.entity';
import { Repository } from 'typeorm';
import { PrestamistaEntity } from '../prestamista/prestamista.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { PrestamistaRecursoService } from './prestamista-recurso.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('PrestamistaRecursoService', () => {
  let service: PrestamistaRecursoService;
  let prestamistaRepository: Repository<PrestamistaEntity>;
  let recursoRepository: Repository<RecursoEntity>;
  let prestamista: PrestamistaEntity;
  let recursosList: RecursoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PrestamistaRecursoService],
    }).compile();

    service = module.get<PrestamistaRecursoService>(PrestamistaRecursoService);
    prestamistaRepository = module.get<Repository<PrestamistaEntity>>(getRepositoryToken(PrestamistaEntity));
    recursoRepository = module.get<Repository<RecursoEntity>>(getRepositoryToken(RecursoEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    recursoRepository.clear();
    prestamistaRepository.clear();

    recursosList = [];
    for (let i = 0; i < 5; i++) {
      const recurso: RecursoEntity = await recursoRepository.save({
        nombre: faker.commerce.productName(),
        tipo: faker.commerce.productAdjective (),
        descripcion: faker.commerce.productDescription(),
        valor: parseFloat(faker.finance.amount({ min: 100, max: 1000, dec: 0 })),
      });
      recursosList.push(recurso);
    }

    prestamista = await prestamistaRepository.save({
      nombre: faker.name.fullName(),
      direccion: faker.address.streetAddress(),
      telefono: faker.phone.number(),
      correo: faker.internet.email(),
      foto: faker.image.avatar(),
      fondosTotales: parseFloat(faker.finance.amount({ min: 1000, max: 10000, dec: 0 })),
      saldo: parseFloat(faker.finance.amount({ min: 500, max: 5000, dec: 0 })),
      recursos: recursosList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addRecursoPrestamista should add a recurso to a prestamista', async () => {
    const newRecurso: RecursoEntity = await recursoRepository.save({
      nombre: faker.commerce.productName(),
      tipo: faker.commerce.productAdjective (),
      descripcion: faker.commerce.productDescription(),
      valor: parseFloat(faker.finance.amount({ min: 100, max: 1000, dec: 0 })),
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

    const result: PrestamistaEntity = await service.addRecursoPrestamista(newPrestamista.id, newRecurso.id);

    expect(result.recursos.length).toBe(1);
    expect(result.recursos[0]).not.toBeNull();
    expect(result.recursos[0].nombre).toBe(newRecurso.nombre);
  });

  it('addRecursoPrestamista should throw an exception for an invalid recurso', async () => {
    const newPrestamista: PrestamistaEntity = await prestamistaRepository.save({
      nombre: faker.name.fullName(),
      direccion: faker.address.streetAddress(),
      telefono: faker.phone.number(),
      correo: faker.internet.email(),
      foto: faker.image.avatar(),
      fondosTotales: parseFloat(faker.finance.amount({ min: 1000, max: 10000, dec: 0 })),
      saldo: parseFloat(faker.finance.amount({ min: 500, max: 5000, dec: 0 })),
    });

    await expect(() => service.addRecursoPrestamista(newPrestamista.id, "0"))
      .rejects.toHaveProperty("message", "El recurso con el id proporcionado no fue encontrado");
  });

  it('addRecursoPrestamista should throw an exception for an invalid prestamista', async () => {
    const newRecurso: RecursoEntity = await recursoRepository.save({
      nombre: faker.commerce.productName(),
      tipo: faker.commerce.productAdjective (),
      descripcion: faker.commerce.productDescription(),
      valor: parseFloat(faker.finance.amount({ min: 100, max: 1000, dec: 0 })),
    });

    await expect(() => service.addRecursoPrestamista("0", newRecurso.id))
      .rejects.toHaveProperty("message", "El prestamista con el id proporcionado no fue encontrado");
  });

  it('findRecursoByPrestamistaIdRecursoId should return a recurso by prestamista', async () => {
    const recurso: RecursoEntity = recursosList[0];
    const storedRecurso: RecursoEntity = await service.findRecursoByPrestamistaIdRecursoId(prestamista.id, recurso.id);

    expect(storedRecurso).not.toBeNull();
    expect(storedRecurso.nombre).toBe(recurso.nombre);
    expect(storedRecurso.tipo).toBe(recurso.tipo);
    expect(storedRecurso.descripcion).toBe(recurso.descripcion);
  });

  it('findRecursoByPrestamistaIdRecursoId should throw an exception for an invalid recurso', async () => {
    await expect(() => service.findRecursoByPrestamistaIdRecursoId(prestamista.id, "0"))
      .rejects.toHaveProperty("message", "El recurso con el id proporcionado no fue encontrado");
  });

  it('findRecursosByPrestamistaId should return recursos by prestamista', async () => {
    const recursos: RecursoEntity[] = await service.findRecursosByPrestamistaId(prestamista.id);
    expect(recursos.length).toBe(5);
  });

  it('findRecursosByPrestamistaId should throw an exception for an invalid prestamista', async () => {
    await expect(() => service.findRecursosByPrestamistaId("0"))
      .rejects.toHaveProperty("message", "El prestamista con el id proporcionado no fue encontrado");
  });

  it('associateRecursosPrestamista should update recursos list for a prestamista', async () => {
    const newRecurso: RecursoEntity = await recursoRepository.save({
      nombre: faker.commerce.productName(),
      tipo: faker.commerce.productAdjective (),
      descripcion: faker.commerce.productDescription(),
      valor: parseFloat(faker.finance.amount({ min: 100, max: 1000, dec: 0 })),
    });

    const updatedPrestamista: PrestamistaEntity = await service.associateRecursosPrestamista(prestamista.id, [newRecurso]);
    expect(updatedPrestamista.recursos.length).toBe(1);
    expect(updatedPrestamista.recursos[0].nombre).toBe(newRecurso.nombre);
    expect(updatedPrestamista.recursos[0].tipo).toBe(newRecurso.tipo);
    expect(updatedPrestamista.recursos[0].descripcion).toBe(newRecurso.descripcion);
  });

  it('deleteRecursoPrestamista should remove a recurso from a prestamista', async () => {
    const recurso: RecursoEntity = recursosList[0];

    await service.deleteRecursoPrestamista(prestamista.id, recurso.id);

    const storedPrestamista: PrestamistaEntity = await prestamistaRepository.findOne({
      where: { id: prestamista.id },
      relations: ["recursos"],
    });
    const deletedRecurso: RecursoEntity = storedPrestamista.recursos.find((r) => r.id === recurso.id);

    expect(deletedRecurso).toBeUndefined();
  });
});
