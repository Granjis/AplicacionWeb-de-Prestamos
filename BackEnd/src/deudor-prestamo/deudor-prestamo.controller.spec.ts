import { Test, TestingModule } from '@nestjs/testing';
import { DeudorPrestamoController } from './deudor-prestamo.controller';
import { DeudorPrestamoService } from './deudor-prestamo.service';
import { PrestamoEntity } from '../prestamo/prestamo.entity';
import { PrestamoDto } from '../prestamo/prestamo.dto';
import { plainToInstance } from 'class-transformer';

describe('DeudorPrestamoController', () => {
  let controller: DeudorPrestamoController;
  let service: DeudorPrestamoService;

  const mockPrestamosDto: PrestamoDto[] = [
    { monto: 1000, fechafin:new Date(), fechainicio: new Date(), pagado:false ,interes: 5, nombre:'Estudios'},
    { monto: 2000, fechafin:new Date(), fechainicio: new Date(), pagado:true ,interes: 10, nombre:'Casa'},
  ];
  
  const mockPrestamosEntities = plainToInstance(PrestamoEntity, mockPrestamosDto);

  const mockService = {
    addPrestamoDeudor: jest.fn(),
    findPrestamoByDeudorIDPrestamoID: jest.fn(),
    findPrestamosByDeudorId: jest.fn(),
    associatePrestamosDeudor: jest.fn(),
    associatePrestamoDeudor: jest.fn(),
    deletePrestamoDeudor: jest.fn(),
    deletePrestamosDeudor: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeudorPrestamoController],
      providers: [
        {
          provide: DeudorPrestamoService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<DeudorPrestamoController>(DeudorPrestamoController);
    service = module.get<DeudorPrestamoService>(DeudorPrestamoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addPrestamoDeudor', () => {
    it('should call addPrestamoDeudor from service', async () => {
      mockService.addPrestamoDeudor.mockResolvedValue({
        id: '1',
        prestamos: mockPrestamosEntities,
      });
      const result = await controller.addPrestamoDeudor('1', '1');
      expect(service.addPrestamoDeudor).toHaveBeenCalledWith('1', '1');
      expect(result).toEqual({
        id: '1',
        prestamos: mockPrestamosEntities,
      });
    });
  });

  describe('findPrestamoBydeudorIdprestamoId', () => {
    it('should call findPrestamoByDeudorIDPrestamoID from service', async () => {
      mockService.findPrestamoByDeudorIDPrestamoID.mockResolvedValue({
        id: '1',
        prestamos: mockPrestamosEntities,
      });
      const result = await controller.findPrestamoBydeudorIdprestamoId('1', '1');
      expect(service.findPrestamoByDeudorIDPrestamoID).toHaveBeenCalledWith('1', '1');
      expect(result).toEqual({
        id: '1',
        prestamos: mockPrestamosEntities,
      });
    });
  });

  describe('findprestamosBydeudorId', () => {
    it('should call findPrestamosByDeudorId from service', async () => {
      mockService.findPrestamosByDeudorId.mockResolvedValue({
        id: '1',
        prestamos: mockPrestamosEntities,
      });
      const result = await controller.findprestamosBydeudorId('1');
      expect(service.findPrestamosByDeudorId).toHaveBeenCalledWith('1');
      expect(result).toEqual({
        id: '1',
        prestamos: mockPrestamosEntities,
      });
    });
  });

  describe('associateprestamosDeudor', () => {
    it('should call associatePrestamosDeudor from service', async () => {
      mockService.associatePrestamosDeudor.mockResolvedValue({
        id: '1',
        prestamos: mockPrestamosEntities,
      });
      const result = await controller.associateprestamosDeudor(mockPrestamosDto, '1');
      expect(service.associatePrestamosDeudor).toHaveBeenCalledWith('1', mockPrestamosEntities);
      expect(result).toEqual({
        id: '1',
        prestamos: mockPrestamosEntities,
      });
    });
  });

  describe('associateprestamoDeudor', () => {
    it('should call associatePrestamoDeudor from service', async () => {
      mockService.associatePrestamoDeudor.mockResolvedValue({
        id: '1',
        prestamos: mockPrestamosEntities,
      });
      const result = await controller.associateprestamoDeudor(mockPrestamosDto[0], '1', '1');
      expect(service.associatePrestamoDeudor).toHaveBeenCalledWith('1', '1', mockPrestamosEntities[0]);
      expect(result).toEqual({
        id: '1',
        prestamos: mockPrestamosEntities,
      });
    });
  });

  describe('deletePrestamoDeudor', () => {
    it('should call deletePrestamoDeudor from service', async () => {
      mockService.deletePrestamoDeudor.mockResolvedValue(undefined);
      const result = await controller.deletePrestamoDeudor('1', '1');
      expect(service.deletePrestamoDeudor).toHaveBeenCalledWith('1', '1');
      expect(result).toBeUndefined();
    });
  });

  describe('deletePrestamosDeudor', () => {
    it('should call deletePrestamosDeudor from service', async () => {
      mockService.deletePrestamosDeudor.mockResolvedValue(undefined);
      const result = await controller.deletePrestamosDeudor('1');
      expect(service.deletePrestamosDeudor).toHaveBeenCalledWith('1');
      expect(result).toBeUndefined();
    });
  });
});
