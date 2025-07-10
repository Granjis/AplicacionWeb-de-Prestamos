import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { PrestamistaEntity } from './prestamista.entity';
import { PrestamistaService } from './prestamista.service';
import { faker } from '@faker-js/faker';

describe('PrestamistaService', () => {
  let service: PrestamistaService;
  let repository: Repository<PrestamistaEntity>;
  let prestamistasList: PrestamistaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PrestamistaService],
    }).compile();

    service = module.get<PrestamistaService>(PrestamistaService);
    repository = module.get<Repository<PrestamistaEntity>>(getRepositoryToken(PrestamistaEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    prestamistasList = [];
    for (let i = 0; i < 5; i++) {
      const prestamista: PrestamistaEntity = await repository.save({
        nombre: faker.name.fullName(),
        direccion: faker.address.streetAddress(),
        telefono: faker.phone.number(),
        correo: faker.internet.email(),
        foto: faker.image.avatar(),
        fondosTotales: faker.number.int({ min: 1000, max: 50000 }),
        saldo: faker.number.int({ min: 0, max: 10000 }),
      });
      prestamistasList.push(prestamista);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all prestamistas', async () => {
    const prestamistas: PrestamistaEntity[] = await service.findAll();
    expect(prestamistas).not.toBeNull();
    expect(prestamistas).toHaveLength(prestamistasList.length);
  });

  it('findOne should return a prestamista by id', async () => {
    const storedPrestamista: PrestamistaEntity = prestamistasList[0];
    const prestamista: PrestamistaEntity = await service.findOne(storedPrestamista.id);
    expect(prestamista).not.toBeNull();
    expect(prestamista.nombre).toEqual(storedPrestamista.nombre);
    expect(prestamista.direccion).toEqual(storedPrestamista.direccion);
    expect(prestamista.telefono).toEqual(storedPrestamista.telefono);
    expect(prestamista.correo).toEqual(storedPrestamista.correo);
    expect(prestamista.foto).toEqual(storedPrestamista.foto);
    expect(prestamista.fondosTotales).toEqual(storedPrestamista.fondosTotales);
    expect(prestamista.saldo).toEqual(storedPrestamista.saldo);
  });

  it('findOne should throw an exception for an invalid prestamista', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The prestamista with the given id was not found");
  });

  it('create should return a new prestamista', async () => {
    const prestamista= {
      id: '200000000',
      nombre: faker.name.fullName(),
      direccion: faker.address.streetAddress(),
      telefono: faker.phone.number(),
      correo: faker.internet.email(),
      foto: faker.image.avatar(),
      fondosTotales: faker.number.int({ min: 1000, max: 50000 }),
      saldo: faker.number.int({ min: 0, max: 10000 }),
      recursos: [],
      prestamos: [],
    } as PrestamistaEntity;

    const newPrestamista: PrestamistaEntity = await service.create(prestamista);
    expect(newPrestamista).not.toBeNull();

    const storedPrestamista: PrestamistaEntity = await repository.findOne({ where: { id: newPrestamista.id } });
    expect(storedPrestamista).not.toBeNull();
    expect(storedPrestamista.nombre).toEqual(newPrestamista.nombre);
    expect(storedPrestamista.direccion).toEqual(newPrestamista.direccion);
    expect(storedPrestamista.telefono).toEqual(newPrestamista.telefono);
    expect(storedPrestamista.correo).toEqual(newPrestamista.correo);
    expect(storedPrestamista.foto).toEqual(newPrestamista.foto);
    expect(storedPrestamista.fondosTotales).toEqual(newPrestamista.fondosTotales);
    expect(storedPrestamista.saldo).toEqual(newPrestamista.saldo);
  });

  it('update should modify a prestamista', async () => {
    const prestamista: PrestamistaEntity = prestamistasList[0];
    prestamista.nombre = "Updated Name";
    prestamista.direccion = "Updated Address";

    const updatedPrestamista: PrestamistaEntity = await service.update(prestamista.id, prestamista);
    expect(updatedPrestamista).not.toBeNull();

    const storedPrestamista: PrestamistaEntity = await repository.findOne({ where: { id: prestamista.id } });
    expect(storedPrestamista).not.toBeNull();
    expect(storedPrestamista.nombre).toEqual(prestamista.nombre);
    expect(storedPrestamista.direccion).toEqual(prestamista.direccion);
  });

  it('update should throw an exception for an invalid prestamista', async () => {
    let prestamista: PrestamistaEntity = prestamistasList[0];
    prestamista = {
      ...prestamista,
      nombre: "Updated Name",
      direccion: "Updated Address",
    };
    await expect(() => service.update("0", prestamista)).rejects.toHaveProperty("message", "The prestamista with the given id was not found");
  });

  it('delete should remove a prestamista', async () => {
    const prestamista: PrestamistaEntity = prestamistasList[0];
    await service.delete(prestamista.id);

    const deletedPrestamista: PrestamistaEntity = await repository.findOne({ where: { id: prestamista.id } });
    expect(deletedPrestamista).toBeNull();
  });

  it('delete should throw an exception for an invalid prestamista', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The prestamista with the given id was not found");
  });
});
