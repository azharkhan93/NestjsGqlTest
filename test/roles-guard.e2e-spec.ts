import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from '@common/presentation/guards/roles/roles.guard';
import { UserRole } from '@common/domain/enums';
import { ROLES_KEY } from '@common/presentation/decorators/roles.decorator';

describe('RolesGuard (E2E Integration)', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  const createMockContext = (userRole?: UserRole): ExecutionContext => {
    return {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      getType: () => 'graphql',
      switchToHttp: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
      getArgs: () => [
        null,
        null,
        { req: { user: userRole ? { role: userRole } : undefined } },
        null,
      ],
      getArgByIndex: jest.fn(),
    } as unknown as ExecutionContext;
  };

  it('should allow access if no roles are required on handler/class', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
    const context = createMockContext(UserRole.CUSTOMER);

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should allow access if user has the required SUPER_ADMIN role', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([UserRole.SUPER_ADMIN]);
    const context = createMockContext(UserRole.SUPER_ADMIN);

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should reject access if user has CUSTOMER role but SUPER_ADMIN is required', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([UserRole.SUPER_ADMIN]);
    const context = createMockContext(UserRole.CUSTOMER);

    expect(guard.canActivate(context)).toBe(false);
  });

  it('should reject access if user is unauthenticated (no req.user)', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([UserRole.SUPER_ADMIN]);
    const context = createMockContext(undefined);

    expect(guard.canActivate(context)).toBe(false);
  });
});
