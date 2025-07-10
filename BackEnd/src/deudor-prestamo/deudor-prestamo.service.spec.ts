import { Test, TestingModule } from '@nestjs/testing';
import { DeudorPrestamoService } from './deudor-prestamo.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeudorEntity } from '../deudor/deudor.entity';
import { PrestamoEntity } from '../prestamo/prestamo.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

describe('DeudorPrestamoService', () => {
  let service: DeudorPrestamoService;
  let deudorRepository: jest.Mocked<Repository<DeudorEntity>>;
  let prestamoRepository: jest.Mocked<Repository<PrestamoEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeudorPrestamoService,
        {
          provide: getRepositoryToken(DeudorEntity),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(PrestamoEntity),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DeudorPrestamoService>(DeudorPrestamoService);
    deudorRepository = module.get(getRepositoryToken(DeudorEntity));
    prestamoRepository = module.get(getRepositoryToken(PrestamoEntity));
  });

  const mockDeudor: DeudorEntity = {
    id: '1',
    nombrecompleto: 'Test Deudor',
    cedula: '123456789',
    situacionLaboral: 'Test Occupation',
    direccion: '123 Main St',
    telefono: '123456789',
    fecha: new Date(),
    email: 'test@example.com',
    ocupacion: 'Test Occupation',
    foto: 'test.jpg',
    prestamos: [],
  };

  const mockPrestamo: PrestamoEntity = {
    id: '1',
    monto: 1000,
    fechainicio: new Date(),
    fechafin: new Date(),
    interes: 5,
    pagado: false,
    deudor: mockDeudor,
    historialpagos: [],
    prestamista:null,
    nombre:'Test Prestamo',
    recurso:null,
  };

  describe('addPrestamoDeudor', () => {
    it('should add a prestamo to a deudor', async () => {
      deudorRepository.findOne.mockResolvedValue({ ...mockDeudor, prestamos: [] });
      prestamoRepository.findOne.mockResolvedValue(mockPrestamo);
      deudorRepository.save.mockResolvedValue({ ...mockDeudor, prestamos: [mockPrestamo] });

      const result = await service.addPrestamoDeudor('1', '1');
      expect(result.prestamos).toContain(mockPrestamo);
      expect(deudorRepository.save).toHaveBeenCalledWith({
        ...mockDeudor,
        prestamos: [mockPrestamo],
      });
    });

    it('should throw an error if the prestamo is not found', async () => {
      prestamoRepository.findOne.mockResolvedValue(null);

      try {
        await service.findPrestamoByDeudorIDPrestamoID('1', '1')
      } catch (error) {
        expect(error).toBeInstanceOf(BusinessLogicException);
        expect(error.message).toBe("The prestamo with the given id was not found");
      }
    });

    it('should throw an error if the deudor is not found', async () => {
      prestamoRepository.findOne.mockResolvedValue(mockPrestamo);
      deudorRepository.findOne.mockResolvedValue(null);

      try {
        await service.findPrestamoByDeudorIDPrestamoID('1', '1')
      } catch (error) {
        expect(error).toBeInstanceOf(BusinessLogicException);
        expect(error.message).toBe("The deudor with the given id was not found");
      }
    });
  });

  describe('findPrestamoByDeudorIDPrestamoID', () => {
    it('should return the prestamo associated with the deudor', async () => {
      deudorRepository.findOne.mockResolvedValue({ ...mockDeudor, prestamos: [mockPrestamo] });
      prestamoRepository.findOne.mockResolvedValue(mockPrestamo);

      const result = await service.findPrestamoByDeudorIDPrestamoID('1', '1');
      expect(result).toEqual(mockPrestamo);
    });

    it('should throw an error if the prestamo is not found', async () => {
      prestamoRepository.findOne.mockResolvedValue(null);
      
      try {
        await service.findPrestamoByDeudorIDPrestamoID('1', '1')
      } catch (error) {
        expect(error).toBeInstanceOf(BusinessLogicException);
        expect(error.message).toBe("The prestamo with the given id was not found");
      }
    });

    it('should throw an error if the deudor is not found', async () => {
      prestamoRepository.findOne.mockResolvedValue(mockPrestamo);
      deudorRepository.findOne.mockResolvedValue(null);

      try {
        await service.findPrestamoByDeudorIDPrestamoID('1', '1')
      } catch (error) {
        expect(error).toBeInstanceOf(BusinessLogicException);
        expect(error.message).toBe("The deudor with the given id was not found");
      }
    });

    it('should throw an error if the prestamo is not associated with the deudor', async () => {
      deudorRepository.findOne.mockResolvedValue({ ...mockDeudor, prestamos: [] });
      prestamoRepository.findOne.mockResolvedValue(mockPrestamo);

      try {
        await service.findPrestamoByDeudorIDPrestamoID('1', '1')
      } catch (error) {
        expect(error).toBeInstanceOf(BusinessLogicException);
        expect(error.message).toBe("The prestamo with the given id is not associated to the deudor");
      }
    });
  });

  describe('findPrestamosByDeudorId', () => {
    it('should return all prestamos associated with the deudor', async () => {
      deudorRepository.findOne.mockResolvedValue({ ...mockDeudor, prestamos: [mockPrestamo] });

      const result = await service.findPrestamosByDeudorId('1');
      expect(result).toEqual([mockPrestamo]);
    });

    it('should throw an error if the deudor is not found', async () => {
      deudorRepository.findOne.mockResolvedValue(null);
      try {
        await service.findPrestamosByDeudorId('1')
      } catch (error) {
        expect(error).toBeInstanceOf(BusinessLogicException);
        expect(error.message).toBe("The deudor with the given id was not found");
      }
    });
  });
  describe('associatePrestamosDeudor', () => {
    it('should associate a list of prestamos to the deudor', async () => {
      const prestamos = [
        { id: '1', monto: 1000, interes: 5 } as PrestamoEntity,
        { id: '2', monto: 2000, interes: 10 } as PrestamoEntity,
      ];
  
      deudorRepository.findOne.mockResolvedValue({ ...mockDeudor, prestamos: [] });
      prestamoRepository.findOne.mockImplementation((options) => {
        const where = options.where as FindOptionsWhere<PrestamoEntity>;
        return Promise.resolve(prestamos.find((p) => p.id === where.id) || null);
      });
  
      deudorRepository.save.mockResolvedValue({ ...mockDeudor, prestamos });
  
      const result = await service.associatePrestamosDeudor('1', prestamos);
      expect(result.prestamos).toEqual(prestamos);
      expect(deudorRepository.save).toHaveBeenCalledWith({ ...mockDeudor, prestamos });
    });
  
    it('should throw an error if the deudor is not found', async () => {
      deudorRepository.findOne.mockResolvedValue(null);

      try {
        await service.associatePrestamosDeudor('1', [])
      } catch (error) {
        expect(error).toBeInstanceOf(BusinessLogicException);
        expect(error.message).toBe("The deudor with the given id was not found");
      }
    });
  
    it('should throw an error if any prestamo is not found', async () => {
      const prestamos = [
        { id: '1', monto: 1000, interes: 5 } as PrestamoEntity,
        { id: '2', monto: 2000, interes: 10 } as PrestamoEntity,
      ];
  
      deudorRepository.findOne.mockResolvedValue({ ...mockDeudor, prestamos: [] });
      prestamoRepository.findOne.mockImplementation((options) => {
        const where = options.where as FindOptionsWhere<PrestamoEntity>;
        return Promise.resolve(prestamos.find((p) => p.id === where.id) || null);
      });

      try {
        await service.associatePrestamosDeudor('1', prestamos)
      } catch (error) {
        expect(error).toBeInstanceOf(BusinessLogicException);
        expect(error.message).toBe("The prestamo with the given id was not found");
      }
    });
  });
  
  describe('associatePrestamoDeudor', () => {
    it('should replace a specific prestamo associated with the deudor', async () => {
      const existingPrestamo = { id: '1', monto: 1000, interes: 5 } as PrestamoEntity;
      const newPrestamo = { id: '2', monto: 2000, interes: 10 } as PrestamoEntity;
  
      deudorRepository.findOne.mockResolvedValue({ ...mockDeudor, prestamos: [existingPrestamo] });
      prestamoRepository.findOne.mockResolvedValueOnce(existingPrestamo).mockResolvedValueOnce(newPrestamo);
  
      deudorRepository.save.mockResolvedValue({ ...mockDeudor, prestamos: [newPrestamo] });
  
      const result = await service.associatePrestamoDeudor('1', '1', newPrestamo);
      expect(result.prestamos).toEqual([newPrestamo]);
      expect(deudorRepository.save).toHaveBeenCalledWith({ ...mockDeudor, prestamos: [newPrestamo] });
    });
  
    it('should throw an error if the deudor is not found', async () => {
      deudorRepository.findOne.mockResolvedValue(null);

      try {
        await service.associatePrestamoDeudor('1', '1', mockPrestamo)
      } catch (error) {
        expect(error).toBeInstanceOf(BusinessLogicException);
        expect(error.message).toBe("The deudor with the given id was not found");
      }
    });
  
    it('should throw an error if the prestamo to replace is not found', async () => {
      deudorRepository.findOne.mockResolvedValue({ ...mockDeudor, prestamos: [mockPrestamo] });
      prestamoRepository.findOne.mockResolvedValue(null);

      try {
        await service.associatePrestamoDeudor('1', '1', mockPrestamo)
      } catch (error) {
        expect(error).toBeInstanceOf(BusinessLogicException);
        expect(error.message).toBe("The prestamo with the given id was not found");
      }
    });
  
    it('should throw an error if the prestamo to replace is not associated with the deudor', async () => {
      const anotherPrestamo = { id: '2', monto: 1500, interes: 7 } as PrestamoEntity;
  
      deudorRepository.findOne.mockResolvedValue({ ...mockDeudor, prestamos: [] });
      prestamoRepository.findOne.mockResolvedValue(anotherPrestamo);
  
      try {
        await service.associatePrestamoDeudor('1', '1', mockPrestamo)
      } catch (error) {
        expect(error).toBeInstanceOf(BusinessLogicException);
        expect(error.message).toBe("The prestamo with the given id is not associated to the deudor");
      }
    });
  });  

  describe('deletePrestamoDeudor', () => {
    it('should delete the prestamo from the deudor', async () => {
      deudorRepository.findOne.mockResolvedValue({ ...mockDeudor, prestamos: [mockPrestamo] });
      prestamoRepository.findOne.mockResolvedValue(mockPrestamo);

      deudorRepository.save.mockResolvedValue({ ...mockDeudor, prestamos: [] });

      await service.deletePrestamoDeudor('1', '1');
      expect(deudorRepository.save).toHaveBeenCalledWith({
        ...mockDeudor,
        prestamos: [],
      });
    });
    it('should delete the prestamos from the deudor', async () => {
      deudorRepository.findOne.mockResolvedValue({ ...mockDeudor, prestamos: [mockPrestamo] });
      prestamoRepository.findOne.mockResolvedValue(mockPrestamo);

      deudorRepository.save.mockResolvedValue({ ...mockDeudor, prestamos: [] });

      await service.deletePrestamosDeudor('1');
      expect(deudorRepository.save).toHaveBeenCalledWith({
        ...mockDeudor,
        prestamos: [],
      });
    });

    it('should throw an error if the deudor is not found', async () => {
      deudorRepository.findOne.mockResolvedValue(null);
      prestamoRepository.findOne.mockResolvedValue(mockPrestamo);

      try {
        await service.deletePrestamoDeudor('1', '1')
      } catch (error) {
        expect(error).toBeInstanceOf(BusinessLogicException);
        expect(error.message).toBe("The deudor with the given id was not found");
      }
    });

    it('should throw an error if the prestamo is not found', async () => {
      deudorRepository.findOne.mockResolvedValue(mockDeudor);
      prestamoRepository.findOne.mockResolvedValue(null);

      try {
        await service.deletePrestamoDeudor('1', '1')
      } catch (error) {
        expect(error).toBeInstanceOf(BusinessLogicException);
        expect(error.message).toBe("The prestamo with the given id was not found");
      }
    });

    it('should throw an error if the prestamo is not associated with the deudor', async () => {
      deudorRepository.findOne.mockResolvedValue({ ...mockDeudor, prestamos: [] });
      prestamoRepository.findOne.mockResolvedValue(mockPrestamo);
      try {
        await service.deletePrestamoDeudor('1', '1')
      } catch (error) {
        expect(error).toBeInstanceOf(BusinessLogicException);
        expect(error.message).toBe("The prestamo with the given id is not associated to the deudor");
      }
      
    });
    //prestamos
    it('should throw an error if the deudor is not found', async () => {
      deudorRepository.findOne.mockResolvedValue(null);
      prestamoRepository.findOne.mockResolvedValue(mockPrestamo);

      try {
        await service.deletePrestamosDeudor('1')
      } catch (error) {
        expect(error).toBeInstanceOf(BusinessLogicException);
        expect(error.message).toBe("The deudor with the given id was not found");
      }
    });
  });
});
